/* ══════════════════════════════════════════════════════════════════════
   HORAS.JS — Mes 10 · 24 Horas.

   El verbo de este mes es GIRAR. Todos los meses anteriores hablan de
   días grandes; este habla de un martes cualquiera. Una rueda con las
   24 horas del día, y en cada una un micro-momento — no la pregunta, no
   el aniversario, lo de siempre, que es lo que de verdad sostiene esto.

   ── LO ÚNICO QUE HAY QUE EDITAR ──────────────────────────────────────
   Cada hora tiene un campo `texto`. Vacío, la tarjeta lo dice tal cual.
   No hacen falta las 24 — hasta con seis o siete ya cuenta un día.
   ══════════════════════════════════════════════════════════════════════ */

const HORAS = Array.from({ length: 24 }, (_, h) => ({ hora: h, texto: '' }));

(function () {
    'use strict';

    const REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rueda = document.getElementById('hrRueda');
    const anillo = document.getElementById('hrAnillo');
    const tarjeta = document.getElementById('hrTarjeta');
    const tarjetaHora = document.getElementById('hrTarjetaHora');
    const tarjetaTexto = document.getElementById('hrTarjetaTexto');
    const ayuda = document.getElementById('hrAyuda');
    if (!rueda || !anillo) return;

    const RADIO = 42; // % del contenedor
    let rotacion = 0;

    function crearBotones() {
        HORAS.forEach(h => {
            const angulo = (h.hora / 24) * 360;
            const rad = (angulo - 90) * Math.PI / 180;
            const x = 50 + RADIO * Math.cos(rad);
            const y = 50 + RADIO * Math.sin(rad);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'hr-hora';
            btn.style.left = `${x}%`;
            btn.style.top = `${y}%`;
            btn.textContent = String(h.hora).padStart(2, '0');
            btn.dataset.hora = h.hora;
            btn.setAttribute('aria-label', `Hora ${String(h.hora).padStart(2, '0')}:00`);
            btn.addEventListener('click', () => seleccionar(h.hora));
            anillo.appendChild(btn);
        });
    }

    function girarA(hora) {
        // Lleva esa hora a las 12 en punto (arriba) con una animación breve.
        const objetivo = -((hora / 24) * 360);
        // Toma el camino más corto desde la rotación actual.
        let delta = ((objetivo - rotacion) % 360 + 540) % 360 - 180;
        rotacion += delta;
        anillo.style.transition = REDUCIDO ? 'none' : 'transform .6s var(--ent, ease-out)';
        anillo.style.transform = `rotate(${rotacion}deg)`;
    }

    const visitadas = new Set();
    const digito = document.getElementById('hrDigito');

    function seleccionar(hora) {
        girarA(hora);
        const h = HORAS.find(x => x.hora === hora);
        rueda.querySelectorAll('.hr-hora').forEach(b => b.classList.toggle('hr-hora--activa', Number(b.dataset.hora) === hora));
        tarjeta.hidden = false;
        tarjetaHora.textContent = `${String(hora).padStart(2, '0')}:00`;
        tarjetaTexto.textContent = h.texto || 'Todavía no se ha escrito qué pasa a esta hora.';
        tarjetaTexto.classList.toggle('hr-texto--vacio', !h.texto);
        ayuda.hidden = true;

        // Dígito del mes 10 para La Bóveda: se gana al dar la vuelta
        // completa al reloj, hora por hora. Ver js/boveda.js.
        visitadas.add(hora);
        if (visitadas.size === HORAS.length && digito) digito.hidden = false;
    }

    /* ── Girar la rueda arrastrando (además del clic directo en una hora) ── */
    let arrastrando = false, anguloInicio = 0, rotacionInicio = 0;

    function anguloDesdeCentro(ev) {
        const r = rueda.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        return Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI;
    }

    rueda.addEventListener('pointerdown', ev => {
        if (ev.target.closest('.hr-hora')) return;
        arrastrando = true;
        anguloInicio = anguloDesdeCentro(ev);
        rotacionInicio = rotacion;
        anillo.style.transition = 'none';
        rueda.setPointerCapture(ev.pointerId);
    });

    rueda.addEventListener('pointermove', ev => {
        if (!arrastrando) return;
        const actual = anguloDesdeCentro(ev);
        rotacion = rotacionInicio + (actual - anguloInicio);
        anillo.style.transform = `rotate(${rotacion}deg)`;
    });

    function soltar() { arrastrando = false; }
    rueda.addEventListener('pointerup', soltar);
    rueda.addEventListener('pointercancel', soltar);

    crearBotones();
})();
