/* ══════════════════════════════════════════════════════════════════════
   MAPA.JS — Mes 8 · El Mapa.

   El verbo de este mes es RECORRER. Un mapa ilustrado que se arrastra y
   se acerca. Dos clases de chinchetas: las VIVIDAS se abren y cuentan qué
   pasó ahí; las FUTURAS están apagadas, sólo dicen a dónde, y no se
   abren — son promesas, no recuerdos.

   ── LO ÚNICO QUE HAY QUE EDITAR ──────────────────────────────────────
   Cada chincheta vivida tiene `nombre` + `historia`. Cada futura tiene
   `destino`. Mientras estén vacíos se nota — no se inventa nada aquí.
   ══════════════════════════════════════════════════════════════════════ */

const LIENZO_W = 1400;
const LIENZO_H = 980;

const CHINCHETAS = [
    { tipo: 'vivida', x: 260, y: 620, nombre: '', historia: '' },
    { tipo: 'vivida', x: 520, y: 340, nombre: '', historia: '' },
    { tipo: 'vivida', x: 840, y: 560, nombre: '', historia: '' },
    { tipo: 'vivida', x: 1080, y: 260, nombre: '', historia: '' },
    { tipo: 'futura', x: 400, y: 830, destino: '' },
    { tipo: 'futura', x: 700, y: 190, destino: '' },
    { tipo: 'futura', x: 1180, y: 650, destino: '' },
    { tipo: 'futura', x: 960, y: 800, destino: '' }
];

(function () {
    'use strict';

    const REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const visor = document.getElementById('mpVisor');
    const lienzo = document.getElementById('mpLienzo');
    const pines = document.getElementById('mpPines');
    const popup = document.getElementById('mpPopup');
    const popupTitulo = document.getElementById('mpPopupTitulo');
    const popupTexto = document.getElementById('mpPopupTexto');
    const popupCerrar = document.getElementById('mpPopupCerrar');
    const btnMas = document.getElementById('mpZoomMas');
    const btnMenos = document.getElementById('mpZoomMenos');
    const btnCentrar = document.getElementById('mpCentrar');
    const contador = document.getElementById('mpContador');
    if (!visor || !lienzo) return;

    /* ── Estado del visor: traslación + escala ── */
    let tx = 0, ty = 0, escala = 1;
    const ESCALA_MIN = 0.65, ESCALA_MAX = 2.2;

    function aplicar(transicion) {
        lienzo.style.transition = transicion && !REDUCIDO ? 'transform .4s var(--calma, ease)' : 'none';
        lienzo.style.transform = `translate(${tx}px, ${ty}px) scale(${escala})`;
    }

    function centrar(transicion) {
        const r = visor.getBoundingClientRect();
        escala = Math.min(r.width / LIENZO_W, r.height / LIENZO_H) * 1.35;
        escala = Math.max(ESCALA_MIN, Math.min(ESCALA_MAX, escala));
        tx = (r.width - LIENZO_W * escala) / 2;
        ty = (r.height - LIENZO_H * escala) / 2;
        aplicar(transicion);
    }

    function zoom(factor) {
        const r = visor.getBoundingClientRect();
        const cx = r.width / 2, cy = r.height / 2;
        const nueva = Math.max(ESCALA_MIN, Math.min(ESCALA_MAX, escala * factor));
        // Mantiene el centro del visor fijo mientras cambia la escala.
        tx = cx - ((cx - tx) / escala) * nueva;
        ty = cy - ((cy - ty) / escala) * nueva;
        escala = nueva;
        aplicar(true);
    }

    btnMas.addEventListener('click', () => zoom(1.25));
    btnMenos.addEventListener('click', () => zoom(1 / 1.25));
    btnCentrar.addEventListener('click', () => centrar(true));

    /* ── Arrastre del mapa con Pointer Events ── */
    let arrastrando = false, ultimoX = 0, ultimoY = 0, movioLoSuficiente = false;

    visor.addEventListener('pointerdown', ev => {
        if (ev.target.closest('.mp-pin')) return;
        arrastrando = true;
        movioLoSuficiente = false;
        ultimoX = ev.clientX;
        ultimoY = ev.clientY;
        visor.setPointerCapture(ev.pointerId);
        lienzo.style.transition = 'none';
    });

    visor.addEventListener('pointermove', ev => {
        if (!arrastrando) return;
        const dx = ev.clientX - ultimoX;
        const dy = ev.clientY - ultimoY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) movioLoSuficiente = true;
        tx += dx; ty += dy;
        ultimoX = ev.clientX; ultimoY = ev.clientY;
        aplicar(false);
    });

    function soltarArrastre() { arrastrando = false; }
    visor.addEventListener('pointerup', soltarArrastre);
    visor.addEventListener('pointercancel', soltarArrastre);

    // Rueda del ratón: zoom sin necesitar los botones.
    visor.addEventListener('wheel', ev => {
        ev.preventDefault();
        zoom(ev.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });

    /* ── Chinchetas ── */
    const visitadas = new Set();

    function marcarVisitada(i) {
        visitadas.add(i);
        if (visitadas.size === CHINCHETAS.length) {
            // Dígito del mes 8 para La Bóveda: se gana al tocar las ocho,
            // vividas y futuras por igual. Ver js/boveda.js.
            const digito = document.getElementById('mpDigito');
            if (digito) digito.hidden = false;
        }
    }

    function crearPin(ch, i) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `mp-pin mp-pin--${ch.tipo}`;
        btn.style.left = `${ch.x}px`;
        btn.style.top = `${ch.y}px`;

        if (ch.tipo === 'vivida') {
            const nombre = ch.nombre || 'Un lugar sin nombre todavía';
            btn.setAttribute('aria-label', `Lugar vivido: ${nombre}. Toca para ver la historia.`);
            btn.addEventListener('click', ev => {
                if (movioLoSuficiente) return;
                abrirPopup(nombre, ch.historia || 'Todavía no se ha escrito qué pasó aquí.');
                marcarVisitada(i);
            });
        } else {
            const destino = ch.destino || 'Un destino todavía por decidir';
            btn.setAttribute('aria-label', `Promesa de viaje: ${destino}. Todavía no se puede abrir.`);
            btn.disabled = false; // sigue siendo enfocable, pero no abre nada
            btn.addEventListener('click', ev => {
                if (movioLoSuficiente) return;
                abrirPopup(destino, 'Todavía no ha pasado. Es una promesa, no un recuerdo — se queda cerrada hasta que lo sea.', true);
                marcarVisitada(i);
            });
        }
        pines.appendChild(btn);
    }

    function abrirPopup(titulo, texto, esFutura) {
        popupTitulo.textContent = titulo;
        popupTexto.textContent = texto;
        popup.classList.toggle('mp-popup--futura', !!esFutura);
        popup.hidden = false;
        popupCerrar.focus();
    }

    popupCerrar.addEventListener('click', () => { popup.hidden = true; });
    popup.addEventListener('click', ev => { if (ev.target === popup) popup.hidden = true; });
    document.addEventListener('keydown', ev => {
        if (ev.key === 'Escape' && !popup.hidden) popup.hidden = true;
    });

    CHINCHETAS.forEach(crearPin);
    const vividas = CHINCHETAS.filter(c => c.tipo === 'vivida').length;
    contador.textContent = `${vividas} lugares vividos · ${CHINCHETAS.length - vividas} promesas todavía cerradas`;

    centrar(false);
    window.addEventListener('resize', () => centrar(false));
})();
