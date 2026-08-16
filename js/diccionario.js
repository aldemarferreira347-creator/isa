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
        palabra: 'Ejemplo',
        categoria: 'sust.',
        definicion: 'Borra esta entrada y escribe aquí la primera palabra de verdad — un apodo, una palabra mal dicha que se quedó, cualquier cosa que sólo signifique algo entre ustedes dos.',
        ejemplo: '«Así se ve una entrada terminada.»',
        fecha: ''
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
            if (abierto && digito) digito.hidden = false;
        });

        li.append(boton, cuerpo);
        return li;
    }

    buscador.addEventListener('input', () => pintar(buscador.value));
    pintar('');
})();
