// ═══════════════════════════════════════════════════════════════
// SUBTITULOS.JS — la barra inferior tipo cine
//
// No pausa el juego: es un rótulo que aparece encima mientras se sigue
// jugando, como en la mayoría de plataformas narrativos. Si dos líneas
// se disparan a la vez (un checkpoint justo cuando termina un diálogo),
// se encolan — nunca se pisan.
//
// El tecleo usa Nucleo.grafemas() para no partir emojis compuestos a
// la mitad. Con prefers-reduced-motion, o en nivel de calidad 0, el
// texto aparece completo de una vez.
//
// Avanzar: tocar/hacer clic en cualquier parte de la pantalla, o pulsar
// espacio (el mismo botón de saltar — juego.js reenvía ese flanco aquí
// cada frame). La primera pulsación completa el tecleo si seguía
// escribiendo; la siguiente pasa a la próxima línea.
// ═══════════════════════════════════════════════════════════════

const Subtitulos = (function () {
    'use strict';

    const elBarra = document.getElementById('subtitulos');
    const elTexto = document.getElementById('subtitulos-texto');
    const elSigue = document.getElementById('subtitulos-sigue');
    const elLector = document.getElementById('subtitulos-lector');

    const VELOCIDAD_TECLEO = 26;    // ms por grafema
    const TIEMPO_MIN_VISIBLE = 900; // ms — evita saltarse una línea por un toque accidental

    // ── Auto-avance ──
    // Sin esto el juego se COLGABA: juego.js espera a que no quede nada
    // que leer para pasar de capítulo, y las líneas sólo avanzaban al
    // tocar la pantalla. Quien no supiera que hay que tocar se quedaba
    // parado para siempre, sin que nada se lo dijera. Ahora la línea se
    // va sola cuando ha dado tiempo de leerla; tocar sigue sirviendo
    // para adelantarla.
    const LECTURA_BASE = 2400;      // ms fijos por línea (antes 1500 — muy corto para leer corriendo)
    const LECTURA_POR_LETRA = 72;   // ms extra por cada carácter visible (antes 55)
    const LECTURA_MAX = 10000;      // techo más alto para frases muy largas

    const cola = [];
    let actual = null;         // { texto, completo }
    let idIntervalo = null;
    let idAuto = null;
    let mostradaDesde = 0;
    // Generación de la línea que se está escribiendo. Cada línea nueva la
    // incrementa, y el tecleo comprueba la suya en cada tic: si ya no
    // coincide, ese intervalo pertenece a una línea vieja y se apaga solo.
    // Es el cinturón de seguridad contra intervalos huérfanos (ver abajo).
    let generacion = 0;

    function cancelarAuto() {
        if (idAuto) { clearTimeout(idAuto); idAuto = null; }
    }

    function cancelarTecleo() {
        if (idIntervalo) { clearInterval(idIntervalo); idIntervalo = null; }
    }

    function textoListo() {
        if (!actual) return;
        actual.completo = true;
        cancelarTecleo();
        // La línea tiene que quedar ENTERA. Esta función se llama también
        // desde avanzar(), es decir, cuando el jugador toca la pantalla
        // para adelantar el tecleo — y ahí sólo se paraba el intervalo,
        // sin escribir lo que faltaba. Resultado: la frase se quedaba
        // cortada por donde iba ("Un hola que lo cambió…" → "Un hola") y
        // ya no se recuperaba nunca. En la batalla del jefe se notaba en
        // cada respuesta, porque ahí se toca la pantalla constantemente.
        if (elTexto.textContent !== actual.texto) elTexto.textContent = actual.texto;
        elSigue.classList.add('visible');

        cancelarAuto();
        const espera = Math.min(LECTURA_MAX,
            LECTURA_BASE + actual.texto.length * LECTURA_POR_LETRA);
        idAuto = setTimeout(() => { idAuto = null; siguiente(); }, espera);
    }

    // ── Por qué esto cancela DOS temporizadores antes de nada ──
    // Este era el fallo que llenaba la barra de "undefinedundefined…".
    // Al empezar una línea se creaba un setInterval nuevo SIN apagar el
    // que pudiera seguir corriendo, y el temporizador de auto-avance de
    // la línea anterior tampoco se cancelaba al adelantarla a mano. Así
    // que bastaba tocar la pantalla para pasar de línea y esperar: el
    // auto-avance viejo disparaba una línea de más, el intervalo en curso
    // se quedaba huérfano (la variable idIntervalo ya apuntaba al nuevo,
    // de modo que clearInterval apagaba el equivocado) y ese huérfano
    // seguía sumando graf[i] con i ya pasado del final — es decir,
    // "undefined" para siempre, varias veces por segundo.
    // Caerse lo disparaba constantemente porque cada reaparición mete una
    // frase nueva por delante de la cola.
    function empezarLinea(item) {
        cancelarTecleo();
        cancelarAuto();

        const mia = ++generacion;
        actual = { texto: item.texto, completo: false };
        mostradaDesde = performance.now();
        elLector.textContent = item.texto;
        elBarra.classList.add('visible');
        elBarra.setAttribute('aria-hidden', 'false');
        elSigue.classList.remove('visible');

        if (Nucleo.nivel === 0 || Nucleo.reducido) {
            elTexto.textContent = item.texto;
            textoListo();
            return;
        }

        elTexto.textContent = '';
        const graf = Nucleo.grafemas(item.texto);
        let i = 0;
        // `propio` guarda el id de ESTE intervalo. Es imprescindible que no
        // se use la variable del módulo aquí dentro: para cuando un
        // intervalo viejo despierta, `idIntervalo` ya apunta al de la línea
        // nueva, así que `clearInterval(idIntervalo)` mataría al bueno y
        // dejaría vivo al huérfano — exactamente al revés de lo que hace
        // falta. Cada intervalo sólo puede apagarse a sí mismo.
        let propio = null;
        propio = setInterval(() => {
            // Un intervalo de una línea que ya no está en pantalla se
            // apaga a sí mismo en vez de escribir sobre la actual.
            if (mia !== generacion) { clearInterval(propio); return; }
            // Y aunque se colara, nunca se concatena un hueco: se cierra
            // la línea y punto. "undefined" no puede llegar a pantalla.
            if (i >= graf.length) { clearInterval(propio); textoListo(); return; }
            elTexto.textContent += graf[i];
            i++;
            if (i >= graf.length) textoListo();
        }, VELOCIDAD_TECLEO);
        idIntervalo = propio;
    }

    function ocultar() {
        actual = null;
        // Al esconder la barra hay que apagar el tecleo TAMBIÉN, no sólo
        // el auto-avance: si no, un intervalo seguía escribiendo sobre una
        // barra invisible y volvía a aparecer texto de la nada al mostrar
        // la siguiente línea. Subir la generación remata a cualquier
        // intervalo que todavía tuviera un tic en vuelo.
        generacion++;
        cancelarTecleo();
        cancelarAuto();
        elTexto.textContent = '';
        elBarra.classList.remove('visible');
        elBarra.setAttribute('aria-hidden', 'true');
    }

    function siguiente() {
        if (!cola.length) { ocultar(); return; }
        empezarLinea(cola.shift());
    }

    // ══════════════════════════════════════════════
    // API
    // ══════════════════════════════════════════════

    // opciones.prioridad: 'ahora' salta al frente de la cola (para la
    // línea de checkpoint, que debe leerse antes que cualquier otra
    // cosa pendiente); por defecto se encola al final.
    function mostrar(texto, opciones) {
        // Guardia: nunca mostrar undefined, null ni cadenas vacías
        if (texto === undefined || texto === null || String(texto).trim() === '') return;
        const o = opciones || {};
        const item = { texto: String(texto) };
        if (o.prioridad === 'ahora') cola.unshift(item);
        else cola.push(item);
        if (!actual) siguiente();
    }

    function avanzar() {
        if (!actual) return;
        if (!actual.completo) { textoListo(); return; }
        if (performance.now() - mostradaDesde < TIEMPO_MIN_VISIBLE) return;
        siguiente();
    }

    function hablando() { return actual !== null; }

    function vaciar() {
        cola.length = 0;
        ocultar();   // ya apaga tecleo, auto-avance y sube la generación
    }

    // Cuántas líneas quedan por leer, contando la que está en pantalla.
    // juego.js la usa para no soltar un aviso encima de otro.
    function pendientes() { return cola.length + (actual ? 1 : 0); }

    // Tocar o hacer clic avanza el diálogo activo — PERO sólo en la
    // mitad derecha de la pantalla. La mitad izquierda es el joystick
    // táctil de entrada.js; si el texto avanzara también ahí, cualquier
    // paso de movimiento saltaría la frase antes de que se pudiera leer.
    // En escritorio (puntero de ratón) no hay zona táctil de movimiento,
    // así que se trata como «derecha» siempre.
    window.addEventListener('pointerdown', (e) => {
        if (!actual) return;
        // Un toque sobre un botón o un panel NO es un toque para avanzar.
        // Sin esto, contestar al jefe se comía su propia respuesta: los
        // botones de opción ocupan media pantalla, así que el mismo dedo
        // que elegía "16 de agosto" adelantaba el subtítulo y la frase de
        // acierto o de error no llegaba a leerse. Pasaba igual con los
        // botones de "capítulo superado", del beso y del compromiso.
        const t = e.target;
        if (t && t.closest && t.closest('button, a, [role="dialog"], .ui-batalla-overlay, .panel')) return;
        // pointerType 'mouse' o 'pen': sin restricción de zona
        if (e.pointerType !== 'touch') { avanzar(); return; }
        // Táctil: sólo mitad derecha (zona de salto = zona de avance)
        if (e.clientX > window.innerWidth / 2) avanzar();
    }, { passive: true });

    return { mostrar, avanzar, hablando, vaciar, pendientes };
})();

window.Subtitulos = Subtitulos;
