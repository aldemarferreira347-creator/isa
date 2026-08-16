/* ============================================================
   JARDIN.JS — "Tu Jardín" con flores vectoriales SVG
   Fase 1: arrastrar la REGADERA sobre las flores marchitas.
   Fase 2: arrastrar el GUANTE hasta una hierba, agarrarla y
           llevarla al CUBO (una por una) para botarla.
   Fase 3: jardín en esplendor → pasar a la cosecha.
   ============================================================ */

const Jardin = (() => {
  const $ = (id) => document.getElementById(id);
  const NS = "http://www.w3.org/2000/svg";
  const PLANTAS = ["tulipan", "girasol", "rosa", "margarita", "rosa", "tulipan",
                   "girasol", "margarita", "tulipan", "rosa", "girasol", "margarita"];

  // punto activo de cada herramienta (fracción del propio elemento)
  const PICO_REGADERA = { x: 0.14, y: 0.30 };   // boquilla del caño
  const PALMA_GUANTE  = { x: 0.50, y: 0.26 };   // punta de los dedos

  const MS_RIEGO = 420;   // cuánto hay que mantener la regadera encima

  let fase = "regar";       // regar | hierbas | esplendor
  let regadas = 0;
  let hierbasRestantes = 0;
  let botadas = 0;
  let preparado = false;

  // estado del arrastre
  let objetivoRiego = null, timerRiego = null, timerGotitas = null;
  let hierbaEnGuante = null, hierbaApuntada = null;

  function svgUso(href, clase) {
    const svg = document.createElementNS(NS, "svg");
    if (clase) svg.setAttribute("class", clase);
    const use = document.createElementNS(NS, "use");
    use.setAttribute("href", href);
    svg.appendChild(use);
    return svg;
  }

  const limitar = (v, min, max) => Math.max(min, Math.min(max, v));

  // ---------- geometría ----------
  // punto activo de una herramienta, en coordenadas de pantalla
  function puntoActivo(el, frac) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width * frac.x, y: r.top + r.height * frac.y };
  }

  function dentro(p, rect, margen = 0) {
    return p.x >= rect.left - margen && p.x <= rect.right + margen &&
           p.y >= rect.top - margen && p.y <= rect.bottom + margen;
  }

  // busca el elemento cuyo rect contiene el punto (el más cercano al centro)
  function bajoElPunto(selector, p, margen) {
    let mejor = null, mejorDist = Infinity;
    document.querySelectorAll(selector).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!dentro(p, r, margen)) return;
      const dx = p.x - (r.left + r.width / 2);
      const dy = p.y - (r.top + r.height / 2);
      const d = dx * dx + dy * dy;
      if (d < mejorDist) { mejorDist = d; mejor = el; }
    });
    return mejor;
  }

  // ---------- arrastre genérico ----------
  function hacerArrastrable(el, { alMover, alSoltar }) {
    let activo = false, offX = 0, offY = 0;

    const colocar = (clientX, clientY) => {
      const zr = $("jardin-zona").getBoundingClientRect();
      const x = limitar(clientX - offX - zr.left, 6, zr.width - 6);
      const y = limitar(clientY - offY - zr.top, 6, zr.height - 6);
      el.style.left = x + "px";
      el.style.top = y + "px";
    };

    el.addEventListener("pointerdown", (e) => {
      if (el.classList.contains("oculto")) return;
      e.preventDefault();
      activo = true;
      el.classList.remove("pulso");
      el.classList.add("arrastrando");
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
      const r = el.getBoundingClientRect();
      offX = e.clientX - (r.left + r.width / 2);
      offY = e.clientY - (r.top + r.height / 2);
    });

    el.addEventListener("pointermove", (e) => {
      if (!activo) return;
      e.preventDefault();
      colocar(e.clientX, e.clientY);
      alMover && alMover();
    });

    const fin = () => {
      if (!activo) return;
      activo = false;
      el.classList.remove("arrastrando");
      alSoltar && alSoltar();
    };
    el.addEventListener("pointerup", fin);
    el.addEventListener("pointercancel", fin);
    el.addEventListener("lostpointercapture", fin);
  }

  // ---------- progreso ----------
  function pintarProgreso() {
    const p = $("jardin-progreso");
    if (fase === "regar") {
      p.textContent = `${regadas} / ${PLANTAS.length} flores regadas`;
    } else if (fase === "hierbas") {
      p.textContent = hierbaEnGuante
        ? "¡La tienes! Llévala al cubo 🪣"
        : `Quedan ${hierbasRestantes} hierbas por botar`;
    } else {
      p.textContent = "✦ ✦ ✦";
    }
  }

  function cabecera(titulo, instruccion) {
    $("jardin-titulo").textContent = titulo;
    $("jardin-instruccion").textContent = instruccion;
  }

  // ══════════════════ FASE 1 · REGAR CON LA REGADERA ══════════════════
  function gotita() {
    const zona = $("jardin-zona");
    const zr = zona.getBoundingClientRect();
    const p = puntoActivo($("regadera"), PICO_REGADERA);
    const g = document.createElement("span");
    g.className = "gotita";
    g.style.left = (p.x - zr.left) + "px";
    g.style.top = (p.y - zr.top) + "px";
    zona.appendChild(g);
    setTimeout(() => g.remove(), 620);
  }

  function pararRiego() {
    clearTimeout(timerRiego);
    clearInterval(timerGotitas);
    timerRiego = timerGotitas = null;
    $("regadera").classList.remove("vertiendo");
    if (objetivoRiego) objetivoRiego.classList.remove("mojandose");
    objetivoRiego = null;
  }

  function florecer(b) {
    b.classList.remove("marchita", "mojandose");
    b.classList.add("florecida");
    b.querySelector("use").setAttribute("href", "#f-" + b.dataset.tipo);
    b.setAttribute("aria-label", "Flor " + b.dataset.tipo + ": ya está regada");
    Sfx.florecer();
    regadas += 1;
    pintarProgreso();
    if (regadas >= PLANTAS.length) {
      pararRiego();
      $("regadera").classList.add("oculto");
      setTimeout(faseHierbas, 850);
    }
  }

  function regarMoviendo() {
    if (fase !== "regar") return;
    const p = puntoActivo($("regadera"), PICO_REGADERA);
    const objetivo = bajoElPunto("#jardin-plantas .planta.marchita", p, 10);

    if (objetivo === objetivoRiego) return;
    pararRiego();
    if (!objetivo) return;

    objetivoRiego = objetivo;
    objetivo.classList.add("mojandose");
    $("regadera").classList.add("vertiendo");
    Sfx.gota();
    gotita();
    timerGotitas = setInterval(gotita, 120);
    timerRiego = setTimeout(() => {
      const flor = objetivoRiego;
      pararRiego();
      if (flor && flor.classList.contains("marchita")) florecer(flor);
    }, MS_RIEGO);
  }

  // ══════════════════ FASE 2 · GUANTE, HIERBAS Y CUBO ══════════════════
  function faseHierbas() {
    fase = "hierbas";
    cabecera(CONFIG.jardin.tituloHierbas, CONFIG.jardin.instruccionHierbas);
    hierbasRestantes = CONFIG.jardin.numHierbas;
    botadas = 0;
    hierbaEnGuante = null;
    pintarProgreso();

    $("cubo-cuenta").textContent = "0";
    $("cubo").classList.remove("oculto");

    const guante = $("guante");
    guante.classList.remove("oculto", "agarrando", "sobre-cubo");
    guante.style.left = "18%";
    guante.style.top = "82%";
    guante.classList.add("pulso");

    const usadas = [];
    for (let i = 0; i < hierbasRestantes; i++) {
      setTimeout(() => brotarHierba(usadas), i * 190);
    }
  }

  function brotarHierba(usadas) {
    const zona = $("jardin-zona");
    const h = document.createElement("div");
    h.className = "hierba";
    h.setAttribute("aria-hidden", "true");
    h.appendChild(svgUso("#f-hierba"));

    // posición sin pisarse con las otras ni con el cubo (esquina inferior derecha)
    let x = 0, y = 0;
    for (let intento = 0; intento < 26; intento++) {
      x = 6 + Math.random() * 74;
      y = 8 + Math.random() * 62;
      const lejos = usadas.every((u) => Math.hypot(u.x - x, u.y - y) > 17);
      if (lejos) break;
    }
    usadas.push({ x, y });
    h.style.left = x + "%";
    h.style.top = y + "%";

    const svg = h.firstChild;
    svg.style.transform = `scale(${Math.random() < 0.5 ? -1 : 1}, 1) rotate(${(Math.random() * 14 - 7).toFixed(1)}deg)`;
    zona.appendChild(h);
  }

  function apuntar(hierba) {
    if (hierbaApuntada === hierba) return;
    if (hierbaApuntada) hierbaApuntada.classList.remove("apuntada");
    hierbaApuntada = hierba;
    if (hierba) hierba.classList.add("apuntada");
  }

  function agarrarHierba(hierba) {
    const guante = $("guante");
    hierba.classList.remove("apuntada");
    hierba.classList.add("agarrada");
    hierba.style.left = "";
    hierba.style.top = "";
    hierba.firstChild.style.transform = "";
    guante.appendChild(hierba);
    guante.classList.add("agarrando");
    hierbaEnGuante = hierba;
    hierbaApuntada = null;
    Sfx.arrancarHierba();
    pintarProgreso();
  }

  function botarHierba() {
    const guante = $("guante");
    const cubo = $("cubo");
    const hierba = hierbaEnGuante;
    hierbaEnGuante = null;
    guante.classList.remove("agarrando", "sobre-cubo");
    cubo.classList.remove("listo");

    hierba.classList.add("botada");   // conserva "agarrada" para no perder su posición
    Sfx.gota();
    setTimeout(() => hierba.remove(), 460);

    cubo.classList.remove("recibiendo");
    void cubo.offsetWidth;             // reinicia la animación
    cubo.classList.add("recibiendo");

    botadas += 1;
    hierbasRestantes -= 1;
    $("cubo-cuenta").textContent = botadas;
    pintarProgreso();

    if (fase === "hierbas" && hierbasRestantes <= 0) {
      guante.classList.add("oculto");
      setTimeout(esplendor, 650);
    }
  }

  function guanteMoviendo() {
    if (fase !== "hierbas") return;
    const guante = $("guante");
    const p = puntoActivo(guante, PALMA_GUANTE);

    if (hierbaEnGuante) {
      // ya lleva una hierba → solo importa llegar al cubo
      const cubo = $("cubo");
      const sobre = dentro(p, cubo.getBoundingClientRect(), 8);
      cubo.classList.toggle("listo", sobre);
      guante.classList.toggle("sobre-cubo", sobre);
      if (sobre) botarHierba();
      return;
    }

    apuntar(bajoElPunto("#jardin-zona .hierba:not(.agarrada):not(.botada)", p, 12));
  }

  function guanteSoltado() {
    const guante = $("guante");
    if (hierbaEnGuante) return;             // se queda agarrada hasta el cubo
    if (hierbaApuntada) {
      agarrarHierba(hierbaApuntada);
    } else {
      guante.classList.remove("agarrando");
    }
  }

  // ══════════════════ FASE 3 · ESPLENDOR ══════════════════
  function esplendor() {
    fase = "esplendor";
    cabecera(CONFIG.jardin.tituloEsplendor, CONFIG.jardin.instruccionEsplendor);
    pintarProgreso();
    Sfx.fanfarria();
    $("cubo").classList.add("oculto");
    document.querySelectorAll("#jardin-plantas .planta").forEach((p, i) => {
      p.classList.add("baile");
      p.style.animationDelay = (i % 4) * 0.18 + "s";
    });
    const zona = $("jardin-zona");
    for (let i = 0; i < 12; i++) {
      const s = document.createElement("span");
      s.className = "chispa";
      s.textContent = "✦";
      s.style.left = Math.random() * 92 + "%";
      s.style.top = Math.random() * 88 + "%";
      s.style.animationDelay = Math.random() * 1.5 + "s";
      zona.appendChild(s);
    }
    $("btn-cosechar").classList.remove("oculto");
  }

  // ---------- accesibilidad: teclado (Enter / Espacio) ----------
  function atajoTeclado(el, accion) {
    el.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      accion();
    });
  }

  function regarConTeclado() {
    if (fase !== "regar") return;
    const flor = document.querySelector("#jardin-plantas .planta.marchita");
    if (flor) florecer(flor);
  }

  function guanteConTeclado() {
    if (fase !== "hierbas") return;
    if (hierbaEnGuante) { botarHierba(); return; }
    const h = document.querySelector("#jardin-zona .hierba:not(.agarrada):not(.botada)");
    if (h) agarrarHierba(h);
  }

  // ---------- API ----------
  function preparar() {
    $("btn-cosechar").textContent = CONFIG.jardin.botonCosechar;
    $("btn-cosechar").addEventListener("click", () => {
      App.irA("pantalla-juego");
      Juego.mostrar();
    });

    if (!preparado) {
      preparado = true;
      hacerArrastrable($("regadera"), { alMover: regarMoviendo, alSoltar: pararRiego });
      hacerArrastrable($("guante"), { alMover: guanteMoviendo, alSoltar: guanteSoltado });
      atajoTeclado($("regadera"), regarConTeclado);
      atajoTeclado($("guante"), guanteConTeclado);
    }
  }

  function iniciar() {
    fase = "regar";
    regadas = 0;
    hierbasRestantes = 0;
    botadas = 0;
    pararRiego();
    hierbaEnGuante = null;
    hierbaApuntada = null;

    cabecera(CONFIG.jardin.tituloRegar, CONFIG.jardin.instruccionRegar);
    $("btn-cosechar").classList.add("oculto");
    $("cubo").classList.add("oculto");
    $("cubo").classList.remove("listo", "recibiendo");
    $("guante").classList.add("oculto");
    $("guante").classList.remove("agarrando", "sobre-cubo", "pulso");
    document.querySelectorAll("#guante .hierba").forEach((e) => e.remove());

    const regadera = $("regadera");
    regadera.classList.remove("oculto", "vertiendo");
    regadera.style.left = "17%";
    regadera.style.top = "83%";
    regadera.classList.add("pulso");

    document.querySelectorAll("#jardin-zona .hierba, #jardin-zona .chispa, #jardin-zona .gotita")
      .forEach((e) => e.remove());

    const cont = $("jardin-plantas");
    cont.innerHTML = "";
    PLANTAS.forEach((tipo) => {
      const b = document.createElement("div");
      b.className = "planta marchita";
      b.dataset.tipo = tipo;
      b.setAttribute("aria-label", "Flor marchita: riégala con la regadera");
      b.appendChild(svgUso("#f-marchita", "planta-svg"));
      cont.appendChild(b);
    });
    pintarProgreso();
  }

  return { preparar, iniciar };
})();
