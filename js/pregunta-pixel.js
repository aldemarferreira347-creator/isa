// ═══════════════════════════════════════════════════════════════════════
// PREGUNTA-PIXEL.JS — la escena de pixel art de «La Pregunta»
//
// Un escritorio de noche: una vela que titila, la carta sellada esperando
// sobre la mesa, una ventana con estrellas y corazones que suben del papel.
//
// Se dibuja a 128×80 píxeles REALES en un lienzo interno y se amplía con el
// filtrado desactivado. Ése es el truco del pixel art de verdad: nunca se
// dibuja "grande y con bordes duros", se dibuja pequeño y se agranda entero.
// Así cada píxel es un cuadrado perfecto y del mismo tamaño, que es lo que
// el ojo reconoce como pixel art.
//
// La paleta es la del tema `pregunta`: luz de vela sobre negro. Nada de
// colores nuevos — tiene que parecer de la misma casa que el resto.
// ═══════════════════════════════════════════════════════════════════════
(function () {
  const cv = document.getElementById('pixelPregunta');
  if (!cv || !cv.getContext) return;

  const AN = 128, AL = 80;            // resolución interna, en píxeles
  const buf = document.createElement('canvas');
  buf.width = AN; buf.height = AL;
  const b = buf.getContext('2d');
  const ctx = cv.getContext('2d');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const amp = reduce ? 0.35 : 1;

  // ── Paleta ────────────────────────────────────────────────────────────
  // Cada letra es un color. Los mapas de abajo se leen carácter a carácter.
  const P = {
    '.': null,                  // transparente
    'k': '#08050200',           // (sin uso, marcador)
    'a': '#1a1206',             // pared honda
    'b': '#241a0a',             // pared
    'c': '#0d0904',             // sombra
    'd': '#3a2410',             // madera oscura
    'e': '#5a3818',             // madera
    'f': '#7a4e22',             // madera clara
    'g': '#8a6a2a',             // latón
    'h': '#f5c518',             // oro (acento del tema)
    'i': '#ff9b4a',             // ámbar (acento 2)
    'j': '#ffe9a6',             // oro pálido
    'l': '#fff6da',             // luz
    'm': '#b09876',             // tinta apagada
    'n': '#6b5a3e',             // papel en sombra
    'o': '#d8c49a',             // papel
    'p': '#efe0bd',             // papel iluminado
    'q': '#c0392b',             // lacre
    'r': '#8e2b20',             // lacre en sombra
    's': '#2a3550',             // cielo de la ventana
    't': '#151d33'              // cielo hondo
  };

  const pinta = (x, y, c) => { b.fillStyle = c; b.fillRect(x, y, 1, 1); };

  function sprite(mapa, ox, oy, alfa) {
    if (alfa !== undefined) b.globalAlpha = alfa;
    for (let y = 0; y < mapa.length; y++) {
      const fila = mapa[y];
      for (let x = 0; x < fila.length; x++) {
        const c = P[fila[x]];
        if (c) pinta(ox + x, oy + y, c);
      }
    }
    b.globalAlpha = 1;
  }

  // ── Sprites ───────────────────────────────────────────────────────────

  // Vela: cera con derrames, sobre un platillo de latón
  const VELA = [
    '..pppp..',
    '.poooop.',
    '.pooooo.',
    'ppooooop',
    'pooooooo',
    'poooooon',
    'pooooonn',
    'poooonnn',
    'ppooonnn',
    '.pooonn.',
    '.pooonn.',
    '.ppoonn.',
    'gggggggg',
    '.gggggg.'
  ];

  // Llama: cuatro cuadros. No se interpola: se CAMBIA de dibujo, como en
  // los juegos de 8 bits. Interpolar destruiría el escalón del píxel.
  const LLAMA = [
    ['..h..', '.hjh.', '.jlj.', '.hjh.', '..h..'],
    ['..h..', '.hjh.', 'hjlj.', '.hjh.', '..i..'],
    ['..h..', '.hjh.', '.jljh', '.hjh.', '..h..'],
    ['..i..', '.ihi.', '.jlj.', '.hjh.', '..h..']
  ];

  // La carta cerrada, con su lacre
  const CARTA = [
    '..oooooooooooooooooooooo..',
    '.opppppppppppppppppppppp o',
    'opppppppppppppppppppppppo',
    'oppnnppppppppppppppnnpppo',
    'opppnnppppppppppppnnppppo',
    'oppppnnppppppppppnnpppppo',
    'opppppnnppppppppnnppppppo',
    'oppppppnnppppppnnpppppppo',
    'opppppppnnppppnnppppppppo',
    'oppppppppnnppnnpppppppppo',
    'ooooooooooooooooooooooooo',
    '.nnnnnnnnnnnnnnnnnnnnnnn.'
  ];

  // La carta abierta: el papel sale y se ven renglones
  const CARTA_ABIERTA = [
    '..ppppppppppppppppppppp..',
    '.ppppppppppppppppppppppp.',
    'pp.mmmmmmmmmm.mmmmmmm..pp',
    'pppppppppppppppppppppppppp',
    'pp.mmmmmmm.mmmmmmmmmmm.pp',
    'pppppppppppppppppppppppp',
    'pp.mmmmmmmmmmmm.mmmm...pp',
    'pppppppppppppppppppppppp',
    'pp.mmmmm.mmmmmmmm......pp',
    'ppppppppppppppppppppppppp',
    'ooooooooooooooooooooooooo',
    '.nnnnnnnnnnnnnnnnnnnnnnn.'
  ];

  const LACRE = [
    '.qqq.',
    'qqrqq',
    'qrhrq',
    'qqrqq',
    '.qqq.'
  ];

  const CORAZON = [
    '.hh.hh.',
    'hjjhjjh',
    'hjjjjjh',
    '.hjjjh.',
    '..hjh..',
    '...h...'
  ];

  const LUNA = [
    '..jjj..',
    '.jjljj.',
    'jjljjjj',
    'jjjjjjj',
    'jjjjljj',
    '.jjjjj.',
    '..jjj..'
  ];

  // ── Estado ────────────────────────────────────────────────────────────
  let abierta = false;
  const estrellas = [];
  for (let i = 0; i < 16; i++) {
    estrellas.push({
      x: 82 + ((i * 7) % 34),
      y: 9 + ((i * 5) % 26),
      f: Math.random() * 6.28,
      v: 0.6 + Math.random() * 1.6
    });
  }
  let corazones = [];
  let sigCorazon = 0;

  // ── Escena ────────────────────────────────────────────────────────────
  function fondo(luz) {
    // Pared: bandas horizontales, más claras cerca de la vela
    for (let y = 0; y < 58; y++) {
      b.fillStyle = y < 20 ? P.a : P.b;
      b.fillRect(0, y, AN, 1);
    }
    // Halo de la vela sobre la pared. En pixel art el degradado se hace por
    // ESCALONES, no continuo: aquí, anillos concretos alrededor del pábilo.
    const cx = 26, cy = 36;
    const anillos = [
      [30 + luz * 5, 'rgba(245,197,24,0.06)'],
      [21 + luz * 4, 'rgba(245,197,24,0.07)'],
      [13 + luz * 3, 'rgba(255,155,74,0.09)'],
      [7 + luz * 2, 'rgba(255,233,166,0.11)']
    ];
    anillos.forEach(([r, col]) => {
      b.fillStyle = col;
      for (let y = -r; y <= r; y++) {
        const an = Math.round(Math.sqrt(Math.max(0, r * r - y * y)));
        if (an > 0) b.fillRect(cx - an, cy + y, an * 2, 1);
      }
    });
  }

  function ventana(t) {
    const x0 = 78, y0 = 6, an = 42, al = 36;
    // cielo
    for (let y = 0; y < al; y++) {
      b.fillStyle = y < al * 0.5 ? P.t : P.s;
      b.fillRect(x0, y0 + y, an, 1);
    }
    // estrellas que titilan: encendida o apagada, sin medias tintas
    estrellas.forEach(e => {
      if (Math.sin(t * e.v + e.f) > 0.25) {
        pinta(e.x, e.y, Math.sin(t * e.v * 1.7 + e.f) > 0.6 ? P.l : P.j);
      }
    });
    sprite(LUNA, 104, 11);
    // marco y cruceta
    b.fillStyle = P.e;
    b.fillRect(x0 - 2, y0 - 2, an + 4, 2);
    b.fillRect(x0 - 2, y0 + al, an + 4, 2);
    b.fillRect(x0 - 2, y0 - 2, 2, al + 4);
    b.fillRect(x0 + an, y0 - 2, 2, al + 4);
    b.fillStyle = P.d;
    b.fillRect(x0 + an / 2 - 1, y0, 2, al);
    b.fillRect(x0, y0 + al / 2 - 1, an, 2);
  }

  function escritorio() {
    for (let y = 58; y < AL; y++) {
      b.fillStyle = y < 60 ? P.f : (y < 64 ? P.e : P.d);
      b.fillRect(0, y, AN, 1);
    }
    // vetas de la madera
    b.fillStyle = P.c;
    [[6, 66], [40, 70], [78, 65], [100, 73], [20, 76]].forEach(([x, y]) => {
      b.fillRect(x, y, 18, 1);
    });
  }

  function vela(t, luz) {
    sprite(VELA, 22, 44);
    // pábilo
    b.fillStyle = P.c; b.fillRect(25, 42, 2, 3);
    // llama: cuadro elegido por el tiempo, no interpolado
    const cuadro = LLAMA[Math.floor(t * 9 * amp) % LLAMA.length];
    sprite(cuadro, 24, 35);
    // el corazón de la llama
    pinta(26, 38, P.l);
    // resplandor sobre el escritorio
    b.fillStyle = 'rgba(255,155,74,' + (0.10 + luz * 0.05).toFixed(3) + ')';
    b.fillRect(10, 58, 34 + Math.round(luz * 4), 4);
  }

  function carta(t) {
    const y = 47;
    if (abierta) {
      sprite(CARTA_ABIERTA, 50, y - 2);
    } else {
      sprite(CARTA, 50, y);
      sprite(LACRE, 60, y + 3);
      // el lacre respira
      if (Math.sin(t * 2.2) > 0.55) pinta(62, y + 5, P.l);
    }
  }

  function volarCorazones(t, dt) {
    sigCorazon -= dt;
    if (sigCorazon <= 0) {
      sigCorazon = abierta ? 22 : 55;
      corazones.push({
        x: 56 + Math.random() * 16,
        y: 46,
        v: 0.10 + Math.random() * 0.10,
        d: (Math.random() - 0.5) * 0.06,
        vida: 0,
        total: 60 + Math.random() * 30
      });
    }
    corazones = corazones.filter(c => {
      c.vida += dt;
      if (c.vida > c.total) return false;
      c.y -= c.v * dt * amp;
      c.x += Math.sin(c.vida * 0.07) * 0.12 * amp + c.d;
      // Se desvanece por SALTOS de opacidad, no con un fundido suave: en
      // pixel art un alfa continuo emborrona el escalón y canta muchísimo.
      const k = c.vida / c.total;
      const paso = k > 0.85 ? 0.2 : k > 0.6 ? 0.5 : k > 0.3 ? 0.8 : 1;
      sprite(CORAZON, Math.round(c.x), Math.round(c.y), paso);
      return true;
    });
  }

  // ── Bucle ─────────────────────────────────────────────────────────────
  let raf = null, t0 = 0, ultimo = 0, visible = false;

  function cuadro(ahora) {
    raf = requestAnimationFrame(cuadro);
    if (!t0) { t0 = ahora; ultimo = ahora; }
    const dt = Math.min(3, (ahora - ultimo) / 16.667);
    ultimo = ahora;
    const t = (ahora - t0) / 1000;

    // Titileo de la vela: tres senos primos para que no se note el bucle
    const luz = 0.5
      + 0.26 * Math.sin(t * 3.1)
      + 0.14 * Math.sin(t * 7.7 + 1.1)
      + 0.10 * Math.sin(t * 13.3 + 2.4);

    b.clearRect(0, 0, AN, AL);
    fondo(luz * amp);
    ventana(t);
    escritorio();
    vela(t, luz * amp);
    carta(t);
    volarCorazones(t, dt);

    // Viñeta: cuatro escalones, otra vez sin degradado continuo
    b.fillStyle = 'rgba(8,5,2,0.30)';
    b.fillRect(0, 0, 4, AL); b.fillRect(AN - 4, 0, 4, AL);
    b.fillRect(0, 0, AN, 3); b.fillRect(0, AL - 3, AN, 3);
    b.fillStyle = 'rgba(8,5,2,0.16)';
    b.fillRect(4, 3, 3, AL - 6); b.fillRect(AN - 7, 3, 3, AL - 6);

    // Al lienzo visible, ampliado y SIN suavizado
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(buf, 0, 0, AN, AL, 0, 0, cv.width, cv.height);
  }

  function arrancar() { if (raf === null) { t0 = 0; raf = requestAnimationFrame(cuadro); } }
  function parar() { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }

  function medir() {
    // El lienzo visible se fija a un MÚLTIPLO ENTERO de la resolución
    // interna. Con un factor decimal unos píxeles saldrían de 3 y otros de 4
    // y la retícula quedaría irregular — el defecto que delata al pixel art
    // mal escalado.
    // Se mide el hueco REAL del marco (su caja de contenido), no su borde
    // exterior: si no, la escala incluiría el paspartú y el lienzo se saldría.
    const marco = cv.parentElement;
    const cs = getComputedStyle(marco);
    const hueco = marco.getBoundingClientRect().width
      - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);
    const escala = Math.max(1, Math.floor(hueco / AN));
    cv.width = AN * escala;
    cv.height = AL * escala;
    cv.style.width = (AN * escala) + 'px';
    cv.style.height = (AL * escala) + 'px';
  }

  const io = new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (visible && !document.hidden) arrancar(); else parar();
  }, { threshold: 0.05 });
  io.observe(cv);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar(); else if (visible) arrancar();
  });

  let temp = null;
  window.addEventListener('resize', () => {
    clearTimeout(temp);
    temp = setTimeout(medir, 160);
  });

  medir();
  // Arranca ya, sin esperar al observador. Si el elemento resulta no estar
  // a la vista, el propio observador lo para en su primera llamada. Al revés
  // —esperar a que avise para pintar— el lienzo se queda en negro si el
  // aviso tarda o no llega nunca, que es lo que pasa dentro de un iframe
  // fuera de pantalla y en algún navegador con la pestaña en segundo plano.
  arrancar();

  // La escena obedece al sobre real: cuando ella lo abre, la carta de la
  // mesa también se abre y salen más corazones.
  window.PixelPregunta = {
    abrir() {
      abierta = true;
      for (let i = 0; i < 10; i++) {
        corazones.push({
          x: 52 + Math.random() * 24, y: 42 + Math.random() * 6,
          v: 0.12 + Math.random() * 0.16,
          d: (Math.random() - 0.5) * 0.14,
          vida: 0, total: 55 + Math.random() * 40
        });
      }
    }
  };
})();
