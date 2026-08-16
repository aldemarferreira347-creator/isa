document.addEventListener('DOMContentLoaded', () => {
    // ── Carnations ──
    const carnationSVG = (delay) => {
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        el.setAttribute('viewBox', '0 0 60 110');
        el.classList.add('carnation-svg');
        el.style.animationDelay = delay + 's';
        el.innerHTML = `
            <rect x="28" y="55" width="4" height="55" rx="2" fill="#4a7c3f"/>
            <ellipse cx="22" cy="80" rx="10" ry="5" fill="#5a9e4a" transform="rotate(-30 22 80)"/>
            <ellipse cx="38" cy="90" rx="10" ry="5" fill="#5a9e4a" transform="rotate(30 38 90)"/>
            <ellipse cx="30" cy="35" rx="14" ry="10" fill="#f5c518" opacity="0.9"/>
            <ellipse cx="30" cy="35" rx="14" ry="10" fill="#ffe044" opacity="0.85" transform="rotate(40 30 35)"/>
            <ellipse cx="30" cy="35" rx="14" ry="10" fill="#ffb700" opacity="0.85" transform="rotate(80 30 35)"/>
            <ellipse cx="30" cy="35" rx="14" ry="10" fill="#f5c518" opacity="0.85" transform="rotate(120 30 35)"/>
            <ellipse cx="30" cy="35" rx="14" ry="10" fill="#ffe044" opacity="0.85" transform="rotate(160 30 35)"/>
            <ellipse cx="30" cy="33" rx="9" ry="7" fill="#fff176" opacity="0.95" transform="rotate(20 30 33)"/>
            <ellipse cx="30" cy="33" rx="9" ry="7" fill="#ffe87a" opacity="0.9" transform="rotate(70 30 33)"/>
            <ellipse cx="30" cy="33" rx="9" ry="7" fill="#fff176" opacity="0.9" transform="rotate(120 30 33)"/>
            <circle cx="30" cy="32" r="5" fill="#ffcc00"/>
            <circle cx="30" cy="32" r="3" fill="#fff8dc"/>
        `;
        return el;
    };
    const row = document.getElementById('carnations-row');
    for (let i = 0; i < 14; i++) row.appendChild(carnationSVG((i * 0.3) % 4));

    // ── Girasol: en el index original se dibujaba al terminar el quest de Dedicatoria;
    // aquí, al ser página propia, se dibuja directamente al cargar ──
    drawSunflower();

    // ── Modal close on backdrop ──
    document.getElementById('flowerModal').addEventListener('click', function (e) {
        if (e.target === this) closeFlowerModal();
    });
});

// ─────────────────────────────────────────
// GIFT (flores amarillas) — pregunta + respuesta
// ─────────────────────────────────────────
function giftAnswer(yes) {
    document.getElementById('giftQuestion').style.display = 'none';
    if (yes) {
        document.getElementById('giftYes').style.display = 'block';
    } else {
        document.getElementById('giftNo').style.display = 'block';
    }
}

function openFlowerModal() {
    const modal = document.getElementById('flowerModal');
    const bgMusic = document.getElementById('bgMusic');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof window.startSpecialFlower === 'function') window.startSpecialFlower();

    if (bgMusic) {
        bgMusic.currentTime = 100;
        bgMusic.play().catch(e => console.error('Audio play failed:', e));
        const musicBtn = document.getElementById('musicBtn');
        if (musicBtn) musicBtn.textContent = '⏸️';
    }
}

function closeFlowerModal() {
    const modal = document.getElementById('flowerModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (typeof window.stopSpecialFlower === 'function') window.stopSpecialFlower();
}

// ─────────────────────────────────────────
// GIRASOL — lienzo de la sección
// ─────────────────────────────────────────
// Antes: 220 círculos y elipses planos pintados por setTimeout cada 10 ms, sin
// escalar por densidad de píxeles (borroso en pantallas retina) y sin nada de
// vida una vez terminado. Ahora crece con una curva de tiempo real, tiene
// volumen, luz propia y se mece con polen flotando. El disco sigue usando
// filotaxis de 137,5° como antes, pero cada semilla se ilumina según su
// posición, así que el centro tiene relieve en lugar de ser un mosaico plano.
function drawSunflower() {
    const canvas = document.getElementById('sunflowerCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- resolución real ----
    const LADO = 600;                       // sistema de coordenadas lógico
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(LADO * dpr);
    canvas.height = Math.round(LADO * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = LADO / 2;
    const cy = LADO * 0.40;                 // deja sitio abajo para el tallo
    const PHI = 137.508 * Math.PI / 180;

    // ---- siembra ----
    const N_SEM = 340;                      // semillas del disco
    const semillas = [];
    for (let i = 0; i < N_SEM; i++) {
        const r = 4.3 * Math.sqrt(i);
        const th = i * PHI;
        semillas.push({
            x: Math.cos(th) * r,
            y: Math.sin(th) * r,
            r: 2.2 + (i / N_SEM) * 2.4,
            t: i / N_SEM,
            j: Math.random()
        });
    }
    const R_DISCO = 4.3 * Math.sqrt(N_SEM - 1);

    const N_EXT = 19, N_INT = 15;
    const petalos = [];
    for (let f = 0; f < 2; f++) {
        const n = f === 0 ? N_EXT : N_INT;
        for (let k = 0; k < n; k++) {
            petalos.push({
                ang: (k / n) * Math.PI * 2 + (f ? Math.PI / n : 0),
                fila: f,
                largo: (f ? 74 : 96) * (0.93 + Math.random() * 0.14),
                ancho: (f ? 19 : 24) * (0.9 + Math.random() * 0.2),
                giro: (Math.random() - 0.5) * 0.15,
                tono: Math.random(),
                fase: Math.random() * Math.PI * 2,
                retardo: (k / n) * 0.34 + f * 0.10
            });
        }
    }

    const polen = [];
    for (let i = 0; i < 44; i++) {
        polen.push({
            a: Math.random() * Math.PI * 2,
            d: R_DISCO * (0.2 + Math.random() * 0.95),
            y: Math.random() * -110,
            v: 0.10 + Math.random() * 0.30,
            s: 0.6 + Math.random() * 1.8,
            f: Math.random() * Math.PI * 2,
            // la bocanada hace que salgan a rachas y no en un goteo constante
            r: Math.random()
        });
    }

    const salida = (t) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);

    // ---- piezas ----
    function tallo(p, sway) {
        if (p <= 0) return;
        const y0 = cy + R_DISCO * 0.55;
        const alto = 250 * p;
        const g = ctx.createLinearGradient(cx - 11, 0, cx + 11, 0);
        g.addColorStop(0, '#20430f');
        g.addColorStop(0.42, '#4a7c3f');
        g.addColorStop(0.62, '#63a052');
        g.addColorStop(1, '#1d3c0d');
        ctx.strokeStyle = g;
        ctx.lineWidth = 17;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx + sway * 0.15, y0);
        ctx.quadraticCurveTo(cx - sway * 0.8, y0 + alto * 0.55, cx + sway * 0.25, y0 + alto);
        ctx.stroke();

        // dos hojas que se despliegan con el tallo
        const hojas = [[-1, 0.42, 0.52], [1, 0.68, 0.42]];
        for (let i = 0; i < hojas.length; i++) {   // i da la fase del temblor
            const lado = hojas[i][0], en = hojas[i][1], esc = hojas[i][2];
            const ph = (p - en * 0.6) / (1 - en * 0.6);
            if (ph <= 0) continue;
            const k = salida(ph) * esc;
            ctx.save();
            ctx.translate(cx + sway * 0.2 * (1 - en), y0 + alto * en);
            // la hoja tiembla con retardo respecto del tallo, como en la realidad
            ctx.rotate(lado * (0.55 + sway * 0.006) + Math.sin(sway * 0.35 + i * 2.1) * 0.05);
            ctx.scale(k * lado, k);
            const hg = ctx.createLinearGradient(0, -30, 150, 30);
            hg.addColorStop(0, '#63a052');
            hg.addColorStop(0.55, '#3f7a30');
            hg.addColorStop(1, '#1e4211');
            ctx.fillStyle = hg;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(60, -58, 130, -34, 158, 0);
            ctx.bezierCurveTo(130, 34, 60, 58, 0, 0);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,.22)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(4, 0);
            ctx.quadraticCurveTo(80, 3, 150, 0);
            ctx.stroke();
            ctx.restore();
        }
    }

    function unPetalo(pt, p, brillo, t, amp) {
        const k = salida((p - pt.retardo) / (1 - pt.retardo));
        if (k <= 0) return;
        // cada pétalo aletea con su propia fase: sin esto la corola es un
        // bloque rígido por muy bien dibujada que esté
        const aleteo = Math.sin(t * 1.45 + pt.fase) * 0.030 * amp;
        const respira = 1 + Math.sin(t * 1.05 + pt.fase * 0.7) * 0.022 * amp;
        ctx.save();
        ctx.rotate(pt.ang + pt.giro * k + aleteo);
        ctx.scale(k * respira, k * respira);
        const R0 = R_DISCO * 0.55;
        const L = pt.largo, A = pt.ancho, t0 = pt.tono;
        // el gradiente corre a lo largo: base ámbar, punta casi blanca
        const g = ctx.createLinearGradient(R0, 0, R0 + L, 0);
        g.addColorStop(0, pt.fila ? '#b07d06' : '#c98d08');
        g.addColorStop(0.35, 'rgb(' + (230 + t0 * 20 | 0) + ',' + (170 + t0 * 30 | 0) + ',' + (20 + t0 * 20 | 0) + ')');
        g.addColorStop(0.75, 'rgb(255,' + (215 + t0 * 25 | 0) + ',' + (70 + t0 * 40 | 0) + ')');
        g.addColorStop(1, '#fff3b8');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(R0, 0);
        ctx.bezierCurveTo(R0 + L * 0.16, -A, R0 + L * 0.74, -A * 0.82, R0 + L, 0);
        ctx.bezierCurveTo(R0 + L * 0.74, A * 0.82, R0 + L * 0.16, A, R0, 0);
        ctx.fill();
        // pliegue en sombra: es lo que le da volumen al pétalo
        ctx.globalAlpha = 0.20;
        ctx.fillStyle = '#7a4d00';
        ctx.beginPath();
        ctx.moveTo(R0, 0);
        ctx.bezierCurveTo(R0 + L * 0.16, A * 0.5, R0 + L * 0.74, A * 0.42, R0 + L, 0);
        ctx.lineTo(R0, 0);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(150,95,0,.28)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(R0 + L * 0.08, 0);
        ctx.lineTo(R0 + L * 0.9, 0);
        ctx.stroke();
        // reflejo que recorre el pétalo
        if (brillo > 0.01) {
            ctx.globalAlpha = brillo * 0.45;
            ctx.fillStyle = '#fffbe6';
            ctx.beginPath();
            ctx.ellipse(R0 + L * 0.55, -A * 0.20, L * 0.21, A * 0.19, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        ctx.restore();
    }

    function disco(p) {
        const k = salida((p - 0.25) / 0.75);
        if (k <= 0) return;
        const R = R_DISCO * k;
        // base del disco, más oscura hacia el borde
        const bg = ctx.createRadialGradient(-R * 0.25, -R * 0.25, 0, 0, 0, R);
        bg.addColorStop(0, '#7a4f20');
        bg.addColorStop(0.55, '#4a2f12');
        bg.addColorStop(1, '#241505');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < N_SEM; i++) {
            const s = semillas[i];
            const ks = salida((p - 0.25 - s.t * 0.40) / 0.40);
            if (ks <= 0) continue;
            const x = s.x * k, y = s.y * k, r = s.r * ks;
            // iluminación desde arriba-izquierda
            const luz = Math.max(0, Math.min(1, 0.5 + (-s.x - s.y) / (R_DISCO * 1.7)));
            const base = 26 + luz * 60 + s.j * 14;
            ctx.fillStyle = 'rgb(' + (base + 24 | 0) + ',' + (base * 0.66 | 0) + ',' + (base * 0.30 | 0) + ')';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,236,190,' + (0.08 + luz * 0.18).toFixed(3) + ')';
            ctx.beginPath();
            ctx.arc(x - r * 0.32, y - r * 0.32, r * 0.34, 0, Math.PI * 2);
            ctx.fill();
        }

        // corona de flósculos amarillos justo en el borde del disco
        ctx.globalAlpha = k;
        for (let i = 0; i < 64; i++) {
            const a = (i / 64) * Math.PI * 2;
            const rr = R * (0.945 + (i % 3) * 0.018);
            ctx.fillStyle = i % 2 ? 'rgba(255,206,60,.85)' : 'rgba(226,166,26,.80)';
            ctx.beginPath();
            ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function halo(p, pulso) {
        if (p <= 0) return;
        const R = R_DISCO * 4.2;
        const a = 0.19 * p * (0.85 + pulso * 0.15);
        const g = ctx.createRadialGradient(0, 0, R_DISCO * 0.6, 0, 0, R);
        g.addColorStop(0, 'rgba(255,208,70,' + a.toFixed(3) + ')');
        g.addColorStop(0.45, 'rgba(255,170,30,' + (a * 0.34).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(255,150,20,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.fill();
    }

    function motas(p, t) {
        if (p < 0.75) return;
        ctx.globalCompositeOperation = 'lighter';
        // racha global: cada ~7 s el viento arranca una bocanada de polen
        const racha = 0.45 + 0.55 * Math.pow(Math.max(0, Math.sin(t * 0.45)), 3);
        for (let i = 0; i < polen.length; i++) {
            const m = polen[i];
            m.y -= m.v * (0.6 + racha * 1.1);
            if (m.y < -170) { m.y = 14; m.a = Math.random() * Math.PI * 2; }
            const x = Math.cos(m.a) * m.d + Math.sin(t * 0.9 + m.f) * (9 + racha * 7);
            const y = Math.sin(m.a) * m.d * 0.5 + m.y;
            const al = Math.max(0, 1 - Math.abs(m.y) / 170) *
                       (0.45 + 0.55 * Math.abs(Math.sin(t * 1.6 + m.f))) *
                       (0.35 + m.r * 0.65 * racha + 0.35);
            const g = ctx.createRadialGradient(x, y, 0, x, y, m.s * 4);
            g.addColorStop(0, 'rgba(255,238,170,' + (0.85 * al).toFixed(3) + ')');
            g.addColorStop(1, 'rgba(255,200,60,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, m.s * 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    // Rayos de luz que giran despacio detrás de la corola. Es lo que hace que
    // la flor parezca estar emitiendo luz en vez de estar iluminada.
    function rayos(p, t) {
        if (p <= 0) return;
        const R = R_DISCO * 4.6;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.rotate(t * 0.055);
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            const pul = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.7 + i * 1.31));
            const anc = 0.055 + 0.03 * Math.sin(t * 0.9 + i);
            const g = ctx.createLinearGradient(0, 0, Math.cos(a) * R, Math.sin(a) * R);
            g.addColorStop(0, 'rgba(255,214,96,' + (0.085 * p * pul).toFixed(3) + ')');
            g.addColorStop(1, 'rgba(255,180,40,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, R, a - anc, a + anc);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }

    // Destellos que recorren el disco: pequeñas semillas que se encienden al
    // pasar una onda por encima.
    function glints(p, t) {
        if (p < 0.6) return;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const onda = (t * 0.42) % 2 - 0.5;      // barre el disco de lado a lado
        for (let i = 0; i < N_SEM; i += 3) {
            const s = semillas[i];
            const d = Math.abs((s.x / R_DISCO) - onda);
            const e = Math.exp(-d * d * 26) * (0.45 + 0.55 * Math.sin(t * 3 + s.j * 30));
            if (e < 0.05) continue;
            const r = s.r * (1.4 + e);
            const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 2.6);
            g.addColorStop(0, 'rgba(255,244,196,' + (0.85 * e).toFixed(3) + ')');
            g.addColorStop(1, 'rgba(255,200,80,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(s.x, s.y, r * 2.6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // ---- bucle ----
    const DUR = 3.4;                        // segundos de crecimiento
    let t0 = null;
    let raf = null;

    function pintar(ts) {
        if (t0 === null) t0 = ts;
        const t = (ts - t0) / 1000;
        const p = Math.min(1, t / (reduce ? DUR * 0.45 : DUR));
        const vivo = Math.max(0, (p - 0.85) / 0.15);
        // El modo de movimiento reducido baja la amplitud, no la apaga: una flor
        // completamente inmóvil parecía un PNG y no era lo que se pedía.
        const amp = reduce ? 0.30 : 1;

        // viento: dos senos desfasados en vez de uno, para que el vaivén no se
        // note periódico
        const brisa = (Math.sin(t * 0.62) * 0.72 + Math.sin(t * 0.27 + 1.9) * 0.38);
        const sway = brisa * 8 * vivo * amp;
        const pulso = (Math.sin(t * 1.25) * 0.5 + 0.5);
        // heliotropismo: la cabeza busca la luz muy despacio
        const giroCabeza = Math.sin(t * 0.21) * 0.055 * vivo * amp;

        ctx.clearRect(0, 0, LADO, LADO);
        tallo(salida(Math.min(1, p / 0.55)), sway);

        ctx.save();
        ctx.translate(cx + sway, cy + Math.sin(t * 0.5) * 3.2 * vivo * amp);
        ctx.rotate(sway * 0.0018 + giroCabeza);
        rayos(salida(Math.min(1, p / 0.75)) * (0.6 + pulso * 0.4), t);
        halo(salida(Math.min(1, p / 0.7)), pulso);
        const pp = Math.min(1, p / 0.92);
        // primero la corona exterior, luego la interior encima
        for (let f = 0; f < 2; f++) {
            for (let i = 0; i < petalos.length; i++) {
                if (petalos[i].fila !== f) continue;
                const brillo = Math.max(0, Math.sin(t * 1.1 + petalos[i].fase)) * vivo * amp;
                unPetalo(petalos[i], pp, brillo, t, vivo * amp);
            }
        }
        disco(p);
        glints(p, t);
        motas(p, t);
        ctx.restore();

        raf = requestAnimationFrame(pintar);
    }

    // sólo anima mientras el girasol está a la vista
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (ents) {
            for (let i = 0; i < ents.length; i++) {
                if (ents[i].isIntersecting) {
                    if (raf === null) raf = requestAnimationFrame(pintar);
                } else if (raf !== null) {
                    cancelAnimationFrame(raf);
                    raf = null;
                }
            }
        }, { threshold: 0.05 });
        io.observe(canvas);
    } else {
        raf = requestAnimationFrame(pintar);
    }
}

// ─────────────────────────────────────────
// ESCENA DEL MODAL — jardín nocturno
// ─────────────────────────────────────────
// Segunda pasada, centrada en coste. La versión anterior se veía bien pero
// hundía el rendimiento incluso en equipos buenos, por dos motivos concretos:
//
//   1. `ctx.filter = 'blur(Npx)'` tres veces por fotograma sobre el lienzo
//      entero (hierba de primer plano y las dos composiciones de resplandor).
//      El desenfoque de Canvas 2D no está acelerado: a 1000×1760 px reales eso
//      solo ya cuesta decenas de milisegundos.
//   2. ~600 objetos de degradado creados en cada fotograma (uno por pétalo, uno
//      por brizna de hierba, uno por semilla del disco...).
//
// Ahora: cero `filter`. El desenfoque sale de dibujar en búferes pequeños y
// devolverlos escalados — el filtrado bilineal de la GPU hace el trabajo gratis.
// Y todos los degradados se construyen una vez en espacio normalizado (0..1) y
// se reutilizan, escalando el contexto en lugar de rehacerlos.
//
// Además los pétalos ya no se funden entre sí: llevan un canto oscuro, la punta
// pálida se ha recortado y las longitudes varían más.
(function () {
    const canvas = document.getElementById('flowerAnimationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animFrameId = null;
    let W = 0, H = 0, groundY = 0, dpr = 1;
    let flores, clavelinas, floresFondo, estrellas, luciernagas, briznas,
        briznasFrente, polen, nubes;
    let cielo = null;
    let bufGlowA = null, gA = null;      // resplandor a 1/4
    let bufGlowB = null, gB = null;      // reducción a 1/8 → halo ancho
    let bufFrente = null, gF = null;     // primer plano a 1/2

    // calidad adaptativa: se mide el fotograma real y se recorta si hace falta
    let calidad = 2;                     // 2 completo · 1 sin halo ancho · 0 mínimo
    let acumMs = 0, acumN = 0, ignorar = 0;

    const lim = (v, a, b) => Math.max(a, Math.min(b, v));
    const suave = t => { t = lim(t, 0, 1); return t * t * (3 - 2 * t); };
    const salida = t => 1 - Math.pow(1 - lim(t, 0, 1), 3);
    const rebote = t => {
        t = lim(t, 0, 1);
        const c = 1.35, c3 = c + 1, m = t - 1;
        return 1 + c3 * m * m * m + c * m * m;
    };

    const FASES = {
        cielo: 1.4, luna: 1.2, suelo: 0.9, tallos: 2.2, hojas: 1.2,
        petalos: 2.2, clavel: 1.8, hierba: 1.6, luces: 1.4, texto: 1.8
    };
    const inicio = {};
    let _a = 0;
    Object.keys(FASES).forEach(k => { inicio[k] = _a; _a += FASES[k]; });
    const faseT = (n, t) => lim((t - inicio[n]) / FASES[n], 0, 1);

    let LUNA = { x: 0, y: 0, r: 0 };
    let LUZ = { x: 0.55, y: -0.83 };

    function viento(t, x, prof) {
        const r = Math.sin(t * 0.55 + x * 0.010) * 0.62
                + Math.sin(t * 1.23 + x * 0.021 + 1.7) * 0.26
                + Math.sin(t * 2.10 + x * 0.037 + 4.1) * 0.12;
        const rafaga = 0.55 + 0.45 * Math.sin(t * 0.21 + x * 0.004);
        return r * rafaga * prof;
    }

    // ============================================== DEGRADADOS EN CACHÉ
    // Todos viven en espacio normalizado y se reutilizan siempre: el contexto se
    // escala al tamaño que toque en vez de fabricar un degradado nuevo.
    const N_LUZ = 12;                                  // cubos de iluminación
    // Un girasol de verdad ronda las 30-40 lígulas. Con 20 + 14 la corona se
    // leía rala y se veía el disco entre pétalo y pétalo.
    const N_EXT = 27, N_INT = 19;                      // pétalos por corona
    let gradHoja = null, gradClavel = null, gradHierba = null;
    let petSprite = null;          // [fila][cuboLuz] → calcomanía de pétalo
    const PET_W = 220, PET_H = 96; // resolución del horneado

    // Silueta: estrecha en la base, vientre a dos tercios, punta redondeada con
    // una muesca. Ligeramente asimétrica para que no parezca troquelada.
    function trazarPetalo(x, w, h, curva) {
        const cy = h * 0.5;
        x.beginPath();
        x.moveTo(0, cy);
        x.bezierCurveTo(w * 0.14, cy - h * 0.30 * curva,
                        w * 0.52, cy - h * 0.48,
                        w * 0.80, cy - h * 0.30);
        x.quadraticCurveTo(w * 0.97, cy - h * 0.16, w, cy - h * 0.015);
        x.quadraticCurveTo(w * 0.965, cy, w, cy + h * 0.015);
        x.quadraticCurveTo(w * 0.97, cy + h * 0.16, w * 0.80, cy + h * 0.31);
        x.bezierCurveTo(w * 0.52, cy + h * 0.47,
                        w * 0.14, cy + h * 0.29 * curva,
                        0, cy);
        x.closePath();
    }

    function hornearPetalos() {
        petSprite = [[], []];
        for (let fila = 0; fila < 2; fila++) {
            for (let i = 0; i < N_LUZ; i++) {
                const luz = i / (N_LUZ - 1);
                const c = document.createElement('canvas');
                c.width = PET_W; c.height = PET_H;
                const x = c.getContext('2d');
                const w = PET_W, h = PET_H, cy = h * 0.5;
                // la fila interior es más corta y algo más oscura
                const som = fila ? 0.86 : 1;

                // relleno principal: ámbar en la base, amarillo pleno en medio,
                // punta pálida — el degradado va a lo largo
                const g = x.createLinearGradient(0, 0, w, 0);
                g.addColorStop(0,    'rgb(' + ((70 + luz * 52) * som | 0) + ',' + ((44 + luz * 44) * som | 0) + ',' + ((3 + luz * 9) * som | 0) + ')');
                g.addColorStop(0.14, 'rgb(' + ((132 + luz * 60) * som | 0) + ',' + ((94 + luz * 62) * som | 0) + ',' + ((8 + luz * 20) * som | 0) + ')');
                g.addColorStop(0.42, 'rgb(' + ((214 + luz * 41) * som | 0) + ',' + ((166 + luz * 62) * som | 0) + ',' + ((28 + luz * 44) * som | 0) + ')');
                g.addColorStop(0.76, 'rgb(' + ((246 + luz * 9) * som | 0) + ',' + ((204 + luz * 38) * som | 0) + ',' + ((66 + luz * 60) * som | 0) + ')');
                g.addColorStop(1,    'rgb(' + (252 * som | 0) + ',' + ((226 + luz * 20) * som | 0) + ',' + ((136 + luz * 48) * som | 0) + ')');
                x.fillStyle = g;
                trazarPetalo(x, w, h, 1);
                x.fill();

                // ── Volumen del pétalo, en dos capas ──────────────────────
                // Antes había UNA sola: sombra fija en la mitad de abajo y
                // reflejo fijo en la de arriba. Como el sprite se rota por el
                // ángulo del pétalo, esa sombra giraba con él y daba la vuelta
                // a la flor: un molinillo en el que ninguna cara obedecía a la
                // luz. De ahí que los pétalos no orientaran a nada.
                //
                // Ahora se separan las dos cosas que de verdad ocurren:
                //   · el CANAL — el pétalo está plegado por su nervio, así que
                //     hunde el centro y levanta los dos bordes. Es simétrico y
                //     es del pétalo, no de la luz: no depende del ángulo.
                //   · el LATERAL — de las dos mitades del pliegue, una mira a
                //     la luz y la otra se esconde. Eso sí depende del ángulo.
                //
                // Y hay una relación que lo hace barato: el eje del pétalo y la
                // luz son unitarios, luego |cruz| = √(1 − dot²). El mismo cubo
                // que ya guarda el brillo general determina cuánta asimetría
                // toca; sólo falta saber de qué lado, y eso se resuelve al
                // dibujar volteando el sprite. Al ser cero la asimetría justo
                // donde cambia el lado, el volteo no deja costura.
                const dotL = lim((luz - 0.30) / 0.70, -1, 1);
                const lateral = Math.sqrt(Math.max(0, 1 - dotL * dotL));

                x.save();
                trazarPetalo(x, w, h, 1);
                x.clip();

                // canal: hundido en el nervio, claro hacia ambos cantos
                const gc = x.createLinearGradient(0, 0, 0, h);
                gc.addColorStop(0, 'rgba(255,244,198,0.17)');
                gc.addColorStop(0.34, 'rgba(120,72,0,0.10)');
                gc.addColorStop(0.5, 'rgba(104,60,0,0.22)');
                gc.addColorStop(0.66, 'rgba(120,72,0,0.10)');
                gc.addColorStop(1, 'rgba(255,244,198,0.17)');
                x.fillStyle = gc;
                x.fillRect(0, 0, w, h);

                // lateral: la mitad de abajo se esconde de la luz, la de arriba
                // la recibe. Su fuerza cae a cero cuando el pétalo apunta a la
                // luz o le da la espalda, que es cuando no hay lado que valga.
                const som2 = (0.46 * lateral).toFixed(3);
                const som1 = (0.20 * lateral).toFixed(3);
                const gs = x.createLinearGradient(0, cy, 0, h);
                gs.addColorStop(0, 'rgba(92,54,0,0)');
                gs.addColorStop(0.45, 'rgba(92,54,0,' + som1 + ')');
                gs.addColorStop(1, 'rgba(64,36,0,' + som2 + ')');
                x.fillStyle = gs;
                x.fillRect(0, cy, w, h - cy);

                const gh = x.createLinearGradient(0, 0, 0, cy);
                gh.addColorStop(0, 'rgba(255,246,206,' + (0.30 * lateral).toFixed(3) + ')');
                gh.addColorStop(1, 'rgba(255,246,206,0)');
                x.fillStyle = gh;
                x.fillRect(0, 0, w, cy);

                // nervio central
                x.strokeStyle = 'rgba(150,96,0,0.34)';
                x.lineWidth = 1.6;
                x.beginPath();
                x.moveTo(w * 0.05, cy);
                x.quadraticCurveTo(w * 0.55, cy + 1, w * 0.93, cy);
                x.stroke();
                // nervios secundarios
                x.strokeStyle = 'rgba(150,96,0,0.17)';
                x.lineWidth = 1;
                for (let v = 0; v < 4; v++) {
                    const px = w * (0.20 + v * 0.19);
                    for (let sgn = -1; sgn <= 1; sgn += 2) {
                        x.beginPath();
                        x.moveTo(px, cy);
                        x.quadraticCurveTo(px + w * 0.10, cy + sgn * h * 0.13,
                                           px + w * 0.15, cy + sgn * h * 0.20);
                        x.stroke();
                    }
                }
                // sombra en el arranque: separa el pétalo del disco
                const gb = x.createLinearGradient(0, 0, w * 0.22, 0);
                gb.addColorStop(0, 'rgba(46,26,0,0.70)');
                gb.addColorStop(1, 'rgba(46,26,0,0)');
                x.fillStyle = gb;
                x.fillRect(0, 0, w * 0.22, h);
                x.restore();

                // canto: apenas una insinuación, no una línea de tebeo
                x.strokeStyle = 'rgba(118,72,0,0.30)';
                x.lineWidth = 1.4;
                trazarPetalo(x, w, h, 1);
                x.stroke();

                petSprite[fila].push(c);
            }
        }
    }

    function construirGradientes() {
        gradHoja = [];
        for (let i = 0; i < N_LUZ; i++) {
            const luz = i / (N_LUZ - 1);
            const g = ctx.createLinearGradient(0, -0.35, 1, 0.35);
            g.addColorStop(0,    'rgb(' + (52 + luz * 62 | 0) + ',' + (104 + luz * 74 | 0) + ',' + (28 + luz * 34 | 0) + ')');
            g.addColorStop(0.62, 'rgb(' + (36 + luz * 40 | 0) + ',' + (78 + luz * 48 | 0) + ',' + (20 + luz * 22 | 0) + ')');
            g.addColorStop(1,    '#12300a');
            gradHoja.push(g);
        }
        gradClavel = [];
        for (let i = 0; i < N_LUZ; i++) {
            const m = 0.55 + (i / (N_LUZ - 1)) * 0.45;
            const g = ctx.createLinearGradient(0, 0, 0, -1);
            g.addColorStop(0,    'rgb(' + (196 * m | 0) + ',' + (146 * m | 0) + ',' + (8 * m | 0) + ')');
            g.addColorStop(0.55, 'rgb(' + (255 * m | 0) + ',' + (210 * m | 0) + ',' + (38 * m | 0) + ')');
            g.addColorStop(1,    'rgb(' + (255 * m | 0) + ',' + (240 * m | 0) + ',' + (150 * m | 0) + ')');
            gradClavel.push(g);
        }
        gradHierba = [];
        for (let i = 0; i < 8; i++) {
            const tono = 96 + (i / 7) * 38, luzz = 16 + (i / 7) * 22;
            const g = ctx.createLinearGradient(0, 0, 0, -1);
            g.addColorStop(0,    'hsl(' + tono + ',60%,' + (luzz * 0.5) + '%)');
            g.addColorStop(0.55, 'hsl(' + tono + ',64%,' + luzz + '%)');
            g.addColorStop(1,    'hsl(' + (tono + 8) + ',70%,' + (luzz + 16) + '%)');
            gradHierba.push(g);
        }
    }
    const cuboLuz = v => lim(Math.round(v * (N_LUZ - 1)), 0, N_LUZ - 1);

    // Un halo radial se dibujaba con createRadialGradient una vez por luciérnaga
    // y por flor, en cada fotograma. Se sustituye por dos calcomanías creadas
    // una sola vez que sólo hay que estampar.
    let halOro = null, halVerde = null;
    function halo(rgb) {
        const L = 128;
        const c = document.createElement('canvas');
        c.width = c.height = L;
        const x = c.getContext('2d');
        const g = x.createRadialGradient(L / 2, L / 2, 0, L / 2, L / 2, L / 2);
        g.addColorStop(0, 'rgba(' + rgb + ',1)');
        g.addColorStop(0.32, 'rgba(' + rgb + ',0.34)');
        g.addColorStop(1, 'rgba(' + rgb + ',0)');
        x.fillStyle = g;
        x.fillRect(0, 0, L, L);
        return c;
    }
    function estampa(cx, ctxDest, x, y, r, alfa) {
        if (alfa <= 0.002) return;
        ctxDest.globalAlpha = alfa;
        ctxDest.drawImage(cx, x - r, y - r, r * 2, r * 2);
        ctxDest.globalAlpha = 1;
    }

    // ============================================== MEDIDA
    function medir() {
        const caja = canvas.getBoundingClientRect();
        const cw = Math.max(280, Math.round(caja.width || 480));
        const ch = Math.max(360, Math.round(caja.height || 820));
        // 1.5 basta de sobra para una escena de degradados suaves y cuesta un
        // 44% menos de píxeles que 2
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        W = cw; H = ch;
        groundY = H * 0.845;
    }

    function crearBuf(escala) {
        const c = document.createElement('canvas');
        c.width = Math.max(2, Math.round(W * escala));
        c.height = Math.max(2, Math.round(H * escala));
        return c;
    }

    function initData() {
        medir();
        construirGradientes();
        hornearPetalos();

        LUNA = { x: W * 0.80, y: H * 0.165, r: Math.max(20, W * 0.055) };
        const lx = LUNA.x - W * 0.5, ly = LUNA.y - groundY * 0.55;
        const ll = Math.hypot(lx, ly) || 1;
        LUZ = { x: lx / ll, y: ly / ll };

        floresFondo = [
            { x: W * 0.13, alto: H * 0.30, esc: 0.44, prof: 0.30, incl: -0.55, sem: 0.11 },
            { x: W * 0.42, alto: H * 0.34, esc: 0.40, prof: 0.26, incl: 0.30, sem: 0.62 },
            { x: W * 0.68, alto: H * 0.28, esc: 0.46, prof: 0.32, incl: 0.62, sem: 0.37 },
            { x: W * 0.90, alto: H * 0.32, esc: 0.42, prof: 0.28, incl: -0.20, sem: 0.84 }
        ];
        flores = [
            { x: W * 0.50, alto: H * 0.545, esc: 1.15, prof: 1.00, incl: -0.10, sem: 0.20, retardo: 0.00 },
            { x: W * 0.215, alto: H * 0.435, esc: 0.90, prof: 0.86, incl: -0.42, sem: 0.55, retardo: 0.12 },
            { x: W * 0.795, alto: H * 0.400, esc: 0.84, prof: 0.82, incl: 0.46, sem: 0.78, retardo: 0.22 }
        ];
        clavelinas = [
            { x: W * 0.075, alto: H * 0.255, esc: 0.80, prof: 0.72, incl: -0.30, retardo: 0.00, sem: 0.31 },
            { x: W * 0.930, alto: H * 0.230, esc: 0.74, prof: 0.70, incl: 0.34, retardo: 0.14, sem: 0.66 },
            { x: W * 0.355, alto: H * 0.185, esc: 0.60, prof: 0.62, incl: -0.12, retardo: 0.28, sem: 0.09 },
            { x: W * 0.640, alto: H * 0.170, esc: 0.56, prof: 0.60, incl: 0.16, retardo: 0.40, sem: 0.93 },
            { x: W * 0.500, alto: H * 0.140, esc: 0.48, prof: 0.55, incl: 0.05, retardo: 0.52, sem: 0.47 }
        ];
        flores.forEach(f => { f.disco = null; f.semDisco = null; });
        floresFondo.forEach(f => { f.sprite = null; });
        clavelinas.forEach(c => { c.cabeza = null; });

        estrellas = [];
        const nEst = reduce ? 70 : 130;
        for (let i = 0; i < nEst; i++) {
            const m = Math.pow(Math.random(), 2.6);
            estrellas.push({
                x: Math.random() * W, y: Math.random() * groundY * 0.80,
                r: 0.35 + m * 1.7, b: 0.20 + m * 0.80,
                f: Math.random() * Math.PI * 2, v: 0.7 + Math.random() * 2.0,
                t: Math.random(), pua: m > 0.72
            });
        }
        nubes = [
            { y: H * 0.10, v: 0.0045, a: 0.055, e: 1.7 },
            { y: H * 0.24, v: 0.0028, a: 0.042, e: 2.4 }
        ];

        luciernagas = [];
        const nLuc = reduce ? 9 : 18;
        for (let i = 0; i < nLuc; i++) {
            const prof = 0.35 + Math.random() * 0.9;
            luciernagas.push({
                x: Math.random() * W, y: groundY * (0.18 + Math.random() * 0.74),
                vx: (Math.random() - 0.5) * 0.30, vy: (Math.random() - 0.5) * 0.22,
                f: Math.random() * Math.PI * 2, r: (0.9 + Math.random() * 1.5) * prof,
                prof, estela: []
            });
        }
        polen = [];
        for (let i = 0; i < (reduce ? 10 : 22); i++) {
            polen.push({
                x: Math.random() * W, y: groundY * (0.25 + Math.random() * 0.75),
                v: 0.10 + Math.random() * 0.30, s: 0.5 + Math.random() * 1.3,
                f: Math.random() * Math.PI * 2, a: 0.12 + Math.random() * 0.3
            });
        }

        briznas = [];
        for (let i = 0; i < (reduce ? 70 : 118); i++) {
            const prof = 0.55 + Math.random() * 0.5;
            briznas.push({
                x: Math.random() * W, prof,
                h: (H * 0.030 + Math.random() * H * 0.055) * prof,
                incl: (Math.random() - 0.5) * 0.55,
                w: (1 + Math.random() * 2.2) * prof,
                g: (Math.random() * 8) | 0,
                retardo: Math.random() * 0.6
            });
        }
        briznasFrente = [];
        for (let i = 0; i < (reduce ? 14 : 26); i++) {
            briznasFrente.push({
                x: Math.random() * W,
                h: H * 0.075 + Math.random() * H * 0.075,
                incl: (Math.random() - 0.5) * 0.6,
                w: 2.5 + Math.random() * 4.5,
                retardo: Math.random() * 0.5
            });
        }

        cielo = null;
        halOro = halo('255,196,70');
        halVerde = halo('178,255,110');
        bufGlowA = crearBuf(0.25); gA = bufGlowA.getContext('2d');
        bufGlowB = crearBuf(0.125); gB = bufGlowB.getContext('2d');
        bufFrente = crearBuf(0.5); gF = bufFrente.getContext('2d');
        calidad = 2; acumMs = 0; acumN = 0; ignorar = 0;
        startTime = null;
    }

    // ============================================== FONDO EN CACHÉ
    function pintarCielo() {
        const c = document.createElement('canvas');
        c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
        const x = c.getContext('2d');
        x.setTransform(dpr, 0, 0, dpr, 0, 0);

        const g = x.createLinearGradient(0, 0, 0, groundY);
        g.addColorStop(0, '#01040e');
        g.addColorStop(0.34, '#040a1b');
        g.addColorStop(0.68, '#08132a');
        g.addColorStop(1, '#0e2036');
        x.fillStyle = g;
        x.fillRect(0, 0, W, groundY + 2);

        x.save();
        x.translate(W * 0.5, groundY * 0.42);
        x.rotate(-0.5);
        for (let i = 0; i < 3; i++) {
            const anc = W * (0.30 + i * 0.22);
            const gv = x.createLinearGradient(0, -anc, 0, anc);
            gv.addColorStop(0, 'rgba(90,110,190,0)');
            gv.addColorStop(0.5, 'rgba(96,116,196,' + (0.050 - i * 0.013).toFixed(3) + ')');
            gv.addColorStop(1, 'rgba(90,110,190,0)');
            x.fillStyle = gv;
            x.fillRect(-W, -anc, W * 2, anc * 2);
        }
        x.restore();

        for (let i = 0; i < 520; i++) {
            const px = Math.random() * W, py = Math.random() * groundY * 0.9;
            x.fillStyle = 'rgba(200,215,255,' + (0.03 + Math.random() * 0.10).toFixed(3) + ')';
            x.fillRect(px, py, 1, 1);
        }

        x.beginPath();
        x.moveTo(0, groundY);
        const base = groundY - H * 0.055;
        x.lineTo(0, base + H * 0.020);
        for (let i = 0; i <= 12; i++) {
            const px = (i / 12) * W;
            const py = base + Math.sin(i * 0.9 + 1.3) * H * 0.016 + Math.sin(i * 2.3) * H * 0.007;
            x.lineTo(px, py);
        }
        x.lineTo(W, groundY);
        x.closePath();
        x.fillStyle = '#050d18';
        x.fill();

        const bruma = x.createLinearGradient(0, groundY - H * 0.10, 0, groundY);
        bruma.addColorStop(0, 'rgba(120,150,190,0)');
        bruma.addColorStop(1, 'rgba(120,150,190,0.10)');
        x.fillStyle = bruma;
        x.fillRect(0, groundY - H * 0.10, W, H * 0.10);

        // suelo y luna también van al caché: no cambian nunca
        const gs = x.createLinearGradient(0, groundY, 0, H);
        gs.addColorStop(0, '#16290c');
        gs.addColorStop(0.30, '#0c1a06');
        gs.addColorStop(1, '#040802');
        x.fillStyle = gs;
        x.fillRect(0, groundY, W, H - groundY);

        return c;
    }

    function dibujarCielo(t) {
        const p = suave(faseT('cielo', t));
        if (!cielo) cielo = pintarCielo();
        // el caché del cielo ya es opaco y cubre todo: no hace falta limpiar
        ctx.globalAlpha = p;
        ctx.drawImage(cielo, 0, 0, W, H);
        ctx.globalAlpha = 1;
    }

    // El grueso de estrellas es fijo: se hornea en una calcomanía y sólo las
    // dos docenas más brillantes se redibujan para que parpadeen. Antes eran
    // 140 arcos y 30 pares de trazos en cada fotograma.
    let bufEstrellas = null;
    let estrellasVivas = null;
    function hornearEstrellas() {
        const c = document.createElement('canvas');
        c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
        const x = c.getContext('2d');
        x.setTransform(dpr, 0, 0, dpr, 0, 0);
        estrellasVivas = [];
        for (let i = 0; i < estrellas.length; i++) {
            const s = estrellas[i];
            if (s.b > 0.62) { estrellasVivas.push(s); continue; }
            const r = 232 - (s.t * 30 | 0), gg = 240 - (s.t * 6 | 0), b = 215 + (s.t * 40 | 0);
            x.fillStyle = 'rgba(' + r + ',' + gg + ',' + b + ',' + (s.b * 0.75).toFixed(3) + ')';
            x.beginPath(); x.arc(s.x, s.y, s.r, 0, Math.PI * 2); x.fill();
        }
        return c;
    }
    function dibujarEstrellas(t) {
        const p = suave(faseT('cielo', t));
        if (p <= 0) return;
        if (!bufEstrellas) bufEstrellas = hornearEstrellas();
        ctx.globalAlpha = p;
        ctx.drawImage(bufEstrellas, 0, 0, W, H);
        ctx.globalAlpha = 1;
        for (let i = 0; i < estrellasVivas.length; i++) {
            const s = estrellasVivas[i];
            const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * s.v + s.f));
            const a = p * s.b * tw;
            ctx.fillStyle = 'rgba(232,240,235,' + a.toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
            if (s.pua && calidad === 2) {
                ctx.strokeStyle = 'rgba(220,235,255,' + (a * 0.35).toFixed(3) + ')';
                ctx.lineWidth = 0.7;
                const L = s.r * 4.5;
                ctx.beginPath();
                ctx.moveTo(s.x - L, s.y); ctx.lineTo(s.x + L, s.y);
                ctx.moveTo(s.x, s.y - L); ctx.lineTo(s.x, s.y + L);
                ctx.stroke();
            }
        }
    }

    // La luna se dibuja una sola vez en su propio búfer.
    let bufLuna = null;
    function pintarLuna() {
        const r = LUNA.r, R = r * 7;
        const c = document.createElement('canvas');
        c.width = c.height = Math.ceil(R * 2 * dpr);
        const x = c.getContext('2d');
        x.setTransform(dpr, 0, 0, dpr, 0, 0);
        x.translate(R, R);

        const h = x.createRadialGradient(0, 0, r * 0.7, 0, 0, R);
        h.addColorStop(0, 'rgba(190,210,255,0.20)');
        h.addColorStop(0.30, 'rgba(160,185,240,0.07)');
        h.addColorStop(1, 'rgba(140,170,230,0)');
        x.fillStyle = h;
        x.beginPath(); x.arc(0, 0, R, 0, Math.PI * 2); x.fill();

        const d = x.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r * 1.05);
        d.addColorStop(0, '#fdfbf2');
        d.addColorStop(0.55, '#e6e9f2');
        d.addColorStop(1, '#9aa6bd');
        x.fillStyle = d;
        x.beginPath(); x.arc(0, 0, r, 0, Math.PI * 2); x.fill();

        x.save();
        x.beginPath(); x.arc(0, 0, r, 0, Math.PI * 2); x.clip();
        const cr = [[-0.30, -0.18, 0.24], [0.22, 0.10, 0.17], [-0.06, 0.36, 0.13],
                    [0.38, -0.30, 0.10], [-0.44, 0.24, 0.09], [0.05, -0.44, 0.08]];
        for (let i = 0; i < cr.length; i++) {
            const cx = cr[i][0] * r, cy = cr[i][1] * r, rr = cr[i][2] * r;
            const cg = x.createRadialGradient(cx - rr * 0.3, cy - rr * 0.3, 0, cx, cy, rr);
            cg.addColorStop(0, 'rgba(150,158,175,0.30)');
            cg.addColorStop(1, 'rgba(120,130,150,0.05)');
            x.fillStyle = cg;
            x.beginPath(); x.arc(cx, cy, rr, 0, Math.PI * 2); x.fill();
        }
        x.restore();
        return { c, R };
    }

    function dibujarLuna(t) {
        const p = salida(faseT('luna', t));
        if (p <= 0) return;
        if (!bufLuna) bufLuna = pintarLuna();
        ctx.globalAlpha = p;
        ctx.drawImage(bufLuna.c, LUNA.x - bufLuna.R, LUNA.y - bufLuna.R, bufLuna.R * 2, bufLuna.R * 2);
        ctx.globalAlpha = 1;
    }

    let gradBorde = null;
    function dibujarSueloBorde(t) {
        const p = salida(faseT('suelo', t));
        if (p <= 0) return;
        ctx.save();
        ctx.globalAlpha = p;
        if (!gradBorde) {
            gradBorde = ctx.createLinearGradient(0, 0, W, 0);
            gradBorde.addColorStop(0, 'rgba(90,138,37,0)');
            gradBorde.addColorStop(0.30, 'rgba(120,176,58,0.55)');
            gradBorde.addColorStop(0.72, 'rgba(120,176,58,0.45)');
            gradBorde.addColorStop(1, 'rgba(90,138,37,0)');
        }
        ctx.strokeStyle = gradBorde;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();
        ctx.restore();
    }

    // ============================================== HIERBA
    // Las briznas se agrupan por color y grosor y se trazan en bloque: ocho
    // llamadas en lugar de ciento sesenta. El degradado vertical por brizna se
    // cambia por un color sólido más una punta clara, indistinguible a este
    // tamaño y sin coste.
    const COL_HIERBA = [];
    for (let i = 0; i < 8; i++) {
        const tono = 96 + (i / 7) * 38, luzz = 16 + (i / 7) * 22;
        COL_HIERBA.push(['hsl(' + tono + ',63%,' + luzz.toFixed(1) + '%)',
                         'hsl(' + (tono + 8) + ',72%,' + (luzz + 15).toFixed(1) + '%)']);
    }
    function dibujarHierba(t) {
        const p = faseT('hierba', t);
        if (p <= 0) return;
        ctx.lineCap = 'round';
        for (let g = 0; g < 8; g++) {
            // cuerpo
            ctx.beginPath();
            let ancho = 0, n = 0;
            for (let i = 0; i < briznas.length; i++) {
                const b = briznas[i];
                if (b.g !== g) continue;
                const k = salida(lim((p - b.retardo) / (1 - b.retardo), 0, 1));
                if (k <= 0) continue;
                const h = b.h * k;
                const v = viento(t, b.x, b.prof) * 0.28;
                const dx = Math.sin(b.incl + v), dy = -Math.cos(b.incl + v);
                const px = b.x, py = groundY + 1;
                const mx = px + dx * h * 0.55 + (b.w * 2.4 + v * 14) * Math.cos(b.incl + v);
                const my = py + dy * h * 0.55 + (b.w * 2.4 + v * 14) * Math.sin(b.incl + v);
                const tx = px + dx * h + v * 22 * Math.cos(b.incl + v);
                const ty = py + dy * h + v * 22 * Math.sin(b.incl + v);
                ctx.moveTo(px, py);
                ctx.quadraticCurveTo(mx, my, tx, ty);
                ancho += b.w; n++;
            }
            if (!n) continue;
            ctx.strokeStyle = COL_HIERBA[g][0];
            ctx.lineWidth = ancho / n;
            ctx.stroke();
        }
    }

    // Primer plano: se pinta a media resolución y se devuelve escalado. El
    // filtrado bilineal da la suavidad sin pagar un blur de Canvas 2D.
    function dibujarHierbaFrente(t) {
        const p = faseT('hierba', t);
        if (p <= 0 || calidad === 0) return;
        gF.setTransform(1, 0, 0, 1, 0, 0);
        gF.clearRect(0, 0, bufFrente.width, bufFrente.height);
        gF.setTransform(0.5, 0, 0, 0.5, 0, 0);
        gF.strokeStyle = '#020601';
        gF.lineCap = 'round';
        for (let i = 0; i < briznasFrente.length; i++) {
            const b = briznasFrente[i];
            const k = salida(lim((p - b.retardo) / (1 - b.retardo), 0, 1));
            if (k <= 0) continue;
            const h = b.h * k;
            const v = viento(t, b.x, 1.35) * 0.34;
            gF.save();
            gF.translate(b.x, H + 2);
            gF.rotate(b.incl + v);
            gF.lineWidth = b.w;
            gF.beginPath();
            gF.moveTo(0, 0);
            gF.quadraticCurveTo(b.w * 2 + v * 20, -h * 0.55, v * 30, -h);
            gF.stroke();
            gF.restore();
        }
        ctx.globalAlpha = 0.92;
        ctx.drawImage(bufFrente, 0, 0, W, H);
        ctx.globalAlpha = 1;
    }

    let gradNiebla = null;
    function dibujarNiebla(t) {
        const p = suave(faseT('hierba', t));
        if (p <= 0) return;
        const y0 = groundY - H * 0.075;
        if (!gradNiebla) {
            gradNiebla = ctx.createLinearGradient(0, y0, 0, groundY + H * 0.035);
            gradNiebla.addColorStop(0, 'rgba(120,155,175,0)');
            gradNiebla.addColorStop(0.55, 'rgba(120,155,175,0.075)');
            gradNiebla.addColorStop(1, 'rgba(110,140,160,0)');
        }
        ctx.globalAlpha = p;
        ctx.fillStyle = gradNiebla;
        ctx.fillRect(0, y0, W, H * 0.11);
        ctx.globalAlpha = 1;
    }

    // ============================================== TALLOS Y HOJAS
    function puntaTallo(f, k, t) {
        const h = f.alto * k;
        const v = viento(t, f.x, f.prof);
        const cx = f.x + v * h * 0.055 + Math.sin(f.incl) * h * 0.10;
        return { x: cx, y: groundY - h, h, v };
    }

    function gradTallo(f) {
        if (f._gt) return f._gt;
        const anc = 7.5 * f.esc;
        const g = ctx.createLinearGradient(-anc * 0.5, 0, anc * 0.5, 0);
        g.addColorStop(0, '#12300a');
        g.addColorStop(0.38, '#2f6416');
        g.addColorStop(0.58, '#4d8f28');
        g.addColorStop(1, '#14350b');
        f._gt = g;
        return g;
    }

    function dibujarTallo(f, k, t) {
        if (k <= 0) return;
        const { h, v } = puntaTallo(f, k, t);
        const anc = 7.5 * f.esc;
        ctx.save();
        ctx.translate(f.x, groundY + 2);
        const dx1 = Math.sin(f.incl) * h * 0.10 + v * h * 0.018;
        const dx2 = Math.sin(f.incl) * h * 0.10 + v * h * 0.055;
        ctx.beginPath();
        ctx.moveTo(-anc * 0.5, 0);
        ctx.bezierCurveTo(-anc * 0.5 + dx1 * 0.5, -h * 0.45,
                          -anc * 0.22 + dx2 * 0.9, -h * 0.80,
                          -anc * 0.16 + dx2, -h);
        ctx.lineTo(anc * 0.16 + dx2, -h);
        ctx.bezierCurveTo(anc * 0.22 + dx2 * 0.9, -h * 0.80,
                          anc * 0.5 + dx1 * 0.5, -h * 0.45,
                          anc * 0.5, 0);
        ctx.closePath();
        ctx.fillStyle = gradTallo(f);
        ctx.fill();
        ctx.restore();
    }

    function dibujarHoja(cx, cy, ang, tam, k) {
        if (k <= 0) return;
        const luz = lim(0.35 + (Math.cos(ang) * LUZ.x + Math.sin(ang) * LUZ.y) * 0.65, 0, 1);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ang);
        ctx.scale(tam * k, tam * k);              // dibujo normalizado 0..1
        ctx.fillStyle = gradHoja[cuboLuz(luz)];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0.34, -0.40, 0.78, -0.26, 1, 0);
        ctx.bezierCurveTo(0.78, 0.26, 0.34, 0.40, 0, 0);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.26)';
        ctx.lineWidth = 1.3 / (tam * k);
        ctx.beginPath();
        ctx.moveTo(0.04, 0);
        ctx.quadraticCurveTo(0.5, 0.03, 0.9, 0);
        ctx.stroke();
        ctx.restore();
    }

    function dibujarHojas(f, kTallo, t, kHoja) {
        if (kHoja <= 0) return;
        const h = f.alto * kTallo;
        const v = viento(t, f.x, f.prof);
        const sitios = [[0.34, -1, 0.42], [0.55, 1, 0.36], [0.72, -1, 0.27]];
        for (let i = 0; i < sitios.length; i++) {
            const en = sitios[i][0], lado = sitios[i][1], tam = sitios[i][2];
            const k = salida(lim((kHoja - i * 0.18) / (1 - i * 0.18), 0, 1));
            if (k <= 0) continue;
            const y = groundY - h * en;
            const x = f.x + Math.sin(f.incl) * h * 0.10 * en + v * h * 0.018 * en;
            const ang = lado * (0.46 + Math.sin(t * 0.9 + i + f.sem * 6) * 0.05) + v * 0.14;
            ctx.save();
            ctx.scale(lado, 1);
            dibujarHoja(x * lado, y, ang * lado, tam * f.alto * 0.34 * f.esc, k);
            ctx.restore();
        }
    }

    // ============================================== DISCO (en caché)
    function discoSprite(f) {
        if (f.disco) return f.disco;
        const R = f.alto * 0.20 * f.esc * 0.34;
        const lado = Math.ceil(R * 2.2 * dpr);
        const c = document.createElement('canvas');
        c.width = c.height = lado;
        const x = c.getContext('2d');
        const s = lado / (R * 2.2);
        x.setTransform(s, 0, 0, s, lado / 2, lado / 2);

        const bg = x.createRadialGradient(-R * 0.30, -R * 0.30, R * 0.05, 0, 0, R);
        bg.addColorStop(0, '#8a5c24');
        bg.addColorStop(0.5, '#4e3212');
        bg.addColorStop(1, '#221403');
        x.fillStyle = bg;
        x.beginPath(); x.arc(0, 0, R, 0, Math.PI * 2); x.fill();

        const PHI = 137.508 * Math.PI / 180;
        const n = Math.max(30, Math.round(R * 2.6));
        for (let i = 0; i < n; i++) {
            const rr = R * Math.sqrt(i / n) * 0.94;
            const th = i * PHI;
            const sx = Math.cos(th) * rr, sy = Math.sin(th) * rr;
            const luz = lim(0.42 + (sx * LUZ.x + sy * LUZ.y) / (R || 1) * 0.55, 0, 1);
            const base = 30 + luz * 66;
            const sr = R * 0.055 + (i / n) * R * 0.035;
            x.fillStyle = 'rgb(' + (base + 28 | 0) + ',' + (base * 0.68 | 0) + ',' + (base * 0.30 | 0) + ')';
            x.beginPath(); x.arc(sx, sy, sr, 0, Math.PI * 2); x.fill();
        }
        const nf = 30;
        for (let i = 0; i < nf; i++) {
            const a = (i / nf) * Math.PI * 2;
            x.fillStyle = i % 2 ? 'rgba(255,206,70,.85)' : 'rgba(214,158,26,.8)';
            x.beginPath(); x.arc(Math.cos(a) * R * 0.95, Math.sin(a) * R * 0.95, R * 0.07, 0, Math.PI * 2); x.fill();
        }
        // el disco es un domo: sombra en el borde y luz alta arriba a la
        // izquierda, para que no parezca una pegatina plana
        const so = x.createRadialGradient(0, 0, R * 0.48, 0, 0, R * 1.02);
        so.addColorStop(0, 'rgba(0,0,0,0)');
        so.addColorStop(0.82, 'rgba(0,0,0,0.30)');
        so.addColorStop(1, 'rgba(0,0,0,0.58)');
        x.fillStyle = so;
        x.beginPath(); x.arc(0, 0, R, 0, Math.PI * 2); x.fill();

        const br = x.createRadialGradient(-R * 0.34, -R * 0.34, 0, -R * 0.30, -R * 0.30, R * 0.85);
        br.addColorStop(0, 'rgba(255,224,150,0.20)');
        br.addColorStop(1, 'rgba(255,200,90,0)');
        x.fillStyle = br;
        x.beginPath(); x.arc(0, 0, R, 0, Math.PI * 2); x.fill();

        f.disco = { c, R: R * 1.1 };
        return f.disco;
    }

    // ============================================== COROLA
    function dibujarCorola(f, apertura, t, aGlow) {
        if (apertura <= 0) return;
        const pt = puntaTallo(f, 1, t);
        const R = f.alto * 0.20 * f.esc;
        const rd = R * 0.34;
        const incl = f.incl * 0.55 + Math.sin(t * 0.6 + f.sem * 9) * 0.04;
        // `cabeceo` es el escorzo: cuánto se ve la cabeza de canto. Estaba en
        // 0.62, o sea aplastada al 62% de su alto, y por eso la flor no era
        // redonda sino una elipse tumbada. Un girasol mirando al frente es
        // prácticamente un círculo; se deja sólo la insinuación de que la
        // cabeza está algo inclinada, y respirando.
        const cabeceo = 0.94 + Math.sin(t * 0.45 + f.sem * 5) * 0.025;

        ctx.save();
        ctx.translate(pt.x, pt.y - R * 0.10);
        ctx.rotate(incl * 0.5 + pt.v * 0.05);

        // dos coronas: la exterior larga, la interior más corta rellenando los
        // huecos. Una sola fila dejaba ver el disco entre pétalo y pétalo y era
        // lo que hacía que la flor pareciera una margarita recortada.
        const orden = [];
        for (let i = 0; i < N_EXT; i++) {
            const a = (i / N_EXT) * Math.PI * 2 - Math.PI / 2;
            orden.push({ i, a, fila: 0, z: Math.sin(a) - 0.02 });
        }
        for (let i = 0; i < N_INT; i++) {
            const a = (i / N_INT) * Math.PI * 2 - Math.PI / 2 + Math.PI / N_INT;
            orden.push({ i, a, fila: 1, z: Math.sin(a) });
        }
        orden.sort((p, q) => p.z - q.z);
        const mitad = orden.length - N_INT - 1;

        for (let o = 0; o < orden.length; o++) {
            const i = orden[o].i, a = orden[o].a, fila = orden[o].fila;
            const n = fila ? N_INT : N_EXT;
            const fase = i / n;
            const k = salida(lim((apertura - fase * 0.26 - fila * 0.10) / 0.64, 0, 1));
            if (k > 0) {
                const esc = Math.hypot(Math.cos(a), Math.sin(a) * cabeceo);
                // longitudes y anchos dispares: pétalos idénticos se leen como
                // una mancha continua
                const vLargo = 0.86 + ((i * 37 + fila * 11) % 13) / 40;
                const vAncho = 0.84 + ((i * 53 + fila * 7) % 9) / 22;
                // más pétalos ⇒ cada uno más estrecho, o se apelmazan
                const largo = R * (fila ? 0.66 : 1.00) * vLargo * esc;
                const ancho = R * (fila ? 0.26 : 0.31) * vAncho;
                const ax = Math.cos(a), ay = Math.sin(a) * cabeceo;
                const ang = Math.atan2(ay, ax);
                const dot = ax * LUZ.x + ay * LUZ.y;
                const luz = lim(0.30 + dot * 0.70, 0, 1);
                // De qué lado del pétalo cae la luz. El sprite se hornea con la
                // mitad iluminada arriba; si la luz está al otro lado se voltea
                // en vertical, que en el eje del pétalo es exactamente cambiar
                // de mitad. Sin esto la sombra giraba con el pétalo y la flor
                // entera se leía como un molinillo.
                const cruz = ax * LUZ.y - ay * LUZ.x;
                // rizo: la punta se gira un poco, distinto en cada pétalo
                const rizo = Math.sin(t * 0.9 + i * 1.7 + f.sem * 6) * 0.035 * (fila ? 0.6 : 1);

                ctx.save();
                ctx.rotate(ang + rizo);
                if (cruz < 0) ctx.scale(1, -1);
                // El arranque tiene que seguir al DISCO, que es una elipse
                // achatada por `cabeceo`, no un círculo. Con un radio fijo los
                // pétalos de arriba y abajo nacían por fuera del borde —el
                // disco sólo llega a rd·cabeceo en la vertical— y entre base y
                // disco se abrían cuñas de fondo. Escalando por `esc` la base
                // queda siempre metida bajo el disco, mire donde mire.
                ctx.translate(rd * esc * 0.72, 0);
                const L = largo * k, A = ancho * (0.30 + k * 0.70);
                ctx.drawImage(petSprite[fila][cuboLuz(luz)], 0, -A * 0.5, L, A);
                ctx.restore();
            }
            if (o === mitad) {
                const kd = salida(lim((apertura - 0.10) / 0.55, 0, 1));
                if (kd > 0) {
                    const sp = discoSprite(f);
                    ctx.save();
                    ctx.scale(1, cabeceo);
                    const s = sp.R * kd;
                    ctx.drawImage(sp.c, -s, -s, s * 2, s * 2);
                    ctx.restore();
                }
            }
        }
        ctx.restore();

        if (aGlow) estampa(halOro, aGlow, pt.x, pt.y - R * 0.1, R * 1.7, 0.42 * apertura);
    }

    // ============================================== FLORES DE FONDO (sprite)
    function spriteFondo(f) {
        if (f.sprite) return f.sprite;
        const R = f.alto * 0.20 * f.esc;
        const lado = Math.ceil(R * 2.4 * dpr);
        const c = document.createElement('canvas');
        c.width = c.height = lado;
        const x = c.getContext('2d');
        const s = lado / (R * 2.4);
        x.setTransform(s, 0, 0, s, lado / 2, lado / 2);
        const rd = R * 0.34, cabeceo = 0.66, nPet = 16;
        for (let i = 0; i < nPet; i++) {
            const a = (i / nPet) * Math.PI * 2;
            const ax = Math.cos(a), ay = Math.sin(a) * cabeceo;
            const dot = ax * LUZ.x + ay * LUZ.y;
            const luz = lim(0.30 + dot * 0.70, 0, 1);
            const cruz = ax * LUZ.y - ay * LUZ.x;   // mismo criterio de lado
            x.save();
            x.rotate(Math.atan2(ay, ax));
            if (cruz < 0) x.scale(1, -1);
            x.translate(rd * 0.72, 0);
            const L = R * 0.86, A = R * 0.32;
            x.drawImage(petSprite[0][cuboLuz(luz)], 0, -A * 0.5, L, A);
            x.restore();
        }
        x.save();
        x.scale(1, cabeceo);
        const bg = x.createRadialGradient(-rd * 0.3, -rd * 0.3, 0, 0, 0, rd);
        bg.addColorStop(0, '#7a4f20');
        bg.addColorStop(1, '#241505');
        x.fillStyle = bg;
        x.beginPath(); x.arc(0, 0, rd, 0, Math.PI * 2); x.fill();
        x.restore();
        f.sprite = { c, R: R * 1.2 };
        return f.sprite;
    }

    function dibujarFondo(t, kTallo, kPet) {
        if (kTallo <= 0) return;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < floresFondo.length; i++) {
            const f = floresFondo[i];
            dibujarTallo(f, kTallo, t);
            if (kPet > 0) {
                const pt = puntaTallo(f, 1, t);
                const sp = spriteFondo(f);
                const s = sp.R * suave(kPet);
                ctx.drawImage(sp.c, pt.x - s, pt.y - s, s * 2, s * 2);
            }
        }
        ctx.restore();
    }

    // ============================================== CLAVELINAS (cabeza en caché)
    function cabezaClavel(c) {
        if (c.cabeza) return c.cabeza;
        // Los pétalos llegan hasta R + l (≈1,72·R) desde el centro, pero el
        // lienzo sólo medía 1,3·R de semilado: los recortaba y por eso las
        // clavelinas salían como cuadrados amarillos.
        const R = 17 * c.esc;
        const SEMI = R * 2.05;
        const lado = Math.ceil(SEMI * 2 * dpr);
        const cv = document.createElement('canvas');
        cv.width = cv.height = lado;
        const x = cv.getContext('2d');
        const s = lado / (SEMI * 2);
        x.setTransform(s, 0, 0, s, lado / 2, lado / 2);
        const capas = [
            { n: 15, r: R, l: R * 0.72, w: R * 0.34, b: 0.72 },
            { n: 12, r: R * 0.66, l: R * 0.62, w: R * 0.30, b: 0.88 },
            { n: 9, r: R * 0.34, l: R * 0.52, w: R * 0.28, b: 1.00 }
        ];
        for (let ci = 0; ci < capas.length; ci++) {
            const ca = capas[ci];
            for (let i = 0; i < ca.n; i++) {
                const a = (i / ca.n) * Math.PI * 2 + ci * 0.35;
                const px = Math.cos(a) * ca.r, py = Math.sin(a) * ca.r * 0.82;
                const luz = lim(0.34 + (Math.cos(a) * LUZ.x + Math.sin(a) * LUZ.y) * 0.66, 0, 1);
                x.save();
                x.translate(px, py);
                x.rotate(a + Math.PI * 0.5);
                x.scale(ca.w, ca.l);
                x.fillStyle = gradClavel[cuboLuz(luz * ca.b)];
                x.beginPath();
                x.moveTo(0, 0);
                x.bezierCurveTo(-0.78, -0.30, -0.62, -0.74, -0.36, -0.88);
                x.quadraticCurveTo(-0.20, -0.74, -0.13, -0.86);
                x.quadraticCurveTo(-0.05, -0.97, 0, -1);
                x.quadraticCurveTo(0.05, -0.97, 0.13, -0.86);
                x.quadraticCurveTo(0.20, -0.74, 0.36, -0.88);
                x.bezierCurveTo(0.62, -0.74, 0.78, -0.30, 0, 0);
                x.fill();
                x.strokeStyle = 'rgba(122,78,0,0.28)';
                x.lineWidth = 0.9 / ca.w;
                x.stroke();
                x.restore();
            }
        }
        const gc = x.createRadialGradient(0, 0, 0, 0, 0, R * 0.28);
        gc.addColorStop(0, 'rgba(255,248,190,0.95)');
        gc.addColorStop(1, 'rgba(226,170,30,0)');
        x.fillStyle = gc;
        x.beginPath(); x.arc(0, 0, R * 0.28, 0, Math.PI * 2); x.fill();
        c.cabeza = { c: cv, R: SEMI };
        return c.cabeza;
    }

    function dibujarClavelina(c, t, aGlow) {
        const base = faseT('clavel', t);
        const p = salida(lim((base - c.retardo) / (1 - c.retardo), 0, 1));
        if (p <= 0) return;
        const h = c.alto * Math.min(1, rebote(p));
        const v = viento(t, c.x, c.prof);
        const dx = Math.sin(c.incl) * h * 0.12 + v * h * 0.05;

        ctx.save();
        ctx.translate(c.x, groundY + 1);
        ctx.beginPath();
        ctx.moveTo(-2.4 * c.esc, 0);
        ctx.quadraticCurveTo(dx * 0.4 - 1.6 * c.esc, -h * 0.55, dx - 1.4 * c.esc, -h);
        ctx.lineTo(dx + 1.4 * c.esc, -h);
        ctx.quadraticCurveTo(dx * 0.4 + 1.6 * c.esc, -h * 0.55, 2.4 * c.esc, 0);
        ctx.closePath();
        ctx.fillStyle = gradTallo(c);
        ctx.fill();
        if (p > 0.35) {
            const kh = salida((p - 0.35) / 0.65);
            for (let i = 0; i < 2; i++) {
                const en = 0.42 + i * 0.24, lado = i ? 1 : -1;
                dibujarHoja(dx * en, -h * en, lado * (0.9 + v * 0.1), 28 * c.esc, kh);
            }
        }
        ctx.restore();

        if (p < 0.5) return;
        const hp = salida((p - 0.5) / 0.5);
        const cx = c.x + dx, cy = groundY - h;
        const sp = cabezaClavel(c);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(v * 0.06);
        const s = sp.R * hp;
        ctx.drawImage(sp.c, -s, -s, s * 2, s * 2);
        ctx.restore();

        if (aGlow) estampa(halOro, aGlow, cx, cy, 17 * c.esc * 2.4, 0.28 * hp);
    }

    // ============================================== BICHOS
    function dibujarLuciernagas(t, dt, aGlow) {
        const p = faseT('luces', t);
        if (p <= 0) return;
        for (let i = 0; i < luciernagas.length; i++) {
            const f = luciernagas[i];
            f.vx = lim(f.vx + (Math.random() - 0.5) * 0.05, -0.55, 0.55);
            f.vy = lim(f.vy + (Math.random() - 0.5) * 0.035, -0.45, 0.45);
            f.x += f.vx * dt; f.y += f.vy * dt;
            if (f.x < -10) f.x = W + 10; else if (f.x > W + 10) f.x = -10;
            if (f.y < groundY * 0.10) { f.y = groundY * 0.10; f.vy = Math.abs(f.vy); }
            if (f.y > groundY - 4) { f.y = groundY - 4; f.vy = -Math.abs(f.vy); }

            f.estela.push(f.x, f.y);
            if (f.estela.length > 16) f.estela.splice(0, 2);

            const parp = 0.18 + 0.82 * Math.pow(Math.abs(Math.sin(t * 1.9 + f.f)), 2.2);
            const a = p * parp;

            ctx.strokeStyle = 'rgba(190,255,120,' + (a * 0.16).toFixed(3) + ')';
            ctx.lineWidth = f.r * 0.7;
            ctx.lineCap = 'round';
            ctx.beginPath();
            for (let j = 0; j < f.estela.length; j += 2) {
                if (j === 0) ctx.moveTo(f.estela[0], f.estela[1]);
                else ctx.lineTo(f.estela[j], f.estela[j + 1]);
            }
            ctx.stroke();

            ctx.fillStyle = 'rgba(228,255,186,' + a.toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();

            if (aGlow) estampa(halVerde, aGlow, f.x, f.y, f.r * 10, a * 0.62);
        }
    }

    function dibujarPolen(t, dt) {
        const p = faseT('luces', t);
        if (p <= 0) return;
        for (let i = 0; i < polen.length; i++) {
            const m = polen[i];
            m.y -= m.v * dt;
            m.x += Math.sin(t * 0.7 + m.f) * 0.22 * dt;
            if (m.y < groundY * 0.05) { m.y = groundY - 6; m.x = Math.random() * W; }
            const a = p * m.a * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + m.f)));
            ctx.fillStyle = 'rgba(255,234,168,' + a.toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(m.x, m.y, m.s, 0, Math.PI * 2); ctx.fill();
        }
    }

    // ============================================== TEXTO Y VIÑETA
    let fuentesListas = false;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fuentesListas = true; });
    else fuentesListas = true;

    function dibujarTexto(t) {
        const bruto = faseT('texto', t);
        if (bruto <= 0 || !fuentesListas) return;
        const p = salida(bruto);
        const tx = W * 0.46, ty = H * 0.088;
        const tam = Math.round(Math.min(W * 0.125, H * 0.072));
        ctx.save();
        ctx.globalAlpha = p;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'italic 700 ' + tam + "px 'Playfair Display', Georgia, serif";
        const txt = 'Feliz día ❣️';

        // El horneado de esta capa quedaba desplazado y el título se veía
        // doble. Una sola pasada de sombra, dibujada en el sitio.
        ctx.save();
        ctx.shadowColor = 'rgba(255,168,30,0.6)';
        ctx.shadowBlur = 30;
        ctx.fillStyle = 'rgba(255,168,30,0.22)';
        ctx.fillText(txt, tx, ty);
        ctx.restore();

        const barrido = Math.sin(t * 0.5) * 0.5 + 0.5;
        const g = ctx.createLinearGradient(tx - tam * 2.4, ty - tam * 0.5, tx + tam * 2.4, ty + tam * 0.5);
        g.addColorStop(0, '#8a5c00');
        g.addColorStop(Math.max(0.01, barrido - 0.16), '#e0ac24');
        g.addColorStop(barrido, '#fff6c8');
        g.addColorStop(Math.min(0.99, barrido + 0.16), '#e8b820');
        g.addColorStop(1, '#c07800');
        ctx.fillStyle = g;
        ctx.fillText(txt, tx, ty);
        ctx.restore();
    }

    let gradVineta = null;
    function dibujarVineta() {
        if (!gradVineta) {
            gradVineta = ctx.createRadialGradient(W * 0.5, H * 0.46, Math.min(W, H) * 0.28,
                                                  W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
            gradVineta.addColorStop(0, 'rgba(0,0,0,0)');
            gradVineta.addColorStop(0.65, 'rgba(0,0,0,0.28)');
            gradVineta.addColorStop(1, 'rgba(0,0,0,0.72)');
        }
        ctx.fillStyle = gradVineta;
        ctx.fillRect(0, 0, W, H);
    }

    // ============================================== BUCLE
    let startTime = null;
    let ultimoTs = 0;

    function gobernar(ms) {
        if (ignorar < 30) { ignorar++; return; }
        acumMs += ms; acumN++;
        if (acumN < 45) return;
        const media = acumMs / acumN;
        acumMs = 0; acumN = 0;
        if (media > 26 && calidad > 0) calidad--;
        else if (media < 15 && calidad < 2) calidad++;
    }

    function draw(ts) {
        const t0real = performance.now();
        if (startTime === null) { startTime = ts; ultimoTs = ts; }
        const t = (ts - startTime) / 1000;
        let dt = (ts - ultimoTs) / 16.67;
        ultimoTs = ts;
        if (!isFinite(dt) || dt <= 0) dt = 1;
        if (dt > 3) dt = 3;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const usaGlow = calidad > 0;
        if (usaGlow) {
            gA.setTransform(1, 0, 0, 1, 0, 0);
            gA.clearRect(0, 0, bufGlowA.width, bufGlowA.height);
            gA.setTransform(0.25, 0, 0, 0.25, 0, 0);
        }
        const aGlow = usaGlow ? gA : null;

        dibujarCielo(t);
        dibujarEstrellas(t);
        dibujarLuna(t);
        dibujarSueloBorde(t);

        dibujarFondo(t, suave(faseT('tallos', t)), faseT('petalos', t) * 0.9);
        dibujarNiebla(t);

        const kPet = faseT('petalos', t);
        const kHoja = suave(faseT('hojas', t));
        const orden = [1, 2, 0];
        for (let n = 0; n < orden.length; n++) {
            const f = flores[orden[n]];
            const kT = Math.min(1, rebote(lim((faseT('tallos', t) - f.retardo) / (1 - f.retardo), 0, 1)));
            dibujarTallo(f, kT, t);
            dibujarHojas(f, kT, t, kHoja);
            dibujarCorola(f, suave(lim((kPet - f.retardo * 0.4) / (1 - f.retardo * 0.4), 0, 1)), t, aGlow);
        }
        for (let i = 0; i < clavelinas.length; i++) dibujarClavelina(clavelinas[i], t, aGlow);

        dibujarHierba(t);
        dibujarPolen(t, dt);
        dibujarLuciernagas(t, dt, aGlow);

        // resplandor: dos reducciones sucesivas hacen de desenfoque, sin filter
        if (usaGlow) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.85;
            ctx.drawImage(bufGlowA, 0, 0, W, H);
            if (calidad === 2) {
                gB.setTransform(1, 0, 0, 1, 0, 0);
                gB.clearRect(0, 0, bufGlowB.width, bufGlowB.height);
                gB.drawImage(bufGlowA, 0, 0, bufGlowB.width, bufGlowB.height);
                ctx.globalAlpha = 0.55;
                ctx.drawImage(bufGlowB, 0, 0, W, H);
            }
            ctx.restore();
        }

        dibujarHierbaFrente(t);
        dibujarVineta();
        dibujarTexto(t);

        gobernar(performance.now() - t0real);
        animFrameId = requestAnimationFrame(draw);
    }

    window.startSpecialFlower = function () {
        if (animFrameId) cancelAnimationFrame(animFrameId);
        bufLuna = null; gradVineta = null;
        bufEstrellas = null; gradBorde = null; gradNiebla = null;
        initData();
        animFrameId = requestAnimationFrame(draw);
    };

    window.stopSpecialFlower = function () {
        if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
    };

    let rz = null;
    window.addEventListener('resize', () => {
        if (animFrameId === null) return;
        clearTimeout(rz);
        rz = setTimeout(() => {
            const guion = startTime;
            bufLuna = null; gradVineta = null;
            bufEstrellas = null; gradBorde = null; gradNiebla = null;
            initData();
            startTime = guion;
        }, 150);
    });
})();
