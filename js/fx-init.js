// ═══════════════════════════════════════════════════════════════
// FX-INIT.JS — arranque del motor por página
// Cada página activa sólo los módulos que le corresponden,
// detectando qué elementos existen. Un solo archivo para todas.
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    if (typeof FX === 'undefined') return;

    const hay = sel => document.querySelector(sel) !== null;
    const pagina = document.body.className;

    // ── Globales: valen en cualquier página ──
    FX.cursor();
    FX.onda('.nav-card, .btn-entrar, .quest-btn, .isa-btn, .hbtn, .gift-btn, ' +
        '.present-btn, .dcl-btn, .music-btn, .back-btn, .ready-btn, .photo-card');
    FX.progresoLectura();

    // ── Inclinación 3D en todo lo que sea tarjeta ──
    FX.tilt('.nav-card', { max: 11, escala: 1.035, alturaZ: 30 });
    FX.tilt('.card', { max: 6.5, escala: 1.02, alturaZ: 18 });
    FX.tilt('.bn-card', { max: 5.5, escala: 1.015, alturaZ: 14 });
    FX.tilt('.gift-box, .visit-card', { max: 7, escala: 1.02, alturaZ: 16 });
    FX.tilt('.photo-card', { max: 8, escala: 1.03, alturaZ: 20 });

    // ── Botones magnéticos ──
    FX.magnetico('.btn-entrar', { radio: 140, fuerza: .38 });
    FX.magnetico('.music-btn', { radio: 90, fuerza: .45 });
    FX.magnetico('.back-btn', { radio: 80, fuerza: .3 });
    FX.magnetico('.dcl-btn, .gift-btn, .present-btn, .ready-btn', { radio: 100, fuerza: .32 });

    // ── Títulos que entran letra a letra ──
    FX.textoEntra('.hero-title, .bn-title, .dcl-title, .promise-heading, ' +
        '.section-label h2, .winner-title, .isa-title, .canvas-title, .timer-title');

    // ── Adornos flotantes con paralaje ──
    if (hay('.promise-float-heart')) {
        FX.paralaje('.promise-float-heart', { factor: .07 });
    }
    if (hay('.winner-dec-flower') || hay('.winner-dec-heart')) {
        FX.paralaje('.winner-dec-flower, .winner-dec-heart', { factor: .05 });
    }

    // ── Campo de partículas sobre el fondo de cada sección grande ──
    const anfitrion = document.querySelector('.hero') ||
        document.querySelector('.bn-section') ||
        document.querySelector('.dcl-section') ||
        document.querySelector('.promise-section');

    if (anfitrion) {
        // Hereda el acento de la página para que el color case con el tema
        const acento = getComputedStyle(document.body)
            .getPropertyValue('--fx-accent').trim() || '#ffe044';
        FX.particulas(anfitrion, { color: hexARgb(acento) });
    }

    // Los odómetros los montan romantico.js y home.js, que son quienes
    // producen los números. Engancharlos aquí con MutationObserver obligaría
    // a observar mis propias escrituras y entrar en bucle.

    // Al terminar la entrada de los títulos, soltar will-change
    setTimeout(() => {
        document.querySelectorAll('.fx-texto-listo')
            .forEach(el => el.classList.add('fx-texto-frio'));
    }, 3500);

    // ── Utilidades locales ──

    // '#ffe044' → '255,224,68' (lo que espera el canvas de partículas)
    function hexARgb(hex) {
        const h = hex.replace('#', '').trim();
        if (h.length === 3) {
            return [0, 1, 2].map(i => parseInt(h[i] + h[i], 16)).join(',');
        }
        if (h.length === 6) {
            return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)).join(',');
        }
        return '255,224,68';
    }

});

// Crea una cinta de odómetro dentro de un elemento y devuelve la función
// que la actualiza. El número real queda en un nodo aparte para los
// lectores de pantalla: la cinta es decorado y va con aria-hidden.
// La usan romantico.js (reloj) y home.js (visitas).
function fxMontarOdometro(destino) {
    if (typeof FX === 'undefined' || FX.nivel === 0) {
        return txt => { destino.textContent = txt; };
    }
    destino.textContent = '';
    const lector = document.createElement('span');
    lector.className = 'fx-solo-lector';
    const caja = document.createElement('span');
    caja.className = 'fx-odo';
    caja.setAttribute('aria-hidden', 'true');
    destino.append(lector, caja);

    const pintar = FX.odometro(caja);
    return txt => { lector.textContent = txt; pintar(txt); };
}
