/* ============================================================
   FINAL.JS — Flor Dorada, lluvia de pétalos vectoriales
   y cupón elegante descargable como imagen.
   ============================================================ */

const Final = (() => {
  const $ = (id) => document.getElementById(id);
  let canvas, ctx, particulas = [], rafId = null, activo = false;

  const COLORES = ["#F2A7BC", "#E7C879", "#F6D7E0", "#CDE3C7", "#F0C64C"];

  // ---------- lluvia de pétalos ----------
  function ajustar() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function crearParticula(desdeArriba) {
    const esChispa = Math.random() < 0.18;
    return {
      esChispa,
      x: Math.random() * canvas.width,
      y: desdeArriba ? -30 : Math.random() * canvas.height,
      vy: 28 + Math.random() * 50,
      tam: esChispa ? 1.5 + Math.random() * 2 : 5 + Math.random() * 8,
      fase: Math.random() * Math.PI * 2,
      giro: 0.5 + Math.random() * 1.4,
      color: COLORES[Math.floor(Math.random() * COLORES.length)]
    };
  }

  function ciclo() {
    if (!activo) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particulas) {
      p.y += p.vy / 60;
      p.fase += 0.025;
      p.x += Math.sin(p.fase) * 0.8;
      if (p.y > canvas.height + 30) Object.assign(p, crearParticula(true));

      if (p.esChispa) {
        const alfa = 0.4 + 0.5 * Math.sin(p.fase * 3);
        ctx.fillStyle = `rgba(255, 226, 138, ${Math.max(0, alfa)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.tam, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.fase * p.giro) * 1.1);
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.tam, p.tam * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.globalAlpha = 1;
      }
    }
    rafId = requestAnimationFrame(ciclo);
  }

  const prefiereQuieto = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- textos ----------
  function pintarTextos() {
    $("titulo-final").textContent = CONFIG.tituloFinal;
    $("subtitulo-final").textContent = CONFIG.subtituloFinal;
    $("cupon-titulo").textContent = CONFIG.cupon.titulo;
    $("cupon-detalle").textContent = CONFIG.cupon.detalle;
    $("cupon-nota").textContent = CONFIG.cupon.nota;
    $("cupon-firma").textContent = CONFIG.cupon.firma;
    $("carta-titulo").textContent = CONFIG.cartaTitulo;
    $("carta-texto").textContent = CONFIG.carta;
  }

  // ---------- foto opcional ----------
  function cargarFoto() {
    if (!CONFIG.fotoFinal) return;
    const img = $("foto-img");
    img.onload = () => $("foto-final").classList.remove("oculto");
    img.onerror = () => $("foto-final").classList.add("oculto");
    img.src = CONFIG.fotoFinal;
  }

  // ============================================================
  //  CUPÓN COMO IMAGEN PNG  (cupón + apartado "Respuestas")
  // ============================================================
  const AN = 560;                       // ancho del lienzo
  const FIN_CUPON = 312;                // dónde termina el bloque del cupón
  const PANEL_X0 = 40, PANEL_X1 = AN - 40;
  const TXT_X = PANEL_X0 + 42;
  const TXT_ANCHO = PANEL_X1 - 20 - TXT_X;

  const F_PREGUNTA = "700 12.5px Quicksand, sans-serif";
  const F_RESPUESTA = "italic 600 16px 'Cormorant Garamond', serif";
  const ALT_PREGUNTA = 17, ALT_RESPUESTA = 21;
  const HUECO_PR = 5, HUECO_BLOQUE = 18;

  // la margarita es casi blanca: se lee mal como viñeta pequeña
  const FLORES_VINETA = ["rosa", "girasol", "tulipan"];

  // Parte un texto en líneas que caben en maxW (respeta los saltos de línea)
  function envolver(g, texto, maxW) {
    const lineas = [];
    String(texto || "").split("\n").forEach((parrafo) => {
      const palabras = parrafo.trim().split(/\s+/).filter(Boolean);
      if (!palabras.length) return;
      let linea = "";
      for (const p of palabras) {
        const prueba = linea ? linea + " " + p : p;
        if (linea && g.measureText(prueba).width > maxW) {
          lineas.push(linea);
          linea = p;
        } else {
          linea = prueba;
        }
      }
      if (linea) lineas.push(linea);
    });
    return lineas.length ? lineas : ["—"];
  }

  // Mide todos los bloques de respuestas y calcula la altura que necesitan
  function medirRespuestas(g) {
    const items = (typeof Trivia !== "undefined" && Trivia.obtenerRespuestas)
      ? Trivia.obtenerRespuestas() : [];
    const bloques = items.map((it) => {
      g.font = F_PREGUNTA;
      const lp = envolver(g, it.pregunta, TXT_ANCHO);
      g.font = F_RESPUESTA;
      const lr = envolver(g, it.respuesta, TXT_ANCHO);
      return {
        lineasPregunta: lp,
        lineasRespuesta: lr,
        alto: lp.length * ALT_PREGUNTA + HUECO_PR + lr.length * ALT_RESPUESTA
      };
    });
    const alto = bloques.reduce((s, b) => s + b.alto, 0) +
                 Math.max(0, bloques.length - 1) * HUECO_BLOQUE;
    return { bloques, alto };
  }

  function rectRedondo(g, x, y, w, h, r) {
    g.beginPath();
    if (g.roundRect) g.roundRect(x, y, w, h, r);
    else g.rect(x, y, w, h);
  }

  // Flor con un halo dorado detrás: así las claras (margarita, tulipán)
  // también se leen sobre el fondo crema.
  function florConHalo(g, tipo, x, y, s) {
    const halo = g.createRadialGradient(x, y, 0, x, y, s * 1.9);
    halo.addColorStop(0, "rgba(240, 198, 76, 0.30)");
    halo.addColorStop(1, "rgba(240, 198, 76, 0)");
    g.fillStyle = halo;
    g.beginPath();
    g.arc(x, y, s * 1.9, 0, Math.PI * 2);
    g.fill();
    FloresArt.draw(g, tipo, x, y, s);
  }

  function dibujarCupon(g, AL, medida) {
    // ---- fondo crema con luz cálida ----
    g.fillStyle = "#FFFBF3";
    g.fillRect(0, 0, AN, AL);
    const grad = g.createLinearGradient(0, 0, AN, AL);
    grad.addColorStop(0, "rgba(240, 198, 76, 0.16)");
    grad.addColorStop(0.5, "rgba(255, 251, 243, 0)");
    grad.addColorStop(1, "rgba(216, 95, 135, 0.14)");
    g.fillStyle = grad;
    g.fillRect(0, 0, AN, AL);

    // ---- doble borde dorado ----
    g.strokeStyle = "#E0A93C";
    g.lineWidth = 3;
    g.strokeRect(16, 16, AN - 32, AL - 32);
    g.strokeStyle = "rgba(224, 169, 60, 0.75)";
    g.lineWidth = 1.2;
    g.setLineDash([7, 5]);
    g.strokeRect(24, 24, AN - 48, AL - 48);
    g.setLineDash([]);

    // ---- perforación de ticket (bordes laterales) ----
    g.fillStyle = "#EFE3D0";
    for (let y = 34; y < AL - 24; y += 20) {
      g.beginPath(); g.arc(16, y, 4.5, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(AN - 16, y, 4.5, 0, Math.PI * 2); g.fill();
    }

    // ---- flores en las esquinas ----
    florConHalo(g, "rosa", 54, 54, 14);
    florConHalo(g, "girasol", AN - 54, 54, 14);
    florConHalo(g, "tulipan", 54, AL - 54, 14);
    florConHalo(g, "margarita", AN - 54, AL - 54, 14);

    // ══════════ bloque 1 · el cupón ══════════
    g.textAlign = "center";
    g.fillStyle = "#7D5E74";
    g.font = "700 11px Quicksand, sans-serif";
    g.fillText("C U P Ó N   D E   R E G A L O", AN / 2, 64);

    g.fillStyle = "#B84568";
    g.font = "52px 'Great Vibes', cursive";
    g.fillText(CONFIG.cupon.titulo.toLowerCase(), AN / 2, 134);

    g.fillStyle = "#4A2B44";
    g.font = "italic 600 17px 'Cormorant Garamond', serif";
    g.fillText(CONFIG.cupon.detalle, AN / 2, 168);

    g.strokeStyle = "rgba(74, 43, 68, 0.3)";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(120, 198);
    g.lineTo(AN - 120, 198);
    g.stroke();
    FloresArt.draw(g, "rosa", AN / 2, 198, 9);

    g.fillStyle = "#7D5E74";
    g.font = "500 12px Quicksand, sans-serif";
    g.fillText(CONFIG.cupon.nota, AN / 2, 230);

    g.fillStyle = "#5E8C5A";
    g.font = "26px 'Great Vibes', cursive";
    g.fillText(CONFIG.cupon.firma, AN / 2, 274);

    if (!medida.bloques.length) return;

    // ══════════ línea de corte ══════════
    g.strokeStyle = "rgba(224, 169, 60, 0.85)";
    g.lineWidth = 1.4;
    g.setLineDash([6, 6]);
    g.beginPath();
    g.moveTo(32, FIN_CUPON);
    g.lineTo(AN - 32, FIN_CUPON);
    g.stroke();
    g.setLineDash([]);

    // ══════════ bloque 2 · las respuestas ══════════
    const panelY0 = FIN_CUPON + 22;
    const panelY1 = panelY0 + 84 + medida.alto + 22;

    rectRedondo(g, PANEL_X0, panelY0, PANEL_X1 - PANEL_X0, panelY1 - panelY0, 16);
    g.fillStyle = "rgba(255, 255, 255, 0.62)";
    g.fill();
    g.strokeStyle = "rgba(224, 169, 60, 0.45)";
    g.lineWidth = 1.2;
    g.setLineDash([5, 4]);
    g.stroke();
    g.setLineDash([]);

    g.textAlign = "center";
    g.fillStyle = "#7D5E74";
    g.font = "700 11px Quicksand, sans-serif";
    g.fillText("R E S P U E S T A S", AN / 2, panelY0 + 32);

    g.fillStyle = "#B84568";
    g.font = "27px 'Great Vibes', cursive";
    g.fillText("nuestra historia, en tus palabras", AN / 2, panelY0 + 62);

    g.strokeStyle = "rgba(74, 43, 68, 0.22)";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(PANEL_X0 + 60, panelY0 + 74);
    g.lineTo(PANEL_X1 - 60, panelY0 + 74);
    g.stroke();

    g.textAlign = "left";
    let y = panelY0 + 84;
    medida.bloques.forEach((b, i) => {
      const yInicio = y;

      g.fillStyle = "#7D5E74";
      g.font = F_PREGUNTA;
      b.lineasPregunta.forEach((linea) => {
        y += ALT_PREGUNTA;
        g.fillText(linea, TXT_X, y);
      });

      y += HUECO_PR;
      g.fillStyle = "#4A2B44";
      g.font = F_RESPUESTA;
      b.lineasRespuesta.forEach((linea) => {
        y += ALT_RESPUESTA;
        g.fillText(linea, TXT_X, y);
      });

      // viñeta floral + hilo vertical del bloque
      florConHalo(g, FLORES_VINETA[i % FLORES_VINETA.length], PANEL_X0 + 22, yInicio + 12, 8);
      g.strokeStyle = "rgba(224, 169, 60, 0.4)";
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(PANEL_X0 + 22, yInicio + 22);
      g.lineTo(PANEL_X0 + 22, y - 4);
      g.stroke();

      y += HUECO_BLOQUE;
    });

    // cierre bonito bajo el panel
    g.textAlign = "center";
    g.fillStyle = "#5E8C5A";
    g.font = "22px 'Great Vibes', cursive";
    g.fillText("guardado con amor ✦", AN / 2, panelY1 + 34);
  }

  function descargarCupon() {
    // 1ª pasada: medir con un lienzo auxiliar
    const medidor = document.createElement("canvas").getContext("2d");
    const medida = medirRespuestas(medidor);

    const AL = medida.bloques.length
      ? FIN_CUPON + 22 + 84 + medida.alto + 22 + 34 + 40
      : 340;

    // 2ª pasada: dibujar de verdad
    const escala = AL > 1800 ? 1.5 : 2;
    const c = document.createElement("canvas");
    c.width = Math.round(AN * escala);
    c.height = Math.round(AL * escala);
    const g = c.getContext("2d");
    g.scale(escala, escala);

    dibujarCupon(g, AL, medida);

    const enlace = document.createElement("a");
    enlace.download = `cupon-y-respuestas-${(CONFIG.nombre || "amor").toLowerCase()}-1agosto.png`;
    enlace.href = c.toDataURL("image/png");
    enlace.click();
  }

  // ---------- API ----------
  function preparar() {
    canvas = $("petalos");
    ctx = canvas.getContext("2d");
    $("btn-guardar-cupon").addEventListener("click", () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(descargarCupon);
      } else {
        descargarCupon();
      }
    });
    $("btn-rejugar").addEventListener("click", () => location.reload());
    window.addEventListener("resize", () => { if (activo) ajustar(); });
  }

  function mostrar() {
    pintarTextos();
    cargarFoto();
    ajustar();
    Sfx.fanfarria();
    if (!prefiereQuieto()) {
      particulas = Array.from({ length: 40 }, () => crearParticula(false));
      activo = true;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(ciclo);
    }
  }

  return { preparar, mostrar };
})();
