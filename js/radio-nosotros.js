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
    {
        freq: 88.4,
        archivo: 'music/1teesperaba.mp3',
        titulo: 'Te Esperaba',
        porque: 'Porque antes de ti no entendía el verdadero valor de esperar; hoy sé que la vida valió cada segundo solo para encontrarte a ti.'
    },
    {
        freq: 89.1,
        archivo: 'music/museo.mp3',
        titulo: 'Museo',
        porque: 'Porque mirarte a los ojos es contemplar mi obra de arte favorita; cada sonrisa, cada gesto y cada detalle tuyo merecen ser eternos.'
    },
    {
        freq: 90.6,
        archivo: 'music/5caritalinda.mp3',
        titulo: 'Carita Linda',
        porque: 'Porque esa carita tuya tan preciosa ilumina hasta el día más gris y me hace enamorarme de ti una y otra vez sin remedio.'
    },
    {
        freq: 92.0,
        archivo: 'music/personafavorita.mp3',
        inicio: 20,
        titulo: 'Persona Favorita',
        porque: 'Porque en un mundo con tanta gente, tú siempre serás mi refugio, mi lugar seguro, mi paz y mi persona favorita.'
    },
    {
        freq: 93.4,
        archivo: 'music/9arroyito.mp3',
        titulo: 'Arroyito',
        porque: 'Porque tu amor llegó a mi vida como agua fresca y pura, calmando mis dudas y llenándome de una felicidad que no cabe en el pecho.'
    },
    {
        freq: 94.7,
        archivo: 'music/6antesdeti.mp3',
        titulo: 'Antes de Ti',
        porque: 'Porque antes de ti no sabía lo que era amar con el alma entera; fuiste tú quien le dio color, magia y sentido a mi vida.'
    },
    {
        freq: 96.1,
        archivo: 'music/prometofonseca.mp3',
        titulo: 'Prometo',
        porque: 'Porque te prometo amarte toda la vida, abrazarte en tus silencios y cuidarte como el tesoro más sagrado que Dios puso en mi camino.'
    },
    {
        freq: 97.3,
        archivo: 'music/2creoenti.mp3',
        titulo: 'Creo en Ti',
        porque: 'Porque cuando creía que el amor de verdad no existía, llegaste tú a enseñarme que soñar despierto a tu lado es lo más real que tengo.'
    },
    {
        freq: 98.6,
        archivo: 'music/faltadequerer.mp3',
        titulo: 'Falta de Querer',
        porque: 'Porque incluso cuando la distancia o la nostalgia aprietan, recuerdo que nuestro amor es más fuerte que cualquier obstáculo.'
    },
    {
        freq: 99.9,
        archivo: 'music/4eresmia.mp3',
        titulo: 'Eres Mía',
        porque: 'Porque más allá de las palabras y el tiempo, nuestras almas se reconocen y saben que este amor nació para quedarse.'
    },
    {
        freq: 101.2,
        archivo: 'music/incondicional.mp3',
        titulo: 'Incondicional',
        porque: 'Porque mi amor por ti no tiene condiciones ni límites; estoy aquí para amarte, apoyarte y acompañarte en cada paso.'
    },
    {
        freq: 102.5,
        archivo: 'music/amorcompleto.mp3',
        titulo: 'Amor Completo',
        porque: 'Porque a tu lado no falta nada ni sobra nada; estar contigo es sentir en el corazón la calma de un amor sincero y completo.'
    },
    {
        freq: 103.7,
        archivo: 'music/7teregalo.mp3',
        titulo: 'Te Regalo',
        porque: 'Porque te regalo mis días, mis noches enteras, mis caricias y cada latido que late únicamente al ritmo del tuyo.'
    },
    {
        freq: 104.9,
        archivo: 'music/airplane.mp3',
        titulo: 'Airplane',
        porque: 'Porque contigo cualquier viaje es inolvidable; me haces soñar con mundos lejanos y sentir que juntos podemos tocar el cielo.'
    },
    {
        freq: 105.5,
        archivo: 'music/beso.mp3',
        titulo: 'Beso',
        porque: 'Porque cada beso tuyo tiene la magia de detener el tiempo y recordarme que la felicidad cabe entera en tus labios.'
    },
    {
        freq: 106.2,
        archivo: 'music/8propuestaindecente.mp3',
        titulo: 'Propuesta Indecente',
        porque: 'Porque mi propuesta más bonita siempre es la misma: quédate conmigo para siempre, bailemos la vida juntos y no me sueltes jamás.'
    },
    {
        freq: 106.9,
        archivo: 'music/3vasaquedarte.mp3',
        titulo: 'Vas a Quedarte',
        porque: 'Porque cada segundo elijo estar a tu lado, y le pido a la vida que te quedes conmigo para escribir juntos todos nuestros capítulos.'
    },
    {
        freq: 107.5,
        archivo: 'music/musica.mp3',
        titulo: 'Nuestra Melodía',
        porque: 'Porque esta es la banda sonora de nuestra historia: nuestras risas, nuestras miradas cómplices y todo el amor inmenso que nos une.'
    },
    {
        freq: 108.0,
        archivo: 'music/mon-amour.mp4',
        titulo: 'Mon Amour',
        porque: 'Porque eres mi gran amor, mi persona especial en este mundo y la razón de mis sonrisas más sinceras. Esta última estación es nuestro rincón sagrado: donde suena nuestra canción y brillan nuestros recuerdos más amorosos.'
    }
];

// Ventana de sintonía: a cuántos MHz de una estación se considera «encontrada».
// Con 19 estaciones, 0.18 MHz garantiza sintonía precisa y estática entre estaciones.
const TOLERANCIA = 0.18;
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
    const btnSeekAtras = document.getElementById('radioSeekAtras');
    const btnSeekAdelante = document.getElementById('radioSeekAdelante');
    const tarjetaTiempo = document.getElementById('radioTarjetaTiempo');
    const progresoWrap = document.getElementById('radioProgresoWrap');
    const progresoBarra = document.getElementById('radioProgresoBarra');
    const estadoBusqueda = document.getElementById('radioBuscando');
    const contador = document.getElementById('radioContador');
    const cierre = document.getElementById('radioCierre');
    const audioCancion = document.getElementById('radioAudioCancion');
    if (!dial || !regla) return;

    function formatearTiempo(seg) {
        if (!seg || isNaN(seg) || !isFinite(seg)) return '0:00';
        const m = Math.floor(seg / 60);
        const s = Math.floor(seg % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

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
        // Al hacer clic sobre una de ellas, el dial salta directamente a esa frecuencia.
        ESTACIONES.forEach((e, i) => {
            if (!encontradas.has(i)) return;
            const punto = document.createElement('span');
            punto.className = 'radio-hallazgo';
            punto.style.left = `${((e.freq - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * 100}%`;
            punto.title = `${e.titulo} (${e.freq.toFixed(1)} FM)`;
            punto.style.cursor = 'pointer';
            punto.addEventListener('click', (ev) => {
                ev.stopPropagation();
                if (!encendida) encender();
                dial.value = Math.round(e.freq * 10);
                actualizarDesdeValor();
            });
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
            // Dígito del mes 5 para La Bóveda: se gana al encontrar las 18/19.
            // Ver js/boveda.js — DIGITOS_CORRECTOS.
            const digito = document.getElementById('radioDigito');
            if (digito) digito.hidden = false;
            if (window.notificarAccion) {
                window.notificarAccion('Mes 5 - Radio', 'Radio completada', `Encontró las ${ESTACIONES.length} estaciones de radio (Dígito de bóveda 7)`);
            }
        }
    }

    /* ══════════════════════════════════════════════════════════════
       AUDIO — estática sintetizada (sin archivo: ruido blanco filtrado
       por un paso de banda, para que suene a interferencia de radio y
       no a lluvia) + la canción de la estación sintonizada.
       ══════════════════════════════════════════════════════════════ */
    let ctx = null, nodoEstatica = null, gananciaEstatica = null, encendida = false;
    const activeTweens = new WeakMap();

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

    const btnPrev = document.getElementById('btnSintPrev');
    const btnNext = document.getElementById('btnSintNext');

    function encender() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            construirEstatica();
        } else if (ctx.state === 'suspended') {
            ctx.resume();
        }
        encendida = true;
        btnPower.setAttribute('aria-pressed', 'true');
        btnPower.classList.add('is-on');
        btnPower.textContent = 'Radio encendida';
        dial.disabled = false;
        if (btnPrev) btnPrev.disabled = false;
        if (btnNext) btnNext.disabled = false;
        dial.focus();
        actualizarDesdeValor();
        if (window.notificarAccion) {
            window.notificarAccion('Mes 5 - Radio', 'Radio encendida', 'Encendió la radio para sintonizar');
        }
    }

    function apagar() {
        if (!encendida) return;
        encendida = false;
        btnPower.setAttribute('aria-pressed', 'false');
        btnPower.classList.remove('is-on');
        btnPower.textContent = 'Encender la radio';
        dial.disabled = true;
        if (btnPrev) btnPrev.disabled = true;
        if (btnNext) btnNext.disabled = true;
        if (gananciaEstatica) {
            try { gananciaEstatica.gain.value = 0; } catch (e) {}
        }
        if (ctx && ctx.state === 'running') {
            ctx.suspend();
        }
        audioCancion.pause();
        audioCancion.volume = 0;
        estacionActual = -1;
        tarjeta.hidden = true;
        estadoBusqueda.hidden = false;
        estadoBusqueda.textContent = 'enciende la radio para empezar';
        lectura.textContent = '87.5 FM';
        if (progresoBarra) progresoBarra.style.width = '0%';
        if (tarjetaTiempo) tarjetaTiempo.textContent = '0:00 / 0:00';
        ocultarGaleria();
    }

    function tween(objetivo, valor, ms, alTerminar) {
        const prop = ('gain' in objetivo) ? 'gain' : (('value' in objetivo) ? 'value' : 'volume');
        const inicio = typeof objetivo[prop] === 'number' ? objetivo[prop] : 0;
        const t0 = performance.now();

        // Control de concurrencia: si hay un tween activo en este objetivo, lo reemplaza
        const tweenId = (activeTweens.get(objetivo) || 0) + 1;
        activeTweens.set(objetivo, tweenId);

        if (REDUCIDO || ms <= 0) {
            try { objetivo[prop] = valor; } catch (e) {}
            if (alTerminar) alTerminar();
            return;
        }
        function paso(t) {
            if (activeTweens.get(objetivo) !== tweenId) return;
            const p = Math.min(1, (t - t0) / ms);
            try {
                objetivo[prop] = inicio + (valor - inicio) * (1 - Math.pow(1 - p, 3)); // ease-out cúbico
            } catch (e) {}
            if (p < 1) {
                requestAnimationFrame(paso);
            } else if (alTerminar) {
                alTerminar();
            }
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
            if (window.notificarAccion) {
                window.notificarAccion('Mes 5 - Radio', 'Estación sintonizada', `${e.titulo} (${e.freq.toFixed(1)} FM)`);
            }
        }

        // Quitar completamente el ruido de la radio al comenzar la canción
        tween(gananciaEstatica.gain, 0, REDUCIDO ? 0 : 500);

        const rutaActual = audioCancion.getAttribute('src') || '';
        const inicioSeg = e.inicio || 0;

        if (rutaActual !== e.archivo) {
            audioCancion.src = e.archivo;
            audioCancion.loop = true;
            audioCancion.volume = 0;

            const aplicarInicio = () => {
                if (inicioSeg > 0) {
                    try { audioCancion.currentTime = inicioSeg; } catch (_) {}
                }
            };

            if (audioCancion.readyState >= 1) {
                aplicarInicio();
            } else {
                audioCancion.addEventListener('loadedmetadata', aplicarInicio, { once: true });
            }

            const playPromise = audioCancion.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        } else {
            if (inicioSeg > 0 && audioCancion.currentTime < 1) {
                try { audioCancion.currentTime = inicioSeg; } catch (_) {}
            }
            if (audioCancion.paused) {
                audioCancion.play().catch(() => {});
            }
        }
        tween(audioCancion, 0.85, REDUCIDO ? 0 : 900);

        tarjeta.hidden = false;
        estadoBusqueda.hidden = true;
        tarjetaTitulo.textContent = e.titulo;
        tarjetaPorque.textContent = e.porque || 'Nuestra historia contada en cada melodía.';
        tarjetaPorque.classList.remove('radio-porque--vacio');
        btnPlay.setAttribute('aria-label', 'Pausar');
        btnPlay.textContent = '⏸';
        lectura.textContent = `${e.freq.toFixed(1)} FM — en el aire`;
        mostrarGaleria(indice, e.titulo);
    }

    function perderSintonia() {
        if (estacionActual === -1) return;
        estacionActual = -1;
        // La estática vuelve al buscar o perder sintonía
        tween(gananciaEstatica.gain, 0.16, REDUCIDO ? 0 : 500);
        tween(audioCancion, 0, REDUCIDO ? 0 : 500, () => {
            if (estacionActual === -1) {
                audioCancion.pause();
            }
        });
        tarjeta.hidden = true;
        estadoBusqueda.hidden = false;
        ocultarGaleria();
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
            // Pista de proximidad: la estática visual se agita más cerca de encontrar algo
            const cerca = distancia < TOLERANCIA * 3;
            dial.parentElement.classList.toggle('radio-dial--cerca', cerca);
            estadoBusqueda.textContent = cerca ? 'casi…' : 'buscando señal…';
        }
    }

    function irAEstacion(direccion) {
        if (!encendida) encender();
        const freqActual = Number(dial.value) / 10;
        let objetivoIndex = -1;

        if (direccion > 0) {
            objetivoIndex = ESTACIONES.findIndex(e => e.freq > freqActual + 0.15);
            if (objetivoIndex === -1) objetivoIndex = 0; // Volver al inicio
        } else {
            for (let i = ESTACIONES.length - 1; i >= 0; i--) {
                if (ESTACIONES[i].freq < freqActual - 0.15) {
                    objetivoIndex = i;
                    break;
                }
            }
            if (objetivoIndex === -1) objetivoIndex = ESTACIONES.length - 1; // Ir a la última
        }

        if (objetivoIndex !== -1) {
            dial.value = Math.round(ESTACIONES[objetivoIndex].freq * 10);
            actualizarDesdeValor();
        }
    }

    /* ══════════════════════════════════════════════════════════════
       GALERÍA DE FOTOS Y VISOR LIGHTBOX
       ══════════════════════════════════════════════════════════════ */
    const galeria = document.getElementById('radioGaleria');
    const galeriaTitulo = document.getElementById('radioGaleriaTitulo');
    const galeriaSub = document.getElementById('radioGaleriaSub');
    const galeriaBadge = document.getElementById('radioGaleriaBadge');
    const galeriaGrid = document.getElementById('radioGaleriaGrid');
    const btnCargarMas = document.getElementById('btnCargarMasFotos');
    const btnVerTodas = document.getElementById('btnVerTodasFotos');

    const lightbox = document.getElementById('radioLightbox');
    const lightboxImg = document.getElementById('radioLightboxImg');
    const lightboxCumplido = document.getElementById('radioLightboxCumplido');
    const lightboxContador = document.getElementById('radioLightboxContador');
    const lightboxPrev = document.getElementById('radioLightboxPrev');
    const lightboxNext = document.getElementById('radioLightboxNext');
    const lightboxCerrar = document.getElementById('radioLightboxCerrar');
    const lightboxOverlay = document.getElementById('radioLightboxOverlay');

    let fotosActivas = [];
    let estacionGaleriaActual = -1;
    let viendoTodoAlbum = false;
    let fotosRenderizadas = 0;
    const PASO_FOTOS = 24;
    let fotoActualIndex = 0;

    function renderizarFotos(cantidad) {
        if (!galeriaGrid || fotosActivas.length === 0) return;
        const limite = Math.min(fotosActivas.length, fotosRenderizadas + cantidad);
        const frag = document.createDocumentFragment();

        for (let i = fotosRenderizadas; i < limite; i++) {
            const f = fotosActivas[i];
            const card = document.createElement('div');
            card.className = 'rd-foto-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Foto ${i + 1}: ${f.cumplido}`);

            const wrap = document.createElement('div');
            wrap.className = 'rd-foto-img-wrap';

            const img = document.createElement('img');
            img.src = encodeURI(f.src);
            img.alt = f.cumplido;
            img.className = 'rd-foto-img';
            img.loading = 'lazy';

            wrap.appendChild(img);

            const texto = document.createElement('p');
            texto.className = 'rd-foto-cumplido';
            texto.textContent = `«${f.cumplido}»`;

            card.appendChild(wrap);
            card.appendChild(texto);

            const indexFoto = i;
            card.addEventListener('click', () => abrirLightbox(indexFoto));
            card.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    abrirLightbox(indexFoto);
                }
            });

            frag.appendChild(card);
        }

        galeriaGrid.appendChild(frag);
        fotosRenderizadas = limite;

        if (btnCargarMas) {
            btnCargarMas.hidden = fotosRenderizadas >= fotosActivas.length;
        }
        if (btnVerTodas) {
            btnVerTodas.hidden = false;
        }
    }

    function mostrarGaleria(indice, tituloCancion) {
        if (!galeria) return;
        galeria.hidden = false;

        if (estacionGaleriaActual === indice && !viendoTodoAlbum) return;

        estacionGaleriaActual = indice;
        viendoTodoAlbum = false;

        const infoEstacion = (typeof FOTOS_POR_ESTACION !== 'undefined' && FOTOS_POR_ESTACION[indice])
            ? FOTOS_POR_ESTACION[indice]
            : null;

        if (infoEstacion && infoEstacion.fotos && infoEstacion.fotos.length > 0) {
            fotosActivas = infoEstacion.fotos;
            if (indice === 18) {
                if (galeriaTitulo) galeriaTitulo.textContent = `Nuestros Recuerdos · ${tituloCancion} 💖`;
                if (galeriaBadge) galeriaBadge.textContent = `✨ ${fotosActivas.length} fotos más amorosas ✨`;
                if (galeriaSub) galeriaSub.textContent = `Temática especial: ${infoEstacion.tema}`;
            } else {
                if (galeriaTitulo) galeriaTitulo.textContent = `Nuestros Recuerdos · ${tituloCancion}`;
                if (galeriaBadge) galeriaBadge.textContent = `${fotosActivas.length} fotos`;
                if (galeriaSub) galeriaSub.textContent = `Temática: ${infoEstacion.tema}`;
            }
        } else {
            fotosActivas = (typeof FOTOS_PAREJA !== 'undefined') ? FOTOS_PAREJA : [];
            if (galeriaTitulo) galeriaTitulo.textContent = `Nuestros Recuerdos · ${tituloCancion}`;
            if (galeriaBadge) galeriaBadge.textContent = `${fotosActivas.length} fotos`;
            if (galeriaSub) galeriaSub.textContent = 'Fotos especiales de nuestra historia';
        }

        galeriaGrid.innerHTML = '';
        fotosRenderizadas = 0;
        renderizarFotos(fotosActivas.length);

        if (btnCargarMas) btnCargarMas.hidden = true;
        if (btnVerTodas) {
            const totalFotos = (typeof FOTOS_PAREJA !== 'undefined') ? FOTOS_PAREJA.length : 224;
            btnVerTodas.textContent = `Ver todo el álbum (${totalFotos} fotos)`;
        }
    }

    function mostrarTodasLasFotos() {
        viendoTodoAlbum = true;
        fotosActivas = (typeof FOTOS_PAREJA !== 'undefined') ? FOTOS_PAREJA : [];

        if (galeriaTitulo) galeriaTitulo.textContent = 'Álbum Completo de Nosotros';
        if (galeriaBadge) galeriaBadge.textContent = `${fotosActivas.length} fotos`;
        if (galeriaSub) galeriaSub.textContent = 'Todos nuestros recuerdos juntos en un solo lugar';

        galeriaGrid.innerHTML = '';
        fotosRenderizadas = 0;
        renderizarFotos(PASO_FOTOS);

        if (btnCargarMas) {
            btnCargarMas.hidden = fotosRenderizadas >= fotosActivas.length;
        }
        if (btnVerTodas) {
            btnVerTodas.textContent = '← Volver a fotos de esta canción';
        }
    }

    function ocultarGaleria() {
        if (galeria) galeria.hidden = true;
        estacionGaleriaActual = -1;
        cerrarLightbox();
    }

    if (btnCargarMas) {
        btnCargarMas.addEventListener('click', () => renderizarFotos(PASO_FOTOS));
    }
    if (btnVerTodas) {
        btnVerTodas.addEventListener('click', () => {
            if (viendoTodoAlbum) {
                if (estacionActual !== -1) {
                    mostrarGaleria(estacionActual, ESTACIONES[estacionActual].titulo);
                }
            } else {
                mostrarTodasLasFotos();
            }
        });
    }

    /* ── Lightbox ── */
    function abrirLightbox(index) {
        if (!lightbox || fotosActivas.length === 0) return;
        fotoActualIndex = (index + fotosActivas.length) % fotosActivas.length;
        const f = fotosActivas[fotoActualIndex];

        lightboxImg.src = encodeURI(f.src);
        lightboxCumplido.textContent = `«${f.cumplido}»`;
        if (lightboxContador) {
            lightboxContador.textContent = `${fotoActualIndex + 1} / ${fotosActivas.length}`;
        }

        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';

        if (window.notificarAccion) {
            window.notificarAccion('Mes 5 - Radio', 'Foto ampliada', `Foto ${fotoActualIndex + 1} de ${fotosActivas.length}: «${(f.cumplido || '').slice(0, 70)}»`);
        }
    }

    function cerrarLightbox() {
        if (!lightbox || lightbox.hidden) return;
        lightbox.hidden = true;
        document.body.style.overflow = '';
    }

    function cambiarFotoLightbox(delta) {
        abrirLightbox(fotoActualIndex + delta);
    }

    if (lightboxPrev) lightboxPrev.addEventListener('click', () => cambiarFotoLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => cambiarFotoLightbox(1));
    if (lightboxCerrar) lightboxCerrar.addEventListener('click', cerrarLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', cerrarLightbox);

    window.addEventListener('keydown', (ev) => {
        if (!lightbox || lightbox.hidden) return;
        if (ev.key === 'Escape') cerrarLightbox();
        else if (ev.key === 'ArrowLeft') cambiarFotoLightbox(-1);
        else if (ev.key === 'ArrowRight') cambiarFotoLightbox(1);
    });

    dial.addEventListener('input', actualizarDesdeValor);

    btnPower.addEventListener('click', () => {
        if (encendida) apagar();
        else encender();
    });

    if (btnPrev) btnPrev.addEventListener('click', () => irAEstacion(-1));
    if (btnNext) btnNext.addEventListener('click', () => irAEstacion(1));

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

    /* ── Controles de avance (+20s) y retroceso (-10s) ── */
    if (btnSeekAdelante) {
        btnSeekAdelante.addEventListener('click', () => {
            if (!encendida) return;
            const dur = audioCancion.duration || Infinity;
            audioCancion.currentTime = Math.min(dur, (audioCancion.currentTime || 0) + 20);
        });
    }

    if (btnSeekAtras) {
        btnSeekAtras.addEventListener('click', () => {
            if (!encendida) return;
            audioCancion.currentTime = Math.max(0, (audioCancion.currentTime || 0) - 10);
        });
    }

    if (progresoWrap) {
        progresoWrap.addEventListener('click', (ev) => {
            if (!encendida || !audioCancion.duration) return;
            const rect = progresoWrap.getBoundingClientRect();
            const clickX = ev.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, clickX / rect.width));
            audioCancion.currentTime = ratio * audioCancion.duration;
        });
    }

    audioCancion.addEventListener('timeupdate', () => {
        const cur = audioCancion.currentTime || 0;
        const dur = audioCancion.duration || 0;

        if (tarjetaTiempo) {
            tarjetaTiempo.textContent = `${formatearTiempo(cur)} / ${formatearTiempo(dur)}`;
        }
        if (progresoBarra && dur > 0) {
            const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
            progresoBarra.style.width = `${pct}%`;
            if (progresoWrap) progresoWrap.setAttribute('aria-valuenow', Math.round(pct));
        }
    });

    pintarRegla();
    actualizarContador();
})();
