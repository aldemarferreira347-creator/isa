// ═══════════════════════════════════════════════════════════════════════
// NAVIDAD-ESCENA.JS — noche de nochebuena, dibujada a mano
//
// La carta de Navidad era la única de su clase sin nada que mirar: sólo
// texto y nieve de fondo. Aquí se le da su propia escena, con las mismas
// reglas de coste que la del girasol: todo lo caro se hornea UNA vez en
// lienzos aparte y por fotograma sólo se estampan calcomanías. Ni un solo
// `ctx.filter`, ni un degradado nuevo por vuelta.
//
// No toca ni una palabra de la carta: vive debajo, en su propio lienzo.
// ═══════════════════════════════════════════════════════════════════════
(function () {
  const cv = document.getElementById('escenaNavidad');
  if (!cv || !cv.getContext) return;

  const ctx = cv.getContext('2d', { alpha: false });
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = mqReduce.matches;
  // Con movimiento reducido no se congela: se baja la amplitud. Una escena
  // parada no cuenta nada; una escena lenta sigue contándolo.
  const amp = reduce ? 0.34 : 1;

  const nucleos = navigator.hardwareConcurrency || 4;
  const flojo = nucleos <= 4;

  let W = 0, H = 0, dpr = 1, calidad = 1;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const lim = (v, a, b) => v < a ? a : v > b ? b : v;

  // ─────────────────────────────────────────────────── calcomanías
  function halo(rgb, dureza) {
    const L = 128, c = document.createElement('canvas');
    c.width = c.height = L;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(L / 2, L / 2, 0, L / 2, L / 2, L / 2);
    g.addColorStop(0, 'rgba(' + rgb + ',1)');
    g.addColorStop(dureza || 0.35, 'rgba(' + rgb + ',0.42)');
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

  let spCalido, spFrio, spCopo, spBombilla = [];
  const COLORES_LUZ = ['255,86,86', '255,214,92', '120,226,140', '128,192,255', '255,150,220'];

  function hornear() {
    spCalido = halo('255,176,72', 0.30);
    spFrio = halo('186,222,255', 0.34);
    spCopo = halo('238,247,255', 0.45);
    spBombilla = COLORES_LUZ.map(c => halo(c, 0.26));
  }

  // ─────────────────────────────────────────────── fondo horneado
  // Cielo, colinas, árbol y regalos no cambian nunca. Se pintan una vez en
  // un lienzo aparte y cada fotograma se copian de un golpe.
  let bufFondo = null;
  const luces = [];   // posiciones de la guirnalda, para animarlas encima

  function pintarFondo() {
    bufFondo = document.createElement('canvas');
    bufFondo.width = cv.width;
    bufFondo.height = cv.height;
    const x = bufFondo.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ── cielo ──
    const cielo = x.createLinearGradient(0, 0, 0, H);
    cielo.addColorStop(0, '#04121b');
    cielo.addColorStop(0.42, '#0a2333');
    cielo.addColorStop(0.72, '#123a46');
    cielo.addColorStop(1, '#1d5350');
    x.fillStyle = cielo;
    x.fillRect(0, 0, W, H);

    // ── estrellas ──
    const nEst = Math.round((flojo ? 60 : 110) * calidad);
    for (let i = 0; i < nEst; i++) {
      const ex = Math.random() * W, ey = Math.random() * H * 0.62;
      const r = rnd(0.4, 1.5);
      x.fillStyle = 'rgba(226,240,255,' + rnd(0.16, 0.8).toFixed(2) + ')';
      x.beginPath(); x.arc(ex, ey, r, 0, 6.283); x.fill();
    }

    // ── luna baja, fría ──
    const lx = W * 0.82, ly = H * 0.17, lr = Math.min(W, H) * 0.055;
    const gl = x.createRadialGradient(lx, ly, 0, lx, ly, lr * 5);
    gl.addColorStop(0, 'rgba(198,226,255,0.30)');
    gl.addColorStop(1, 'rgba(198,226,255,0)');
    x.fillStyle = gl;
    x.beginPath(); x.arc(lx, ly, lr * 5, 0, 6.283); x.fill();
    x.fillStyle = '#dfeeff';
    x.beginPath(); x.arc(lx, ly, lr, 0, 6.283); x.fill();

    // ── colinas de nieve, tres planos ──
    const suelo = H * 0.78;
    [[0.60, '#12303c', 0.030], [0.72, '#1b4450', 0.045], [0.86, '#2a5f63', 0.062]]
      .forEach(([alt, col, onda]) => {
        const base = H * alt;
        x.fillStyle = col;
        x.beginPath();
        x.moveTo(-10, H + 10);
        x.lineTo(-10, base);
        for (let px = -10; px <= W + 10; px += 12) {
          const y = base
            + Math.sin(px * 0.0075 + alt * 20) * H * onda
            + Math.sin(px * 0.021 + alt * 9) * H * onda * 0.34;
          x.lineTo(px, y);
        }
        x.lineTo(W + 10, H + 10);
        x.closePath();
        x.fill();
      });

    // ── manto nevado en primer plano ──
    const nieve = x.createLinearGradient(0, suelo, 0, H);
    nieve.addColorStop(0, '#e8f6ff');
    nieve.addColorStop(0.4, '#cfe6f2');
    nieve.addColorStop(1, '#9fc3d2');
    x.fillStyle = nieve;
    x.beginPath();
    x.moveTo(-10, H + 10);
    x.lineTo(-10, suelo + 14);
    for (let px = -10; px <= W + 10; px += 10) {
      x.lineTo(px, suelo + 14 + Math.sin(px * 0.013) * H * 0.016 + Math.sin(px * 0.037) * H * 0.007);
    }
    x.lineTo(W + 10, H + 10);
    x.closePath();
    x.fill();

    // ── el pino ──
    const tx = W * 0.5, tBase = suelo + H * 0.035;
    const tAlto = H * 0.60, tAncho = W * 0.46;

    // tronco
    x.fillStyle = '#4a2f18';
    x.fillRect(tx - W * 0.016, tBase - H * 0.05, W * 0.032, H * 0.062);

    // faldas: de abajo a arriba, cada una más corta
    const CAPAS = 5;
    luces.length = 0;
    for (let i = 0; i < CAPAS; i++) {
      const k = i / (CAPAS - 1);
      const cy = tBase - H * 0.045 - k * tAlto * 0.80;
      const an = tAncho * (1 - k * 0.68) * 0.5;
      const al = tAlto * (0.30 - k * 0.045);

      const g = x.createLinearGradient(tx - an, cy - al, tx + an, cy);
      g.addColorStop(0, '#1f6b32');
      g.addColorStop(0.45, '#2f8f42');
      g.addColorStop(1, '#154d24');
      x.fillStyle = g;

      // Media silueta, de la punta a la base, y luego se refleja. El borde
      // baja de verdad: antes se quedaba pegado a la horizontal y cada falda
      // salía como una tira plana en vez de un faldón.
      const dientes = 6;
      const media = [];
      for (let d = 0; d <= dientes; d++) {
        const p = d / dientes;
        media.push([an * p, -al + al * p]);                    // punta del diente
        if (d < dientes) {
          const pm = (d + 0.5) / dientes;
          media.push([an * pm * 0.80, -al + al * pm + al * 0.06]); // muesca
        }
      }

      x.beginPath();
      x.moveTo(tx, cy - al);
      for (let q = 0; q < media.length; q++) x.lineTo(tx + media[q][0], cy + media[q][1]);
      x.quadraticCurveTo(tx, cy + al * 0.13, tx - an, cy);
      for (let q = media.length - 1; q >= 0; q--) x.lineTo(tx - media[q][0], cy + media[q][1]);
      x.closePath();
      x.fill();

      // nieve posada en el canto de cada falda
      x.strokeStyle = 'rgba(232,246,255,0.62)';
      x.lineWidth = Math.max(1.4, H * 0.004);
      x.beginPath();
      x.moveTo(tx - an * 0.92, cy - al * 0.01);
      x.quadraticCurveTo(tx, cy + al * 0.12, tx + an * 0.92, cy - al * 0.01);
      x.stroke();

      // guirnalda: se reparte a lo ancho de la falda, cayendo en curva
      const nL = Math.max(3, Math.round((7 - i) * calidad));
      for (let b = 0; b < nL; b++) {
        const p = nL === 1 ? 0.5 : b / (nL - 1);
        const bx = tx - an * 0.86 + an * 1.72 * p;
        const by = cy - al * 0.04 + Math.sin(p * Math.PI) * al * 0.17;
        luces.push({
          x: bx, y: by,
          c: (i + b) % COLORES_LUZ.length,
          f: Math.random() * 6.28,
          v: rnd(1.1, 2.4),
          r: Math.max(2, Math.min(W, H) * 0.0055)
        });
      }
    }

    // ── estrella de la punta (el cuerpo; los rayos se animan encima) ──
    const ex = tx, ey = tBase - H * 0.045 - tAlto * 0.80 - tAlto * 0.26;
    x.fillStyle = '#ffe98a';
    x.beginPath();
    for (let i = 0; i < 10; i++) {
      const ang = -Math.PI / 2 + i * Math.PI / 5;
      const rr = (i % 2 ? 0.42 : 1) * Math.min(W, H) * 0.040;
      x[i ? 'lineTo' : 'moveTo'](ex + Math.cos(ang) * rr, ey + Math.sin(ang) * rr);
    }
    x.closePath();
    x.fill();
    estrella = { x: ex, y: ey, r: Math.min(W, H) * 0.040 };

    // ── regalos al pie ──
    const cajas = [
      [-0.085, 0.052, '#c0392b', '#ffe08a'],
      [0.030, 0.040, '#2d7a4f', '#ffd0d0'],
      [0.098, 0.034, '#8e44ad', '#ffe08a']
    ];
    cajas.forEach(([off, tam, col, cinta]) => {
      const bw = W * tam, bh = bw * 0.82;
      const bx = tx + W * off - bw / 2, by = tBase + H * 0.012 - bh;
      x.fillStyle = col;
      x.fillRect(bx, by, bw, bh);
      x.fillStyle = 'rgba(0,0,0,0.22)';
      x.fillRect(bx, by, bw, bh * 0.16);          // tapa en sombra
      x.fillStyle = cinta;
      x.fillRect(bx + bw * 0.42, by, bw * 0.16, bh);
      x.fillRect(bx, by + bh * 0.40, bw, bh * 0.14);
    });
  }

  let estrella = { x: 0, y: 0, r: 10 };

  // ─────────────────────────────────────────────────────── la nieve
  let copos = [];
  function crearNieve() {
    const N = Math.round((flojo ? 70 : 150) * calidad);
    copos = [];
    for (let i = 0; i < N; i++) {
      const prof = Math.random();
      copos.push({
        x: Math.random() * W, y: Math.random() * H,
        prof,
        r: 0.7 + prof * 2.6,
        v: 0.20 + prof * 0.95,
        f: Math.random() * 6.28,
        osc: rnd(0.3, 1.0),
        a: 0.22 + prof * 0.66
      });
    }
  }

  // ───────────────────────────────────────────────────────── medir
  function medir() {
    const caja = cv.getBoundingClientRect();
    W = Math.max(1, Math.round(caja.width));
    H = Math.max(1, Math.round(caja.height));
    dpr = Math.min(window.devicePixelRatio || 1, calidad < 1 ? 1 : 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    hornear();
    pintarFondo();
    crearNieve();
  }

  // ───────────────────────────────────────────────────────── pintar
  function pintar(t, dt) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bufFondo, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.globalCompositeOperation = 'lighter';

    // ── la estrella respira y lanza rayos ──
    const pal = 0.72 + 0.28 * Math.sin(t * 1.6);
    estampa(spCalido, estrella.x, estrella.y, estrella.r * 7, 0.30 * pal);
    // Destello de cuatro puntas, corto. Antes eran seis rectas largas que
    // cruzaban el cielo de lado a lado y parecían un error de trazado.
    for (let i = 0; i < 2; i++) {
      const ang = i * Math.PI / 2 + t * 0.05 * amp;
      const largo = estrella.r * (2.1 + Math.sin(t * 1.3 + i) * 0.35) * (i ? 0.62 : 1);
      const g = ctx.createLinearGradient(
        estrella.x - Math.cos(ang) * largo, estrella.y - Math.sin(ang) * largo,
        estrella.x + Math.cos(ang) * largo, estrella.y + Math.sin(ang) * largo);
      g.addColorStop(0, 'rgba(255,233,138,0)');
      g.addColorStop(0.5, 'rgba(255,245,190,' + (0.42 * pal).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(255,233,138,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = estrella.r * 0.13;
      ctx.beginPath();
      ctx.moveTo(estrella.x - Math.cos(ang) * largo, estrella.y - Math.sin(ang) * largo);
      ctx.lineTo(estrella.x + Math.cos(ang) * largo, estrella.y + Math.sin(ang) * largo);
      ctx.stroke();
    }

    // ── la guirnalda: cada bombilla con su propio ritmo ──
    for (let i = 0; i < luces.length; i++) {
      const b = luces[i];
      // no todas parpadean a la vez: eso delataría el bucle enseguida
      const p = 0.42 + 0.58 * Math.pow(Math.sin(t * b.v + b.f) * 0.5 + 0.5, 1.7);
      estampa(spBombilla[b.c], b.x, b.y, b.r * 5.5, p * 0.42);
      estampa(spBombilla[b.c], b.x, b.y, b.r * 1.5, p * 0.95);
    }

    // ── resplandor cálido que sale del árbol y tiñe la nieve ──
    estampa(spCalido, W * 0.5, H * 0.80, Math.min(W, H) * 0.52,
      0.055 * (0.85 + 0.15 * Math.sin(t * 0.7)));

    ctx.globalCompositeOperation = 'source-over';

    // ── la nieve, delante de todo ──
    const rafaga = Math.sin(t * 0.21) * 0.75 + Math.sin(t * 0.57 + 1.3) * 0.32;
    for (let i = 0; i < copos.length; i++) {
      const c = copos[i];
      c.y += c.v * dt * amp;
      c.x += (rafaga * (0.4 + c.prof) + Math.sin(t * c.osc + c.f) * 0.42) * dt * amp;
      if (c.y > H + 10) { c.y = -10; c.x = Math.random() * W; }
      if (c.x < -16) c.x = W + 16; else if (c.x > W + 16) c.x = -16;

      if (c.prof < 0.42) {
        // los del fondo son bruma, no puntos
        estampa(spCopo, c.x, c.y, c.r * 4.2, c.a * 0.34);
      } else {
        ctx.fillStyle = 'rgba(244,251,255,' + c.a.toFixed(2) + ')';
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 6.283); ctx.fill();
      }
    }
  }

  // ────────────────────────────────────────────────── bucle y gobierno
  let raf = null, t0 = 0, ultimo = 0, visible = false;
  let acum = 0, n = 0, ignorar = 0;

  function gobernar(ms) {
    if (ignorar < 24) { ignorar++; return; }
    acum += ms; n++;
    if (n < 48) return;
    const media = acum / n;
    acum = 0; n = 0;
    // Si un fotograma cuesta más de 11 ms hay poco margen para llegar a 60;
    // se recorta densidad y resolución antes de que se note el tirón.
    let nueva = calidad;
    if (media > 11 && calidad > 0.55) nueva = Math.max(0.55, calidad - 0.22);
    else if (media < 5.5 && calidad < 1) nueva = Math.min(1, calidad + 0.15);
    if (nueva !== calidad) { calidad = nueva; ignorar = 0; medir(); }
  }

  function bucle(ahora) {
    raf = requestAnimationFrame(bucle);
    if (!t0) { t0 = ahora; ultimo = ahora; }
    const dt = Math.min(3, (ahora - ultimo) / 16.667);
    ultimo = ahora;
    const inicio = performance.now();
    pintar((ahora - t0) / 1000, dt);
    gobernar(performance.now() - inicio);
  }

  function arrancar() {
    if (raf === null) { t0 = 0; raf = requestAnimationFrame(bucle); }
  }
  function parar() {
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }

  // Sólo se anima si está a la vista y la pestaña está delante: una escena
  // que nadie mira no tiene por qué gastar batería.
  const io = new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (visible && !document.hidden) arrancar(); else parar();
  }, { threshold: 0.05 });
  io.observe(cv);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar();
    else if (visible) arrancar();
  });

  let temp = null;
  window.addEventListener('resize', () => {
    clearTimeout(temp);
    temp = setTimeout(medir, 160);
  });

  medir();
})();
