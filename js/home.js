// ── Welcome overlay ──
document.addEventListener('DOMContentLoaded', () => {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const btnEntrar = document.getElementById('btnEntrar');
    // Marcadas con [data-fx-manual]: common.js no las observa, así que la
    // cascada no se gasta detrás del overlay de bienvenida. Se liberan al entrar.
    const tarjetas = document.querySelectorAll('.main-nav [data-fx-manual]');

    let menuRevelado = false;
    function revelarMenu() {
        if (menuRevelado) return;
        menuRevelado = true;
        // Sin requestAnimationFrame a propósito: en pestañas de fondo o
        // contenedores fuera de pantalla no se dispara, y el menú se quedaría
        // invisible para siempre. El retardo del llamador ya da el margen.
        tarjetas.forEach((t, i) => {
            t.style.setProperty('--i', Math.min(i, 9));
            t.classList.add('visible');
        });
    }

    // Ancho real de la barra de scroll: al ocultarla hay que devolver ese
    // espacio como padding, o el contenido se desplaza de golpe.
    const anchoBarra = window.innerWidth - document.documentElement.clientWidth;

    function bloquearScroll(bloquear) {
        document.body.classList.toggle('fx-sin-scroll', bloquear);
        document.body.style.paddingRight = bloquear && anchoBarra > 0 ? anchoBarra + 'px' : '';
    }

    // La bienvenida es un saludo, no un peaje: se muestra una vez por sesión.
    // Al volver atrás desde otra página el navegador recarga el index, y sin
    // esto el overlay salía de nuevo cada vez.
    let yaEntro = false;
    try { yaEntro = sessionStorage.getItem('fxBienvenidaVista') === '1'; }
    catch (e) { /* modo privado o almacenamiento bloqueado: se muestra igual */ }

    function cerrarBienvenida(instantaneo) {
        try { sessionStorage.setItem('fxBienvenidaVista', '1'); } catch (e) { }
        bloquearScroll(false);
        if (instantaneo) {
            welcomeOverlay.style.display = 'none';
            revelarMenu();
            return;
        }
        welcomeOverlay.style.opacity = '0';
        welcomeOverlay.style.pointerEvents = 'none';
        setTimeout(() => { welcomeOverlay.style.display = 'none'; }, 800);
        setTimeout(revelarMenu, 260);
    }

    if (btnEntrar && welcomeOverlay) {
        if (yaEntro) {
            cerrarBienvenida(true);
        } else {
            // Nada debe scrollear detrás de la bienvenida
            bloquearScroll(true);
            btnEntrar.addEventListener('click', () => cerrarBienvenida(false), { once: true });
        }
    } else {
        // Sin overlay no hay nada que esperar
        revelarMenu();
    }

    // Red de seguridad: pase lo que pase, ni el menú queda invisible
    // ni la página queda sin poder scrollear.
    setTimeout(() => {
        revelarMenu();
        bloquearScroll(false);
    }, 9000);
});

/* ══════════════════════════════════════════════════════════════════════
   CONTADOR DE VISITAS

   Una cuenta compartida por todos los que abren la página, guardada
   fuera del navegador (si viviera en localStorage sería «las veces que
   has entrado en ESTE teléfono», que no es lo que dice la tarjeta).

   Servicio: abacus.jasoncameron.dev — gratuito, sin cuenta, con CORS
   abierto. `/hit/` suma uno y devuelve el total; `/get/` sólo lee.

   Antes esto apuntaba a `api.counterapi.dev/v1`, que se descontinuó y
   hoy responde 410 Gone a todo. El código lo capturaba y caía a un
   contador local, así que la tarjeta llevaba tiempo enseñando un número
   inventado en este navegador y presentándolo como la cuenta de todos.
   (La v2 de ese servicio existe, pero exige crear una cuenta y un
   workspace: responde 404 «Workspace not found» sin registrarse.)
   ══════════════════════════════════════════════════════════════════════ */
(function () {
    const NAMESPACE = 'isa-regalo-2026';
    const CLAVE = 'visitas';
    const BASE = 'https://abacus.jasoncameron.dev';
    const API_SUMAR = `${BASE}/hit/${NAMESPACE}/${CLAVE}`;
    const API_LEER = `${BASE}/get/${NAMESPACE}/${CLAVE}`;
    const LS_CACHE = 'visit_global_cache';
    const SS_CONTADA = 'visit_counted_session';
    const ESPERA_MAX = 8000;

    const tarjeta = document.getElementById('visitCard');
    const numeroEl = document.getElementById('visitCount');

    // Los tres puntitos parpadean en bucle infinito por CSS. Son un
    // «cargando», así que tienen que apagarse cuando deje de cargar —
    // si no, la tarjeta se queda pidiendo paciencia para siempre.
    function dejarDeCargar() {
        if (tarjeta) tarjeta.classList.add('visit-card--lista');
    }

    /* Muestra el número como odómetro rodante */
    let pintarOdo = null;
    function pintarNumero(n) {
        if (!numeroEl) return;
        if (!pintarOdo) pintarOdo = fxMontarOdometro(numeroEl);
        pintarOdo(String(n));
        numeroEl.style.transition = 'transform .5s cubic-bezier(.175,.885,.32,1.275)';
        numeroEl.style.transform = 'scale(1.35)';
        setTimeout(() => { numeroEl.style.transform = 'scale(1)'; }, 500);
        dejarDeCargar();
    }

    function leerCache() {
        try { return parseInt(localStorage.getItem(LS_CACHE), 10) || 0; }
        catch (e) { return 0; }
    }
    function guardarCache(n) {
        try { localStorage.setItem(LS_CACHE, String(n)); } catch (e) { }
    }

    // Sin `signal` una petición colgada dejaba los «···» puestos para
    // siempre y la tarjeta nunca resolvía.
    async function pedir(url) {
        const corta = new AbortController();
        const reloj = setTimeout(() => corta.abort(), ESPERA_MAX);
        try {
            const res = await fetch(url, { mode: 'cors', signal: corta.signal });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const datos = await res.json();
            const n = datos.value ?? datos.count;
            if (typeof n !== 'number') throw new Error('respuesta sin número');
            return n;
        } finally {
            clearTimeout(reloj);
        }
    }

    async function arrancarContador() {
        // Lo último que se sabe, pintado ya: la tarjeta no nace vacía
        // mientras va y viene la red.
        const cache = leerCache();
        if (cache > 0) pintarNumero(cache);

        // Esta pestaña ya sumó su visita: recargar (F5, volver atrás) no
        // puede volver a incrementar, pero sí conviene releer el total por
        // si ha entrado alguien más mientras tanto.
        let yaContada = false;
        try { yaContada = sessionStorage.getItem(SS_CONTADA) === '1'; }
        catch (e) { /* modo privado */ }

        try {
            const n = await pedir(yaContada ? API_LEER : API_SUMAR);
            guardarCache(n);
            pintarNumero(n);
            if (!yaContada) {
                try { sessionStorage.setItem(SS_CONTADA, '1'); } catch (e) { }
            }
        } catch (e) {
            /* Sin red o servicio caído. Se deja el último total conocido y
               NO se inventa un +1: este número dice «cuántas veces se ha
               abierto esto», y sumar en local sería mentir con una cifra
               que nadie ha contado. Si nunca hubo total, se dice. */
            if (cache > 0) {
                pintarNumero(cache);
            } else if (numeroEl) {
                numeroEl.textContent = '—';
            }
            if (tarjeta) tarjeta.classList.add('visit-card--sinRed');
            dejarDeCargar();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', arrancarContador);
    } else {
        arrancarContador();
    }
})();

/* ══════════════════════════════════════════════════════════════════════
   MODAL «CUMPLEAÑOS»

   La tarjeta del menú ya no entra directo a los momentos: primero
   pregunta si abrir El Principito (externo) o La Carta (la ruta de
   siempre, momentos-cumpleanos.html). El enlace conserva su `href` real
   por si el JS no carga — sólo se intercepta el clic cuando sí carga.
   ══════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const tarjeta = document.getElementById('navCumple');
    const modal = document.getElementById('cumpleModal');
    const btnCerrar = document.getElementById('cumpleModalCerrar');
    if (!tarjeta || !modal || !btnCerrar) return;

    function abrir() {
        modal.classList.add('abierto');
        modal.setAttribute('aria-hidden', 'false');
    }

    function cerrar() {
        modal.classList.remove('abierto');
        modal.setAttribute('aria-hidden', 'true');
    }

    tarjeta.addEventListener('click', ev => {
        ev.preventDefault();
        abrir();
    });

    btnCerrar.addEventListener('click', cerrar);

    // Clic fuera de la caja cierra, clic dentro no
    modal.addEventListener('click', ev => {
        if (ev.target === modal) cerrar();
    });

    document.addEventListener('keydown', ev => {
        if (ev.key === 'Escape' && modal.classList.contains('abierto')) cerrar();
    });
});
