/* ============================================================================
   AMBIENTE — un cielo propio para cada página
   ----------------------------------------------------------------------------
   Hasta ahora los temas de temas.css sólo cambiaban dos variables de color, así
   que todas las páginas se veían iguales: oro sobre negro. Esto les da a cada
   una una atmósfera generativa distinta, dibujada en un único lienzo detrás del
   contenido.

     inicio      → constelación que reacciona al puntero
     noche       → luna, nubes a la deriva y estrellas fugaces
     promesa     → haces de luz y polvo de oro subiendo
     romantico   → bokeh de corazones latiendo a tres profundidades
     dedicatoria → rayos radiales y pétalos girando al caer
     girasol     → sol bajo y polen en rachas
     pregunta    → confeti suspendido que voltea en 3D
     navidad     → nieve con tres capas de paralaje y ráfagas

   Reglas de coste, iguales para todas: nada de ctx.filter, cero degradados
   creados por fotograma (todo horneado en calcomanías), un solo rAF, resolución
   adaptativa y parada total con la pestaña oculta.
   ========================================================================== */
(function () {
  'use strict';

  const body = document.body;
  if (!body) return;

  const m = /tema-([a-zA-Z]+)/.exec(body.className || '');
  const tema = m ? m[1] : null;
  if (!tema || !ESCENAS_DISPONIBLES(tema)) return;

  function ESCENAS_DISPONIBLES(t) {
    return ['inicio', 'noche', 'promesa', 'romantico', 'dedicatoria',
      'girasol', 'pregunta', 'navidad'].indexOf(t) !== -1;
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const amp = reduce ? 0.35 : 1;          // amplitud global de movimiento
  const nucleos = navigator.hardwareConcurrency || 4;
  const flojo = nucleos <= 4 || (navigator.deviceMemory || 4) <= 4;

  // ---------------------------------------------------------------- lienzo
  const cv = document.createElement('canvas');
  cv.className = 'fx-ambiente';
  cv.setAttribute('aria-hidden', 'true');
  body.insertBefore(cv, body.firstChild);
  const ctx = cv.getContext('2d');

  let W = 0, H = 0, dpr = 1;
  let calidad = flojo ? 0.75 : 1;

  function medir() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, flojo ? 1 : 1.5) * calidad;
    cv.width = Math.max(2, Math.round(W * dpr));
    cv.height = Math.max(2, Math.round(H * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---------------------------------------------------------------- utilería
  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);

  /** Calcomanía radial: se hornea una vez y luego sólo se estampa. */
  function halo(rgb, dureza) {
    const L = 128;
    const c = document.createElement('canvas');
    c.width = c.height = L;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(L / 2, L / 2, 0, L / 2, L / 2, L / 2);
    g.addColorStop(0, 'rgba(' + rgb + ',1)');
    g.addColorStop(dureza || 0.28, 'rgba(' + rgb + ',0.32)');
    g.addColorStop(1, 'rgba(' + rgb + ',0)');
    x.fillStyle = g;
    x.fillRect(0, 0, L, L);
    return c;
  }

  function estampa(sp, x, y, r, a) {
    if (a <= 0.004) return;
    ctx.globalAlpha = a;
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = 1;
  }

  /** Silueta de corazón maciza, horneada.
      Hubo una variante en contorno; se retiró porque sobre las fotos leía
      como un alambre dibujado encima, no como una luz desenfocada. */
  function spriteCorazon(rgb) {
    const L = 96;
    const c = document.createElement('canvas');
    c.width = c.height = L;
    const x = c.getContext('2d');
    // La figura ocupa x∈[-13,13] e y∈[-20,4]: hay que encuadrarla por su caja
    // real. Antes se escalaba por 34 y se centraba en L/2, así que los lóbulos
    // se salían por arriba del lienzo y los corazones salían decapitados.
    const ESC = L / 30;                 // 26 de ancho + margen
    x.translate(L / 2, L / 2 + 8 * ESC); // 8 = centro vertical de la figura
    x.scale(ESC, ESC);
    x.beginPath();
    x.moveTo(0, 4);
    x.bezierCurveTo(-1, 1, -4, -1, -7.5, -1);
    x.bezierCurveTo(-13, -1, -13, -7, -13, -7);
    x.bezierCurveTo(-13, -11, -9.5, -14.5, 0, -20);
    x.bezierCurveTo(9.5, -14.5, 13, -11, 13, -7);
    x.bezierCurveTo(13, -7, 13, -1, 7.5, -1);
    x.bezierCurveTo(4, -1, 1, 1, 0, 4);
    x.closePath();
    const g = x.createRadialGradient(-4, -12, 0, 0, -8, 18);
    g.addColorStop(0, 'rgba(' + rgb + ',0.95)');
    g.addColorStop(1, 'rgba(' + rgb + ',0.35)');
    x.fillStyle = g;
    x.fill();
    return c;
  }

  /** Pétalo alargado con nervio, horneado. */
  function spritePetalo(rgb) {
    const w = 64, h = 30;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(' + rgb + ',0.30)');
    g.addColorStop(0.45, 'rgba(' + rgb + ',0.92)');
    g.addColorStop(1, 'rgba(255,255,255,0.85)');
    x.fillStyle = g;
    x.beginPath();
    x.moveTo(0, h / 2);
    x.bezierCurveTo(w * 0.2, 0, w * 0.72, 1, w, h / 2);
    x.bezierCurveTo(w * 0.72, h - 1, w * 0.2, h, 0, h / 2);
    x.fill();
    x.strokeStyle = 'rgba(120,80,0,0.18)';
    x.lineWidth = 1;
    x.beginPath(); x.moveTo(w * 0.08, h / 2); x.lineTo(w * 0.9, h / 2); x.stroke();
    return c;
  }

  /** Nube difusa por acumulación de manchas. */
  function spriteNube(rgb, semilla) {
    const w = 320, h = 130;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    let s = semilla;
    const azar = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 26; i++) {
      const cxp = azar() * w, cyp = h * 0.35 + azar() * h * 0.45;
      const r = 22 + azar() * 46;
      const g = x.createRadialGradient(cxp, cyp, 0, cxp, cyp, r);
      g.addColorStop(0, 'rgba(' + rgb + ',0.16)');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      x.fillStyle = g;
      x.beginPath(); x.arc(cxp, cyp, r, 0, Math.PI * 2); x.fill();
    }
    return c;
  }

  /** Luna con cráteres y halo. */
  function spriteLuna(r) {
    const R = r * 5.5;
    const c = document.createElement('canvas');
    c.width = c.height = Math.ceil(R * 2);
    const x = c.getContext('2d');
    x.translate(R, R);
    const h = x.createRadialGradient(0, 0, r * 0.8, 0, 0, R);
    h.addColorStop(0, 'rgba(198,214,255,0.22)');
    h.addColorStop(0.3, 'rgba(160,185,240,0.07)');
    h.addColorStop(1, 'rgba(140,170,230,0)');
    x.fillStyle = h;
    x.beginPath(); x.arc(0, 0, R, 0, Math.PI * 2); x.fill();
    const d = x.createRadialGradient(-r * 0.34, -r * 0.34, r * 0.08, 0, 0, r * 1.04);
    d.addColorStop(0, '#fefcf5');
    d.addColorStop(0.55, '#e7eaf3');
    d.addColorStop(1, '#98a4bb');
    x.fillStyle = d;
    x.beginPath(); x.arc(0, 0, r, 0, Math.PI * 2); x.fill();
    x.save();
    x.beginPath(); x.arc(0, 0, r, 0, Math.PI * 2); x.clip();
    const cr = [[-0.30, -0.18, 0.24], [0.22, 0.10, 0.17], [-0.06, 0.36, 0.13],
                [0.38, -0.30, 0.10], [-0.44, 0.24, 0.09]];
    for (let i = 0; i < cr.length; i++) {
      const cx2 = cr[i][0] * r, cy2 = cr[i][1] * r, rr = cr[i][2] * r;
      const cg = x.createRadialGradient(cx2 - rr * 0.3, cy2 - rr * 0.3, 0, cx2, cy2, rr);
      cg.addColorStop(0, 'rgba(148,157,176,0.32)');
      cg.addColorStop(1, 'rgba(120,130,150,0.04)');
      x.fillStyle = cg;
      x.beginPath(); x.arc(cx2, cy2, rr, 0, Math.PI * 2); x.fill();
    }
    x.restore();
    return { c, R };
  }

  // ---------------------------------------------------------------- puntero
  const puntero = { x: -9999, y: -9999, activo: false };
  window.addEventListener('pointermove', (e) => {
    puntero.x = e.clientX; puntero.y = e.clientY; puntero.activo = true;
  }, { passive: true });
  window.addEventListener('pointerleave', () => { puntero.activo = false; });

  // ================================================================ ESCENAS
  const escenas = {};

  /* ---------------------------------------------------------- CONSTELACIÓN */
  escenas.inicio = (function () {
    let estrellas = [], spBlanco, spOro, fugaces = [], sigFugaz = 3;
    // Densidad y alcance en función del ÁREA, no fijos. Con 105 estrellas y
    // un radio de 165 px constantes, en un móvil de 375 px cada estrella
    // alcanzaba a media pantalla: la malla se cerraba sobre sí misma y el
    // texto de las tarjetas quedaba debajo de una red. Se calculan en init()
    // porque W y H sólo se conocen después de medir.
    let N = 0, DIST = 165;

    return {
      init() {
        const area = W * H;
        const ref = 1440 * 900;                       // pantalla de referencia
        const k = Math.sqrt(area / ref);              // escala lineal
        N = Math.round((flojo ? 60 : 105) * Math.min(1, Math.max(0.34, area / ref)));
        DIST = Math.round(165 * Math.min(1.15, Math.max(0.62, k)));

        spBlanco = halo('226,236,255');
        spOro = halo('255,214,110');
        estrellas = [];
        for (let i = 0; i < N; i++) {
          estrellas.push({
            x: Math.random() * W, y: Math.random() * H,
            vx: rnd(-0.10, 0.10), vy: rnd(-0.07, 0.07),
            r: rnd(1.0, 2.9), b: Math.pow(Math.random(), 1.6) * 0.75 + 0.35,
            f: Math.random() * 6.28, oro: Math.random() < 0.22
          });
        }
        fugaces = []; sigFugaz = 3;
      },
      draw(t, dt) {
        // hilos entre estrellas próximas: la constelación se teje sola
        ctx.lineWidth = 1;
        for (let i = 0; i < estrellas.length; i++) {
          const a = estrellas[i];
          a.x += a.vx * dt * amp; a.y += a.vy * dt * amp;
          if (a.x < -20) a.x = W + 20; else if (a.x > W + 20) a.x = -20;
          if (a.y < -20) a.y = H + 20; else if (a.y > H + 20) a.y = -20;

          // el puntero atrae suavemente a las cercanas
          if (puntero.activo) {
            const dx = puntero.x - a.x, dy = puntero.y - a.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 30000 && d2 > 1) {
              const f = (1 - d2 / 30000) * 0.035 * amp;
              a.x += dx * f; a.y += dy * f;
            }
          }

          for (let j = i + 1; j < estrellas.length; j++) {
            const b = estrellas[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d = Math.abs(dx) + Math.abs(dy);      // manhattan: barato
            if (d > DIST) continue;
            const real = Math.sqrt(dx * dx + dy * dy);
            if (real > DIST) continue;
            let al = (1 - real / DIST) * 0.24;
            // los hilos junto al cursor se encienden
            if (puntero.activo) {
              const mx = (a.x + b.x) * 0.5 - puntero.x;
              const my = (a.y + b.y) * 0.5 - puntero.y;
              const dm = Math.sqrt(mx * mx + my * my);
              const R = DIST * 1.35;                   // el foco escala con la malla
              if (dm < R) al += (1 - dm / R) * 0.55;
            }
            ctx.strokeStyle = 'rgba(255,224,150,' + al.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // los nodos, encima de los hilos
        for (let i = 0; i < estrellas.length; i++) {
          const s = estrellas[i];
          const tw = 0.55 + 0.45 * Math.sin(t * 1.4 + s.f);
          estampa(s.oro ? spOro : spBlanco, s.x, s.y, s.r * 9, s.b * tw * 0.85);
          ctx.fillStyle = 'rgba(255,250,240,' + (s.b * tw).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
        }

        // estrellas fugaces esporádicas
        sigFugaz -= dt / 60;
        if (sigFugaz <= 0 && !reduce) {
          sigFugaz = rnd(4, 11);
          fugaces.push({ x: rnd(0, W), y: rnd(-40, H * 0.4), vx: rnd(4, 8), vy: rnd(2, 4), v: 0 });
        }
        for (let i = fugaces.length - 1; i >= 0; i--) {
          const f = fugaces[i];
          f.v += dt / 60;
          f.x += f.vx * dt; f.y += f.vy * dt;
          const a = Math.max(0, 1 - f.v / 1.1);
          if (a <= 0 || f.x > W + 60) { fugaces.splice(i, 1); continue; }
          const g = ctx.createLinearGradient(f.x, f.y, f.x - f.vx * 14, f.y - f.vy * 14);
          g.addColorStop(0, 'rgba(255,246,214,' + (a * 0.9).toFixed(3) + ')');
          g.addColorStop(1, 'rgba(255,214,110,0)');
          ctx.strokeStyle = g; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(f.x, f.y); ctx.lineTo(f.x - f.vx * 14, f.y - f.vy * 14);
          ctx.stroke();
        }
      }
    };
  })();

  /* ------------------------------------------------------------------ NOCHE */
  escenas.noche = (function () {
    let luna, estrellas = [], spEstrella;
    let lunaPropia = null, spHalo;      // luna que ya trae la página
    const N = flojo ? 60 : 110;

    /** ¿La página ya dibuja una luna? Entonces no ponemos otra encima. */
    function buscarLuna() {
      const el = document.querySelector('.bn-moon, .moon, #moon, .luna, #luna');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 8) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
    }

    return {
      init() {
        lunaPropia = buscarLuna();
        spHalo = halo('198,214,255', 0.22);
        luna = lunaPropia ? null : spriteLuna(Math.max(26, Math.min(W, H) * 0.055));
        spEstrella = halo('222,232,255');
        estrellas = [];
        for (let i = 0; i < N; i++) {
          estrellas.push({
            x: Math.random() * W, y: Math.random() * H * 0.85,
            r: Math.pow(Math.random(), 2.4) * 1.9 + 0.35,
            b: 0.18 + Math.random() * 0.72,
            f: Math.random() * 6.28, v: rnd(0.5, 2.1)
          });
        }
      },
      draw(t, dt) {
        let lx, ly, radio;
        if (lunaPropia) {
          // sólo le añadimos el halo que le falta; el disco es suyo
          lx = lunaPropia.x; ly = lunaPropia.y; radio = lunaPropia.r * 5.2;
          const respira = 0.85 + 0.15 * Math.sin(t * 0.35);
          estampa(spHalo, lx, ly, radio, 0.24 * respira);
        } else {
          lx = W * 0.84; ly = H * 0.17; radio = luna.R;
          ctx.globalAlpha = 0.95;
          ctx.drawImage(luna.c, lx - luna.R, ly - luna.R, luna.R * 2, luna.R * 2);
          ctx.globalAlpha = 1;
        }

        for (let i = 0; i < estrellas.length; i++) {
          const s = estrellas[i];
          const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * s.v + s.f));
          const d = Math.hypot(s.x - lx, s.y - ly);
          const cerca = d < radio * 0.45 ? 0.35 : 1;   // la luna apaga lo cercano
          const a = s.b * tw * cerca;
          if (s.b > 0.7) estampa(spEstrella, s.x, s.y, s.r * 8, a * 0.35);
          ctx.fillStyle = 'rgba(235,242,255,' + a.toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
        }
      }
    };
  })();

  /* --------------------------------------------------------------- PROMESA */
  escenas.promesa = (function () {
    let motas = [], spOro;
    const N = flojo ? 55 : 105;
    return {
      init() {
        spOro = halo('255,214,120');
        motas = [];
        for (let i = 0; i < N; i++) {
          motas.push({
            x: Math.random() * W, y: Math.random() * H,
            v: rnd(0.10, 0.42), s: rnd(0.7, 2.3),
            f: Math.random() * 6.28, d: rnd(-0.25, 0.25),
            a: rnd(0.16, 0.6)
          });
        }
      },
      draw(t, dt) {
        // haces de luz desde arriba a la izquierda, girando muy despacio
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const ox = W * 0.16, oy = -H * 0.12;
        for (let i = 0; i < 5; i++) {
          const base = 0.62 + i * 0.20 + Math.sin(t * 0.09 + i) * 0.030 * amp;
          const anc = 0.085 + 0.032 * Math.sin(t * 0.23 + i * 1.7);
          const L = Math.hypot(W, H) * 1.25;
          const g = ctx.createLinearGradient(ox, oy, ox + Math.cos(base) * L, oy + Math.sin(base) * L);
          const inten = (0.085 + 0.045 * Math.sin(t * 0.5 + i * 2.1)) * amp;
          g.addColorStop(0, 'rgba(255,206,110,' + inten.toFixed(3) + ')');
          g.addColorStop(0.55, 'rgba(255,180,60,' + (inten * 0.35).toFixed(3) + ')');
          g.addColorStop(1, 'rgba(255,160,30,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.arc(ox, oy, L, base - anc, base + anc);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // polvo de oro ascendente
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < motas.length; i++) {
          const p = motas[i];
          p.y -= p.v * dt * amp;
          p.x += (p.d + Math.sin(t * 0.7 + p.f) * 0.28) * dt * amp;
          if (p.y < -14) { p.y = H + 14; p.x = Math.random() * W; }
          const br = p.a * (0.42 + 0.58 * Math.abs(Math.sin(t * 1.5 + p.f)));
          estampa(spOro, p.x, p.y, p.s * 4.6, br * 0.55);
          ctx.fillStyle = 'rgba(255,238,180,' + (br * 0.85).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 0.6, 0, 6.283); ctx.fill();
        }
        ctx.restore();
      }
    };
  })();

  /* ------------------------------------------------------------- ROMÁNTICO */
  escenas.romantico = (function () {
    let corazones = [], spLleno, spBokeh;
    const N = flojo ? 16 : 28;
    return {
      init() {
        spLleno = spriteCorazon('255,138,180');
        // El corazón en CONTORNO se ha eliminado. Sobre las fotos no leía
        // como bokeh sino como un garabato de alambre encima del recuerdo:
        // una silueta hueca no se difumina, se recorta. Aquí sólo entran
        // formas macizas y muy tenues, que es como se comporta una luz
        // desenfocada de verdad.
        spBokeh = halo('255,168,205', 0.55);
        corazones = [];
        for (let i = 0; i < N; i++) {
          const prof = Math.random();                 // 0 lejos · 1 cerca
          corazones.push({
            x: Math.random() * W, y: Math.random() * H,
            prof,
            r: (5 + prof * 13),
            v: (0.10 + prof * 0.32),
            g: rnd(-0.4, 0.4), rot: Math.random() * 6.28,
            f: Math.random() * 6.28,
            a: 0.09 + (1 - prof) * 0.13 + prof * 0.15
          });
        }
      },
      draw(t, dt) {
        // latido: doble golpe, el mismo compás que el corazón de la carta
        const T = 1.18, fase = (t % T) / T;
        const golpe = Math.exp(-Math.pow((fase - 0.02) / 0.055, 2))
                    + Math.exp(-Math.pow((fase - 0.21) / 0.048, 2)) * 0.62;
        const beat = 1 + golpe * 0.06 * amp;

        for (let i = 0; i < corazones.length; i++) {
          const c = corazones[i];
          c.y -= c.v * dt * amp;
          c.x += (c.g + Math.sin(t * 0.5 + c.f) * 0.24) * dt * amp;
          c.rot += 0.0035 * dt * amp * (c.prof - 0.5);
          if (c.y < -c.r * 3) { c.y = H + c.r * 3; c.x = Math.random() * W; }

          const r = c.r * beat;
          // los lejanos son sólo bokeh; los cercanos insinúan la silueta
          if (c.prof < 0.55) {
            estampa(spBokeh, c.x, c.y, r * 1.6, c.a * 0.55);
          } else {
            estampa(spBokeh, c.x, c.y, r * 1.9, c.a * 0.30);
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(Math.sin(c.rot) * 0.22);
            ctx.globalAlpha = c.a * 0.75;
            ctx.drawImage(spLleno, -r, -r, r * 2, r * 2);
            ctx.restore();
            ctx.globalAlpha = 1;
          }
        }
      }
    };
  })();

  /* ----------------------------------------------------------- DEDICATORIA */
  escenas.dedicatoria = (function () {
    let petalos = [], sp, spGlow;
    // Menos y más tenues de lo que parecía razonable: esta página es para
    // LEER. Con 46 pétalos opacos el texto quedaba enterrado en confeti;
    // la caída tiene que insinuarse, no competir.
    const N = flojo ? 13 : 24;
    return {
      init() {
        sp = spritePetalo('255,206,80');
        spGlow = halo('255,220,140');
        petalos = [];
        for (let i = 0; i < N; i++) {
          const prof = Math.random();
          petalos.push({
            x: Math.random() * W, y: Math.random() * H,
            prof,
            v: rnd(0.25, 0.85), g: rnd(-0.5, 0.5),
            rot: Math.random() * 6.28, vr: rnd(-0.03, 0.03),
            esc: rnd(0.5, 1.35), f: Math.random() * 6.28,
            // la profundidad manda en el brillo: los del fondo casi no están
            a: 0.10 + prof * 0.26
          });
        }
      },
      draw(t, dt) {
        // abanico de rayos desde el borde superior
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const ox = W * 0.5, oy = -H * 0.28;
        for (let i = 0; i < 7; i++) {
          const base = 1.5708 + (i - 3) * 0.19 + Math.sin(t * 0.11 + i) * 0.02 * amp;
          const anc = 0.055 + 0.024 * Math.sin(t * 0.31 + i * 1.3);
          const L = H * 1.8;
          const g = ctx.createLinearGradient(ox, oy, ox + Math.cos(base) * L, oy + Math.sin(base) * L);
          const inten = (0.070 + 0.038 * Math.sin(t * 0.44 + i * 1.9)) * amp;
          g.addColorStop(0, 'rgba(255,224,140,' + inten.toFixed(3) + ')');
          g.addColorStop(1, 'rgba(255,190,60,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.arc(ox, oy, L, base - anc, base + anc);
          ctx.closePath(); ctx.fill();
        }
        ctx.restore();

        for (let i = 0; i < petalos.length; i++) {
          const p = petalos[i];
          p.y += p.v * dt * amp * (0.4 + p.prof);
          p.x += (p.g + Math.sin(t * 0.6 + p.f) * 0.5) * dt * amp;
          p.rot += p.vr * dt * amp;
          if (p.y > H + 30) { p.y = -30; p.x = Math.random() * W; }
          if (p.x < -40) p.x = W + 40; else if (p.x > W + 40) p.x = -40;

          const w = 30 * p.esc * (0.55 + p.prof * 0.9);
          const h = w * 0.47;
          estampa(spGlow, p.x, p.y, w * 0.8, p.a * 0.14);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          // el giro sobre su eje hace que el pétalo se vea de canto a ratos
          ctx.scale(1, Math.abs(Math.cos(p.rot * 1.7)) * 0.75 + 0.25);
          ctx.globalAlpha = p.a;
          ctx.drawImage(sp, -w / 2, -h / 2, w, h);
          ctx.restore();
          ctx.globalAlpha = 1;
        }
      }
    };
  })();

  /* --------------------------------------------------------------- GIRASOL */
  escenas.girasol = (function () {
    let polen = [], spOro;
    const N = flojo ? 30 : 58;
    return {
      init() {
        spOro = halo('255,222,120');
        polen = [];
        for (let i = 0; i < N; i++) {
          polen.push({
            x: Math.random() * W, y: Math.random() * H,
            v: rnd(0.08, 0.34), s: rnd(0.8, 2.6),
            f: Math.random() * 6.28, a: rnd(0.14, 0.5)
          });
        }
      },
      draw(t, dt) {
        // sol bajo por la izquierda
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        estampa(spOro, W * 0.10, H * 0.86, Math.max(W, H) * 0.42, 0.055 * (0.85 + 0.15 * Math.sin(t * 0.4)));
        estampa(spOro, W * 0.92, H * 0.12, Math.max(W, H) * 0.28, 0.030);
        // racha: el polen sale a bocanadas, no en goteo constante
        const racha = 0.5 + 0.5 * Math.pow(Math.max(0, Math.sin(t * 0.33)), 3);
        for (let i = 0; i < polen.length; i++) {
          const p = polen[i];
          p.y -= p.v * (0.5 + racha) * dt * amp;
          p.x += Math.sin(t * 0.8 + p.f) * 0.5 * dt * amp;
          if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; }
          const br = p.a * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.4 + p.f)));
          estampa(spOro, p.x, p.y, p.s * 5, br * 0.6);
        }
        ctx.restore();
      }
    };
  })();

  /* -------------------------------------------------------------- PREGUNTA */
  /* Luz de vela. Aquí ANTES llovía confeti todo el rato, y estaba mal por
     dos motivos: la-pregunta.js ya suelta confeti de corazones cuando ella
     contesta que sí, así que el fondo le robaba su único momento; y una
     página que consiste en abrir un sobre y esperar una respuesta no puede
     estar de fiesta antes de que la pregunta se haga.
     Lo que corresponde es una vela: rescoldo bajo, pavesas que suben y un
     parpadeo que nunca repite el mismo ciclo. */
  escenas.pregunta = (function () {
    let pavesas = [], spBrasa, spCalor;
    const N = flojo ? 26 : 52;

    // Parpadeo de llama: tres senos primos entre sí para que el ojo no
    // encuentre el bucle. Un solo seno se delata en tres segundos.
    const titilar = t =>
      0.80 +
      0.11 * Math.sin(t * 2.13) +
      0.06 * Math.sin(t * 5.77 + 1.3) +
      0.04 * Math.sin(t * 11.31 + 2.6);

    function nacer(p, alto) {
      p.x = W * rnd(0.16, 0.84);
      p.y = H + rnd(4, alto);
      p.v = rnd(0.28, 0.85);
      p.deriva = rnd(-0.22, 0.22);
      p.f = Math.random() * 6.28;
      p.osc = rnd(0.35, 1.05);
      p.r = rnd(1.1, 2.9);
      p.a = rnd(0.30, 0.85);
      p.vida = 0;
      p.total = rnd(260, 620);
    }

    return {
      init() {
        spBrasa = halo('255,170,60', 0.42);
        spCalor = halo('255,150,40', 0.55);
        pavesas = [];
        for (let i = 0; i < N; i++) {
          const p = {};
          nacer(p, H * 1.1);
          p.vida = Math.random() * p.total;   // ya vienen subiendo al cargar
          p.y = H - (p.vida / p.total) * H * 1.05;
          pavesas.push(p);
        }
      },
      draw(t, dt) {
        const luz = titilar(t);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Rescoldo: la fuente de luz vive abajo, fuera de cuadro
        estampa(spCalor, W * 0.5, H * 1.06, Math.max(W, H) * 0.68, 0.075 * luz);
        estampa(spCalor, W * 0.5, H * 0.98, Math.max(W, H) * 0.30, 0.055 * luz);

        for (let i = 0; i < pavesas.length; i++) {
          const p = pavesas[i];
          p.vida += dt * amp;
          if (p.vida >= p.total || p.y < -20) { nacer(p, 30); continue; }

          // sube frenando: el aire caliente pierde empuje al alejarse
          const k = p.vida / p.total;
          p.y -= p.v * (1 - k * 0.55) * dt * amp;
          p.x += (p.deriva + Math.sin(t * p.osc + p.f) * 0.34) * dt * amp;

          // se enciende al nacer y se apaga al final, nunca de golpe
          const sobre = Math.min(1, k * 6) * (1 - k) * (1 - k);
          const brillo = p.a * sobre * luz;
          if (brillo <= 0.004) continue;

          estampa(spBrasa, p.x, p.y, p.r * 7, brillo * 0.5);   // aura
          estampa(spBrasa, p.x, p.y, p.r * 2.1, brillo);       // núcleo
        }
        ctx.restore();
      }
    };
  })();

  /* ---------------------------------------------------------------- NAVIDAD */
  escenas.navidad = (function () {
    let copos = [], spCopo;
    const N = flojo ? 60 : 130;
    return {
      init() {
        spCopo = halo('236,244,255', 0.4);
        copos = [];
        for (let i = 0; i < N; i++) {
          const prof = Math.random();
          copos.push({
            x: Math.random() * W, y: Math.random() * H,
            prof,
            r: 0.9 + prof * 3.1,
            v: 0.22 + prof * 0.95,
            f: Math.random() * 6.28,
            osc: rnd(0.3, 1.1),
            a: 0.20 + prof * 0.62
          });
        }
      },
      draw(t, dt) {
        // ráfaga lateral compartida: toda la nieve se inclina a la vez
        const rafaga = Math.sin(t * 0.23) * 0.7 + Math.sin(t * 0.61 + 1.4) * 0.3;
        for (let i = 0; i < copos.length; i++) {
          const c = copos[i];
          c.y += c.v * dt * amp;
          c.x += (rafaga * (0.5 + c.prof) + Math.sin(t * c.osc + c.f) * 0.4) * dt * amp;
          if (c.y > H + 12) { c.y = -12; c.x = Math.random() * W; }
          if (c.x < -20) c.x = W + 20; else if (c.x > W + 20) c.x = -20;
          // los del fondo son puro halo difuso; los del frente, nítidos
          if (c.prof < 0.45) {
            estampa(spCopo, c.x, c.y, c.r * 5, c.a * 0.5);
          } else {
            estampa(spCopo, c.x, c.y, c.r * 3.4, c.a * 0.35);
            ctx.fillStyle = 'rgba(244,250,255,' + c.a.toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 6.283); ctx.fill();
          }
        }
      }
    };
  })();

  // ================================================================ BUCLE
  const escena = escenas[tema];
  if (!escena) return;

  medir();
  escena.init();

  let ultimo = performance.now();
  let raf = null;
  let acumMs = 0, acumN = 0, ignorar = 0;

  function gobernar(ms) {
    if (ignorar < 40) { ignorar++; return; }
    acumMs += ms; acumN++;
    if (acumN < 60) return;
    const media = acumMs / acumN;
    acumMs = 0; acumN = 0;
    if (media > 30 && calidad > 0.55) { calidad = Math.max(0.55, calidad - 0.2); medir(); escena.init(); }
    else if (media < 19 && calidad < 1) { calidad = Math.min(1, calidad + 0.15); medir(); escena.init(); }
  }

  function bucle(ahora) {
    raf = requestAnimationFrame(bucle);
    let ms = ahora - ultimo;
    ultimo = ahora;
    if (!isFinite(ms) || ms <= 0) ms = 16.7;
    if (ms > 100) ms = 100;
    const dt = ms / 16.67;
    const t = ahora / 1000;

    ctx.clearRect(0, 0, W, H);
    escena.draw(t, dt);
    gobernar(ms);
  }

  function arrancar() {
    if (raf === null) { ultimo = performance.now(); raf = requestAnimationFrame(bucle); }
  }
  function parar() {
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }

  // nada de gastar batería con la pestaña de fondo
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar(); else arrancar();
  });

  let rz = null;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { medir(); escena.init(); }, 160);
  });

  arrancar();
})();
