/* ============================================================
   GAME.JS — Minijuego "Cosechando el Ramo"
   Canvas 2D con arte vectorial (flores.js), partículas,
   sonido (sfx.js) y vibración en móvil.
   ============================================================ */

const Juego = (() => {
  const TIPOS_FLOR = ["girasol", "rosa", "margarita", "tulipan"];
  const COLOR_ESTALLIDO = {
    girasol: "#F6C244",
    rosa: "#E2688C",
    margarita: "#FFF1DE",
    tulipan: "#F7A6BE",
    agua: "#7FC4E8"
  };

  let canvas, ctx, dpr = 1, W = 0, H = 0;

  const jugador = { x: 0, w: 70, alto: 54, dir: 0, velocidad: 460 };
  let objetos = [];      // {x, y, vy, tipo, tam, balanceo, fase}
  let chispas = [];      // partículas de estallido {x, y, vx, vy, vida, color, r}
  let flores = [];       // {tipo, marchita, restante}
  let vidas = 0;
  let corriendo = false;
  let terminado = false;

  let tiempoSpawn = 0;
  let tiempoMarchitar = 0;
  let lastTs = 0;
  let rafId = null;

  // ---------- utilidades ----------
  const $ = (id) => document.getElementById(id);
  const azar = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const vibrar = (ms) => { if (navigator.vibrate) navigator.vibrate(ms); };

  function avisar(texto) {
    const el = $("aviso-flotante");
    el.textContent = texto;
    el.classList.remove("oculto");
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  }

  // ---------- tamaño del canvas ----------
  function ajustarCanvas() {
    const wrap = $("canvas-wrap");
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    jugador.x = Math.min(Math.max(jugador.x, jugador.w / 2), W - jugador.w / 2);
  }

  // ---------- HUD ----------
  function pintarHUD() {
    const total = CONFIG.juego.vidas;
    let corazones = "";
    for (let i = 0; i < total; i++) {
      corazones += `<span class="vida${i < vidas ? "" : " gastada"}">♥</span> `;
    }
    $("hud-vidas").innerHTML = corazones.trim();
    const vivas = flores.filter((f) => !f.marchita).length;
    $("hud-contador").textContent = `❀ ${vivas} / ${CONFIG.juego.metaFlores}`;
  }

  function pintarRamo() {
    const barra = $("ramo-barra");
    barra.innerHTML = "";
    flores.forEach((f) => {
      const ns = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("class", "mini-flor" + (f.marchita ? " seca" : ""));
      const use = document.createElementNS(ns, "use");
      use.setAttribute("href", f.marchita ? "#f-marchita" : "#f-" + f.tipo);
      svg.appendChild(use);
      barra.appendChild(svg);
    });
  }

  // ---------- partículas ----------
  function estallido(x, y, color, n = 9) {
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const vel = 50 + Math.random() * 130;
      chispas.push({
        x, y,
        vx: Math.cos(ang) * vel,
        vy: Math.sin(ang) * vel - 60,
        vida: 0.55 + Math.random() * 0.25,
        max: 0.8,
        r: 2 + Math.random() * 3,
        color
      });
    }
  }

  // ---------- ciclo de objetos ----------
  function progreso() {
    return Math.min(1, flores.length / CONFIG.juego.metaFlores);
  }

  function crearObjeto() {
    const p = progreso();
    const hayMarchita = flores.some((f) => f.marchita);
    const r = Math.random();
    const pAgua = hayMarchita ? 0.32 : 0.05;
    const pEspina = 0.17 + p * 0.18;

    let tipo;
    if (r < pAgua) tipo = "agua";
    else if (r < pAgua + pEspina) tipo = "espina";
    else tipo = azar(TIPOS_FLOR);

    const tam = tipo === "agua" ? 15 : tipo === "espina" ? 20 : 19;
    objetos.push({
      x: tam * 2 + Math.random() * (W - tam * 4),
      y: -tam * 2,
      vy: 135 + p * 175 + Math.random() * 85,
      tipo, tam,
      balanceo: 14 + Math.random() * 18,
      fase: Math.random() * Math.PI * 2
    });
  }

  function marchitarUna() {
    const vivas = flores.filter((f) => !f.marchita);
    if (vivas.length < 3) return;
    if (flores.some((f) => f.marchita)) return;
    const f = azar(vivas);
    f.marchita = true;
    f.restante = CONFIG.juego.tiempoMarchitarse;
    avisar("¡Una flor se está secando! Atrapa una gota 💧");
    pintarRamo();
    pintarHUD();
  }

  function regar() {
    const f = flores.find((x) => x.marchita);
    if (f) {
      f.marchita = false;
      f.restante = 0;
      avisar("¡Flor salvada! 💚");
      pintarRamo();
      pintarHUD();
      if (flores.filter((x) => !x.marchita).length >= CONFIG.juego.metaFlores) ganar();
    }
  }

  function golpeEspina() {
    vidas -= 1;
    pintarHUD();
    Sfx.espina();
    vibrar(90);
    const wrap = $("canvas-wrap");
    wrap.classList.remove("golpe");
    void wrap.offsetWidth;
    wrap.classList.add("golpe");
    if (vidas <= 0) {
      perder();
    } else {
      avisar(`¡Auch, una espina! ${vidas === 1 ? "Última vida..." : "Cuidado, mi amor"}`);
    }
  }

  // ---------- estados finales ----------
  function perder() {
    if (terminado) return;
    corriendo = false;
    terminado = true;
    $("texto-derrota").textContent = azar(CONFIG.mensajeDerrota);
    $("overlay-derrota").classList.remove("oculto");
  }

  function ganar() {
    if (terminado) return;
    corriendo = false;
    terminado = true;
    Sfx.fanfarria();
    $("overlay-victoria").classList.remove("oculto");
    setTimeout(() => {
      $("overlay-victoria").classList.add("oculto");
      App.irA("pantalla-trivia");
      Trivia.iniciar();
    }, 1700);
  }

  // ---------- actualización ----------
  function actualizar(dt) {
    if (jugador.dir !== 0) {
      jugador.x += jugador.dir * jugador.velocidad * dt;
      jugador.x = Math.min(Math.max(jugador.x, jugador.w / 2), W - jugador.w / 2);
    }

    tiempoSpawn -= dt * 1000;
    if (tiempoSpawn <= 0) {
      crearObjeto();
      tiempoSpawn = Math.max(310, 840 - progreso() * 430) * (0.8 + Math.random() * 0.4);
    }

    tiempoMarchitar -= dt * 1000;
    if (tiempoMarchitar <= 0) {
      marchitarUna();
      tiempoMarchitar = CONFIG.juego.intervaloMarchitar * (0.8 + Math.random() * 0.5);
    }

    let cambioRamo = false;
    for (let i = flores.length - 1; i >= 0; i--) {
      const f = flores[i];
      if (f.marchita) {
        f.restante -= dt * 1000;
        if (f.restante <= 0) {
          flores.splice(i, 1);
          cambioRamo = true;
          avisar("Se secó una flor... 🥀");
        }
      }
    }
    if (cambioRamo) { pintarRamo(); pintarHUD(); }

    // partículas
    for (let i = chispas.length - 1; i >= 0; i--) {
      const c = chispas[i];
      c.vida -= dt;
      if (c.vida <= 0) { chispas.splice(i, 1); continue; }
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += 300 * dt;
    }

    // objetos y colisiones
    const yCesta = H - jugador.alto;
    for (let i = objetos.length - 1; i >= 0; i--) {
      const o = objetos[i];
      o.y += o.vy * dt;
      o.fase += dt * 2.2;

      const ox = o.x + Math.sin(o.fase) * o.balanceo * 0.15;
      const atrapado =
        o.y + o.tam >= yCesta &&
        o.y < H &&
        Math.abs(ox - jugador.x) < (o.tam * 2 + jugador.w) / 2 - 6;

      if (atrapado) {
        objetos.splice(i, 1);
        if (o.tipo === "espina") {
          estallido(ox, yCesta, "#B84568", 7);
          golpeEspina();
          if (terminado) return;
        } else if (o.tipo === "agua") {
          estallido(ox, yCesta, COLOR_ESTALLIDO.agua, 8);
          Sfx.gota();
          regar();
        } else {
          estallido(ox, yCesta, COLOR_ESTALLIDO[o.tipo], 10);
          Sfx.atrapar();
          flores.push({ tipo: o.tipo, marchita: false, restante: 0 });
          pintarRamo();
          pintarHUD();
          if (flores.filter((f) => !f.marchita).length >= CONFIG.juego.metaFlores) {
            ganar();
            return;
          }
        }
      } else if (o.y - o.tam * 2 > H) {
        objetos.splice(i, 1);
      }
    }
  }

  // ---------- dibujo ----------
  function dibujar() {
    ctx.clearRect(0, 0, W, H);

    // pradera al pie del lienzo
    const pasto = ctx.createLinearGradient(0, H - 52, 0, H);
    pasto.addColorStop(0, "rgba(143, 188, 143, 0)");
    pasto.addColorStop(1, "rgba(110, 158, 96, 0.5)");
    ctx.fillStyle = pasto;
    ctx.fillRect(0, H - 52, W, 52);

    // objetos que caen (arte vectorial)
    for (const o of objetos) {
      const ox = o.x + Math.sin(o.fase) * o.balanceo * 0.15;
      FloresArt.draw(ctx, o.tipo, ox, o.y, o.tam, Math.sin(o.fase) * 0.25);
    }

    // partículas
    for (const c of chispas) {
      ctx.globalAlpha = Math.max(0, c.vida / c.max);
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // cesta
    FloresArt.drawCesta(ctx, jugador.x, H - jugador.alto / 2 - 4, jugador.w);
  }

  function ciclo(ts) {
    if (!corriendo) return;
    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    actualizar(dt);
    if (corriendo) dibujar();
    rafId = requestAnimationFrame(ciclo);
  }

  // ---------- controles ----------
  function instalarControles() {
    const mover = (clientX) => {
      const rect = canvas.getBoundingClientRect();
      jugador.x = Math.min(Math.max(clientX - rect.left, jugador.w / 2), W - jugador.w / 2);
    };
    let arrastrando = false;
    canvas.addEventListener("pointerdown", (e) => { arrastrando = true; mover(e.clientX); });
    window.addEventListener("pointermove", (e) => { if (arrastrando) mover(e.clientX); });
    window.addEventListener("pointerup", () => { arrastrando = false; });
    canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") jugador.dir = -1;
      if (e.key === "ArrowRight") jugador.dir = 1;
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft" && jugador.dir === -1) jugador.dir = 0;
      if (e.key === "ArrowRight" && jugador.dir === 1) jugador.dir = 0;
    });

    const btnDir = (id, d) => {
      const b = $(id);
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); jugador.dir = d; });
      b.addEventListener("pointerup", () => { if (jugador.dir === d) jugador.dir = 0; });
      b.addEventListener("pointerleave", () => { if (jugador.dir === d) jugador.dir = 0; });
      b.addEventListener("contextmenu", (e) => e.preventDefault());
    };
    btnDir("btn-izq", -1);
    btnDir("btn-der", 1);

    window.addEventListener("resize", () => { if (canvas) ajustarCanvas(); });
  }

  // ---------- API pública ----------
  function preparar() {
    canvas = $("lienzo");
    ctx = canvas.getContext("2d");
    instalarControles();

    $("texto-instrucciones").textContent = CONFIG.juego.instrucciones;
    $("btn-jugar").addEventListener("click", () => {
      $("overlay-instrucciones").classList.add("oculto");
      empezar();
    });
    $("btn-reintentar").addEventListener("click", () => {
      $("overlay-derrota").classList.add("oculto");
      empezar();
    });
  }

  function mostrar() {
    ajustarCanvas();
    reiniciarEstado();
    dibujar();
    $("overlay-instrucciones").classList.remove("oculto");
    $("overlay-derrota").classList.add("oculto");
    $("overlay-victoria").classList.add("oculto");
  }

  function reiniciarEstado() {
    objetos = [];
    chispas = [];
    flores = [];
    vidas = CONFIG.juego.vidas;
    terminado = false;
    corriendo = false;
    jugador.x = W / 2;
    jugador.dir = 0;
    tiempoSpawn = 400;
    tiempoMarchitar = CONFIG.juego.intervaloMarchitar;
    pintarHUD();
    pintarRamo();
  }

  function empezar() {
    ajustarCanvas();
    reiniciarEstado();
    corriendo = true;
    lastTs = 0;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(ciclo);
  }

  function detener() {
    corriendo = false;
    cancelAnimationFrame(rafId);
  }

  return { preparar, mostrar, empezar, detener };
})();
