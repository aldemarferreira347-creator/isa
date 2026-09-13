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

const HORAS = [
    { hora: 0, texto: 'El último audio en la cama susurrando «te quiero mucho, sueña conmigo».' },
    { hora: 1, texto: 'Ese silencio bonito cuando ya los dos estamos dormidos, compartiendo el mismo descanso.' },
    { hora: 2, texto: 'Si despierto en mitad de la noche, lo primero que hago es pensar en ti y desear que descanses en paz.' },
    { hora: 3, texto: 'La hora donde la noche está en calma y sé que en mis sueños más felices estás tú.' },
    { hora: 4, texto: 'El mundo entero duerme, pero el amor tan inmenso que siento por ti no descansa jamás.' },
    { hora: 5, texto: 'Los primeros destellos de luz que anuncian que hoy será otro día con tu sonrisa.' },
    { hora: 6, texto: 'La alarma suena, y antes de poner un pie en el suelo ya estoy sonriendo porque existes.' },
    { hora: 7, texto: 'El mensaje infaltable de buenos días: «Buenos días, mi amor bonito ☀️». El mejor inicio.' },
    { hora: 8, texto: 'El primer café pensando en cómo te habrá ido al despertar y en desearte el mejor día.' },
    { hora: 9, texto: 'Empezar la rutina diaria con el corazón lleno de la paz que siempre me das.' },
    { hora: 10, texto: 'Ese sticker o meme espontáneo que me mandas y me alegra la mañana por completo.' },
    { hora: 11, texto: 'Un mensajito rápido entre ocupaciones solo para decirte que te extraño y preguntarte cómo vas.' },
    { hora: 12, texto: 'Mediodía: recordarte que comas rico, que te cuides y que te mando un beso enorme.' },
    { hora: 13, texto: 'Un ratito de pausa contándonos qué tal va el día y qué cosas divertidas han pasado.' },
    { hora: 14, texto: 'Ese momento donde releo tus mensajes de cariño y me quedo sonriendo como un tonto frente a la pantalla.' },
    { hora: 15, texto: 'El audio largo contándome cada detalle y yo escuchándolo feliz de principio a fin.' },
    { hora: 16, texto: 'La tarde avanza y ya cuento los minutos para que llegue la noche y podamos hablar tranquilos.' },
    { hora: 17, texto: 'Una foto rápida que nos compartimos: «mira lo que vi hoy, me acordé de ti».' },
    { hora: 18, texto: 'El final de la jornada: ese respiro dulce al saber que todo pasa y que tú estás ahí.' },
    { hora: 19, texto: 'Llegar a casa, ponernos cómodos y empezar nuestra conversación larga y sin afanes.' },
    { hora: 20, texto: 'Cenar contándonos los detalles secretos, los sueños y las risas que solo tú y yo entendemos.' },
    { hora: 21, texto: 'Nuestra llamada, escuchar tu voz cerquita y reírnos de cualquier tontería que nos pasó.' },
    { hora: 22, texto: 'Poner una canción de nuestra radio, hablar de nosotros y sentir que el tiempo se detiene.' },
    { hora: 23, texto: 'El clásico «ya casi me duermo, amor…» y quedarnos hablando otra hora más porque no queremos colgar.' }
];

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
        const eraNueva = !visitadas.has(hora);
        visitadas.add(hora);

        if (eraNueva && window.notificarAccion) {
            window.notificarAccion('Mes 10 - Reloj', 'Hora leída', `${String(hora).padStart(2, '0')}:00 — ${h.texto ? h.texto.slice(0, 60) + '...' : ''}`);
        }

        if (visitadas.size === HORAS.length && digito) {
            digito.hidden = false;
            if (eraNueva && window.notificarAccion) {
                window.notificarAccion('Mes 10 - Reloj', 'Reloj completado', 'Completó las 24 horas del reloj (Dígito de bóveda 6)');
            }
        }
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
