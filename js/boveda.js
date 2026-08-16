/* ══════════════════════════════════════════════════════════════════════
   BOVEDA.JS — Mes 12 · La Bóveda.

   El verbo de este mes es ABRIR, y es el único cierre que convierte los
   doce regalos en uno solo: sin los once dígitos de los meses 1 al 11,
   esto no abre. Dentro está la cápsula del mes 9, sellada desde enero, y
   lo último que hay que decir sobre el año.

   ── LOS ONCE DÍGITOS ─────────────────────────────────────────────────
   Los meses 1, 2 y 4 ya escondían el suyo (ver «Dígito del mes N» en la
   carta final de cada uno: un-mes.html, mes-2.html, el-camino). Los
   meses 5 al 11 esconden el suyo al completarse del todo.

   El mes 3 sigue en `null` a propósito: todavía no tiene página real
   (ver `href` vacío en js/meses.js), así que no hay dónde esconder nada
   todavía. Hasta que la tenga, la bóveda queda honestamente imposible de
   abrir — avisa que falta un dígito en vez de fingir que ya funciona.
   ══════════════════════════════════════════════════════════════════════ */

const DIGITOS_CORRECTOS = [
    '5',  // mes 1 — Un Mes Juntos (al final de la carta, tras ganar el combate)
    '8',  // mes 2 — Lo Que Se Abraza (en la carta final, tras abrir los dos objetos)
    null, // mes 3 — pendiente: todavía no tiene página
    '0',  // mes 4 — El Camino a Ti (en la carta final, tras el último capítulo)
    '7',  // mes 5 — La Radio de Nosotros (las 18 estaciones)
    '2',  // mes 6 — Constelación (las 8 figuras)
    '9',  // mes 7 — Receta para Dos (el plato secreto)
    '4',  // mes 8 — El Mapa (las 8 chinchetas)
    '1',  // mes 9 — Cápsula del Tiempo (al sellarla)
    '6',  // mes 10 — 24 Horas (las 24 horas)
    '3'   // mes 11 — Diccionario Privado (al abrir una palabra)
];

const LS_ABIERTA = 'm12_boveda_abierta';
const LS_CAPSULA = 'm9_capsula';

(function () {
    'use strict';

    const cerradura = document.getElementById('bvCerradura');
    const slots = [...document.querySelectorAll('.bv-slot')];
    const btnAbrir = document.getElementById('bvAbrir');
    const aviso = document.getElementById('bvAviso');
    const interior = document.getElementById('bvInterior');
    const capsulaTi = document.getElementById('bvCapsulaTi');
    const capsulaMi = document.getElementById('bvCapsulaMi');
    const capsulaVacia = document.getElementById('bvCapsulaVacia');
    const capsulaFecha = document.getElementById('bvCapsulaFecha');
    const cierreFinal = document.getElementById('bvCierreFinal');
    if (!cerradura || !btnAbrir) return;

    const faltantes = DIGITOS_CORRECTOS.filter(d => d === null).length;

    function leerCapsula() {
        try { return JSON.parse(localStorage.getItem(LS_CAPSULA) || 'null'); }
        catch (e) { return null; }
    }

    function pintarInterior() {
        cerradura.hidden = true;
        interior.hidden = false;

        const capsula = leerCapsula();
        if (capsula) {
            capsulaVacia.hidden = true;
            capsulaTi.hidden = false;
            capsulaMi.hidden = false;
            capsulaTi.querySelector('.bv-carta-texto').textContent = capsula.paraTi || '(la dejó en blanco)';
            capsulaMi.querySelector('.bv-carta-texto').textContent = capsula.paraMi || '(la dejó en blanco)';
            capsulaFecha.textContent = new Date(capsula.selladaEn)
                .toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        } else {
            capsulaTi.hidden = true;
            capsulaMi.hidden = true;
            capsulaVacia.hidden = false;
        }

        cierreFinal.hidden = false;
    }

    function intentarAbrir() {
        const intento = slots.map(s => s.value);

        if (faltantes > 0) {
            aviso.textContent = faltantes === 1
                ? 'Todavía falta 1 dígito por esconder en un mes anterior — la bóveda no se puede terminar de configurar sin él.'
                : `Todavía faltan ${faltantes} dígitos por esconder en meses anteriores — la bóveda no se puede terminar de configurar sin ellos.`;
            aviso.hidden = false;
            return;
        }

        const correcto = DIGITOS_CORRECTOS.every((d, i) => intento[i] === d);
        if (correcto) {
            try { localStorage.setItem(LS_ABIERTA, '1'); } catch (e) { /* modo privado */ }
            pintarInterior();
        } else {
            aviso.textContent = 'Esa combinación no es. Revisa mes por mes — cada uno esconde el suyo.';
            aviso.hidden = false;
            cerradura.classList.remove('bv-cerradura--tiembla');
            void cerradura.offsetWidth;
            cerradura.classList.add('bv-cerradura--tiembla');
        }
    }

    /* ── Cada slot avanza solo al siguiente, como un código de un solo uso ── */
    slots.forEach((slot, i) => {
        slot.addEventListener('input', () => {
            slot.value = slot.value.replace(/[^0-9]/g, '').slice(0, 1);
            if (slot.value && slots[i + 1]) slots[i + 1].focus();
            aviso.hidden = true;
        });
        slot.addEventListener('keydown', ev => {
            if (ev.key === 'Backspace' && !slot.value && slots[i - 1]) slots[i - 1].focus();
            if (ev.key === 'Enter') intentarAbrir();
        });
    });

    btnAbrir.addEventListener('click', intentarAbrir);

    try {
        if (localStorage.getItem(LS_ABIERTA) === '1') pintarInterior();
    } catch (e) { /* modo privado */ }
})();
