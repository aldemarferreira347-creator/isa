/* ══════════════════════════════════════════════════════════════════════
   DICCIONARIO.JS — Mes 11 · Diccionario Privado.

   El verbo de este mes es BUSCAR. Un diccionario real, con buscador y
   entradas alfabéticas, pero de las palabras que sólo existen entre
   ustedes dos.

   ── LO ÚNICO QUE HAY QUE EDITAR ──────────────────────────────────────
   Sólo hay una entrada de ejemplo abajo, a propósito: las palabras de
   verdad son las suyas, y no me corresponde inventarlas. Copia el mismo
   formato para cada una nueva y bórrala cuando tengas la primera real.
   ══════════════════════════════════════════════════════════════════════ */

const PALABRAS = [
    {
        palabra: 'Persona Favorita',
        categoria: 'sust. propio',
        definicion: 'La única persona en el universo entero con la que todo cobra sentido, donde el tiempo vuela y la vida se siente ligera y en calma.',
        ejemplo: '«De ocho mil millones de personas, tú eres y siempre serás mi persona favorita.»',
        fecha: '16 de agosto de 2025'
    },
    {
        palabra: 'Mi niña',
        categoria: 'sust. f.',
        definicion: 'Forma cariñosa y tierna de llamarte cuando quiero cuidarte, abrazarte y recordarte lo inmensamente valiosa que eres para mí.',
        ejemplo: '«Te amo con todo mi corazón, mi niña bonita.»',
        fecha: 'Siempre'
    },
    {
        palabra: 'Mon Amour',
        categoria: 'expresión',
        definicion: 'Nuestra canción especial, ese momento íntimo donde cerramos los ojos y solo existimos los dos al ritmo de la melodía.',
        ejemplo: '«Mon amour, eres el detalle más lindo que la vida me dio.»',
        fecha: 'Estación 108.0 FM'
    },
    {
        palabra: 'Abrazo refugio',
        categoria: 'sust. m.',
        definicion: 'El instante en que me pegas a tu pecho o escondo mi cara en tu cuello y el mundo entero deja de doler o de preocupar.',
        ejemplo: '«Necesito uno de esos abrazos refugio que solo tú sabes dar.»',
        fecha: 'Nuestros días'
    },
    {
        palabra: 'Girasol',
        categoria: 'sust. m.',
        definicion: 'Símbolo de luz, constancia y amor eterno. La flor que busca el sol tal como mi corazón te busca a ti en cada amanecer.',
        ejemplo: '«Un jardín entero de girasoles florece cada vez que sonríes.»',
        fecha: '21 de septiembre'
    },
    {
        palabra: 'Complicidad',
        categoria: 'sust. f.',
        definicion: 'Mirarnos a los ojos desde el otro lado de la habitación y saber exactamente lo que el otro está pensando sin decir una sola palabra.',
        ejemplo: '«Esa risa cómplice que solo nosotros entendemos.»',
        fecha: 'Cada segundo'
    },
    {
        palabra: 'Promesa',
        categoria: 'sust. f.',
        definicion: 'El compromiso sincero de cuidarte, respetarte, apoyarte en cada uno de tus sueños y amarte con paciencia y verdad cada día de mi vida.',
        ejemplo: '«Una promesa que no se desgasta con los años, sino que se hace más fuerte.»',
        fecha: 'Para siempre'
    }
];

(function () {
    'use strict';

    const buscador = document.getElementById('dcBuscador');
    const lista = document.getElementById('dcLista');
    const vacio = document.getElementById('dcVacio');
    const contador = document.getElementById('dcContador');
    if (!buscador || !lista) return;

    function normalizar(s) {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function pintar(filtro) {
        const q = normalizar(filtro || '');
        const ordenadas = [...PALABRAS].sort((a, b) => a.palabra.localeCompare(b.palabra, 'es'));
        const visibles = q
            ? ordenadas.filter(p =>
                normalizar(p.palabra).includes(q) ||
                normalizar(p.definicion).includes(q) ||
                normalizar(p.ejemplo || '').includes(q))
            : ordenadas;

        lista.innerHTML = '';
        vacio.hidden = visibles.length > 0;
        vacio.textContent = q
            ? `No hay ninguna palabra que se parezca a «${filtro}».`
            : 'Este diccionario está esperando sus primeras palabras.';

        visibles.forEach(p => lista.appendChild(crearEntrada(p)));
        contador.textContent = `${PALABRAS.length} palabra${PALABRAS.length === 1 ? '' : 's'} en total`;
    }

    function crearEntrada(p) {
        const li = document.createElement('li');
        li.className = 'dc-entrada';

        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'dc-entrada-cab';
        boton.setAttribute('aria-expanded', 'false');
        boton.innerHTML = `
            <span class="dc-palabra">${p.palabra}</span>
            <span class="dc-categoria">${p.categoria || ''}</span>
        `;

        const cuerpo = document.createElement('div');
        cuerpo.className = 'dc-entrada-cuerpo';
        cuerpo.hidden = true;
        cuerpo.innerHTML = `
            <p class="dc-definicion">${p.definicion || 'Todavía no tiene definición.'}</p>
            ${p.ejemplo ? `<p class="dc-ejemplo">${p.ejemplo}${p.fecha ? ` <span class="dc-fecha">— ${p.fecha}</span>` : ''}</p>` : ''}
        `;

        boton.addEventListener('click', () => {
            const abierto = cuerpo.hidden;
            cuerpo.hidden = !abierto;
            boton.setAttribute('aria-expanded', String(abierto));
            li.classList.toggle('dc-entrada--abierta', abierto);
            // Dígito del mes 11 para La Bóveda: se gana al abrir cualquier
            // palabra. Ver js/boveda.js.
            const digito = document.getElementById('dcDigito');
            if (abierto) {
                if (window.notificarAccion) {
                    window.notificarAccion('Mes 11 - Diccionario', 'Palabra consultada', `${p.palabra}: ${p.definicion || ''}`);
                }
                if (digito && digito.hidden) {
                    digito.hidden = false;
                    if (window.notificarAccion) {
                        window.notificarAccion('Mes 11 - Diccionario', 'Dígito revelado', 'Desbloqueó el dígito 3 de la Bóveda');
                    }
                }
            }
        });

        li.append(boton, cuerpo);
        return li;
    }

    let timerBusqueda = null;
    buscador.addEventListener('input', () => {
        const val = (buscador.value || '').trim();
        pintar(val);
        if (val.length >= 2) {
            clearTimeout(timerBusqueda);
            timerBusqueda = setTimeout(() => {
                if (window.notificarAccion) {
                    window.notificarAccion('Mes 11 - Diccionario', 'Búsqueda en diccionario', `Buscó la palabra: "${val}"`);
                }
            }, 1400);
        }
    });
    pintar('');
})();
