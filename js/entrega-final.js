/* ══════════════════════════════════════════════════════════════════════
   ENTREGA-FINAL.JS — Reproductor de Vinilo, Carta Interactiva y Particulas
   Cancion: Los Enanitos Verdes - Tu Carcel
   ══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const audio = document.getElementById('finalAudio');
    const btnPlay = document.getElementById('btnPlay');
    const playIcon = document.getElementById('playIcon');
    const btnRewind = document.getElementById('btnRewind');
    const btnForward = document.getElementById('btnForward');
    const scrubberTrack = document.getElementById('scrubberTrack');
    const scrubberFill = document.getElementById('scrubberFill');
    const timeCurrent = document.getElementById('timeCurrent');
    const timeTotal = document.getElementById('timeTotal');
    const volSlider = document.getElementById('volSlider');
    const btnMute = document.getElementById('btnMute');
    const tonearm = document.getElementById('turntableTonearm');
    const vinyl = document.getElementById('turntableVinyl');
    const equalizer = document.getElementById('playerEqualizer');
    const vinylPhoto = document.getElementById('vinylPhoto');
    const btnCyclePhoto = document.getElementById('btnCyclePhoto');

    // Carta
    const cartaSellada = document.getElementById('cartaSellada');
    const cartaPergamino = document.getElementById('cartaPergamino');
    const btnRomperSello = document.getElementById('btnRomperSello');
    const btnEditarCarta = document.getElementById('btnEditarCarta');
    const cartaTextoCuerpo = document.getElementById('cartaTextoCuerpo');

    // Modal de Edicion
    const cartaModal = document.getElementById('cartaModal');
    const modalTextarea = document.getElementById('modalTextarea');
    const btnModalGuardar = document.getElementById('btnModalGuardar');
    const btnModalCancelar = document.getElementById('btnModalCancelar');
    const btnModalRestablecer = document.getElementById('btnModalRestablecer');

    // Galeria de Fotos de Pareja
    const FOTOS_PAREJA = [
        'img/foto1.jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.50 PM (1).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.29 PM (3).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.32 PM (3).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.35 PM (4).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.41 PM (1).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.43 PM (4).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.46 PM.jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.52 PM (2).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.55 PM (1).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.59 PM.jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.04 PM.jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.18 PM (2).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.21 PM (2).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.25 PM (1).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.30 PM (1).jpeg',
        'Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.34 PM (1).jpeg'
    ];
    let fotoIndex = 0;

    if (btnCyclePhoto && vinylPhoto) {
        btnCyclePhoto.addEventListener('click', () => {
            fotoIndex = (fotoIndex + 1) % FOTOS_PAREJA.length;
            vinylPhoto.style.opacity = '0';
            setTimeout(() => {
                vinylPhoto.src = FOTOS_PAREJA[fotoIndex];
                vinylPhoto.style.opacity = '1';
            }, 250);
            crearExplosionParticulas(btnCyclePhoto.getBoundingClientRect().left + 40, btnCyclePhoto.getBoundingClientRect().top);
        });
    }

    // Texto Original de la Carta
    const CARTA_DEFAULT = "Mi amor, Isabela:\n\n" +
        "Dicen que la musica tiene la magia de encontrar las palabras exactas cuando el corazon se siente tan lleno que apenas puede hablar. Quise que esta cancion, «Tu Carcel», fuera la banda sonora de este rincon tan nuestro. Porque mas alla de cada verso, lo que siempre me recuerda es lo mas valioso que existe: un carino sincero, puro y verdadero, como el que tengo por ti cada segundo de mi vida.\n\n" +
        "Desde el primer dia que entraste a mi mundo, todo cobro un color distinto. Me has ensenado a ver la vida con mas ternura, a valorar las pequenas miradas, las risas compartidas y cada abrazo que detiene el tiempo. No hay nada en este mundo que se compare a la tranquilidad de saber que caminas a mi lado.\n\n" +
        "Esta entrega final es solo un simbolo, porque lo nuestro no tiene final. Es una promesa silenciosa de que siempre estare aqui para cuidarte, apoyarte en cada sueno y amarte con toda mi alma, hoy, manana y en cada uno de los dias que el destino nos regale.\n\n" +
        "Gracias por ser mi paz, mi refugio y el motivo mas bonito de mi sonrisa.";

    function cargarCarta() {
        const guardada = localStorage.getItem('entrega_final_carta');
        const contenido = guardada || CARTA_DEFAULT;
        if (cartaTextoCuerpo) {
            cartaTextoCuerpo.innerHTML = '';
            contenido.split('\n\n').forEach(parrafo => {
                const p = document.createElement('p');
                p.textContent = parrafo.trim();
                cartaTextoCuerpo.appendChild(p);
            });
        }
    }
    cargarCarta();

    // Desplegar Carta (Romper Sello)
    let cartaAbierta = false;
    function abrirCarta() {
        if (cartaAbierta) return;
        cartaAbierta = true;
        if (cartaSellada && cartaPergamino) {
            cartaSellada.style.opacity = '0';
            cartaSellada.style.transform = 'scale(0.95)';
            cartaSellada.style.transition = 'all 0.4s ease';
            setTimeout(() => {
                cartaSellada.style.display = 'none';
                cartaPergamino.style.display = 'block';
                const rect = cartaPergamino.getBoundingClientRect();
                for (let i = 0; i < 6; i++) {
                    setTimeout(() => {
                        crearNotaFlotante(rect.left + Math.random() * rect.width, rect.top + 50);
                    }, i * 150);
                }
            }, 380);
        }
    }

    if (btnRomperSello) {
        btnRomperSello.addEventListener('click', abrirCarta);
    }

    // Modal de Edicion de la Carta
    if (btnEditarCarta && cartaModal) {
        btnEditarCarta.addEventListener('click', () => {
            const actual = localStorage.getItem('entrega_final_carta') || CARTA_DEFAULT;
            modalTextarea.value = actual;
            cartaModal.style.display = 'flex';
        });

        btnModalCancelar.addEventListener('click', () => {
            cartaModal.style.display = 'none';
        });

        btnModalGuardar.addEventListener('click', () => {
            const nuevoTexto = modalTextarea.value.trim();
            if (nuevoTexto) {
                localStorage.setItem('entrega_final_carta', nuevoTexto);
                cargarCarta();
            }
            cartaModal.style.display = 'none';
        });

        btnModalRestablecer.addEventListener('click', () => {
            if (confirm('¿Deseas restablecer la carta a su version original?')) {
                localStorage.removeItem('entrega_final_carta');
                cargarCarta();
                cartaModal.style.display = 'none';
            }
        });

        cartaModal.addEventListener('click', (e) => {
            if (e.target === cartaModal) cartaModal.style.display = 'none';
        });
    }

    // Reproductor de Audio y Giradiscos
    let estaReproduciendo = false;
    let notificacionEnviada = false;

    function formatearTiempo(segundos) {
        if (isNaN(segundos) || segundos < 0) return '0:00';
        const m = Math.floor(segundos / 60);
        const s = Math.floor(segundos % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function actualizarEstadoReproduccion(reproduciendo) {
        estaReproduciendo = reproduciendo;
        if (reproduciendo) {
            playIcon.textContent = '⏸';
            btnPlay.setAttribute('aria-label', 'Pausar');
            tonearm.classList.add('is-active');
            vinyl.classList.add('is-spinning');
            equalizer.classList.add('is-active');
            abrirCarta();
            iniciarCicloParticulas();

            if (!notificacionEnviada && typeof window.enviarNotificacion === 'function') {
                notificacionEnviada = true;
                window.enviarNotificacion('🎶 Isa escuchó la Entrega Final (Tu Cárcel) ❣️', {
                    'Canción': 'Los Enanitos Verdes - Tu Cárcel',
                    'Acción': 'Reproduciendo en el Tocadiscos',
                    'Página': 'La Entrega Final'
                });
            }
        } else {
            playIcon.textContent = '▶';
            btnPlay.setAttribute('aria-label', 'Reproducir');
            tonearm.classList.remove('is-active');
            vinyl.classList.remove('is-spinning');
            equalizer.classList.remove('is-active');
            detenerCicloParticulas();
        }
    }

    function togglePlay() {
        if (!audio) return;
        if (audio.paused) {
            audio.play().then(() => {
                actualizarEstadoReproduccion(true);
            }).catch(err => {
                console.warn('Error al iniciar audio:', err);
            });
        } else {
            audio.pause();
            actualizarEstadoReproduccion(false);
        }
    }

    if (btnPlay) {
        btnPlay.addEventListener('click', togglePlay);
    }

    if (btnRewind) {
        btnRewind.addEventListener('click', () => {
            if (audio) {
                audio.currentTime = Math.max(0, audio.currentTime - 10);
            }
        });
    }

    if (btnForward) {
        btnForward.addEventListener('click', () => {
            if (audio) {
                audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
            }
        });
    }

    // Actualizacion de Tiempo y Barra de Progreso
    if (audio) {
        audio.addEventListener('loadedmetadata', () => {
            if (timeTotal) timeTotal.textContent = formatearTiempo(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            const pct = (audio.currentTime / audio.duration) * 100;
            if (scrubberFill) scrubberFill.style.width = `${pct}%`;
            if (timeCurrent) timeCurrent.textContent = formatearTiempo(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            actualizarEstadoReproduccion(false);
            if (scrubberFill) scrubberFill.style.width = '0%';
        });
    }

    // Click en Scrubber
    if (scrubberTrack && audio) {
        scrubberTrack.addEventListener('click', (e) => {
            const rect = scrubberTrack.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            if (audio.duration) {
                audio.currentTime = clickPos * audio.duration;
            }
        });
    }

    // Control de Volumen
    if (volSlider && audio) {
        const volGuardado = localStorage.getItem('entrega_final_vol');
        if (volGuardado !== null) {
            audio.volume = parseFloat(volGuardado);
            volSlider.value = audio.volume;
        }

        volSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            audio.volume = val;
            localStorage.setItem('entrega_final_vol', val);
            if (btnMute) btnMute.textContent = val === 0 ? '🔇' : '🔊';
        });
    }

    if (btnMute && audio && volSlider) {
        let prevVol = 0.8;
        btnMute.addEventListener('click', () => {
            if (audio.volume > 0) {
                prevVol = audio.volume;
                audio.volume = 0;
                volSlider.value = 0;
                btnMute.textContent = '🔇';
            } else {
                audio.volume = prevVol || 0.8;
                volSlider.value = audio.volume;
                btnMute.textContent = '🔊';
            }
        });
    }

    // Generador de Particulas (Notas y Corazones)
    let intervaloParticulas = null;
    const SIMBOLOS_MUSICA = ['♪', '♫', '♬', '♩', '♥', '✦', '✨'];

    function crearNotaFlotante(x, y) {
        const el = document.createElement('div');
        el.className = 'particle-note';
        el.textContent = SIMBOLOS_MUSICA[Math.floor(Math.random() * SIMBOLOS_MUSICA.length)];

        const posX = x || (window.innerWidth < 768 ? window.innerWidth * 0.5 : window.innerWidth * 0.35);
        const posY = y || (window.innerHeight * 0.45);

        el.style.left = `${posX + (Math.random() * 60 - 30)}px`;
        el.style.top = `${posY + (Math.random() * 40 - 20)}px`;

        const driftX = (Math.random() * 80 - 40) + 'px';
        const driftX2 = (Math.random() * 120 - 60) + 'px';
        const rot = (Math.random() * 40 - 20) + 'deg';
        const rot2 = (Math.random() * 60 - 30) + 'deg';

        el.style.setProperty('--drift-x', driftX);
        el.style.setProperty('--drift-x2', driftX2);
        el.style.setProperty('--rot', rot);
        el.style.setProperty('--rot2', rot2);

        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    function crearExplosionParticulas(x, y) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => crearNotaFlotante(x, y), i * 60);
        }
    }

    function iniciarCicloParticulas() {
        if (intervaloParticulas) return;
        intervaloParticulas = setInterval(() => {
            if (estaReproduciendo) {
                const vinylRect = vinyl.getBoundingClientRect();
                crearNotaFlotante(
                    vinylRect.left + vinylRect.width / 2,
                    vinylRect.top + vinylRect.height / 2
                );
            }
        }, 1400);
    }

    function detenerCicloParticulas() {
        if (intervaloParticulas) {
            clearInterval(intervaloParticulas);
            intervaloParticulas = null;
        }
    }
});
