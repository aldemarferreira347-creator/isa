/* global THREE */
/* ============================================================================
   CORAZÓN 3D — motor cinematográfico de partículas
   ----------------------------------------------------------------------------
   Reemplaza por completo la escena anterior (PointsMaterial + sprites de canvas)
   por un sistema propio:

     · Morphing en la GPU. Cada partícula lleva su origen, su destino, su retardo
       y su papel como atributos; el vertex shader resuelve toda la coreografía.
       El bucle de JS sólo mueve uniforms, así que caben ~36.000 partículas donde
       antes cabían 6.900 y el frame cuesta menos.

     · Bloom real, escrito a mano: bright-pass → 3 niveles de desenfoque gaussiano
       separable → composición con ACES, viñeta, aberración cromática y grano de
       película. Sin dependencias de CDN extra.

     · Corazón volumétrico. El contorno es un tubo 3D (no una línea plana) y el
       cuerpo es una cáscara con perfil de profundidad, así que gira y tiene bulto.

     · Coreografía en cinco tiempos: polvo → vórtice → destello → el contorno se
       dibuja solo desde el hueco superior hasta la punta → el volumen lo rellena
       por detrás → late.

   El texto de la carta no se toca en ningún punto de este archivo.
   ========================================================================== */
(function () {
  'use strict';

  const canvas = document.getElementById('hc');
  if (!canvas || typeof THREE === 'undefined') return;

  // ---------------------------------------------------------------- calidad
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Mismo contrato que fx-engine.js: ?fx=0|1|2 en la URL o data-fx-nivel en <html>
  // fuerzan la calidad. Sirve para probar el modo completo en entornos que
  // reportan prefers-reduced-motion siempre activo.
  const urlNivel = (function () {
    const m = /[?&#]fx=([012])/.exec(window.location.search + window.location.hash);
    if (m) return parseInt(m[1], 10);
    const attr = document.documentElement.getAttribute('data-fx-nivel');
    if (attr !== null && /^[012]$/.test(attr)) return parseInt(attr, 10);
    return null;
  })();
  const nucleos = navigator.hardwareConcurrency || 4;
  const memoria = navigator.deviceMemory || 4;

  // Dos ejes independientes, y esto importa:
  //   NIVEL  = cuánto puede dibujar la máquina (núcleos y memoria).
  //   REDUCE = cuánto se le permite MOVERSE a la cámara.
  // Antes iban juntos: pedir menos movimiento recortaba también las partículas
  // al 35% y el filamento del corazón salía punteado en vez de continuo.
  // Que alguien no quiera mareos no significa que tenga un equipo lento.
  const NIVEL = urlNivel !== null
    ? urlNivel
    : (nucleos <= 4 || memoria <= 4 ? 1 : 2);
  const REDUCE = urlNivel !== null ? urlNivel === 0 : mqReduce.matches;

  const ESCALA_PART = NIVEL === 2 ? 1 : (NIVEL === 1 ? 0.55 : 0.35);
  const PR_MAX = NIVEL === 2 ? 1.75 : (NIVEL === 1 ? 1.35 : 1);
  const USA_MIP2 = NIVEL === 2;

  // Un contenedor de 0 px dejaría aspect = 0/0 = NaN y la matriz de proyección
  // envenenada para siempre; el suelo de 1 px evita ese estado sin salida.
  let W = Math.max(1, window.innerWidth), H = Math.max(1, window.innerHeight);
  const PR = Math.min(window.devicePixelRatio || 1, PR_MAX);

  // ---------------------------------------------------------------- renderer
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: false, alpha: false,
    powerPreference: 'high-performance', stencil: false, depth: false
  });
  renderer.setPixelRatio(PR);
  renderer.setSize(W, H);
  renderer.autoClear = false;
  // El tonemapping y el gamma los hace el shader de composición, así que el
  // render de la escena tiene que quedarse en lineal y sin recortar.
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.outputEncoding = THREE.LinearEncoding;
  renderer.setClearColor(0x000000, 1);

  const gl = renderer.getContext();
  const puedeHDR = !!(renderer.capabilities.isWebGL2 ||
    gl.getExtension('OES_texture_half_float'));
  const TIPO_HDR = puedeHDR ? THREE.HalfFloatType : THREE.UnsignedByteType;

  // ---------------------------------------------------------------- escenas
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 4000);
  camera.position.set(0, 2, 54);

  const bgScene = new THREE.Scene();
  const bgCamera = new THREE.PerspectiveCamera(58, W / H, 0.5, 6000);
  bgCamera.position.set(0, 0, 0);

  // ============================================================== GEOMETRÍA
  // Curva paramétrica clásica del corazón, sin escalar.
  const HS = 0.55;      // escala
  const HYOFF = -0.5;   // desplazamiento vertical
  const DEPTH = 2.55;   // grosor máximo del cuerpo
  const TUBE = 0.082;   // radio del tubo del contorno

  function heartRaw(t) {
    return {
      x: 16 * Math.pow(Math.sin(t), 3),
      y: 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    };
  }
  function heartXY(t) {
    const p = heartRaw(t);
    return { x: p.x * HS, y: p.y * HS + HYOFF };
  }

  // --- LUT radial R(θ) medida desde el origen: permite sembrar el interior en
  //     O(1) y saber a qué profundidad está cada punto respecto del borde.
  const LUT_N = 1024;
  const lutR = new Float32Array(LUT_N);
  (function buildLUT() {
    const muestras = 8192;
    for (let i = 0; i < muestras; i++) {
      const p = heartXY((i / muestras) * Math.PI * 2);
      let a = Math.atan2(p.y, p.x);
      if (a < 0) a += Math.PI * 2;
      const r = Math.hypot(p.x, p.y);
      const bin = Math.min(LUT_N - 1, (a / (Math.PI * 2) * LUT_N) | 0);
      if (r > lutR[bin]) lutR[bin] = r;
    }
    // relleno circular de huecos (dos vueltas cubren el envolvimiento)
    let ultimo = 0;
    for (let i = 0; i < LUT_N * 2; i++) {
      const k = i % LUT_N;
      if (lutR[k] > 0) ultimo = lutR[k];
      else if (ultimo > 0) lutR[k] = ultimo;
    }
  })();
  function radioEn(a) {
    a %= Math.PI * 2; if (a < 0) a += Math.PI * 2;
    const f = a / (Math.PI * 2) * LUT_N;
    const i0 = Math.floor(f) % LUT_N, i1 = (i0 + 1) % LUT_N, ff = f - Math.floor(f);
    return lutR[i0] + (lutR[i1] - lutR[i0]) * ff;
  }

  // --- parametrización por longitud de arco, del hueco superior (t=0) a la
  //     punta (t=π). Así el "lápiz" que dibuja el contorno avanza a velocidad
  //     constante en pantalla en lugar de acelerar en las curvas.
  const ARC_N = 2048;
  const arcT = new Float32Array(ARC_N + 1);
  const arcL = new Float32Array(ARC_N + 1);
  const ARC_TOTAL = (function () {
    let L = 0, px = 0, py = 0;
    for (let i = 0; i <= ARC_N; i++) {
      const t = (i / ARC_N) * Math.PI;
      const p = heartXY(t);
      if (i > 0) L += Math.hypot(p.x - px, p.y - py);
      arcT[i] = t; arcL[i] = L; px = p.x; py = p.y;
    }
    return L;
  })();
  function tAtU(u) {
    const objetivo = u * ARC_TOTAL;
    let lo = 0, hi = ARC_N;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (arcL[mid] < objetivo) lo = mid + 1; else hi = mid; }
    const i = Math.max(1, lo);
    const l0 = arcL[i - 1], l1 = arcL[i];
    const f = l1 > l0 ? (objetivo - l0) / (l1 - l0) : 0;
    return arcT[i - 1] + (arcT[i] - arcT[i - 1]) * f;
  }

  // Centro de masa aproximado — es el punto del que nace y al que vuelve todo.
  const SEED = (function () {
    let sx = 0, sy = 0, n = 0;
    for (let i = 0; i < 4000; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = Math.sqrt(Math.random());
      const r = radioEn(a) * s;
      sx += Math.cos(a) * r; sy += Math.sin(a) * r; n++;
    }
    return { x: sx / n, y: sy / n, z: 0 };
  })();

  // --- paleta: los mismos tokens de oro que usa el resto del sitio
  const GOLD = [
    [1.000, 0.965, 0.816], [1.000, 0.914, 0.651], [1.000, 0.827, 0.302],
    [0.961, 0.784, 0.259], [0.906, 0.698, 0.235], [0.788, 0.592, 0.122]
  ];
  function oro(sesgo, out) {
    const t = Math.pow(Math.random(), sesgo) * (GOLD.length - 1);
    const i = Math.min(GOLD.length - 2, Math.floor(t));
    const f = t - i, a = GOLD[i], b = GOLD[i + 1];
    out[0] = a[0] + (b[0] - a[0]) * f;
    out[1] = a[1] + (b[1] - a[1]) * f;
    out[2] = a[2] + (b[2] - a[2]) * f;
  }

  // ============================================================== LÍNEA DE TIEMPO
  const TL = {
    vortice: 1.05, vorticeDur: 2.00,
    destello: 3.35,
    dibujo: 3.78, dibujoDur: 2.35, emerger: 0.55,
    relleno: 4.35, rellenoDur: 2.45,
    fin: 7.70
  };
  const GLSL_TL = `
    const float T_VORTICE   = ${TL.vortice.toFixed(3)};
    const float D_VORTICE   = ${TL.vorticeDur.toFixed(3)};
    const float T_DESTELLO  = ${TL.destello.toFixed(3)};
    const float T_DIBUJO    = ${TL.dibujo.toFixed(3)};
    const float D_DIBUJO    = ${TL.dibujoDur.toFixed(3)};
    const float D_EMERGER   = ${TL.emerger.toFixed(3)};
    const float T_RELLENO   = ${TL.relleno.toFixed(3)};
    const float D_RELLENO   = ${TL.rellenoDur.toFixed(3)};
  `;

  const GLSL_COMUN = `
    float suave(float x){ x = clamp(x,0.0,1.0); return x*x*(3.0-2.0*x); }
    float rebote(float x){
      float c1 = 1.42, c3 = c1 + 1.0, m = x - 1.0;
      return 1.0 + c3*m*m*m + c1*m*m;
    }
    mat2 giro(float a){ float s = sin(a), c = cos(a); return mat2(c,-s,s,c); }
  `;

  // ============================================================== PARTÍCULAS
  const N_EDGE  = Math.round(4200  * ESCALA_PART);
  const N_SHELL = Math.round(13000 * ESCALA_PART);
  const N_INNER = Math.round(2600  * ESCALA_PART);
  const N_MIST  = Math.round(4600  * ESCALA_PART);
  const N_FADE  = Math.round(5000  * ESCALA_PART);
  const N_TOTAL = N_EDGE + N_SHELL + N_INNER + N_MIST + N_FADE;

  const aPos   = new Float32Array(N_TOTAL * 3); // origen: nube de polvo
  const aTo    = new Float32Array(N_TOTAL * 3); // destino en el corazón
  const aCol   = new Float32Array(N_TOTAL * 3);
  const aSize  = new Float32Array(N_TOTAL);
  const aSeed  = new Float32Array(N_TOTAL);
  const aDelay = new Float32Array(N_TOTAL);
  const aRole  = new Float32Array(N_TOTAL);
  const aU     = new Float32Array(N_TOTAL);

  (function sembrar() {
    const c = [0, 0, 0];
    let k = 0;

    // origen común: disco de polvo ancho y lento alrededor del centro
    function polvo(i) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 15 + Math.pow(Math.random(), 0.65) * 21;
      aPos[i * 3]     = Math.cos(ang) * rad;
      aPos[i * 3 + 1] = (Math.random() - 0.5) * 13 + Math.sin(ang * 2) * 1.5;
      aPos[i * 3 + 2] = Math.sin(ang) * rad;
    }

    // --- 1. contorno: tubo 3D alrededor de la curva -----------------------
    for (let i = 0; i < N_EDGE; i++, k++) {
      const u = i / N_EDGE;                 // 0 = hueco superior, 1 = punta
      const lado = (i % 2 === 0) ? 1 : -1;
      const t = tAtU(u);
      const p = heartXY(t);
      const q = heartXY(Math.min(Math.PI, t + 0.004));
      let tx = (q.x - p.x) * lado, ty = q.y - p.y;
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const nx = -ty, ny = tx;              // normal en el plano XY

      // sección circular: la mayoría pegada al eje, unas pocas afuera
      const ca = Math.random() * Math.PI * 2;
      const cr = TUBE * Math.pow(Math.random(), 0.42);
      aTo[k * 3]     = p.x * lado + nx * Math.cos(ca) * cr;
      aTo[k * 3 + 1] = p.y + ny * Math.cos(ca) * cr;
      aTo[k * 3 + 2] = Math.sin(ca) * cr;

      polvo(k);
      aRole[k] = 0;
      aU[k] = u;
      aDelay[k] = u;
      // El filamento es lo más brillante de la escena, pero con 9.000 puntos
      // apilados sobre un tubo de 5 px la suma aditiva satura a blanco puro y
      // se pierde el grano. La intensidad por partícula va deliberadamente baja:
      // el brillo lo pone la acumulación, no cada punto.
      oro(2.6, c);
      const calor = 1 - u * 0.30;           // arriba más pálido, punta más ámbar
      // ~6% son "destellos": mucho más grandes y brillantes. Son los que hacen
      // que la línea centellee como polvo de diamante en lugar de ser un tubo liso.
      const destello = Math.random() < 0.06;
      const g0 = destello ? 3.60 : 1.55;
      aCol[k * 3]     = c[0] * calor * g0;
      aCol[k * 3 + 1] = c[1] * calor * g0 * 0.955;
      aCol[k * 3 + 2] = c[2] * calor * g0 * 0.865;
      aSize[k] = (destello ? 0.16 : 0.058) + Math.random() * (destello ? 0.16 : 0.070);
      aSeed[k] = Math.random();
    }

    // --- 2. cáscara: superficie del corazón con bulto ---------------------
    for (let i = 0; i < N_SHELL; i++, k++) {
      const ang = Math.random() * Math.PI * 2;
      const s = Math.pow(Math.random(), 0.38);   // sesgado hacia el borde
      const r = radioEn(ang) * s;
      const dn = 1 - s;                          // 0 en el borde, 1 en el centro
      const z = DEPTH * Math.pow(dn, 0.62) * (Math.random() < 0.5 ? 1 : -1);
      aTo[k * 3]     = Math.cos(ang) * r;
      aTo[k * 3 + 1] = Math.sin(ang) * r;
      aTo[k * 3 + 2] = z + (Math.random() - 0.5) * 0.14;

      polvo(k);
      aRole[k] = 1;
      aU[k] = 0;
      aDelay[k] = Math.pow(Math.random(), 0.8);
      oro(1.5, c);
      // el borde de la silueta brilla más que el centro (efecto rim light)
      const rim = (0.075 + Math.pow(1 - dn, 2.6) * 0.400);
      aCol[k * 3] = c[0] * rim; aCol[k * 3 + 1] = c[1] * rim; aCol[k * 3 + 2] = c[2] * rim;
      aSize[k] = 0.075 + Math.random() * 0.115;
      aSeed[k] = Math.random();
    }

    // --- 3. núcleo: volumen interior, tenue y cálido -----------------------
    for (let i = 0; i < N_INNER; i++, k++) {
      const ang = Math.random() * Math.PI * 2;
      const s = Math.pow(Math.random(), 1.9);
      const r = radioEn(ang) * s;
      const dn = 1 - s;
      aTo[k * 3]     = Math.cos(ang) * r;
      aTo[k * 3 + 1] = Math.sin(ang) * r;
      aTo[k * 3 + 2] = (Math.random() - 0.5) * 2 * DEPTH * Math.pow(dn, 0.62) * 0.72;

      polvo(k);
      aRole[k] = 2;
      aU[k] = 0;
      aDelay[k] = 0.25 + Math.random() * 0.75;
      oro(0.7, c);
      aCol[k * 3] = c[0] * 0.170; aCol[k * 3 + 1] = c[1] * 0.142; aCol[k * 3 + 2] = c[2] * 0.100;
      aSize[k] = 0.11 + Math.random() * 0.18;
      aSeed[k] = Math.random();
    }

    // --- 4. bruma: ascuas que orbitan alrededor ---------------------------
    for (let i = 0; i < N_MIST; i++, k++) {
      const ang = Math.random() * Math.PI * 2;
      const r = radioEn(ang) * (1.05 + Math.pow(Math.random(), 0.7) * 0.85);
      aTo[k * 3]     = Math.cos(ang) * r;
      aTo[k * 3 + 1] = Math.sin(ang) * r * 0.94;
      aTo[k * 3 + 2] = (Math.random() - 0.5) * 7.5;

      polvo(k);
      aRole[k] = 3;
      aU[k] = 0;
      aDelay[k] = Math.random();
      oro(1.1, c);
      aCol[k * 3] = c[0] * 0.360; aCol[k * 3 + 1] = c[1] * 0.318; aCol[k * 3 + 2] = c[2] * 0.230;
      aSize[k] = 0.09 + Math.random() * 0.26;
      aSeed[k] = Math.random();
    }

    // --- 5. chispas perdidas: nunca llegan, se disuelven -------------------
    for (let i = 0; i < N_FADE; i++, k++) {
      aTo[k * 3] = 0; aTo[k * 3 + 1] = 0; aTo[k * 3 + 2] = 0;
      polvo(k);
      aRole[k] = 4;
      aU[k] = 0;
      aDelay[k] = Math.random();
      oro(1.0, c);
      aCol[k * 3] = c[0] * 0.62; aCol[k * 3 + 1] = c[1] * 0.56; aCol[k * 3 + 2] = c[2] * 0.43;
      aSize[k] = 0.11 + Math.random() * 0.30;
      aSeed[k] = Math.random();
    }

    // el destino está en coordenadas de silueta; el grupo entero lleva el offset
    for (let i = 0; i < N_TOTAL; i++) {
      if (aRole[i] === 4) { aTo[i * 3] = SEED.x; aTo[i * 3 + 1] = SEED.y; aTo[i * 3 + 2] = 0; }
    }
  })();

  const heartGeo = new THREE.BufferGeometry();
  heartGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
  heartGeo.setAttribute('aTo',      new THREE.BufferAttribute(aTo, 3));
  heartGeo.setAttribute('aColor',   new THREE.BufferAttribute(aCol, 3));
  heartGeo.setAttribute('aSize',    new THREE.BufferAttribute(aSize, 1));
  heartGeo.setAttribute('aSeed',    new THREE.BufferAttribute(aSeed, 1));
  heartGeo.setAttribute('aDelay',   new THREE.BufferAttribute(aDelay, 1));
  heartGeo.setAttribute('aRole',    new THREE.BufferAttribute(aRole, 1));
  heartGeo.setAttribute('aU',       new THREE.BufferAttribute(aU, 1));

  const heartUni = {
    uT:      { value: 0 },
    uBeat:   { value: 0 },
    uPulseA: { value: -1 },
    uPulseB: { value: -1 },
    uScale:  { value: 1 },
    uPR:     { value: PR },
    uFocus:  { value: 26 },
    uSeed:   { value: new THREE.Vector3(SEED.x, SEED.y, 0) },
    uReduce: { value: REDUCE ? 1 : 0 },
    uGlobal: { value: 1 },
    uAlto:   { value: H * PR }
  };

  const VS_HEART = `
    attribute vec3  aTo;
    attribute vec3  aColor;
    attribute float aSize;
    attribute float aSeed;
    attribute float aDelay;
    attribute float aRole;
    attribute float aU;

    uniform float uT, uBeat, uPulseA, uPulseB, uScale, uPR, uFocus, uReduce, uGlobal, uAlto;
    uniform vec3  uSeed;

    varying vec3  vCol;
    varying float vI;
    varying float vBokeh;

    ${GLSL_TL}
    ${GLSL_COMUN}

    void main() {
      float sem = aSeed;
      vec3 origen = position;

      // --- 1. polvo a la deriva -------------------------------------------
      vec3 pd = origen;
      pd.xz = giro(uT * 0.055 + sem * 0.5) * pd.xz;
      pd.y += sin(uT * 0.42 + sem * 41.0) * 0.85;

      // --- 2. vórtice: espiral acelerada hacia el punto semilla ------------
      float g  = clamp((uT - T_VORTICE - aDelay * 0.30) / D_VORTICE, 0.0, 1.0);
      float gi = pow(g, 2.15);
      vec3 pv = pd;
      pv.xz = giro(gi * (7.5 + sem * 5.0)) * pv.xz;
      pv = mix(pv, uSeed, gi);

      // --- 3. según el papel ------------------------------------------------
      vec3 pf = pv;
      float asentado = 0.0;
      float vida = 1.0;

      if (aRole < 0.5) {
        // contorno: un lápiz recorre el arco desde el hueco hasta la punta
        float e = clamp((uT - T_DIBUJO - aU * D_DIBUJO) / D_EMERGER, 0.0, 1.0);
        float k = e < 1.0 ? rebote(e) : 1.0;
        pf = mix(uSeed, aTo, k);
        asentado = e;
      } else if (aRole < 3.5) {
        // cáscara, núcleo y bruma: rellenan por detrás del contorno
        float e = clamp((uT - T_RELLENO - aDelay * D_RELLENO) / 0.95, 0.0, 1.0);
        pf = mix(uSeed, aTo, suave(e));
        asentado = e;
      } else {
        // chispas perdidas
        float e = clamp((uT - T_DESTELLO - aDelay * 0.55) / 1.7, 0.0, 1.0);
        vec3 d = normalize(vec3(sin(sem * 31.7), cos(sem * 17.3) * 0.8, sin(sem * 11.1) + 0.01));
        pf = uSeed + d * (pow(e, 0.72) * (5.0 + sem * 8.0));
        vida = 1.0 - e;
      }

      pf = (uT < T_DESTELLO) ? pv : pf;

      // --- 4. respiración e inercia -----------------------------------------
      if (uReduce < 0.5 && asentado >= 0.999) {
        float amp = 0.026 + aRole * 0.020;
        pf += vec3(
          sin(uT * 1.63 + sem * 30.0),
          cos(uT * 1.41 + sem * 22.0),
          sin(uT * 1.19 + sem * 44.0)
        ) * amp;
      }
      pf = uSeed + (pf - uSeed) * (1.0 + uBeat * 0.055 * step(0.999, asentado));

      // --- 5. brillo ---------------------------------------------------------
      float conv = clamp((uT - T_VORTICE) / (D_VORTICE * 0.85), 0.0, 1.0);
      float b = mix(0.30, 1.0, conv) * vida;

      // el destello del nacimiento sobreexpone todo por un instante
      float fl = exp(-pow((uT - T_DESTELLO) * 4.5, 2.0));
      b *= 1.0 + fl * 5.0;

      // pulsos de energía viajando por el filamento
      if (aRole < 0.5) {
        float d1 = abs(aU - uPulseA);
        float d2 = abs(aU - uPulseB);
        b *= 1.0 + (exp(-d1 * d1 * 620.0) + exp(-d2 * d2 * 620.0) * 0.7) * 2.6;
        // punta luminosa mientras se dibuja
        float lapiz = clamp((uT - T_DIBUJO) / D_DIBUJO, 0.0, 1.0);
        float dl = abs(aU - lapiz);
        b *= 1.0 + exp(-dl * dl * 2600.0) * 5.5 * step(uT, T_DIBUJO + D_DIBUJO + 0.2);
      }

      float tw = 0.80 + 0.20 * sin(uT * (1.25 + fract(sem * 7.3) * 2.6) + sem * 57.0);
      b *= tw * uGlobal;

      // --- 6. tamaño y desenfoque de campo falso ------------------------------
      vec4 mv = modelViewMatrix * vec4(pf, 1.0);
      float dist = max(0.001, -mv.z);
      float coc = clamp(abs(dist - uFocus) * 0.030, 0.0, 1.05);
      float sz = aSize * uScale * (1.0 + coc * 1.25);

      gl_PointSize = clamp(sz * uPR * (uAlto * 0.34) / dist, 0.5, 96.0);
      vCol = aColor;
      vI = b / (1.0 + coc * coc * 1.7);
      vBokeh = coc;
      gl_Position = projectionMatrix * mv;
    }
  `;

  // Sprite procedural: núcleo caliente + halo + púas de difracción, y disco
  // plano cuando la partícula está fuera de foco (bokeh de verdad).
  const FS_PART = `
    precision highp float;
    varying vec3  vCol;
    varying float vI;
    varying float vBokeh;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float r = length(uv) * 2.0;
      if (r > 1.0) discard;

      float nucleo = exp(-r * r * 9.0);
      float halo   = exp(-r * r * 2.4) * 0.30;
      float disco  = smoothstep(1.0, 0.80, r) * 0.55;
      float bk = smoothstep(0.22, 1.05, vBokeh);
      // normalizado para que el pico del cuerpo valga ~1 y no ~1.45
      float cuerpo = mix((nucleo + halo) * 0.70, disco, bk);

      float sx = pow(max(0.0, 1.0 - abs(uv.x) * 11.0), 2.5) * exp(-abs(uv.y) * 13.0);
      float sy = pow(max(0.0, 1.0 - abs(uv.y) * 11.0), 2.5) * exp(-abs(uv.x) * 13.0);
      float pua = (sx + sy) * (1.0 - bk) * 0.16;

      float a = (cuerpo + pua) * vI;
      if (a <= 0.0015) discard;
      // El centro caliente es un desplazamiento de TONO, no de energía: mezclar
      // hacia vec3(1.0) hacía que cualquier partícula, por tenue que fuese,
      // aportara casi 1.0 en lineal justo en su centro y todo saliera blanco.
      float mag = max(max(vCol.r, vCol.g), vCol.b);
      vec3 col = mix(vCol, vec3(mag), nucleo * (1.0 - bk) * 0.72);
      gl_FragColor = vec4(col * a, a);
    }
  `;

  const ADITIVO = {
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    transparent: true,
    depthTest: false,
    depthWrite: false
  };

  const heartMat = new THREE.ShaderMaterial(Object.assign({
    uniforms: heartUni,
    vertexShader: VS_HEART,
    fragmentShader: FS_PART
  }, ADITIVO));

  const heartPts = new THREE.Points(heartGeo, heartMat);
  heartPts.frustumCulled = false;
  const heartGroup = new THREE.Group();
  heartGroup.add(heartPts);
  heartGroup.visible = false;
  scene.add(heartGroup);

  // ============================================================== ESTRELLAS
  const N_STAR = Math.round(14000 * (NIVEL === 2 ? 1 : NIVEL === 1 ? 0.5 : 0.3));
  const starGeo = new THREE.BufferGeometry();
  (function sembrarEstrellas() {
    const pos = new Float32Array(N_STAR * 3);
    const col = new Float32Array(N_STAR * 3);
    const sz  = new Float32Array(N_STAR);
    const sd  = new Float32Array(N_STAR);
    const tintes = [
      [1.00, 1.00, 1.00], [1.00, 0.98, 0.95], [1.00, 0.96, 0.88],
      [0.88, 0.93, 1.00], [1.00, 0.92, 0.80]
    ];
    for (let i = 0; i < N_STAR; i++) {
      const u = Math.random(), v = Math.random();
      const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1);
      const r = 420 + Math.pow(Math.random(), 0.35) * 1500;
      pos[i * 3]     = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
      const t = tintes[(Math.random() * tintes.length) | 0];
      // magnitud: muchas débiles, unas pocas dominantes
      const m = Math.pow(Math.random(), 3.4);
      const b = 0.10 + m * 1.25;
      col[i * 3] = t[0] * b; col[i * 3 + 1] = t[1] * b; col[i * 3 + 2] = t[2] * b;
      // tamaño en unidades de mundo: proporcional a la distancia para que el
      // tamaño en pantalla no dependa de dónde cayó la estrella en la esfera
      sz[i] = (2.6 + m * 9.0) * (r / 900);
      sd[i] = Math.random();
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute('aColor',   new THREE.BufferAttribute(col, 3));
    starGeo.setAttribute('aSize',    new THREE.BufferAttribute(sz, 1));
    starGeo.setAttribute('aSeed',    new THREE.BufferAttribute(sd, 1));
  })();

  const starUni = {
    uT: { value: 0 }, uPR: { value: PR }, uAlto: { value: H * PR }, uGlobal: { value: 1 }
  };
  const starMat = new THREE.ShaderMaterial(Object.assign({
    uniforms: starUni,
    vertexShader: `
      attribute vec3 aColor; attribute float aSize; attribute float aSeed;
      uniform float uT, uPR, uAlto, uGlobal;
      varying vec3 vCol; varying float vI; varying float vBokeh;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float dist = max(0.001, -mv.z);
        float tw = 0.55 + 0.45 * sin(uT * (0.7 + fract(aSeed*13.0)*1.9) + aSeed*90.0);
        tw = 0.45 + tw * 0.55;
        gl_PointSize = clamp(aSize * uPR * (uAlto * 0.34) / dist, 0.35, 7.0);
        vCol = aColor; vI = tw * uGlobal; vBokeh = 0.0;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: FS_PART
  }, ADITIVO));
  const starPts = new THREE.Points(starGeo, starMat);
  starPts.frustumCulled = false;
  bgScene.add(starPts);

  // ============================================================== CORONA
  // Plano orientado a cámara con degradado procedural: el corazón se lee como
  // una fuente de luz cálida, no como una línea flotando en negro.
  const coronaUni = {
    uT: { value: 0 }, uOp: { value: 0 }, uBeat: { value: 0 }
  };
  const corona = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial(Object.assign({
      uniforms: coronaUni,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uT, uOp, uBeat;
        float ruido(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        void main(){
          vec2 p = (vUv - 0.5) * 2.0;
          p.y *= 1.12;
          float d = length(p);
          if (d > 1.0) discard;
          float g = exp(-d*d*3.1) * 0.85 + exp(-d*d*11.0) * 0.55;
          // turbulencia lenta para que el halo no sea un degradado muerto
          float a = atan(p.y, p.x);
          float w = sin(a*3.0 + uT*0.5)*0.5 + sin(a*5.0 - uT*0.33)*0.3;
          g *= 1.0 + w * 0.16 * (1.0 - d);
          g *= 1.0 + uBeat * 0.5;
          vec3 col = mix(vec3(1.0,0.72,0.26), vec3(1.0,0.94,0.76), exp(-d*d*7.0));
          float a2 = g * uOp;
          gl_FragColor = vec4(col * a2, a2);
        }
      `
    }, ADITIVO))
  );
  corona.scale.set(15, 15, 1);
  corona.position.set(SEED.x, SEED.y, -3.5);
  corona.frustumCulled = false;
  heartGroup.add(corona);

  // ============================================================== ONDA DE CHOQUE
  const ondaUni = { uP: { value: -1 } };
  const onda = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial(Object.assign({
      uniforms: ondaUni,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv; uniform float uP;
        void main(){
          if (uP < 0.0 || uP > 1.0) discard;
          float d = length((vUv - 0.5) * 2.0);
          float radio = pow(uP, 0.55);
          float grosor = 0.035 + uP * 0.16;
          float anillo = exp(-pow((d - radio) / grosor, 2.0));
          float a = anillo * (1.0 - uP) * 1.5;
          if (a < 0.002) discard;
          vec3 col = mix(vec3(1.0,0.95,0.82), vec3(1.0,0.66,0.20), uP);
          gl_FragColor = vec4(col * a, a);
        }
      `
    }, ADITIVO))
  );
  onda.scale.set(60, 60, 1);
  onda.position.set(SEED.x, SEED.y, -1);
  onda.frustumCulled = false;
  scene.add(onda);

  // ============================================================== ANILLOS ORBITALES
  // Antes eran THREE.Line planas; ahora son ríos de partículas con un frente
  // luminoso que da vueltas, mucho más vivos y coherentes con el resto.
  const anillos = [];
  (function construirAnillos() {
    const defs = [
      { rx: 13.4, ry: 12.6, tx: Math.PI * 0.30, ty: 0.22, tz: 0.35, n: 900, vel: 0.055, br: 0.34 },
      { rx: 15.6, ry: 13.9, tx: Math.PI * 0.20, ty: -0.34, tz: -0.55, n: 700, vel: -0.038, br: 0.26 },
      { rx: 11.8, ry: 11.2, tx: Math.PI * 0.36, ty: 0.48, tz: 1.15, n: 620, vel: 0.070, br: 0.20 }
    ];
    const vs = `
      attribute float aT; attribute float aSeed; attribute float aSize;
      uniform float uTime, uPR, uAlto, uOp, uVel, uBr;
      varying vec3 vCol; varying float vI; varying float vBokeh;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float dist = max(0.001, -mv.z);
        float f = fract(aT - uTime * uVel);
        float frente = exp(-f * 4.0) + exp(-(1.0 - f) * 14.0) * 0.35;
        float b = (0.16 + frente * 1.15) * uOp * uBr;
        b *= 0.75 + 0.25 * sin(uTime * 3.0 + aSeed * 40.0);
        gl_PointSize = clamp(aSize * (1.0 + frente * 1.6) * uPR * (uAlto * 0.34) / dist, 0.4, 40.0);
        vCol = mix(vec3(0.95,0.66,0.16), vec3(1.0,0.96,0.82), min(1.0, frente));
        vI = b; vBokeh = 0.0;
        gl_Position = projectionMatrix * mv;
      }
    `;
    defs.forEach((d) => {
      const pos = new Float32Array(d.n * 3);
      const at  = new Float32Array(d.n);
      const sd  = new Float32Array(d.n);
      const sz  = new Float32Array(d.n);
      for (let i = 0; i < d.n; i++) {
        const t = i / d.n;
        const a = t * Math.PI * 2;
        const jr = 1 + (Math.random() - 0.5) * 0.012;
        pos[i * 3]     = Math.cos(a) * d.rx * jr;
        pos[i * 3 + 1] = Math.sin(a) * d.ry * jr - 0.5;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.10;
        at[i] = t; sd[i] = Math.random(); sz[i] = 0.055 + Math.random() * 0.075;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('aT', new THREE.BufferAttribute(at, 1));
      g.setAttribute('aSeed', new THREE.BufferAttribute(sd, 1));
      g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
      const uni = {
        uTime: { value: 0 }, uPR: { value: PR }, uAlto: { value: H * PR },
        uOp: { value: 0 }, uVel: { value: d.vel }, uBr: { value: d.br }
      };
      const m = new THREE.ShaderMaterial(Object.assign({
        uniforms: uni, vertexShader: vs, fragmentShader: FS_PART
      }, ADITIVO));
      const pts = new THREE.Points(g, m);
      pts.frustumCulled = false;
      pts.rotation.set(d.tx, d.ty, d.tz);
      scene.add(pts);
      anillos.push({ pts, uni, girZ: d.vel * 0.22 });
    });
  })();

  // ============================================================== CHISPAS (pool)
  // Un único búfer reciclado para cometa, estela, explosión y estrellas fugaces.
  // Antes cada frame creaba una SphereGeometry + Material nuevos y no los
  // liberaba nunca: fuga de memoria a 60 objetos por segundo.
  const SPARK_MAX = NIVEL === 2 ? 2200 : 1100;
  const spPos  = new Float32Array(SPARK_MAX * 3);
  const spCol  = new Float32Array(SPARK_MAX * 3);
  const spSize = new Float32Array(SPARK_MAX);
  const spVel  = new Float32Array(SPARK_MAX * 3);
  const spLife = new Float32Array(SPARK_MAX);
  const spMax  = new Float32Array(SPARK_MAX);
  const spDrag = new Float32Array(SPARK_MAX);
  const spBase = new Float32Array(SPARK_MAX * 3);
  let spNext = 0, spVivas = 0;

  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3));
  sparkGeo.setAttribute('aColor',   new THREE.BufferAttribute(spCol, 3));
  sparkGeo.setAttribute('aSize',    new THREE.BufferAttribute(spSize, 1));
  sparkGeo.setDrawRange(0, 0);
  const sparkUni = { uPR: { value: PR }, uAlto: { value: H * PR } };
  const sparkMat = new THREE.ShaderMaterial(Object.assign({
    uniforms: sparkUni,
    vertexShader: `
      attribute vec3 aColor; attribute float aSize;
      uniform float uPR, uAlto;
      varying vec3 vCol; varying float vI; varying float vBokeh;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float dist = max(0.001, -mv.z);
        gl_PointSize = clamp(aSize * uPR * (uAlto * 0.34) / dist, 0.4, 80.0);
        vCol = normalize(aColor + 1e-4); vI = length(aColor) * 0.30; vBokeh = 0.0;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: FS_PART
  }, ADITIVO));
  const sparkPts = new THREE.Points(sparkGeo, sparkMat);
  sparkPts.frustumCulled = false;
  scene.add(sparkPts);

  function chispa(x, y, z, vx, vy, vz, r, g, b, size, vida, drag) {
    const i = spNext;
    spNext = (spNext + 1) % SPARK_MAX;
    if (spVivas < SPARK_MAX) spVivas++;
    spPos[i * 3] = x; spPos[i * 3 + 1] = y; spPos[i * 3 + 2] = z;
    spVel[i * 3] = vx; spVel[i * 3 + 1] = vy; spVel[i * 3 + 2] = vz;
    spBase[i * 3] = r; spBase[i * 3 + 1] = g; spBase[i * 3 + 2] = b;
    spSize[i] = size; spLife[i] = 0; spMax[i] = vida; spDrag[i] = drag === undefined ? 0.985 : drag;
  }

  function actualizarChispas(dt) {
    let ultima = 0;
    for (let i = 0; i < SPARK_MAX; i++) {
      if (spMax[i] <= 0) { spCol[i * 3] = spCol[i * 3 + 1] = spCol[i * 3 + 2] = 0; continue; }
      spLife[i] += dt;
      const f = spLife[i] / spMax[i];
      if (f >= 1) { spMax[i] = 0; spCol[i * 3] = spCol[i * 3 + 1] = spCol[i * 3 + 2] = 0; continue; }
      const d = Math.pow(spDrag[i], dt * 60);
      spVel[i * 3] *= d; spVel[i * 3 + 1] *= d; spVel[i * 3 + 2] *= d;
      spPos[i * 3]     += spVel[i * 3] * dt * 60;
      spPos[i * 3 + 1] += spVel[i * 3 + 1] * dt * 60;
      spPos[i * 3 + 2] += spVel[i * 3 + 2] * dt * 60;
      // curva de vida: entrada rápida, cola larga
      const a = f < 0.12 ? f / 0.12 : Math.pow(1 - (f - 0.12) / 0.88, 1.8);
      spCol[i * 3]     = spBase[i * 3] * a;
      spCol[i * 3 + 1] = spBase[i * 3 + 1] * a;
      spCol[i * 3 + 2] = spBase[i * 3 + 2] * a;
      ultima = i + 1;
    }
    sparkGeo.setDrawRange(0, SPARK_MAX);
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.aColor.needsUpdate = true;
    sparkGeo.attributes.aSize.needsUpdate = true;
    return ultima;
  }

  // ============================================================== POST-PROCESO
  const quadScene = new THREE.Scene();
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
  quadMesh.frustumCulled = false;
  quadScene.add(quadMesh);

  const VS_QUAD = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

  function crearRT(w, h) {
    return new THREE.WebGLRenderTarget(Math.max(2, w | 0), Math.max(2, h | 0), {
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat, type: TIPO_HDR,
      depthBuffer: false, stencilBuffer: false
    });
  }

  let rtScene, rtCielo, mipA = [], mipB = [];
  let frameN = 0;
  let cieloDirty = true;
  const N_MIP = USA_MIP2 ? 3 : 2;

  function crearTargets() {
    const w = Math.max(2, Math.floor(W * PR));
    const h = Math.max(2, Math.floor(H * PR));
    if (rtScene) {
      rtScene.dispose();
      rtCielo.dispose();
      mipA.forEach((r) => r.dispose());
      mipB.forEach((r) => r.dispose());
    }
    rtScene = crearRT(w, h);
    rtCielo = crearRT(w / 4, h / 4);
    cieloDirty = true;
    mipA = []; mipB = [];
    for (let i = 0; i < N_MIP; i++) {
      const d = Math.pow(2, i + 1);
      mipA.push(crearRT(w / d, h / d));
      mipB.push(crearRT(w / d, h / d));
    }
  }
  crearTargets();

  function pasada(mat, destino) {
    quadMesh.material = mat;
    renderer.setRenderTarget(destino || null);
    renderer.clear(true, false, false);
    renderer.render(quadScene, quadCam);
  }

  // --- cielo con nebulosas volumétricas ----------------------------------
  // fBm con domain warping: nubes reales en vez de seis degradados radiales
  // pegados encima. Se dibuja a media resolución y sólo cada pocos fotogramas
  // (se mueve lentísimo, nadie lo nota) para que no cueste nada.
  const cieloMat = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uAspecto: { value: W / H } },
    vertexShader: VS_QUAD,
    depthTest: false, depthWrite: false,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uT, uAspecto;

      float hash21(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float ruido(vec2 p){
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
                   mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.52;
        for (int i = 0; i < 5; i++) { v += a * ruido(p); p = p * 2.03 + 7.1; a *= 0.5; }
        return v;
      }

      void main(){
        vec2 p = vUv;

        // base: azul de noche profunda, con el horizonte un poco más cálido
        vec3 alto  = vec3(0.0014, 0.0014, 0.0058);
        vec3 medio = vec3(0.0038, 0.0034, 0.0100);
        vec3 bajo  = vec3(0.0072, 0.0046, 0.0022);
        vec3 c = mix(bajo, medio, smoothstep(0.0, 0.55, p.y));
        c = mix(c, alto, smoothstep(0.45, 1.0, p.y));

        vec2 q = (p - 0.5) * vec2(uAspecto, 1.0) * 2.6;
        float deriva = uT * 0.010;
        float warp = fbm(q * 0.72 + deriva);
        float n1 = fbm(q + vec2(warp * 1.7, -warp * 1.3) + deriva * 0.6);
        float n2 = fbm(q * 1.85 - vec2(warp * 0.9) + 11.3 - deriva * 0.4);

        // cúmulos cálidos abajo, velos fríos arriba
        float mCal = smoothstep(0.46, 0.94, n1) * smoothstep(1.02, 0.10, p.y);
        float mFri = smoothstep(0.52, 1.00, n2) * smoothstep(-0.05, 0.90, p.y);
        c += vec3(0.052, 0.026, 0.0065) * mCal;
        c += vec3(0.013, 0.012, 0.038) * mFri;

        // hebras finas: el detalle que hace que no parezca una mancha
        float hebra = smoothstep(0.72, 0.99, fbm(q * 3.6 + warp * 2.2));
        c += vec3(0.030, 0.019, 0.006) * hebra * mCal * 1.6;

        // halo central tenue: el corazón nace de una zona ya iluminada
        float d = distance(p * vec2(1.0, 0.84), vec2(0.5, 0.37));
        c += vec3(0.016, 0.010, 0.004) * exp(-d * d * 6.0);

        gl_FragColor = vec4(c, 1.0);
      }
    `
  });

  const UMBRAL_BLOOM = 0.68, SUAVE_BLOOM = 0.55;

  // --- bright pass -------------------------------------------------------
  const brightMat = new THREE.ShaderMaterial({
    uniforms: { tSrc: { value: null }, uUmbral: { value: UMBRAL_BLOOM }, uSuave: { value: SUAVE_BLOOM } },
    vertexShader: VS_QUAD,
    depthTest: false, depthWrite: false,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D tSrc; uniform float uUmbral, uSuave;
      void main(){
        vec3 c = texture2D(tSrc, vUv).rgb;
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
        float k = smoothstep(uUmbral, uUmbral + uSuave, l);
        gl_FragColor = vec4(c * k, 1.0);
      }
    `
  });

  // --- gaussiano separable (9 taps con muestreo lineal → 5 lecturas) ------
  const blurMat = new THREE.ShaderMaterial({
    uniforms: { tSrc: { value: null }, uDir: { value: new THREE.Vector2(1, 0) }, uTexel: { value: new THREE.Vector2() } },
    vertexShader: VS_QUAD,
    depthTest: false, depthWrite: false,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D tSrc; uniform vec2 uDir, uTexel;
      void main(){
        vec2 o1 = uDir * uTexel * 1.3846153846;
        vec2 o2 = uDir * uTexel * 3.2307692308;
        vec3 c = texture2D(tSrc, vUv).rgb * 0.2270270270;
        c += texture2D(tSrc, vUv + o1).rgb * 0.3162162162;
        c += texture2D(tSrc, vUv - o1).rgb * 0.3162162162;
        c += texture2D(tSrc, vUv + o2).rgb * 0.0702702703;
        c += texture2D(tSrc, vUv - o2).rgb * 0.0702702703;
        gl_FragColor = vec4(c, 1.0);
      }
    `
  });

  const copiaMat = new THREE.ShaderMaterial({
    uniforms: { tSrc: { value: null } },
    vertexShader: VS_QUAD,
    depthTest: false, depthWrite: false,
    fragmentShader: `precision highp float; varying vec2 vUv; uniform sampler2D tSrc;
      void main(){ gl_FragColor = vec4(texture2D(tSrc, vUv).rgb, 1.0); }`
  });

  // --- composición final -------------------------------------------------
  const compMat = new THREE.ShaderMaterial({
    uniforms: {
      tBase:   { value: null },
      tB0:     { value: null },
      tB1:     { value: null },
      tB2:     { value: null },
      uBloom:  { value: 1.0 },
      uFlash:  { value: 0.0 },
      uExp:    { value: 0.98 },
      uVig:    { value: 1.0 },
      uAberr:  { value: 1.0 },
      uT:      { value: 0 },
      uMip2:   { value: USA_MIP2 ? 1 : 0 },
      uGrano:  { value: NIVEL === 2 ? 1 : 0.5 }
    },
    vertexShader: VS_QUAD,
    depthTest: false, depthWrite: false,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D tBase, tB0, tB1, tB2;
      uniform float uBloom, uFlash, uExp, uVig, uAberr, uT, uMip2, uGrano;

      vec3 aces(vec3 x){
        const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
        return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
      }
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

      void main(){
        vec2 uv = vUv;
        vec2 dc = uv - 0.5;
        float r2 = dot(dc, dc);

        // aberración cromática radial: se abre hacia los bordes
        float k = 0.0016 * uAberr * (0.25 + r2 * 3.0);
        vec3 base;
        base.r = texture2D(tBase, uv + dc * k).r;
        base.g = texture2D(tBase, uv).g;
        base.b = texture2D(tBase, uv - dc * k).b;

        vec3 bloom = texture2D(tB0, uv).rgb * 0.82
                   + texture2D(tB1, uv).rgb * 0.30;
        if (uMip2 > 0.5) bloom += texture2D(tB2, uv).rgb * 0.15;
        vec3 col = base + bloom * uBloom;

        col += vec3(1.0, 0.90, 0.72) * uFlash;
        col *= uExp;

        // ligero grado cálido antes del tonemap
        col = mix(col, col * vec3(1.045, 1.0, 0.955), 0.6);
        col = aces(col);

        // viñeta suave y ovalada
        float v = 1.0 - uVig * smoothstep(0.18, 0.98, length(dc * vec2(1.05, 1.18)) * 1.46);
        col *= mix(1.0, v, 0.96);

        // grano de película, muy leve, animado
        float g = hash(uv * vec2(1920.0, 1080.0) + fract(uT) * 91.7) - 0.5;
        col += g * 0.020 * uGrano;

        col = pow(max(col, 0.0), vec3(1.0 / 2.2));
        gl_FragColor = vec4(col, 1.0);
      }
    `
  });

  function renderPipeline() {
    // 0. el cielo se repinta cada 5 fotogramas, a media resolución
    if (cieloDirty || (frameN % 8) === 0) {
      cieloMat.uniforms.uAspecto.value = W / H;
      pasada(cieloMat, rtCielo);
      cieloDirty = false;
    }
    frameN++;

    // 1. escena → rtScene
    renderer.setRenderTarget(rtScene);
    renderer.clear(true, false, false);
    copiaMat.uniforms.tSrc.value = rtCielo.texture;
    quadMesh.material = copiaMat;
    renderer.render(quadScene, quadCam);
    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);

    // 2. bright pass → mipA[0]
    brightMat.uniforms.tSrc.value = rtScene.texture;
    pasada(brightMat, mipA[0]);

    // 3. cadena de mips con desenfoque separable
    for (let i = 0; i < mipsActivos; i++) {
      if (i > 0) {
        copiaMat.uniforms.tSrc.value = mipA[i - 1].texture;
        pasada(copiaMat, mipA[i]);
      }
      const w = mipA[i].width, h = mipA[i].height;
      blurMat.uniforms.uTexel.value.set(1 / w, 1 / h);
      blurMat.uniforms.tSrc.value = mipA[i].texture;
      blurMat.uniforms.uDir.value.set(1, 0);
      pasada(blurMat, mipB[i]);
      blurMat.uniforms.tSrc.value = mipB[i].texture;
      blurMat.uniforms.uDir.value.set(0, 1);
      pasada(blurMat, mipA[i]);
    }

    // 4. composición a pantalla
    compMat.uniforms.tBase.value = rtScene.texture;
    compMat.uniforms.tB0.value = mipA[0].texture;
    compMat.uniforms.tB1.value = mipA[Math.min(1, mipsActivos - 1)].texture;
    compMat.uniforms.tB2.value = mipA[mipsActivos - 1].texture;
    compMat.uniforms.uMip2.value = mipsActivos >= 3 ? 1 : 0;
    pasada(compMat, null);
  }

  // ============================================================== CONTROLES
  let arrastrando = false, lx = 0, ly = 0;
  let rotX = 0.10, rotY = 0, tRX = 0.10, tRY = 0;
  const ZOOM_INICIAL = 62, ZOOM_FINAL = 28;
  const ROT_FINAL_Y = REDUCE ? 0.34 : Math.PI * 4.0 + 0.42;
  const ROT_FINAL_X = 0.205;
  let zoom = ZOOM_INICIAL, tZoom = ZOOM_FINAL;
  let pinchIni = 0, pinchZoom = 26;
  let punteroX = 0, punteroY = 0, paraX = 0, paraY = 0;

  canvas.addEventListener('mousedown', (e) => { arrastrando = true; lx = e.clientX; ly = e.clientY; });
  window.addEventListener('mouseup', () => { arrastrando = false; });
  canvas.addEventListener('mousemove', (e) => {
    punteroX = (e.clientX / window.innerWidth) * 2 - 1;
    punteroY = (e.clientY / window.innerHeight) * 2 - 1;
    if (!arrastrando) return;
    tRY += (e.clientX - lx) * 0.007;
    tRX += (e.clientY - ly) * 0.006;
    tRX = Math.max(-1.3, Math.min(1.3, tRX));
    lx = e.clientX; ly = e.clientY;
  });
  canvas.addEventListener('wheel', (e) => {
    tZoom = Math.max(4, Math.min(46, tZoom + e.deltaY * 0.04));
  }, { passive: true });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) { arrastrando = true; lx = e.touches[0].clientX; ly = e.touches[0].clientY; }
    else if (e.touches.length === 2) {
      arrastrando = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchIni = Math.hypot(dx, dy); pinchZoom = tZoom;
    }
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) arrastrando = false;
    else if (e.touches.length === 1) { arrastrando = true; lx = e.touches[0].clientX; ly = e.touches[0].clientY; }
  });
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && arrastrando) {
      tRY += (e.touches[0].clientX - lx) * 0.007;
      tRX += (e.touches[0].clientY - ly) * 0.006;
      tRX = Math.max(-1.3, Math.min(1.3, tRX));
      lx = e.touches[0].clientX; ly = e.touches[0].clientY;
    } else if (e.touches.length === 2 && pinchIni > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const d = Math.hypot(dx, dy) || 1;
      tZoom = Math.max(4, Math.min(46, pinchZoom * (pinchIni / d)));
    }
    e.preventDefault();
  }, { passive: false });

  // ============================================================== ESTADO
  let running = false;      // la secuencia arrancó (clic en "Abrir carta")
  let uT = 0;               // reloj de la coreografía
  let clock = 0;            // reloj continuo
  let flash = 0;
  let shake = 0;
  let bloomBase = 0.60;
  let bloomExtra = 0;
  let ondaP = -1;
  let hudRevelado = false;
  let cartaAbierta = false;
  let buceando = false, buceoT = 0;
  let cometaHecho = false;
  // El buceo sólo puede dispararse una vez por acercamiento: al cerrar la carta
  // la cámara queda dentro del umbral y, sin esto, la carta se reabría sola.
  let armado = true;
  let proxFugaz = 3.2;
  let cometa = null;
  const cometaCol = [1.0, 0.90, 0.62];

  const zoomHintEl = document.getElementById('zoom-hint');
  const UMBRAL_ZOOM = 9;

  function revelarHUD() {
    if (hudRevelado) return;
    hudRevelado = true;
    ['tt', 'st', 'hud-deco', 'hud-bottom', 'hcs-tl', 'hcs-tr', 'hcs-bl', 'hcs-br']
      .forEach((id) => { const el = document.getElementById(id); if (el) el.style.opacity = '1'; });
  }

  // --- arranque desde la pantalla de bienvenida --------------------------
  const overlay = document.getElementById('audio-start');
  if (overlay) {
    overlay.addEventListener('click', function () {
      if (running) return;
      this.style.transition = 'opacity .85s cubic-bezier(.4,0,.2,1), filter .85s ease, transform 1.1s cubic-bezier(.16,.9,.3,1)';
      this.style.opacity = '0';
      this.style.filter = 'blur(14px)';
      this.style.transform = 'scale(1.06)';
      setTimeout(() => { this.style.display = 'none'; }, 950);
      if (window.MusicSystem) window.MusicSystem.startAmbient();
      running = true;
      uT = 0;
      heartGroup.visible = true;
      // Antes, con prefers-reduced-motion, aquí se saltaba a TL.fin y el
      // corazón aparecía ya hecho. La coreografía es el motivo de la página:
      // se conserva siempre y lo que se suprime es el giro de cámara.
    }, { once: false });
  }

  // ============================================================== COMETA
  function lanzarCometa() {
    cometa = {
      p: new THREE.Vector3(-58, 30, -46),
      v: new THREE.Vector3(0.60, -0.205, 0.30)
    };
  }

  function explotar(p) {
    const n = NIVEL === 2 ? 260 : 130;
    for (let i = 0; i < n; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const s = 0.25 + Math.pow(Math.random(), 2) * 1.5;
      chispa(
        p.x, p.y, p.z,
        Math.sin(ph) * Math.cos(th) * s,
        Math.sin(ph) * Math.sin(th) * s,
        Math.cos(ph) * s,
        0.95, 0.72, 0.32,
        0.16 + Math.random() * 0.30,
        0.8 + Math.random() * 1.9,
        0.955
      );
    }
    flash = Math.max(flash, 0.55);
    shake = Math.max(shake, 0.9);
    bloomExtra = Math.max(bloomExtra, 1.1);
  }

  function estrellaFugaz() {
    const ini = new THREE.Vector3(
      (Math.random() - 0.5) * 130,
      26 + Math.random() * 26,
      (Math.random() - 0.5) * 70 - 20
    );
    const dir = new THREE.Vector3((Math.random() - 0.5) * 0.6, -1, (Math.random() - 0.5) * 0.4).normalize();
    const n = 26;
    for (let i = 0; i < n; i++) {
      const f = i / n;
      chispa(
        ini.x + dir.x * f * 9, ini.y + dir.y * f * 9, ini.z + dir.z * f * 9,
        dir.x * 0.95, dir.y * 0.95, dir.z * 0.95,
        0.78 * (1 - f * 0.7), 0.64 * (1 - f * 0.7), 0.36 * (1 - f * 0.8),
        0.20 * (1 - f * 0.65),
        0.55 + f * 0.5,
        0.99
      );
    }
  }

  // ============================================================== TRANSICIÓN A LA CARTA
  function bucearHaciaLaCarta() {
    if (buceando || cartaAbierta) return;
    buceando = true; buceoT = 0;
    if (zoomHintEl) zoomHintEl.style.display = 'none';
    document.querySelectorAll('#tt, #st, #hud-deco, #hud-bottom, .hud-corner-star').forEach((el) => {
      el.style.transition = 'opacity .5s ease';
      el.style.opacity = '0';
    });
  }

  /** Salta la coreografía de entrada y deja el corazón ya formado. */
  // Al terminar (o al saltar) la intro la cámara tiene que quedar exactamente
  // en la pose final: antes heredaba el zoom del último fotograma de la órbita,
  // que con un salto podía ser cualquiera.
  function fijarPoseFinal() {
    rotY = tRY = ROT_FINAL_Y;
    rotX = tRX = ROT_FINAL_X;
    zoom = tZoom = ZOOM_FINAL;
  }
  function saltarIntro() {
    if (!running || uT >= TL.fin) return;
    uT = TL.fin;
    ondaP = 1;
    flash = 0.35;
    fijarPoseFinal();
    revelarHUD();
  }
  // doble clic o Escape durante la intro: para quien ya la vio y quiere su carta
  canvas.addEventListener('dblclick', saltarIntro);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cartaAbierta) saltarIntro();
  });

  window.CorazonFX = {
    saltarIntro,
    /** Lo llama la carta al cerrarse: la cámara vuelve a salir del corazón. */
    volver() {
      cartaAbierta = false;
      buceando = false; buceoT = 0;
      armado = false;
      tZoom = ZOOM_FINAL - 4; zoom = 6;
      flash = 0.75;
      hudRevelado = false;
      revelarHUD();
      if (zoomHintEl) zoomHintEl.style.display = '';
    },
    estaBuceando() { return buceando; }
  };

  // ============================================================== CALIDAD ADAPTATIVA
  // El coste real depende del equipo, no de lo que diga navigator. Se mide el
  // tiempo de fotograma y se baja (o se recupera) la carga por escalones:
  // primero la resolución interna, luego el número de partículas dibujadas.
  const ESCALONES = [
    { pr: 1.00, parte: 1.00, mips: N_MIP },
    { pr: 0.82, parte: 1.00, mips: N_MIP },
    { pr: 0.68, parte: 0.72, mips: Math.min(2, N_MIP) },
    { pr: 0.52, parte: 0.50, mips: 1 }
  ];
  let escalon = 0;
  let mipsActivos = N_MIP;
  let acumMs = 0, acumN = 0;

  function aplicarEscalon() {
    const e = ESCALONES[escalon];
    renderer.setPixelRatio(PR * e.pr);
    renderer.setSize(W, H);
    const alto = H * PR * e.pr;
    heartUni.uAlto.value = alto;
    heartUni.uPR.value = PR * e.pr;
    starUni.uAlto.value = alto;
    sparkUni.uAlto.value = alto;
    anillos.forEach((a) => { a.uni.uAlto.value = alto; });
    heartGeo.setDrawRange(0, Math.round(N_TOTAL * e.parte));
    starGeo.setDrawRange(0, Math.round(N_STAR * Math.max(0.5, e.parte)));
    mipsActivos = e.mips;
    crearTargets();
  }

  let framesIgnorados = 0;
  function gobernar(msFotograma) {
    // los primeros fotogramas incluyen compilación de shaders: no cuentan
    if (framesIgnorados < 60) { framesIgnorados++; return; }
    acumMs += msFotograma; acumN++;
    if (acumN < 60) return;
    const media = acumMs / acumN;
    acumMs = 0; acumN = 0;
    // <33 fps baja un escalón; >51 fps sostenidos permiten recuperarlo
    if (media > 30 && escalon < ESCALONES.length - 1) { escalon++; aplicarEscalon(); }
    else if (media < 19.5 && escalon > 0) { escalon--; aplicarEscalon(); }
  }

  // ============================================================== BUCLE
  const tmpV = new THREE.Vector3();
  let ultimo = performance.now();
  let acumFugaz = 0;

  function animate() {
    requestAnimationFrame(animate);

    const ahora = performance.now();
    let dt = (ahora - ultimo) / 1000;
    ultimo = ahora;
    if (!isFinite(dt) || dt < 0) dt = 0.016;
    if (dt > 0.1) dt = 0.1;               // pestaña en segundo plano
    clock += dt;

    // Mientras la carta está abierta tapa toda la pantalla: no hay nada que
    // dibujar y sí mucha batería que ahorrar.
    if (cartaAbierta && !buceando) return;

    if (running) uT += dt;

    // ---------- coreografía de cámara ----------
    const objetivo = tmpV.set(SEED.x * 0.35, SEED.y * 0.35 + 0.6, 0);

    if (buceando) {
      buceoT += dt;
      const p = Math.min(1, buceoT / 1.25);
      const ease = p * p * p;                       // acelera hacia dentro
      zoom = 9 * (1 - ease) + 0.9 * ease;
      camera.fov = 55 + ease * 34;
      camera.updateProjectionMatrix();
      bloomExtra = 0.6 + ease * 4.2;
      flash = Math.max(flash, Math.pow(p, 3.2));
      heartUni.uGlobal.value = 1 + ease * 2.2;
      if (p >= 1 && !cartaAbierta) {
        cartaAbierta = true;
        buceando = false;
        camera.fov = 55; camera.updateProjectionMatrix();
        heartUni.uGlobal.value = 1;
        bloomExtra = 0;
        if (typeof window.openLetterPage === 'function') window.openLetterPage();
      }
      rotX += (tRX - rotX) * 0.08;
      rotY += (tRY - rotY) * 0.08;
    } else if (running && uT < TL.fin) {
      // intro: órbita amplia que se cierra sobre el corazón
      const p = Math.min(1, uT / TL.fin);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      if (REDUCE) {
        // mismo guion, sin giro: sólo un acercamiento lento y recto
        rotY = ROT_FINAL_Y;
        rotX = 0.30 * (1 - e) + ROT_FINAL_X * e;
        zoom = ZOOM_INICIAL * (1 - e) + ZOOM_FINAL * e;
        camera.fov = 55;
      } else {
        const wob = Math.sin(clock * 0.9) * 0.035;
        rotY = e * ROT_FINAL_Y + wob;
        rotX = 0.56 * (1 - e) + ROT_FINAL_X * e + Math.cos(clock * 0.7) * 0.022;
        zoom = ZOOM_INICIAL * (1 - e) + ZOOM_FINAL * e;
        camera.fov = 55 + Math.sin(clock * 1.05) * (2.4 * (1 - e));
      }
      camera.updateProjectionMatrix();
      tRX = rotX; tRY = rotY; tZoom = zoom;
      if (uT + dt >= TL.fin) fijarPoseFinal();
    } else {
      // control manual, con muelles y un poco de deriva propia
      rotX += (tRX - rotX) * 0.075;
      rotY += (tRY - rotY) * 0.075;
      zoom += (tZoom - zoom) * 0.085;
      if (!arrastrando && !REDUCE) tRY += 0.00035;
    }

    // paralaje suave con el puntero: le da profundidad sin marear
    if (!REDUCE) {
      paraX += (punteroX * 0.55 - paraX) * 0.045;
      paraY += (punteroY * 0.32 - paraY) * 0.045;
    }

    const sk = shake > 0.001 ? shake : 0;
    camera.position.x = Math.sin(rotY) * zoom * Math.cos(rotX) + paraX + (Math.random() - 0.5) * sk * 0.6;
    camera.position.y = Math.sin(rotX) * zoom + 1.2 - paraY + (Math.random() - 0.5) * sk * 0.6;
    camera.position.z = Math.cos(rotY) * zoom * Math.cos(rotX);
    camera.lookAt(objetivo);
    shake *= Math.pow(0.86, dt * 60);

    // la cámara de fondo sólo hereda la orientación: las estrellas quedan lejos
    bgCamera.quaternion.copy(camera.quaternion);
    starPts.rotation.y = clock * 0.0045;

    // ---------- latido ----------
    const T_BEAT = 1.18;
    const fase = (clock % T_BEAT) / T_BEAT;
    const golpe = Math.exp(-Math.pow((fase - 0.02) / 0.055, 2)) +
                  Math.exp(-Math.pow((fase - 0.21) / 0.048, 2)) * 0.62;
    const vivo = running && uT > TL.dibujo + 0.6 ? Math.min(1, (uT - TL.dibujo - 0.6) / 1.4) : 0;
    const beat = REDUCE ? 0 : golpe * vivo;

    // ---------- uniforms ----------
    heartUni.uT.value = uT;
    heartUni.uBeat.value = beat;
    heartUni.uFocus.value += (zoom - heartUni.uFocus.value) * 0.08;
    heartUni.uScale.value = 1;
    heartUni.uPulseA.value = running ? ((clock * 0.36) % 1.6) - 0.3 : -1;
    heartUni.uPulseB.value = running ? ((clock * 0.36 + 0.83) % 1.6) - 0.3 : -1;
    starUni.uT.value = clock;
    coronaUni.uT.value = clock;
    coronaUni.uBeat.value = beat;
    corona.quaternion.copy(camera.quaternion);
    onda.quaternion.copy(camera.quaternion);

    const bloomCorona = running ? Math.min(1, Math.max(0, (uT - TL.destello) / 2.2)) : 0;
    coronaUni.uOp.value = bloomCorona * (0.030 + beat * 0.022);

    // onda de choque en el instante del nacimiento
    if (running && uT >= TL.destello && ondaP < 0) ondaP = 0;
    if (ondaP >= 0 && ondaP <= 1) { ondaP += dt / 1.5; ondaUni.uP.value = ondaP; }
    else ondaUni.uP.value = -1;

    // destello del nacimiento
    if (running && Math.abs(uT - TL.destello) < 0.12) {
      flash = Math.max(flash, 0.85);
      shake = Math.max(shake, 1.4);
      bloomExtra = Math.max(bloomExtra, 2.0);
    }

    // anillos
    const opAnillos = running ? Math.min(1, Math.max(0, (uT - TL.relleno) / 2.0)) : 0;
    anillos.forEach((a) => {
      a.uni.uTime.value = clock;
      a.uni.uOp.value = opAnillos;
      a.pts.rotation.z += a.girZ * dt;
    });

    // ---------- cometa ----------
    if (running && !cometaHecho && uT > TL.fin + 1.6) { cometaHecho = true; lanzarCometa(); }
    if (cometa) {
      const pasos = 2;
      for (let s = 0; s < pasos; s++) {
        cometa.p.addScaledVector(cometa.v, dt * 60 / pasos);
        chispa(cometa.p.x, cometa.p.y, cometa.p.z,
          (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05,
          cometaCol[0] * 0.62, cometaCol[1] * 0.58, cometaCol[2] * 0.40,
          0.16 + Math.random() * 0.13, 0.85, 0.94);
      }
      chispa(cometa.p.x, cometa.p.y, cometa.p.z, 0, 0, 0, 1.35, 1.14, 0.72, 0.42, 0.09, 1);
      if (cometa.p.x > 9.5) {
        explotar(cometa.p);
        cometa = null;
        if (window.MusicSystem) window.MusicSystem.triggerComet();
      }
    }

    // ---------- estrellas fugaces ----------
    if (!REDUCE) {
      acumFugaz += dt;
      if (acumFugaz > proxFugaz) { acumFugaz = 0; proxFugaz = 2.6 + Math.random() * 4.5; estrellaFugaz(); }
    }
    actualizarChispas(dt);

    // ---------- HUD y apertura de la carta ----------
    if (running && uT >= TL.fin - 1.2) revelarHUD();

    if (!buceando && !cartaAbierta && running && uT > TL.fin && zoomHintEl) {
      if (!armado && zoom > UMBRAL_ZOOM + 6) armado = true;
      zoomHintEl.classList.toggle('hint-ready', armado && zoom <= UMBRAL_ZOOM + 3);
      canvas.style.cursor = 'zoom-in';
      if (armado && zoom <= UMBRAL_ZOOM) bucearHaciaLaCarta();
    }

    // ---------- post ----------
    flash *= Math.pow(0.90, dt * 60);
    if (flash < 0.001) flash = 0;
    bloomExtra *= Math.pow(0.94, dt * 60);
    compMat.uniforms.uFlash.value = flash;
    compMat.uniforms.uBloom.value = bloomBase + bloomExtra + beat * 0.18;
    compMat.uniforms.uT.value = clock;
    cieloMat.uniforms.uT.value = clock;

    renderPipeline();
    gobernar(dt * 1000);
  }
  requestAnimationFrame(animate);

  // ============================================================== RESIZE
  let rzTimer = null;
  window.addEventListener('resize', () => {
    W = Math.max(1, window.innerWidth); H = Math.max(1, window.innerHeight);
    renderer.setSize(W, H);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    bgCamera.aspect = W / H; bgCamera.updateProjectionMatrix();
    const alto = H * PR;
    heartUni.uAlto.value = alto;
    starUni.uAlto.value = alto;
    sparkUni.uAlto.value = alto;
    anillos.forEach((a) => { a.uni.uAlto.value = alto; });
    clearTimeout(rzTimer);
    rzTimer = setTimeout(crearTargets, 120);   // recrear FBOs sólo al parar
  });

  // el nivel puede cambiar en caliente si el sistema cambia la preferencia
  const alCambiar = () => {
    if (urlNivel !== null) return;
    heartUni.uReduce.value = mqReduce.matches ? 1 : 0;
  };
  if (mqReduce.addEventListener) mqReduce.addEventListener('change', alCambiar);
})();
