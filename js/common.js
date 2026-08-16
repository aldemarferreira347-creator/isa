// ─────────────────────────────────────────
// COMMON.JS — compartido por todas las páginas
// Pétalos con profundidad + scroll-reveal escalonado + transición de página
// + brillo que sigue al cursor + control de música con ecualizador
// ─────────────────────────────────────────

const FX_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {

    // ── Entrada de página ──
    document.body.classList.add('fx-enter');

    // ── Pétalos en 3 capas de profundidad ──
    // Antes: 18 rectángulos idénticos en una sola capa.
    // Ahora: cada pétalo recibe capa, tamaño, deriva y velocidad propios,
    // así el fondo tiene parallax real en vez de una lluvia plana.
    const wrap = document.getElementById('petals');
    if (wrap) {
        const CAPAS = [
            { clase: 'fx-depth-far', cantidad: 14, min: 5, max: 9, dur: [17, 26], op: [.18, .32] },
            { clase: 'fx-depth-mid', cantidad: 10, min: 8, max: 14, dur: [12, 19], op: [.34, .52] },
            { clase: 'fx-depth-near', cantidad: 6, min: 13, max: 21, dur: [8, 13], op: [.55, .78] }
        ];

        const rnd = (a, b) => a + Math.random() * (b - a);

        CAPAS.forEach(capa => {
            // Con movimiento reducido basta un tercio: quedan quietos, sólo decoran
            const total = FX_REDUCED ? Math.ceil(capa.cantidad / 3) : capa.cantidad;

            for (let i = 0; i < total; i++) {
                const p = document.createElement('div');
                p.className = `petal ${capa.clase}`;

                const ancho = rnd(capa.min, capa.max);
                const opacidad = rnd(capa.op[0], capa.op[1]);

                p.style.left = rnd(-4, 102) + 'vw';
                p.style.width = ancho + 'px';
                p.style.height = ancho * rnd(1.3, 1.8) + 'px';
                p.style.setProperty('--fx-petal-op', opacidad.toFixed(2));

                if (FX_REDUCED) {
                    // Sin caída: se reparten por toda la altura y se quedan ahí
                    p.style.top = rnd(2, 92) + 'vh';
                    p.style.setProperty('--fx-still-rot', rnd(-40, 40).toFixed(0) + 'deg');
                } else {
                    p.style.animationDuration = rnd(capa.dur[0], capa.dur[1]) + 's';
                    p.style.animationDelay = -rnd(0, 22) + 's'; // negativo: ya vienen cayendo al cargar
                    p.style.setProperty('--fx-drift-a', rnd(-55, 55).toFixed(0) + 'px');
                    p.style.setProperty('--fx-drift-b', rnd(-70, 70).toFixed(0) + 'px');
                    p.style.setProperty('--fx-drift-c', rnd(-40, 40).toFixed(0) + 'px');
                }

                wrap.appendChild(p);
            }
        });
    }

    // ── Scroll reveal escalonado ──
    // Los hermanos que entran juntos se numeran para que caigan en cascada
    // en vez de aparecer todos de golpe.
    // [data-fx-manual] queda fuera: esa página revela esos elementos por su cuenta
    // (p. ej. el menú del index, que debe esperar a que cierre la bienvenida).
    const revelables = document.querySelectorAll(
        '.reveal:not([data-fx-manual]), .reveal-up:not([data-fx-manual]),' +
        '.reveal-left:not([data-fx-manual]), .reveal-right:not([data-fx-manual]),' +
        '.reveal-zoom:not([data-fx-manual]), .reveal-blur:not([data-fx-manual])'
    );

    if (FX_REDUCED) {
        revelables.forEach(el => el.classList.add('visible'));
    } else {
        // Índice de stagger relativo a los hermanos revelables del mismo padre
        const porPadre = new Map();
        revelables.forEach(el => {
            const padre = el.parentElement;
            const n = porPadre.get(padre) || 0;
            el.style.setProperty('--i', Math.min(n, 8)); // techo: nadie espera más de 8 pasos
            porPadre.set(padre, n + 1);
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

        revelables.forEach(el => observer.observe(el));
    }

    // ── Brillo que sigue al cursor ──
    document.querySelectorAll('.fx-spot').forEach(el => {
        el.addEventListener('pointermove', ev => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100).toFixed(1) + '%');
            el.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100).toFixed(1) + '%');
        });
    });

    // ── Navegación nativa ──
    // Aquí había una cortina que interceptaba cada enlace con preventDefault
    // y navegaba con location.href tras 450 ms. Eso rompe el comportamiento
    // normal del navegador: retrasa cada clic, estropea abrir en pestaña nueva
    // y deja la página fuera del bfcache, así que al volver atrás se recargaba
    // entera y la bienvenida se repetía. Se eliminó a propósito: el historial,
    // el botón atrás y el gesto de deslizar vuelven a funcionar como el sistema
    // manda.
});

// Convierte el <button id="musicBtn"> en pastilla con ecualizador.
// Se hace por JS para no tocar el HTML de ninguna página.
// Devuelve una función que pinta el estado (sonando / en pausa).
// La usan tanto initBgMusic como el secuenciador propio de la-pregunta.
function initMusicButton(musicBtn) {
    if (!musicBtn) return () => { };

    const icono = document.createElement('span');
    icono.className = 'fx-icon';
    icono.textContent = '▶️';

    const eq = document.createElement('span');
    eq.className = 'fx-eq';
    eq.innerHTML = '<i></i><i></i><i></i><i></i>';

    musicBtn.textContent = '';
    musicBtn.append(icono, eq);
    musicBtn.setAttribute('aria-label', 'Reproducir o pausar música');

    return function pintarEstado(sonando) {
        icono.textContent = sonando ? '⏸️' : '▶️';
        musicBtn.classList.toggle('is-playing', sonando);
        musicBtn.setAttribute('aria-pressed', String(sonando));
    };
}

// Conecta el <audio id="bgMusic"> + el botón <button id="musicBtn"> de cada página.
// startSeconds: segundo en el que debe iniciar la canción (igual que en el index original).
function initBgMusic(startSeconds) {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    if (!bgMusic || !musicBtn) return;
    let isPlaying = false;

    const pintar = initMusicButton(musicBtn);
    const pintarEstado = () => pintar(isPlaying);

    function tryAutoplay() {
        bgMusic.currentTime = startSeconds || 0;
        bgMusic.play().then(() => {
            isPlaying = true;
            pintarEstado();
        }).catch(e => console.log('Reproducción automática bloqueada:', e));
    }

    if (bgMusic.readyState >= 1) {
        tryAutoplay();
    } else {
        bgMusic.addEventListener('loadedmetadata', tryAutoplay, { once: true });
    }

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
        } else {
            bgMusic.play().catch(e => console.error('Audio play failed:', e));
        }
        isPlaying = !isPlaying;
        pintarEstado();
    });

    // Si el audio se detiene por fuera (fin de pista, interrupción del SO), sincroniza
    bgMusic.addEventListener('pause', () => { isPlaying = false; pintarEstado(); });
    bgMusic.addEventListener('play', () => { isPlaying = true; pintarEstado(); });

    pintarEstado();
}
