/* ══════════════════════════════════════════════════════════════════════
   RECETA.JS — Mes 7 · Receta para Dos.

   El verbo de este mes es MEZCLAR. Ingredientes que no son ingredientes
   de verdad se arrastran (o se tocan, para quien no quiera arrastrar) a
   la olla. Según qué eche y cuántos, el plato final cambia de nombre.
   Un ingrediente sólo aparece si antes echó otro — el resto los ve todos
   desde el principio.

   Al final: la receta con lo que echó, y el vale real. ESE vale lo
   cumples tú — no hay nada que editar aquí para que exista.
   ══════════════════════════════════════════════════════════════════════ */

const INGREDIENTES = [
    { id: 'terquedad', nombre: 'Una taza de terquedad' },
    { id: 'risa', nombre: 'Dos cucharadas de risa a las 2 a.m.' },
    { id: 'celos', nombre: 'Una pizca de celos' },
    { id: 'domingo', nombre: 'Ralladura de domingo' },
    { id: 'paciencia', nombre: 'Un puñado de paciencia (la de los lunes)' },
    { id: 'silencio', nombre: 'Media cucharadita de silencio cómodo' },
    { id: 'nostalgia', nombre: 'Un chorrito de nostalgia' },
    { id: 'perdon', nombre: 'Una porción generosa de perdón' },
    // Secreto: sólo se sirve en la encimera después de echar 'celos'.
    { id: 'secreto', nombre: 'Un beso que arregla todo', secreto: true, requiere: 'celos' }
];

const LS_OLLA = 'm7_olla';

(function () {
    'use strict';

    const REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const encimera = document.getElementById('rcEncimera');
    const olla = document.getElementById('rcOlla');
    const ollaLista = document.getElementById('rcOllaLista');
    const ollaVacio = document.getElementById('rcOllaVacio');
    const btnCocinar = document.getElementById('rcCocinar');
    const resultado = document.getElementById('rcResultado');
    const resultadoNombre = document.getElementById('rcResultadoNombre');
    const resultadoLista = document.getElementById('rcResultadoLista');
    const valeFecha = document.getElementById('rcValeFecha');
    const btnImprimir = document.getElementById('rcImprimir');
    if (!encimera || !olla) return;

    let enOlla = new Set();
    try { enOlla = new Set(JSON.parse(localStorage.getItem(LS_OLLA) || '[]')); }
    catch (e) { /* modo privado */ }

    function guardar() {
        try { localStorage.setItem(LS_OLLA, JSON.stringify([...enOlla])); }
        catch (e) { /* modo privado */ }
    }

    /* ── Nombre del plato: reglas simples, evaluadas de más a menos
       específica. Lo importante no es una combinatoria perfecta, es que
       el nombre se sienta consecuencia de lo que echó, no aleatorio. ── */
    function nombrePlato() {
        if (enOlla.has('secreto')) return 'La Receta que Sólo Sabemos Hacer Nosotros';
        if (enOlla.has('terquedad') && enOlla.has('perdon')) return 'Lo que Nos Costó Aprender';
        if (enOlla.has('celos')) return 'Con un Toque de Nervios de Más';
        if (enOlla.size >= 5) return 'Algo que se Parece Mucho a Nosotros';
        if (enOlla.size === 0) return 'Nada Todavía';
        return 'Receta para Dos';
    }

    function chipsDisponibles() {
        return INGREDIENTES.filter(i => !i.secreto || enOlla.has(i.requiere));
    }

    function pintarEncimera() {
        const antes = new Set([...encimera.querySelectorAll('.rc-chip')].map(c => c.dataset.id));
        chipsDisponibles().forEach(ing => {
            if (antes.has(ing.id) || enOlla.has(ing.id)) return;
            const chip = crearChip(ing);
            encimera.appendChild(chip);
            if (ing.secreto && !REDUCIDO) chip.classList.add('rc-chip--aparece');
        });
    }

    function crearChip(ing) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'rc-chip' + (ing.secreto ? ' rc-chip--secreto' : '');
        chip.dataset.id = ing.id;
        chip.textContent = ing.nombre;
        chip.setAttribute('aria-label', `Echar a la olla: ${ing.nombre}`);
        chip.addEventListener('click', () => echar(ing.id));
        activarArrastre(chip, ing.id);
        return chip;
    }

    function echar(id) {
        if (enOlla.has(id)) return;
        enOlla.add(id);
        guardar();
        const chip = encimera.querySelector(`.rc-chip[data-id="${id}"]`);
        if (chip) chip.remove();
        pintarOlla();
        pintarEncimera(); // puede haber desbloqueado el secreto
        btnCocinar.disabled = enOlla.size === 0;
    }

    function quitar(id) {
        enOlla.delete(id);
        guardar();
        pintarOlla();
        pintarEncimera();
        btnCocinar.disabled = enOlla.size === 0;
        resultado.hidden = true;
    }

    function pintarOlla() {
        ollaLista.innerHTML = '';
        ollaVacio.hidden = enOlla.size > 0;
        [...enOlla].forEach(id => {
            const ing = INGREDIENTES.find(i => i.id === id);
            if (!ing) return;
            const li = document.createElement('li');
            li.className = 'rc-ingrediente-olla';
            const span = document.createElement('span');
            span.textContent = ing.nombre;
            const quitarBtn = document.createElement('button');
            quitarBtn.type = 'button';
            quitarBtn.className = 'rc-quitar';
            quitarBtn.setAttribute('aria-label', `Sacar de la olla: ${ing.nombre}`);
            quitarBtn.textContent = '✕';
            quitarBtn.addEventListener('click', () => quitar(id));
            li.append(span, quitarBtn);
            ollaLista.appendChild(li);
        });
    }

    /* ── Arrastre real con Pointer Events (funciona igual con ratón, dedo
       o lápiz). El clic normal sigue funcionando solo: si no hay
       movimiento de por medio, `click` se dispara igual que siempre. ── */
    function activarArrastre(chip, id) {
        let arrastrando = false, offX = 0, offY = 0;

        chip.addEventListener('pointerdown', ev => {
            if (ev.button !== undefined && ev.button !== 0) return;
            const r = chip.getBoundingClientRect();
            offX = ev.clientX - r.left;
            offY = ev.clientY - r.top;
            arrastrando = false;

            function mover(e2) {
                if (!arrastrando) {
                    arrastrando = true;
                    chip.classList.add('rc-chip--arrastrando');
                    chip.style.width = `${chip.offsetWidth}px`;
                }
                chip.style.left = `${e2.clientX - offX}px`;
                chip.style.top = `${e2.clientY - offY}px`;
            }

            function soltar(e2) {
                document.removeEventListener('pointermove', mover);
                document.removeEventListener('pointerup', soltar);
                if (!arrastrando) return;
                chip.classList.remove('rc-chip--arrastrando');
                chip.style.left = chip.style.top = chip.style.width = '';
                const rOlla = olla.getBoundingClientRect();
                const dentro = e2.clientX >= rOlla.left && e2.clientX <= rOlla.right &&
                    e2.clientY >= rOlla.top && e2.clientY <= rOlla.bottom;
                if (dentro) echar(id);
            }

            document.addEventListener('pointermove', mover);
            document.addEventListener('pointerup', soltar);
        });
    }

    btnCocinar.addEventListener('click', () => {
        resultadoNombre.textContent = nombrePlato();
        resultadoLista.innerHTML = '';
        [...enOlla].forEach(id => {
            const ing = INGREDIENTES.find(i => i.id === id);
            const li = document.createElement('li');
            li.textContent = ing.nombre;
            resultadoLista.appendChild(li);
        });
        resultado.hidden = false;
        resultado.scrollIntoView({ behavior: REDUCIDO ? 'auto' : 'smooth', block: 'start' });

        // Dígito del mes 7 para La Bóveda: sólo con el plato secreto. Ver js/boveda.js.
        const digito = document.getElementById('rcDigito');
        if (digito) digito.hidden = !enOlla.has('secreto');
    });

    if (btnImprimir) {
        btnImprimir.addEventListener('click', () => window.print());
    }

    /* La fecha del vale es suya: se guarda para que no se pierda si
       vuelve a entrar más tarde. */
    if (valeFecha) {
        try {
            const guardada = localStorage.getItem('m7_vale_fecha');
            if (guardada) valeFecha.value = guardada;
        } catch (e) { /* modo privado */ }
        valeFecha.addEventListener('change', () => {
            try { localStorage.setItem('m7_vale_fecha', valeFecha.value); }
            catch (e) { /* modo privado */ }
        });
    }

    pintarEncimera();
    pintarOlla();
    btnCocinar.disabled = enOlla.size === 0;
})();
