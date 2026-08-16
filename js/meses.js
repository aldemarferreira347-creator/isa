/* ══════════════════════════════════════════════════════════════════════
   MESES.JS — el hilo del año.

   Un regalo cada día 10. Este archivo es la ÚNICA fuente de verdad:
   el hilo, el anillo de progreso, la cuenta regresiva y las filas se
   dibujan a partir del array de abajo. No hay que tocar el HTML.

   ── CÓMO ABRIR UN MES ──────────────────────────────────────────────
   Cuando llegue el día 10 y el regalo esté listo:
     1. cambia  estado: 'porVenir'   por   estado: 'abierto'
     2. escribe su  titulo,  desc  y  href
   Y ya. El hilo se llena solo, el anillo sube y la fila pasa de
   candado a puerta.

   Si abres un mes pero todavía no tienes el `href`, la fila NO finge
   ser una puerta: se queda «en camino» y el anillo no la cuenta. En
   cuanto pegues el enlace se convierte en puerta sola. Es a propósito
   — un enlace que no lleva a ningún sitio es peor que no ser enlace.

   Mientras un mes esté 'porVenir' NO se ve su título: sólo el número,
   la fecha, la `pista` y cuánto falta. Esto es a propósito — esta
   página la abre ella, y un título de más arruina la sorpresa de un
   mes entero.
   ══════════════════════════════════════════════════════════════════════ */

const MESES = [
    {
        n: 1,
        estado: 'abierto',
        fecha: '2026-05-10',
        icono: '🎮',
        color: '#7fd4ff',
        titulo: 'Un Mes Juntos',
        desc: 'Nivel 1: pixel art, álbum, combate final y una carta cerrada con llave.',
        href: 'un-mes.html'
    },
    {
        n: 2,
        estado: 'abierto',
        fecha: '2026-06-10',
        icono: '🧸',
        color: '#ffb27a',
        titulo: 'Lo Que Se Abraza',
        desc: 'Dos objetos que no caben en una pantalla: uno se abraza, el otro se huele.',
        href: 'mes-2.html'
    },
    {
        n: 3,
        estado: 'abierto',
        fecha: '2026-07-10',
        icono: '✨',
        color: '#c9b8ff',
        titulo: 'El Principito',
        // Este texto lo lee ELLA: nada de instrucciones aquí dentro.
        desc: 'Un cielo con estrellas y una luna. Toca una y se abre una frase del Principito, elegida para nosotros.',
        href: 'https://app-six-delta-24.vercel.app/'
    },
    {
        n: 4,
        estado: 'abierto',
        fecha: '2026-08-10',
        icono: '🌼',
        color: '#ffd75e',
        titulo: 'El Camino a Ti',
        desc: 'Cuatro capítulos caminados. El prado florece porque tú pasas por ahí.',
        href: 'el-camino/'
    },

    /* ── De aquí en adelante, todavía cerrados ──────────────────────
       `pista` es lo ÚNICO que se ve del contenido. Un verbo, nada más:
       ocupa el sitio del título, porque es lo único que hay que leer. */
    {
        n: 5,
        estado: 'porVenir',
        fecha: '2026-09-10',
        icono: '📻',
        color: '#ff8fb1',
        pista: 'algo que se escucha',
        titulo: 'La Radio de Nosotros',
        desc: 'Un dial de verdad, estática de verdad, y dieciocho canciones escondidas entre las frecuencias.',
        href: 'radio-nosotros.html'
    },
    {
        n: 6,
        estado: 'porVenir',
        fecha: '2026-10-10',
        icono: '✶',
        color: '#9db8ff',
        pista: 'algo que se dibuja',
        titulo: 'Constelación',
        desc: 'Ocho figuras sueltas en el cielo. No significan nada hasta que las unes tú misma.',
        href: 'constelacion.html'
    },
    {
        n: 7,
        estado: 'porVenir',
        fecha: '2026-11-10',
        icono: '❋',
        color: '#ffa552',
        pista: 'algo que se mezcla',
        titulo: 'Receta para Dos',
        desc: 'Una encimera, una olla, y un vale real esperando al final.',
        href: 'receta.html'
    },
    {
        n: 8,
        estado: 'porVenir',
        fecha: '2026-12-10',
        icono: '⌖',
        color: '#7fe0b8',
        pista: 'algo que se recorre',
        titulo: 'El Mapa',
        desc: 'Chinchetas doradas para lo que ya vivimos, apagadas para lo que todavía prometo.',
        href: 'mapa.html'
    },
    {
        n: 9,
        estado: 'porVenir',
        fecha: '2027-01-10',
        icono: '✉',
        color: '#e8e2d4',
        pista: 'algo que se escribe',
        titulo: 'Cápsula del Tiempo',
        desc: 'Este mes no te doy nada: te pido algo. Dos cartas, selladas hasta abril.',
        href: 'capsula.html'
    },
    {
        n: 10,
        estado: 'porVenir',
        fecha: '2027-02-10',
        icono: '◐',
        color: '#ff7a9c',
        pista: 'algo que se gira',
        titulo: '24 Horas',
        desc: 'Un martes cualquiera, hora por hora. No la fecha grande — todo lo demás.',
        href: 'horas.html'
    },
    {
        n: 11,
        estado: 'porVenir',
        fecha: '2027-03-10',
        icono: '§',
        color: '#c0a0ff',
        pista: 'algo que se busca',
        titulo: 'Diccionario Privado',
        desc: 'Un diccionario real de las palabras que sólo existen entre nosotros dos.',
        href: 'diccionario.html'
    },
    {
        n: 12,
        estado: 'porVenir',
        fecha: '2027-04-10',
        icono: '⚿',
        color: '#ffd11a',
        pista: 'algo que se abre',
        titulo: 'La Bóveda',
        desc: 'Once dígitos, escondidos desde el mes 5. Sin todos, esto no abre.',
        href: 'boveda.html'
    }
];


/* ══════════════════════════════════════════════════════════════════════
   MODO DE PRUEBA

   Para revisar el hilo completo sin esperar a que lleguen las fechas
   reales: con esto en `true`, TODO mes se lee como si su día ya hubiera
   llegado. No toca el array MESES de arriba — sólo cambia cómo se PINTA,
   así que apagarlo es literalmente esto en `false` y nada más.

   Los meses que de verdad no tienen página (el 5 al 12, y el 3 mientras
   no tenga `href`) no fingen ser un enlace: se ven en su estado «en
   camino», igual que ya pasa con el mes 3, pero con una marca 🧪 para
   distinguir «en camino de prueba» de «en camino de verdad». El anillo
   de progreso tampoco miente: sigue contando sólo los meses con `href`
   real, así que aunque el hilo entero se vea abierto, el número no sube.

   ⚠️ ANTES DE QUE ELLA ABRA ESTA PÁGINA: pon esto en `false`. Mientras
   esté en `true`, el candado de los meses futuros no protege nada — el
   índice también muestra un aviso mientras el hilo está desplegado, para
   que no se te pase por alto. */
const MODO_PRUEBA = false;


(function () {
    'use strict';

    const REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SS_PLEGADO = 'mesesDesplegado';

    const MES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Las fechas llegan como '2026-05-10'. `new Date('2026-05-10')` las lee en
    // UTC y en América eso las corre un día hacia atrás; se parte a mano.
    function aFecha(iso) {
        const [a, m, d] = iso.split('-').map(Number);
        return new Date(a, m - 1, d);
    }

    function fechaCorta(iso) {
        const [a, m, d] = iso.split('-');
        return `${d}·${m}·${a.slice(2)}`;
    }

    function fechaLarga(iso) {
        const f = aFecha(iso);
        return `${f.getDate()} de ${MES_LARGO[f.getMonth()]} de ${f.getFullYear()}`;
    }

    // Días entre hoy y la fecha, contados de medianoche a medianoche para que
    // «faltan 3 días» no cambie según la hora a la que se abra la página.
    function diasHasta(iso) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return Math.round((aFecha(iso) - hoy) / 86400000);
    }

    function textoEspera(dias) {
        if (dias < 0) return 'muy pronto';
        if (dias === 0) return 'se abre hoy';
        if (dias === 1) return 'se abre mañana';
        // Hasta mes y medio se dan los días exactos: «faltan 34 días» dice
        // mucho más que «falta un mes», y es el dato por el que se vuelve.
        if (dias <= 45) return `faltan ${dias} días`;
        const meses = Math.round(dias / 30.4);
        return `falta${meses === 1 ? '' : 'n'} ${meses} mes${meses === 1 ? '' : 'es'}`;
    }

    // Bajo MODO_PRUEBA, todo mes se lee como si su día ya hubiera llegado.
    // Vive sólo aquí, en la única función que decide el estado de una fila:
    // así una bandera arriba basta para activar o apagar la prueba entera.
    function estadoVisible(m) {
        return MODO_PRUEBA ? 'abierto' : m.estado;
    }

    // Un mes es una PUERTA sólo si está abierto y tiene a dónde llevar.
    // Todo lo demás (progreso, anillo, etiquetas) se deriva de aquí, así que
    // no hay manera de que el anillo diga una cifra y el hilo otra.
    function esPuerta(m) {
        return estadoVisible(m) === 'abierto' && !!m.href;
    }

    // Abierto pero sin enlace: llegó su día, la página todavía no.
    function esCamino(m) {
        return estadoVisible(m) === 'abierto' && !m.href;
    }

    // Un mes que sólo se ve abierto porque MODO_PRUEBA lo fuerza: su día de
    // verdad no ha llegado. Distingue esto del mes 3, que está genuinamente
    // abierto y sólo le falta el enlace.
    function esPruebaForzada(m) {
        return MODO_PRUEBA && m.estado !== 'abierto';
    }


    /* ══════════════════════════════════════════════════════════════
       UNA FILA DEL HILO

       Cada fila es un <li> (el hilo es una lista ordenada de verdad:
       doce cosas en un orden que importa). Dentro va la superficie
       interactiva: <a> si es puerta, <div> si no.

       Los dos tramos del hilo se dibujan sobre el <li>, no sobre la
       superficie: así el desplazamiento del hover no arrastra la línea.
       ══════════════════════════════════════════════════════════════ */
    function crearMes(m, esSiguiente) {
        const puerta = esPuerta(m);
        const camino = esCamino(m);
        const forzado = esPruebaForzada(m);
        const dias = diasHasta(m.fecha);

        const fila = document.createElement('li');
        fila.className = 'mes-item';
        fila.style.setProperty('--c', m.color);
        fila.style.setProperty('--i', Math.min(m.n - 1, 11));

        const caja = document.createElement(puerta ? 'a' : 'div');
        caja.className = 'mes'
            + (puerta ? ' mes--abierto' : '')
            + (camino ? ' mes--camino' : '')
            + (!puerta && !camino ? ' mes--cerrado' : '')
            + (esSiguiente ? ' mes--siguiente' : '')
            + (forzado ? ' mes--prueba' : '');
        if (puerta) caja.href = m.href;

        /* Qué se lee en cada estado.

           En los cerrados la PISTA ocupa el sitio del título. Antes ahí
           iba «Todavía no» en los ocho, y ocho filas seguidas con la
           misma cadena convertían dos tercios del año en una lista de
           clones. La pista es corta, distinta en cada mes y es lo único
           que hay de verdad que leer: le corresponde el sitio bueno.

           Y debajo, en los ocho, cuánto falta. Es un dato real, cambia
           cada día que ella entra, y dibuja la forma del año que queda
           mejor que cualquier frase de relleno. */
        let titulo, cuerpo, marca;
        if (puerta) {
            titulo = m.titulo;
            cuerpo = m.desc;
            marca = m.icono || '✦';
        } else if (camino) {
            // Los meses 5 al 12 no tienen `titulo`/`desc` todavía porque no
            // existen de verdad — sólo llegan aquí bajo MODO_PRUEBA. Sin este
            // respaldo la fila mostraría «undefined» en pantalla.
            titulo = m.titulo || `Mes ${m.n}`;
            cuerpo = m.desc || `Modo de prueba — todavía no tiene página real. Pista: «${m.pista}».`;
            marca = forzado ? '🧪' : '⋯';
        } else {
            titulo = m.pista;
            cuerpo = textoEspera(dias);
            marca = '🔒';
        }

        caja.innerHTML = `
            <span class="mes-nodo" aria-hidden="true">
                <span class="mes-nodo-num">${String(m.n).padStart(2, '0')}</span>
            </span>
            <span class="mes-cuerpo">
                <span class="mes-fila">
                    <span class="mes-titulo">${titulo}</span>
                    <time class="mes-fecha" datetime="${m.fecha}">${fechaCorta(m.fecha)}</time>
                </span>
                <span class="mes-desc">${cuerpo}</span>
            </span>
            <span class="mes-marca" aria-hidden="true">${marca}</span>
        `;

        // Para lectores de pantalla: el número, el estado y la fecha larga no
        // se deducen del texto visible (que va abreviado y sin el estado).
        // El aria-label vive en la superficie, que sí tiene rol propio —
        // ponerlo en un <div> pelado hace que muchos lectores lo ignoren.
        if (puerta) {
            caja.setAttribute('aria-label',
                `Mes ${m.n}: ${titulo}. Entregado el ${fechaLarga(m.fecha)}.`);
        } else {
            caja.setAttribute('role', 'group');
            caja.setAttribute('aria-label', camino
                ? `Mes ${m.n}: ${titulo}.${forzado ? ' (modo de prueba: su día real todavía no ha llegado.)' : ` Entregado el ${fechaLarga(m.fecha)}, su página todavía se está montando.`}`
                : `Mes ${m.n}, todavía cerrado. Se abre el ${fechaLarga(m.fecha)}: ${textoEspera(dias)}. Pista: ${m.pista}.`);
        }

        fila.appendChild(caja);
        return fila;
    }


    /* ── Montaje ─────────────────────────────────────────────────────── */
    function montar() {
        const seccion = document.getElementById('meses');
        if (!seccion) return;

        const hilo = seccion.querySelector('.meses-hilo');
        const panel = seccion.querySelector('.meses-panel');
        const boton = seccion.querySelector('.meses-cab');
        const anillo = seccion.querySelector('.meses-anillo-trazo');
        const cuenta = seccion.querySelector('.meses-cuenta');
        const pie = seccion.querySelector('.meses-proximo');
        if (!hilo || !panel || !boton) return;

        // El anillo cuenta PUERTAS, no meses marcados como abiertos: si el
        // mes 3 todavía no tiene enlace, no hay nada que abrir y el anillo
        // no puede decir que sí.
        const puertas = MESES.filter(esPuerta).length;
        const siguiente = MESES.find(m => m.estado !== 'abierto');

        // El hilo no se mide desde aquí: cada fila dibuja sus dos tramos y se
        // encuentran solos en mitad del hueco (ver meses.css). Antes se
        // calculaba una altura única y fallaba en cuanto una descripción
        // ocupaba dos renglones y otra uno.
        // Aviso imposible de no ver mientras el modo de prueba esté activo:
        // se dibuja dentro del panel, así que sólo aparece cuando el hilo
        // está desplegado — y desaparece solo en cuanto MODO_PRUEBA vuelva
        // a `false`, sin nada más que recordar apagar.
        if (MODO_PRUEBA) {
            const aviso = document.createElement('p');
            aviso.className = 'meses-modoPrueba';
            aviso.innerHTML = '🧪 <strong>Modo de prueba activo.</strong> ' +
                'Todo el hilo se ve «abierto» para poder revisarlo — ningún mes está ' +
                'realmente desbloqueado. Pon <code>MODO_PRUEBA</code> en <code>false</code> ' +
                'en <code>js/meses.js</code> antes de que ella entre.';
            hilo.parentElement.insertBefore(aviso, hilo);
        }

        const trozos = document.createDocumentFragment();
        MESES.forEach(m => {
            trozos.appendChild(crearMes(m, siguiente && m.n === siguiente.n));
        });
        hilo.appendChild(trozos);

        // Anillo de progreso: la circunferencia se calcula del radio real del
        // SVG para no dejar el número mágico regado por el CSS.
        if (anillo) {
            const c = 2 * Math.PI * anillo.r.baseVal.value;
            anillo.style.strokeDasharray = c.toFixed(2);
            anillo.style.strokeDashoffset = (c * (1 - puertas / MESES.length)).toFixed(2);
        }
        if (cuenta) {
            cuenta.textContent = `${puertas}/${MESES.length}`;
            cuenta.setAttribute('aria-label',
                `${puertas} de ${MESES.length} meses abiertos`);
        }

        if (pie) {
            pie.textContent = siguiente
                ? `Mes ${siguiente.n} · ${textoEspera(diasHasta(siguiente.fecha))}`
                : 'El año entero, completo.';
        }

        /* ── Abrir y cerrar ──
           El panel se anima con grid-template-rows 0fr → 1fr: es la única
           forma de que una altura desconocida haga transición sin medirla
           con JS (y sin que se corte al cambiar de tamaño la ventana). */
        let desplegado = false;

        function pintar(estado) {
            desplegado = estado;
            seccion.classList.toggle('meses--abierta', estado);
            boton.setAttribute('aria-expanded', String(estado));
            panel.hidden = false;              // nunca `hidden`: rompería la transición
            // Fuera del flujo de tabulación mientras está plegado, o se puede
            // llegar con Tab a filas invisibles. `inert` se lo lleva todo de
            // golpe — foco, clics y lectores — sin repasar los hijos a mano.
            panel.inert = !estado;
            panel.setAttribute('aria-hidden', String(!estado));
        }

        // Se recuerda durante la sesión: entrar a un mes y volver al menú no
        // debe replegar el hilo que ella acababa de abrir.
        function recordar(estado) {
            try { sessionStorage.setItem(SS_PLEGADO, estado ? '1' : '0'); }
            catch (e) { /* modo privado: se pierde y no pasa nada */ }
        }

        function alternar(estado) {
            const nuevo = typeof estado === 'boolean' ? estado : !desplegado;
            if (nuevo === desplegado) return;
            pintar(nuevo);
            recordar(nuevo);
            if (nuevo) {
                // Al abrir desde el menú de arriba, dejar la cabecera a la vista.
                const y = seccion.getBoundingClientRect().top;
                if (y < 0 || y > window.innerHeight * 0.6) {
                    seccion.scrollIntoView({
                        behavior: REDUCIDO ? 'auto' : 'smooth',
                        block: 'start'
                    });
                }
            }
        }

        let recordado = null;
        try { recordado = sessionStorage.getItem(SS_PLEGADO); }
        catch (e) { /* modo privado */ }

        pintar(recordado === '1' || location.hash === '#meses');
        boton.addEventListener('click', () => alternar());

        // Llegar con #meses ya puesto en la dirección (un enlace compartido,
        // una recarga) lo abre solo.
        window.addEventListener('hashchange', () => {
            if (location.hash === '#meses') alternar(true);
        });

        /* La tarjeta «Mes a Mes» del menú apunta a #meses. Con sólo escuchar
           `hashchange` había un caso en el que no hacía nada: si el hash ya
           era #meses y ella había plegado el hilo, volver a pulsar la tarjeta
           no cambiaba el hash, así que no llegaba ningún evento y la tarjeta
           se quedaba muerta. Se escucha el clic directamente. */
        document.addEventListener('click', ev => {
            const enlace = ev.target.closest('a[href="#meses"]');
            if (!enlace) return;
            alternar(true);
        });

        // Esc cierra, estando el foco dentro.
        seccion.addEventListener('keydown', ev => {
            if (ev.key === 'Escape' && desplegado) {
                alternar(false);
                boton.focus();
            }
        });
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', montar);
    } else {
        montar();
    }
})();
