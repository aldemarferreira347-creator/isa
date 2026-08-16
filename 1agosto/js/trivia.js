/* ============================================================
   TRIVIA.JS — "Nuestra Historia"
   Tarjetas de opción múltiple con reintento y pétalos de progreso.
   ============================================================ */

const Trivia = (() => {
  let indice = 0;
  let bloqueada = false;
  let respuestas = [];   // {pregunta, respuesta, tipo} — se imprimen en el cupón

  const $ = (id) => document.getElementById(id);
  const azar = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const TIPOS_PROGRESO = ["rosa", "girasol", "tulipan", "margarita"];

  function pintarProgreso() {
    const cont = $("trivia-progreso");
    const NS = "http://www.w3.org/2000/svg";
    cont.innerHTML = "";
    CONFIG.trivia.forEach((_, i) => {
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "petalo" + (i < indice ? " activo" : ""));
      const use = document.createElementNS(NS, "use");
      use.setAttribute("href", "#f-" + TIPOS_PROGRESO[i % TIPOS_PROGRESO.length]);
      svg.appendChild(use);
      cont.appendChild(svg);
    });
  }

  function pintarPregunta() {
    const q = CONFIG.trivia[indice];
    bloqueada = false;
    $("trivia-pregunta").textContent = q.pregunta;
    $("trivia-feedback").textContent = "";
    $("trivia-feedback").className = "";

    const cont = $("trivia-opciones");
    cont.innerHTML = "";
    if (q.tipo === "libre") {
      const textarea = document.createElement("textarea");
      textarea.className = "input-libre";
      textarea.placeholder = "Escribe tu respuesta aquí...";
      textarea.rows = 3;

      const b = document.createElement("button");
      b.className = "opcion responder-libre";
      b.textContent = "Responder 💌";

      b.addEventListener("click", () => {
        if (!textarea.value.trim()) {
          $("trivia-feedback").textContent = "Por favor, escribe algo bonito. 💕";
          $("trivia-feedback").className = "mal";
          return;
        }
        if (bloqueada) return;
        bloqueada = true;
        guardarRespuesta(q, textarea.value.trim(), "libre");
        b.classList.add("correcta");
        Sfx.bien();
        const fb = $("trivia-feedback");
        fb.textContent = azar(CONFIG.mensajeAcierto);
        fb.className = "bien";
        indice += 1;
        pintarProgreso();
        setTimeout(() => {
          if (indice >= CONFIG.trivia.length) {
            App.irA("pantalla-final");
            Final.mostrar();
          } else {
            pintarPregunta();
          }
        }, 1100);
      });

      cont.appendChild(textarea);
      cont.appendChild(b);
    } else {
      q.opciones.forEach((texto, i) => {
        const b = document.createElement("button");
        b.className = "opcion";
        b.textContent = texto;
        b.addEventListener("click", () => responder(b, i));
        cont.appendChild(b);
      });
    }
    pintarProgreso();
  }

  function responder(boton, i) {
    if (bloqueada) return;
    const q = CONFIG.trivia[indice];
    const fb = $("trivia-feedback");

    if (i === q.correcta) {
      bloqueada = true;
      guardarRespuesta(q, q.opciones[q.correcta], "opcion");
      boton.classList.add("correcta");
      Sfx.bien();
      fb.textContent = azar(CONFIG.mensajeAcierto);
      fb.className = "bien";
      indice += 1;
      pintarProgreso();
      setTimeout(() => {
        if (indice >= CONFIG.trivia.length) {
          App.irA("pantalla-final");
          Final.mostrar();
        } else {
          pintarPregunta();
        }
      }, 1100);
    } else {
      // puede reintentar la misma pregunta
      boton.classList.add("incorrecta");
      boton.disabled = true;
      Sfx.mal();
      fb.textContent = azar(CONFIG.mensajesError);
      fb.className = "mal";
      setTimeout(() => boton.classList.remove("incorrecta"), 600);
    }
  }

  // Guarda la respuesta final de cada pregunta (limpia la de intentos previos)
  function guardarRespuesta(q, texto, tipo) {
    const limpio = (texto || "").replace(/\s+\n/g, "\n").trim();
    const previa = respuestas.findIndex((r) => r.pregunta === q.pregunta);
    const registro = { pregunta: q.pregunta.replace(/\s*✏️.*$/, "").trim(), respuesta: limpio, tipo };
    if (previa >= 0) respuestas[previa] = registro;
    else respuestas.push(registro);
  }

  function obtenerRespuestas() {
    return respuestas.slice();
  }

  function iniciar() {
    indice = 0;
    respuestas = [];
    pintarPregunta();
  }

  return { iniciar, obtenerRespuestas };
})();
