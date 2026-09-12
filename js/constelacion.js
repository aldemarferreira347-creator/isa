/* ══════════════════════════════════════════════════════════════════════
   CONSTELACION.JS — Mes 6 · Constelación.
   Las constelaciones en el cielo forman la frase:
   "TE AMO MI NIÑA ❣️"
   ══════════════════════════════════════════════════════════════════════ */

const VIEW_W = 900;
const VIEW_H = 600;

const CONSTELACIONES = [
    {
        titulo: 'TE — El Comienzo',
        recuerdo: 'Donde empezó a escribirse toda nuestra historia. Una palabra tan pequeña que hoy guarda todo lo que soy contigo.',
        puntos: [
            [45, 90], [85, 90], [125, 90],
            [85, 150], [85, 215],
            [160, 215], [210, 215],
            [160, 150], [200, 150],
            [160, 90], [210, 90]
        ],
        lineas: [
            [0, 1], [1, 2], [1, 3], [3, 4],
            [5, 6], [5, 7], [7, 8], [7, 9], [9, 10]
        ]
    },
    {
        titulo: 'A — Tus Risas',
        recuerdo: 'Esa risa tuya que ilumina hasta el día más oscuro y que se convirtió en mi sonido favorito del mundo.',
        puntos: [
            [285, 215], [315, 150], [345, 85], [375, 150], [405, 215]
        ],
        lineas: [
            [0, 1], [1, 2], [2, 3], [3, 4], [1, 3]
        ]
    },
    {
        titulo: 'M — Mi Refugio',
        recuerdo: 'Ese lugar seguro que encuentro cada vez que te miro, donde el mundo entero se apaga y solo quedamos los dos.',
        puntos: [
            [475, 215], [475, 150], [475, 85],
            [545, 155],
            [615, 85], [615, 150], [615, 215]
        ],
        lineas: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
        ]
    },
    {
        titulo: 'O — Nuestros Secretos',
        recuerdo: 'Cada mirada cómplice, cada broma nuestra y cada detalle que solo tú y yo comprendemos.',
        puntos: [
            [755, 85], [805, 105], [825, 150], [805, 195],
            [755, 215], [705, 195], [685, 150], [705, 105]
        ],
        lineas: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]
        ]
    },
    {
        titulo: 'MI — La Certeza',
        recuerdo: 'El momento exacto en que mi corazón supo que eras tú, sin dudas y para siempre.',
        puntos: [
            [45, 475], [45, 410], [45, 345],
            [85, 410],
            [125, 345], [125, 410], [125, 475],
            [175, 475], [175, 410], [175, 345]
        ],
        lineas: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
            [7, 8], [8, 9]
        ]
    },
    {
        titulo: 'NI — Nuestra Canción',
        recuerdo: 'Cada melodía que suena y de repente tiene tu nombre, tu esencia y tu recuerdo.',
        puntos: [
            [255, 475], [255, 410], [255, 345],
            [290, 410],
            [325, 475], [325, 410], [325, 345],
            [375, 475], [375, 410], [375, 345]
        ],
        lineas: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
            [7, 8], [8, 9]
        ]
    },
    {
        titulo: 'ÑA — Tu Paz',
        recuerdo: 'La tranquilidad tan bonita que me da tenerte en mi vida, sabiendo que caminamos juntos.',
        puntos: [
            [450, 475], [450, 365], [485, 420],
            [520, 475], [520, 365],
            [515, 335], [485, 325], [455, 335],
            [570, 475], [595, 420], [620, 365],
            [645, 420], [670, 475]
        ],
        lineas: [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [7, 6], [6, 5],
            [8, 9], [9, 10], [10, 11], [11, 12], [9, 11]
        ]
    },
    {
        titulo: '❣️ — Lo Que Viene (Para Siempre)',
        recuerdo: 'Todo el amor del universo entero, cada sueño que construiremos y una vida entera a tu lado. Te amo, mi niña.',
        puntos: [
            [795, 435],
            [750, 395], [745, 355], [770, 340],
            [795, 365],
            [820, 340], [845, 355], [840, 395],
            [795, 475]
        ],
        lineas: [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [4, 5], [5, 6], [6, 7], [7, 0]
        ]
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
        for (let i = 0; i < 140; i++) {
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

    const progreso = CONSTELACIONES.map(() => 0);

    function pintarFigura(ci) {
        const fig = CONSTELACIONES[ci];
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'cst-figura');
        g.dataset.c = ci;

        const lineasDef = fig.lineas || fig.puntos.slice(0, -1).map((_, j) => [j, j + 1]);
        lineasDef.forEach(([p1, p2], j) => {
            const [x1, y1] = fig.puntos[p1];
            const [x2, y2] = fig.puntos[p2];
            const linea = document.createElementNS(NS, 'line');
            linea.setAttribute('x1', x1); linea.setAttribute('y1', y1);
            linea.setAttribute('x2', x2); linea.setAttribute('y2', y2);
            linea.setAttribute('class', 'cst-linea');
            linea.dataset.c = ci;
            linea.dataset.p1 = p1;
            linea.dataset.p2 = p2;
            linea.dataset.seg = j;
            g.appendChild(linea);
        });

        fig.puntos.forEach(([x, y], j) => {
            const estrella = document.createElementNS(NS, 'circle');
            estrella.setAttribute('cx', x);
            estrella.setAttribute('cy', y);
            const rBase = 3.2 + (j / Math.max(1, fig.puntos.length - 1)) * 1.5;
            estrella.setAttribute('r', rBase.toFixed(1));
            estrella.setAttribute('class', 'cst-estrella-visual');
            estrella.dataset.c = ci;
            estrella.dataset.idx = j;
            estrella.style.opacity = (0.5 + (j / Math.max(1, fig.puntos.length - 1)) * 0.4).toFixed(2);
            g.appendChild(estrella);

            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'cst-boton';
            boton.style.left = `${(x / VIEW_W) * 100}%`;
            boton.style.top = `${(y / VIEW_H) * 100}%`;
            boton.dataset.c = ci;
            boton.dataset.idx = j;
            boton.setAttribute('aria-label',
                `Estrella ${j + 1} de ${fig.puntos.length} de la figura ${fig.titulo}`);
            boton.addEventListener('click', () => tocarEstrella(ci, j));
            overlay.appendChild(boton);
        });

        svg.appendChild(g);
    }

    function actualizarSiguienteEstrella() {
        svg.querySelectorAll('.cst-estrella-visual--proxima').forEach(e => {
            e.classList.remove('cst-estrella-visual--proxima');
        });

        for (let ci = 0; ci < CONSTELACIONES.length; ci++) {
            if (!hechas.has(ci)) {
                const proxIdx = progreso[ci];
                if (proxIdx < CONSTELACIONES[ci].puntos.length) {
                    const e = svg.querySelector(`.cst-estrella-visual[data-c="${ci}"][data-idx="${proxIdx}"]`);
                    if (e) e.classList.add('cst-estrella-visual--proxima');
                }
            }
        }
    }

    function marcarHecha(ci, sinAnimar) {
        const g = svg.querySelector(`.cst-figura[data-c="${ci}"]`);
        if (g) g.classList.add('cst-figura--hecha');
        overlay.querySelectorAll(`.cst-boton[data-c="${ci}"]`).forEach(b => {
            b.classList.add('cst-boton--hecha');
            b.setAttribute('aria-label', `${CONSTELACIONES[ci].titulo} — ya encendida`);
        });
        svg.querySelectorAll(`.cst-linea[data-c="${ci}"]`).forEach(l => {
            l.classList.add('cst-linea--on');
        });
        if (sinAnimar && g) g.classList.add('cst-figura--instantanea');
    }

    function tocarEstrella(ci, idx) {
        if (hechas.has(ci)) return;
        if (idx !== progreso[ci]) {
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
        if (estrella) {
            estrella.classList.add('cst-estrella-visual--on');
            estrella.classList.remove('cst-estrella-visual--proxima');
            estrella.style.opacity = '1';
        }
        if (boton) boton.classList.add('cst-boton--on');

        svg.querySelectorAll(`.cst-linea[data-c="${ci}"]`).forEach(linea => {
            const p1 = parseInt(linea.dataset.p1, 10);
            const p2 = parseInt(linea.dataset.p2, 10);
            if ((p1 === idx && p2 <= idx) || (p2 === idx && p1 <= idx)) {
                linea.classList.add('cst-linea--on');
            }
        });

        progreso[ci] = idx + 1;
        actualizarSiguienteEstrella();

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
            const digito = document.getElementById('cstDigito');
            if (digito) digito.hidden = false;
            if (typeof enviarNotificacion === 'function') {
                enviarNotificacion('✨ ¡Isa completó la Constelación! (Mes 6)', {
                    'Frase revelada': 'TE AMO MI NIÑA ❣️',
                    'Detalle': 'Ha iluminado el cielo formando la frase completa.'
                });
            }
        }
    }

    /* ── Montaje ── */
    pintarPolvo();
    CONSTELACIONES.forEach((_, ci) => pintarFigura(ci));

    [...hechas].forEach(ci => {
        if (ci < CONSTELACIONES.length) {
            progreso[ci] = CONSTELACIONES[ci].puntos.length;
            svg.querySelectorAll(`.cst-linea[data-c="${ci}"]`).forEach(l => l.classList.add('cst-linea--on'));
            svg.querySelectorAll(`.cst-estrella-visual[data-c="${ci}"]`).forEach(e => {
                e.classList.add('cst-estrella-visual--on');
                e.style.opacity = '1';
            });
            overlay.querySelectorAll(`.cst-boton[data-c="${ci}"]`).forEach(b => b.classList.add('cst-boton--on'));
            marcarHecha(ci, true);
            revelar(ci);
        }
    });

    actualizarSiguienteEstrella();
    actualizarContador();
})();
