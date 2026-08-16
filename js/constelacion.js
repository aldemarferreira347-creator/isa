/* ══════════════════════════════════════════════════════════════════════
   CONSTELACION.JS — Mes 6 · Constelación.

   El verbo de este mes es DIBUJAR. Ocho figuras sueltas en el cielo, cada
   una hecha de puntos que no significan nada hasta que alguien los une en
   el orden correcto. Al cerrar una, se enciende y suelta el recuerdo que
   guardaba dentro.

   ── LO ÚNICO QUE HAY QUE EDITAR ──────────────────────────────────────
   Cada figura tiene un campo `recuerdo`. Mientras esté vacío, la tarjeta
   lo dice tal cual al abrirse — igual que el `porque` de la radio del mes
   5. El `titulo` ya está puesto como disparador; puedes cambiarlo si
   quieres que diga otra cosa.
   ══════════════════════════════════════════════════════════════════════ */

// Lienzo de referencia: todo punto vive en este sistema de coordenadas y
// se convierte a porcentaje al pintar, así que cambiar VIEW_W/H a mitad
// de camino no rompe nada.
const VIEW_W = 900;
const VIEW_H = 600;

const CONSTELACIONES = [
    {
        titulo: 'El Primer Mensaje',
        recuerdo: '',
        puntos: [[40, 120], [85, 70], [125, 110], [160, 60], [180, 130]]
    },
    {
        titulo: 'La Primera Vez que Reímos',
        recuerdo: '',
        puntos: [[275, 140], [315, 80], [365, 100], [395, 50]]
    },
    {
        titulo: 'El Lugar al que Siempre Volvemos',
        recuerdo: '',
        puntos: [[495, 90], [530, 130], [570, 80], [610, 120], [640, 70]]
    },
    {
        titulo: 'Lo que Nadie Más Sabe',
        recuerdo: '',
        puntos: [[725, 150], [760, 100], [805, 140], [845, 90]]
    },
    {
        titulo: 'El Día que Todo Cambió',
        recuerdo: '',
        puntos: [[40, 380], [80, 430], [120, 390], [155, 440], [180, 380]]
    },
    {
        titulo: 'La Canción que Nos Encontró',
        recuerdo: '',
        puntos: [[280, 430], [320, 370], [365, 410], [400, 360]]
    },
    {
        titulo: 'El Miedo que Ya No Está',
        recuerdo: '',
        puntos: [[495, 400], [535, 440], [575, 390], [615, 430], [640, 370]]
    },
    {
        titulo: 'Lo que Viene',
        recuerdo: '',
        puntos: [[725, 420], [765, 370], [805, 420], [845, 380]]
    }
];

const LS_CONST = 'm6_constelaciones_hechas';

(function () {
    'use strict';

    const REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const svg = document.getElementById('cstSvg');
    const overlay = document.getElementById('cstOverlay');
    const contador = document.getElementById('cstContador');
    const registro = document.getElementById('cstRegistro');
    const registroLista = document.getElementById('cstRegistroLista');
    const cierre = document.getElementById('cstCierre');
    if (!svg || !overlay) return;

    const NS = 'http://www.w3.org/2000/svg';

    let hechas = new Set();
    try { hechas = new Set(JSON.parse(localStorage.getItem(LS_CONST) || '[]')); }
    catch (e) { /* modo privado */ }

    function guardar() {
        try { localStorage.setItem(LS_CONST, JSON.stringify([...hechas])); }
        catch (e) { /* modo privado */ }
    }

    /* ── Polvo de fondo: estrellas puramente decorativas, generadas con un
       generador con semilla fija para que el cielo no cambie de forma en
       cada visita. ── */
    function prng(semilla) {
        let s = semilla;
        return function () {
            s |= 0; s = (s + 0x6D2B79F5) | 0;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function pintarPolvo() {
        const azar = prng(19870);
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 130; i++) {
            const c = document.createElementNS(NS, 'circle');
            c.setAttribute('cx', (azar() * VIEW_W).toFixed(1));
            c.setAttribute('cy', (azar() * VIEW_H).toFixed(1));
            c.setAttribute('r', (0.6 + azar() * 1.1).toFixed(2));
            c.setAttribute('class', 'cst-polvo');
            if (!REDUCIDO && azar() > 0.55) {
                c.style.animationDelay = `${(azar() * 6).toFixed(2)}s`;
                c.classList.add('cst-polvo--titila');
            }
            frag.appendChild(c);
        }
        svg.appendChild(frag);
    }

    /* ── Cada figura: líneas (ocultas hasta que se dibujan) + estrellas
       visuales en el SVG, y botones reales encima para el clic/toque/
       teclado — así toda la mecánica es accesible sin depender de un
       gesto de arrastre que un lector de pantalla no puede reproducir. ── */
    const progreso = CONSTELACIONES.map(() => 0);

    function pintarFigura(ci) {
        const fig = CONSTELACIONES[ci];
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'cst-figura');
        g.dataset.c = ci;

        for (let j = 0; j < fig.puntos.length - 1; j++) {
            const [x1, y1] = fig.puntos[j];
            const [x2, y2] = fig.puntos[j + 1];
            const linea = document.createElementNS(NS, 'line');
            linea.setAttribute('x1', x1); linea.setAttribute('y1', y1);
            linea.setAttribute('x2', x2); linea.setAttribute('y2', y2);
            linea.setAttribute('class', 'cst-linea');
            linea.dataset.c = ci; linea.dataset.seg = j;
            g.appendChild(linea);
        }

        fig.puntos.forEach(([x, y], j) => {
            const estrella = document.createElementNS(NS, 'circle');
            estrella.setAttribute('cx', x); estrella.setAttribute('cy', y);
            estrella.setAttribute('r', 3.4);
            estrella.setAttribute('class', 'cst-estrella-visual');
            estrella.dataset.c = ci; estrella.dataset.idx = j;
            g.appendChild(estrella);

            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'cst-boton';
            boton.style.left = `${(x / VIEW_W) * 100}%`;
            boton.style.top = `${(y / VIEW_H) * 100}%`;
            boton.dataset.c = ci; boton.dataset.idx = j;
            boton.setAttribute('aria-label',
                `Estrella ${j + 1} de ${fig.puntos.length} de una figura todavía sin formar`);
            boton.addEventListener('click', () => tocarEstrella(ci, j));
            overlay.appendChild(boton);
        });

        svg.appendChild(g);
    }

    function marcarHecha(ci, sinAnimar) {
        const g = svg.querySelector(`.cst-figura[data-c="${ci}"]`);
        if (g) g.classList.add('cst-figura--hecha');
        overlay.querySelectorAll(`.cst-boton[data-c="${ci}"]`).forEach(b => {
            b.classList.add('cst-boton--hecha');
            b.setAttribute('aria-label', `${CONSTELACIONES[ci].titulo} — ya encendida`);
        });
        if (sinAnimar && g) g.classList.add('cst-figura--instantanea');
    }

    function tocarEstrella(ci, idx) {
        if (hechas.has(ci)) return; // ya está encendida, no hay nada más que hacer
        if (idx !== progreso[ci]) {
            // No es la siguiente de la secuencia: un pequeño gesto de «no
            // todavía», nunca un error — no hay forma de fallar aquí.
            const b = overlay.querySelector(`.cst-boton[data-c="${ci}"][data-idx="${idx}"]`);
            if (b && !REDUCIDO) {
                b.classList.remove('cst-boton--toca');
                void b.offsetWidth;
                b.classList.add('cst-boton--toca');
            }
            return;
        }

        const estrella = svg.querySelector(`.cst-estrella-visual[data-c="${ci}"][data-idx="${idx}"]`);
        const boton = overlay.querySelector(`.cst-boton[data-c="${ci}"][data-idx="${idx}"]`);
        if (estrella) estrella.classList.add('cst-estrella-visual--on');
        if (boton) boton.classList.add('cst-boton--on');

        if (idx > 0) {
            const linea = svg.querySelector(`.cst-linea[data-c="${ci}"][data-seg="${idx - 1}"]`);
            if (linea) linea.classList.add('cst-linea--on');
        }

        progreso[ci] = idx + 1;

        if (progreso[ci] === CONSTELACIONES[ci].puntos.length) {
            hechas.add(ci);
            guardar();
            marcarHecha(ci, false);
            revelar(ci);
            actualizarContador();
        }
    }

    function revelar(ci) {
        const fig = CONSTELACIONES[ci];
        const li = document.createElement('li');
        li.className = 'cst-recuerdo';
        li.innerHTML = `
            <p class="cst-recuerdo-titulo">${fig.titulo}</p>
            <p class="cst-recuerdo-texto${fig.recuerdo ? '' : ' cst-recuerdo-texto--vacio'}">
                ${fig.recuerdo || 'Todavía no se ha escrito qué guardaba esta.'}
            </p>`;
        registroLista.appendChild(li);
        registro.hidden = false;
        li.scrollIntoView({ behavior: REDUCIDO ? 'auto' : 'smooth', block: 'nearest', inline: 'end' });
    }

    function actualizarContador() {
        contador.textContent = `${hechas.size}/${CONSTELACIONES.length} constelaciones encendidas`;
        if (hechas.size === CONSTELACIONES.length && cierre) {
            cierre.hidden = false;
            // Dígito del mes 6 para La Bóveda. Ver js/boveda.js.
            const digito = document.getElementById('cstDigito');
            if (digito) digito.hidden = false;
        }
    }

    /* ── Montaje ── */
    pintarPolvo();
    CONSTELACIONES.forEach((_, ci) => pintarFigura(ci));

    // Restaurar lo ya encontrado en visitas anteriores, sin repetir la
    // animación de encendido ni el orden de descubrimiento.
    [...hechas].forEach(ci => {
        progreso[ci] = CONSTELACIONES[ci].puntos.length;
        svg.querySelectorAll(`.cst-linea[data-c="${ci}"]`).forEach(l => l.classList.add('cst-linea--on'));
        svg.querySelectorAll(`.cst-estrella-visual[data-c="${ci}"]`).forEach(e => e.classList.add('cst-estrella-visual--on'));
        overlay.querySelectorAll(`.cst-boton[data-c="${ci}"]`).forEach(b => b.classList.add('cst-boton--on'));
        marcarHecha(ci, true);
        revelar(ci);
    });
    actualizarContador();
})();
