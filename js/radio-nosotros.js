/* ══════════════════════════════════════════════════════════════════════
   RADIO-NOSOTROS.JS — Mes 5 · La Radio de Nosotros.

   El verbo de este mes es ESCUCHAR, y por primera vez en el regalo la
   música no es fondo: es el contenido. El dial de abajo cubre el rango
   real de FM (87.5–108.0). Detrás hay 18 canciones, cada una escondida
   en su propia frecuencia. Entre una y otra sólo hay estática — no una
   lista, no una playlist, un descubrimiento.

   ── LO ÚNICO QUE HAY QUE EDITAR ──────────────────────────────────────
   Cada estación tiene un campo `porque`. Mientras esté vacío, la tarjeta
   lo dice tal cual (no finge una razón que no existe — mismo principio
   que el mes 3 con su `href` vacío). Escribe ahí, en una frase, qué
   recuerdas cuando suena esa canción. No hace falta terminarlas todas
   de una vez: cada una se guarda sola en cuanto la escribes.
   ══════════════════════════════════════════════════════════════════════ */

const ESTACIONES = [
    { freq: 88.4, archivo: 'music/1teesperaba.mp3', titulo: 'Te Esperaba', porque: '' },
    { freq: 89.1, archivo: 'music/museo.mp3', titulo: 'Museo', porque: '' },
    { freq: 90.6, archivo: 'music/5caritalinda.mp3', titulo: 'Carita Linda', porque: '' },
    { freq: 92.0, archivo: 'music/personafavorita.mp3', titulo: 'Persona Favorita', porque: '' },
    { freq: 93.4, archivo: 'music/9arroyito.mp3', titulo: 'Arroyito', porque: '' },
    { freq: 94.7, archivo: 'music/6antesdeti.mp3', titulo: 'Antes de Ti', porque: '' },
    { freq: 96.1, archivo: 'music/prometofonseca.mp3', titulo: 'Prometo', porque: '' },
    { freq: 97.3, archivo: 'music/2creoenti.mp3', titulo: 'Creo en Ti', porque: '' },
    { freq: 98.6, archivo: 'music/faltadequerer.mp3', titulo: 'Falta de Querer', porque: '' },
    { freq: 99.9, archivo: 'music/4eresmia.mp3', titulo: 'Eres Mía', porque: '' },
    { freq: 101.2, archivo: 'music/incondicional.mp3', titulo: 'Incondicional', porque: '' },
    { freq: 102.5, archivo: 'music/amorcompleto.mp3', titulo: 'Amor Completo', porque: '' },
    { freq: 103.7, archivo: 'music/7teregalo.mp3', titulo: 'Te Regalo', porque: '' },
    { freq: 104.9, archivo: 'music/airplane.mp3', titulo: 'Airplane', porque: '' },
    { freq: 105.8, archivo: 'music/beso.mp3', titulo: 'Beso', porque: '' },
    { freq: 106.6, archivo: 'music/8propuestaindecente.mp3', titulo: 'Propuesta Indecente', porque: '' },
    { freq: 107.3, archivo: 'music/3vasaquedarte.mp3', titulo: 'Vas a Quedarte', porque: '' },
    { freq: 107.9, archivo: 'music/musica.mp3', titulo: 'Nuestra Melodía', porque: '' }
];

// Ventana de sintonía: a cuántos MHz de una estación se considera «encontrada».
// El hueco más pequeño entre dos estaciones es de 0.6 MHz, así que 0.22 no
// deja nunca dos estaciones peleándose por la misma posición del dial.
const TOLERANCIA = 0.22;
const FREQ_MIN = 87.5;
const FREQ_MAX = 108.0;
const LS_ENCONTRADAS = 'm5_estaciones_encontradas';

(function () {
    'use strict';

    const REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dial = document.getElementById('radioDial');
    const regla = document.getElementById('radioRegla');
    const aguja = document.getElementById('radioAguja');
    const lectura = document.getElementById('radioLectura');
    const btnPower = document.getElementById('radioPower');
    const tarjeta = document.getElementById('radioTarjeta');
    const tarjetaTitulo = document.getElementById('radioTarjetaTitulo');
    const tarjetaPorque = document.getElementById('radioTarjetaPorque');
    const btnPlay = document.getElementById('radioPlay');
    const estadoBusqueda = document.getElementById('radioBuscando');
    const contador = document.getElementById('radioContador');
    const cierre = document.getElementById('radioCierre');
    const audioCancion = document.getElementById('radioAudioCancion');
    if (!dial || !regla) return;

    /* ── Progreso guardado ── */
    let encontradas = new Set();
    try {
        const guardado = JSON.parse(localStorage.getItem(LS_ENCONTRADAS) || '[]');
        encontradas = new Set(guardado);
    } catch (e) { /* modo privado: empieza de cero cada vez, no pasa nada */ }

    function guardar() {
        try { localStorage.setItem(LS_ENCONTRADAS, JSON.stringify([...encontradas])); }
        catch (e) { /* modo privado */ }
    }

    /* ── La regla del dial: una marca por MHz entero, una etiqueta cada 5 ── */
    function pintarRegla() {
        const frag = document.createDocumentFragment();
        for (let f = FREQ_MIN; f <= FREQ_MAX + 0.001; f += 0.5) {
            const marca = document.createElement('span');
            const esEntero = Math.abs(f % 1) < 0.01;
            marca.className = 'radio-marca' + (esEntero && Math.round(f) % 5 === 0 ? ' radio-marca--num' : '');
            marca.style.left = `${((f - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * 100}%`;
            if (esEntero && Math.round(f) % 5 === 0) marca.textContent = Math.round(f);
            frag.appendChild(marca);
        }
        // Marcas de estación: sólo las ya encontradas dejan huella en la regla.
        // Las que faltan no se ven — el dial no debe delatar dónde buscar.
        ESTACIONES.forEach((e, i) => {
            if (!encontradas.has(i)) return;
            const punto = document.createElement('span');
            punto.className = 'radio-hallazgo';
            punto.style.left = `${((e.freq - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * 100}%`;
            punto.title = e.titulo;
            frag.appendChild(punto);
        });
        regla.innerHTML = '';
        regla.appendChild(frag);
    }

    function actualizarContador() {
        if (!contador) return;
        contador.textContent = `${encontradas.size}/${ESTACIONES.length} estaciones encontradas`;
        if (encontradas.size === ESTACIONES.length && cierre) {
            cierre.hidden = false;
            // Dígito del mes 5 para La Bóveda: se gana al encontrar las 18.
            // Ver js/boveda.js — DIGITOS_CORRECTOS.
            const digito = document.getElementById('radioDigito');
            if (digito) digito.hidden = false;
        }
    }

    /* ══════════════════════════════════════════════════════════════
       AUDIO — estática sintetizada (sin archivo: ruido blanco filtrado
       por un paso de banda, para que suene a interferencia de radio y
       no a lluvia) + la canción de la estación sintonizada.
       ══════════════════════════════════════════════════════════════ */
    let ctx = null, nodoEstatica = null, gananciaEstatica = null, encendida = false;

    function construirEstatica() {
        const dur = 2;
        const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
        const datos = buffer.getChannelData(0);
        for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1;

        const fuente = ctx.createBufferSource();
        fuente.buffer = buffer;
        fuente.loop = true;

        const paso = ctx.createBiquadFilter();
        paso.type = 'bandpass';
        paso.frequency.value = 2200;
        paso.Q.value = 0.6;

        gananciaEstatica = ctx.createGain();
        gananciaEstatica.gain.value = 0.16;

        fuente.connect(paso).connect(gananciaEstatica).connect(ctx.destination);
        fuente.start();
        nodoEstatica = fuente;
    }

    function encender() {
        if (encendida) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        construirEstatica();
        encendida = true;
        btnPower.setAttribute('aria-pressed', 'true');
        btnPower.classList.add('is-on');
        dial.disabled = false;
        dial.focus();
        actualizarDesdeValor();
    }

    function tween(objetivo, valor, ms, alTerminar) {
        const inicio = objetivo.value;
        const t0 = performance.now();
        if (REDUCIDO || ms <= 0) { objetivo.value = valor; if (alTerminar) alTerminar(); return; }
        function paso(t) {
            const p = Math.min(1, (t - t0) / ms);
            objetivo.value = inicio + (valor - inicio) * (1 - Math.pow(1 - p, 3)); // ease-out cúbico
            if (p < 1) requestAnimationFrame(paso);
            else if (alTerminar) alTerminar();
        }
        requestAnimationFrame(paso);
    }

    /* ══════════════════════════════════════════════════════════════
       SINTONÍA — el dial es un <input type="range"> nativo (teclado y
       lector de pantalla gratis) pintado como una aguja sobre una regla.
       ══════════════════════════════════════════════════════════════ */
    let estacionActual = -1;

    function estacionMasCercana(freq) {
        let mejor = -1, mejorDist = Infinity;
        ESTACIONES.forEach((e, i) => {
            const d = Math.abs(e.freq - freq);
            if (d < mejorDist) { mejorDist = d; mejor = i; }
        });
        return { indice: mejor, distancia: mejorDist };
    }

    function sintonizar(indice) {
        estacionActual = indice;
        const e = ESTACIONES[indice];

        if (!encontradas.has(indice)) {
            encontradas.add(indice);
            guardar();
            pintarRegla();
            actualizarContador();
        }

        tween(gananciaEstatica.gain, 0.02, REDUCIDO ? 0 : 700);

        audioCancion.src = e.archivo;
        audioCancion.volume = 0;
        audioCancion.play().catch(() => { /* algún navegador exige un segundo gesto: el botón ▶ lo cubre */ });
        tween(audioCancion, 0.85, REDUCIDO ? 0 : 900);

        tarjeta.hidden = false;
        estadoBusqueda.hidden = true;
        tarjetaTitulo.textContent = e.titulo;
        tarjetaPorque.textContent = e.porque || 'Todavía no le has puesto una razón a esta canción.';
        tarjetaPorque.classList.toggle('radio-porque--vacio', !e.porque);
        btnPlay.setAttribute('aria-label', 'Pausar');
        btnPlay.textContent = '⏸';
        lectura.textContent = `${e.freq.toFixed(1)} FM — en el aire`;
    }

    function perderSintonia() {
        if (estacionActual === -1) return;
        estacionActual = -1;
        tween(gananciaEstatica.gain, 0.16, REDUCIDO ? 0 : 500);
        tween(audioCancion, 0, REDUCIDO ? 0 : 500, () => audioCancion.pause());
        tarjeta.hidden = true;
        estadoBusqueda.hidden = false;
    }

    function actualizarDesdeValor() {
        const freq = Number(dial.value) / 10;
        aguja.style.left = `${((freq - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * 100}%`;

        const { indice, distancia } = estacionMasCercana(freq);
        if (distancia <= TOLERANCIA) {
            if (estacionActual !== indice) sintonizar(indice);
        } else {
            if (estacionActual !== -1) perderSintonia();
            lectura.textContent = `${freq.toFixed(1)} FM`;
            // Pista de proximidad: la estática visual se agita más cerca de
            // encontrar algo. Ayuda a que buscar no se sienta arbitrario.
            const cerca = distancia < TOLERANCIA * 3;
            dial.parentElement.classList.toggle('radio-dial--cerca', cerca);
            estadoBusqueda.textContent = cerca ? 'casi…' : 'buscando señal…';
        }
    }

    dial.addEventListener('input', actualizarDesdeValor);
    btnPower.addEventListener('click', encender);

    btnPlay.addEventListener('click', () => {
        if (audioCancion.paused) {
            audioCancion.play();
            btnPlay.textContent = '⏸';
            btnPlay.setAttribute('aria-label', 'Pausar');
        } else {
            audioCancion.pause();
            btnPlay.textContent = '▶';
            btnPlay.setAttribute('aria-label', 'Reproducir');
        }
    });

    pintarRegla();
    actualizarContador();
})();
