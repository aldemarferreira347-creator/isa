/* ============================================================
   UN MES — NIVEL 1
   Escena pixel animada por scroll, fotos que se revelan de
   pixel art a foto real, combate de preguntas y carta.
   ============================================================ */

(function () {
    'use strict';

    var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var LLAVE = 'un-mes-nivel1';

    /* ══════════════════════════════════════════
       1. UTILIDADES DE PIXEL
       ══════════════════════════════════════════ */

    function hex(c) {
        return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)];
    }

    function mezcla(a, b, t) {
        var x = hex(a), y = hex(b);
        return 'rgb(' + Math.round(x[0] + (y[0] - x[0]) * t) + ',' +
            Math.round(x[1] + (y[1] - x[1]) * t) + ',' +
            Math.round(x[2] + (y[2] - x[2]) * t) + ')';
    }

    // Dibuja un mapa de caracteres como píxeles
    function mapa(ctx, filas, x, y, colores, esc) {
        esc = esc || 1;
        for (var f = 0; f < filas.length; f++) {
            for (var c = 0; c < filas[f].length; c++) {
                var k = filas[f][c];
                if (k === '.' || !colores[k]) continue;
                ctx.fillStyle = colores[k];
                ctx.fillRect(x + c * esc, y + f * esc, esc, esc);
            }
        }
    }

    var CORAZON = [
        '.##.##.',
        '#######',
        '#######',
        '.#####.',
        '..###..',
        '...#...'
    ];

    var CHICA = [
        '..1111..',
        '.111111.',
        '.122221.',
        '.122221.',
        '.111111.',
        '..3333..',
        '.333333.',
        '.333333.',
        '..3333..',
        '..3..3..',
        '..2..2..',
        '..2..2..'
    ];

    var CHICO = [
        '..4444..',
        '.144441.',
        '.122221.',
        '.122221.',
        '..1111..',
        '..3333..',
        '.333333.',
        '.333333.',
        '..3333..',
        '..3..3..',
        '..2..2..',
        '..2..2..'
    ];

    /* ══════════════════════════════════════════
       2. CORAZONES DEL HUD
       ══════════════════════════════════════════ */

    function corazonSVG(lleno) {
        var s = '<svg viewBox="0 0 7 6" shape-rendering="crispEdges" aria-hidden="true">';
        for (var f = 0; f < CORAZON.length; f++) {
            for (var c = 0; c < CORAZON[f].length; c++) {
                if (CORAZON[f][c] !== '#') continue;
                s += '<rect x="' + c + '" y="' + f + '" width="1" height="1" fill="' +
                    (lleno ? '#E24E8C' : '#241B4A') + '"/>';
            }
        }
        return s + '</svg>';
    }

    var cajaVidas = document.getElementById('vidas');
    var TOTAL_P = 6;

    function pintarVidas(n) {
        var s = '';
        for (var i = 0; i < TOTAL_P; i++) s += corazonSVG(i < n);
        cajaVidas.innerHTML = s;
    }

    /* ══════════════════════════════════════════
       3. ESCENA DE FONDO
       ══════════════════════════════════════════ */

    var lienzo = document.getElementById('escena');
    var ctx = lienzo.getContext('2d');
    var buf = document.createElement('canvas');
    var bctx = buf.getContext('2d');
    var ANCHO = 180, ALTO = 100;

    var FASES = [
        { cieloA: '#7FC7F0', cieloB: '#CDEBFF', mar: '#2E7FC2', hondo: '#1B4F86', arena: '#E8D5A3', arenaOsc: '#C9AE79', astro: '#FFF3C4', sil: '#1E3A2F', noche: 0 },
        { cieloA: '#6B3FA0', cieloB: '#FF9E5E', mar: '#B4536A', hondo: '#4A2C7A', arena: '#C98B5E', arenaOsc: '#8A5A3C', astro: '#FFD166', sil: '#2A1830', noche: .35 },
        { cieloA: '#0A0818', cieloB: '#241B4A', mar: '#14204A', hondo: '#0A1030', arena: '#3A2F55', arenaOsc: '#241B4A', astro: '#E8ECFF', sil: '#0A0818', noche: 1 },
        { cieloA: '#4A2C7A', cieloB: '#FF8FB1', mar: '#2C5FA8', hondo: '#1B3A6B', arena: '#D9B48A', arenaOsc: '#A87F5C', astro: '#FFF3E0', sil: '#2A1830', noche: .25 }
    ];

    var estrellas = [];
    for (var e = 0; e < 90; e++) {
        estrellas.push({ x: Math.random(), y: Math.random() * .55, p: Math.random() });
    }

    function medir() {
        var w = window.innerWidth, h = window.innerHeight;
        ALTO = Math.max(60, Math.round(ANCHO * h / w));
        buf.width = ANCHO; buf.height = ALTO;
        lienzo.width = w; lienzo.height = h;
        ctx.imageSmoothingEnabled = false;
    }

    function faseActual(p) {
        var t = p * 3;
        var i = Math.min(2, Math.floor(t));
        var f = t - i;
        var a = FASES[i], b = FASES[i + 1];
        return {
            cieloA: mezcla(a.cieloA, b.cieloA, f),
            cieloB: mezcla(a.cieloB, b.cieloB, f),
            mar: mezcla(a.mar, b.mar, f),
            hondo: mezcla(a.hondo, b.hondo, f),
            arena: mezcla(a.arena, b.arena, f),
            arenaOsc: mezcla(a.arenaOsc, b.arenaOsc, f),
            astro: mezcla(a.astro, b.astro, f),
            sil: mezcla(a.sil, b.sil, f),
            noche: a.noche + (b.noche - a.noche) * f
        };
    }

    function circulo(g, cx, cy, r, color) {
        g.fillStyle = color;
        for (var y = -r; y <= r; y++) {
            var an = Math.floor(Math.sqrt(r * r - y * y));
            g.fillRect(Math.round(cx - an), Math.round(cy + y), an * 2 + 1, 1);
        }
    }

    var NUBE = [
        '..####..',
        '.######.',
        '########'
    ];

    var BARCO = [
        '..#..',
        '..##.',
        '#####',
        '.###.'
    ];

    var nubes = [
        { x: .10, y: .26, v: .006, e: 3 },
        { x: .55, y: .40, v: .004, e: 2 },
        { x: .82, y: .16, v: .009, e: 2 }
    ];

    var fugaz = { activa: false, x: 0, y: 0, prox: 3 };

    function pajaro(g, x, y, color) {
        g.fillStyle = color;
        g.fillRect(x, y, 1, 1);
        g.fillRect(x + 1, y + 1, 1, 1);
        g.fillRect(x + 2, y, 1, 1);
        g.fillRect(x + 3, y - 1, 1, 1);
        g.fillRect(x + 4, y, 1, 1);
    }

    var t0 = performance.now();
    var progreso = 0;

    function escena() {
        var t = (performance.now() - t0) / 1000;
        var F = faseActual(progreso);
        var horizonte = Math.round(ALTO * .58);
        var arenaY = Math.round(ALTO * .82);

        // Cielo en bandas posterizadas
        var bandas = 12;
        for (var i = 0; i < bandas; i++) {
            bctx.fillStyle = mezclaRGB(F.cieloA, F.cieloB, i / (bandas - 1));
            var y0 = Math.round(horizonte * i / bandas);
            var y1 = Math.round(horizonte * (i + 1) / bandas);
            bctx.fillRect(0, y0, ANCHO, y1 - y0);
        }

        // Estrellas
        if (F.noche > .05) {
            for (var s = 0; s < estrellas.length; s++) {
                var st = estrellas[s];
                var brillo = F.noche * (.5 + .5 * Math.sin(t * 2 + st.p * 9));
                if (brillo < .12) continue;
                bctx.fillStyle = 'rgba(255,255,255,' + brillo.toFixed(2) + ')';
                bctx.fillRect(Math.round(st.x * ANCHO), Math.round(st.y * horizonte), 1, 1);
            }
        }

        // Estrella fugaz (solo de noche)
        if (F.noche > .55) {
            fugaz.prox -= 1 / 60;
            if (!fugaz.activa && fugaz.prox <= 0) {
                fugaz.activa = true;
                fugaz.x = Math.random() * ANCHO * .6;
                fugaz.y = Math.random() * horizonte * .5;
            }
            if (fugaz.activa) {
                fugaz.x += 1.6; fugaz.y += .7;
                bctx.fillStyle = '#FFF3E0';
                for (var q = 0; q < 6; q++) {
                    bctx.globalAlpha = 1 - q / 6;
                    bctx.fillRect(Math.round(fugaz.x - q * 1.6), Math.round(fugaz.y - q * .7), 1, 1);
                }
                bctx.globalAlpha = 1;
                if (fugaz.x > ANCHO || fugaz.y > horizonte) {
                    fugaz.activa = false;
                    fugaz.prox = 4 + Math.random() * 6;
                }
            }
        }

        // Sol / luna en arco
        var ax = Math.round(ANCHO * .12 + progreso * ANCHO * .76);
        var ay = Math.round(horizonte - Math.sin(progreso * Math.PI) * horizonte * .72);
        var r = 7;
        circulo(bctx, ax, ay, r, F.astro);
        if (F.noche > .6) {
            // media luna: se tapa con el cielo
            bctx.save();
            bctx.globalAlpha = Math.min(1, (F.noche - .6) / .4);
            circulo(bctx, ax + 4, ay - 2, r, mezclaRGB(F.cieloA, F.cieloB, .35));
            bctx.restore();
        }
        // reflejo en el agua
        bctx.fillStyle = F.astro;
        bctx.globalAlpha = .35;
        for (var rr = horizonte; rr < arenaY; rr += 2) {
            var an = Math.max(1, Math.round(3 - (rr - horizonte) * .12));
            bctx.fillRect(ax - an + Math.round(Math.sin(t * 1.6 + rr) * 2), rr, an * 2, 1);
        }
        bctx.globalAlpha = 1;

        // Nubes y pájaros (se van con la noche)
        var dia = 1 - F.noche;
        if (dia > .08) {
            bctx.globalAlpha = dia * .85;
            for (var n = 0; n < nubes.length; n++) {
                var nb = nubes[n];
                nb.x += nb.v / 60;
                if (nb.x > 1.2) nb.x = -.2;
                mapa(bctx, NUBE, Math.round(nb.x * ANCHO), Math.round(nb.y * horizonte),
                    { '#': '#FFFFFF' }, nb.e);
            }
            bctx.globalAlpha = dia;
            var bx = (t * 6) % (ANCHO + 30) - 15;
            pajaro(bctx, Math.round(bx), Math.round(horizonte * .32), F.sil);
            pajaro(bctx, Math.round(bx - 9), Math.round(horizonte * .38), F.sil);
            bctx.globalAlpha = 1;
        }

        // Mar
        for (var y = horizonte; y < arenaY; y++) {
            var d = (y - horizonte) / (arenaY - horizonte);
            bctx.fillStyle = mezclaRGB(F.mar, F.hondo, 1 - d);
            bctx.fillRect(0, y, ANCHO, 1);
        }
        // El barquito del horizonte (el de la foto del mar)
        var barcoX = (t * 2.2) % (ANCHO + 24) - 12;
        mapa(bctx, BARCO, Math.round(barcoX), horizonte + 2 + Math.round(Math.sin(t * 1.4)),
            { '#': F.sil }, 1);

        // Crestas de espuma
        bctx.fillStyle = 'rgba(168,232,240,.75)';
        for (var yy = horizonte + 2; yy < arenaY; yy += 3) {
            var fase = t * (1 + (yy - horizonte) * .12);
            for (var x = 0; x < ANCHO; x += 9) {
                var ox = Math.round(Math.sin(fase + x * .35 + yy) * 3);
                bctx.fillRect((x + ox + ANCHO) % ANCHO, yy, 3, 1);
            }
        }

        // Orilla y arena
        bctx.fillStyle = F.arena;
        bctx.fillRect(0, arenaY, ANCHO, ALTO - arenaY);
        bctx.fillStyle = F.arenaOsc;
        for (var xx = 0; xx < ANCHO; xx += 2) {
            bctx.fillRect(xx, arenaY + 3 + (xx % 4 === 0 ? 1 : 0), 1, 1);
            bctx.fillRect(xx + 1, ALTO - 4, 1, 1);
        }
        // espuma que sube y baja en la orilla
        bctx.fillStyle = 'rgba(255,255,255,.55)';
        var ola = Math.round(Math.sin(t * .9) * 2);
        for (var xo = 0; xo < ANCHO; xo += 3) {
            bctx.fillRect(xo, arenaY + ola + Math.round(Math.sin(t + xo * .4)), 2, 1);
        }

        // Palmeras
        palmera(bctx, 16, arenaY, F.sil);
        palmera(bctx, ANCHO - 22, arenaY + 2, F.sil);

        // La pareja
        var paso = Math.floor(t * 3) % 2;
        var baseY = arenaY + 4 + paso;
        var col = { '1': '#2B1B12', '2': '#F0C08A', '3': F.noche > .5 ? '#6B3FA0' : '#E24E8C', '4': '#1B1B2B' };
        mapa(bctx, CHICA, Math.round(ANCHO * .42), baseY - 12, col, 1);
        var col2 = { '1': '#2B1B12', '2': '#F0C08A', '3': F.noche > .5 ? '#2C5FA8' : '#241B4A', '4': '#1B1B2B' };
        mapa(bctx, CHICO, Math.round(ANCHO * .42) + 9, baseY - 12 + (1 - paso), col2, 1);

        // Corazón flotando entre los dos
        var hb = (t * .5) % 3;
        if (hb < 2) {
            bctx.globalAlpha = 1 - hb / 2;
            mapa(bctx, CORAZON, Math.round(ANCHO * .42) + 4, Math.round(baseY - 18 - hb * 6),
                { '#': '#FF8FB1' }, 1);
            bctx.globalAlpha = 1;
        }

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(buf, 0, 0, ANCHO, ALTO, 0, 0, lienzo.width, lienzo.height);
        requestAnimationFrame(escena);
    }

    function mezclaRGB(a, b, t) {
        // acepta 'rgb(...)' o '#hex'
        var x = leer(a), y = leer(b);
        return 'rgb(' + Math.round(x[0] + (y[0] - x[0]) * t) + ',' +
            Math.round(x[1] + (y[1] - x[1]) * t) + ',' +
            Math.round(x[2] + (y[2] - x[2]) * t) + ')';
    }

    function leer(c) {
        if (c[0] === '#') return hex(c);
        var m = c.match(/\d+/g);
        return [+m[0], +m[1], +m[2]];
    }

    function palmera(g, x, y, color) {
        g.fillStyle = color;
        for (var i = 0; i < 16; i++) {
            g.fillRect(x + Math.round(Math.sin(i * .18) * 2), y - i, 2, 1);
        }
        var cy = y - 16;
        var hojas = [[-7, 1], [-5, -1], [-3, -2], [3, -2], [5, -1], [7, 1], [0, -3]];
        for (var h = 0; h < hojas.length; h++) {
            g.fillRect(x + hojas[h][0], cy + hojas[h][1], 3, 1);
            g.fillRect(x + Math.round(hojas[h][0] * .5), cy + hojas[h][1] - 1, 3, 1);
        }
    }

    medir();
    window.addEventListener('resize', medir);
    requestAnimationFrame(escena);

    /* ══════════════════════════════════════════
       4. SCROLL: XP Y FASE
       ══════════════════════════════════════════ */

    var xp = document.getElementById('xp');
    var nivelTxt = document.getElementById('nivelTxt');
    var pend = false;

    function alScroll() {
        var alto = document.documentElement.scrollHeight - window.innerHeight;
        progreso = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0;
        xp.style.width = (progreso * 100).toFixed(1) + '%';
        nivelTxt.textContent = progreso > .985 ? '¡LVL UP!' : 'NIVEL 1';
        pend = false;
    }

    window.addEventListener('scroll', function () {
        if (!pend) { pend = true; requestAnimationFrame(alScroll); }
    }, { passive: true });
    window.addEventListener('resize', alScroll);
    alScroll();

    /* ══════════════════════════════════════════
       5. FOTOS: DE PIXEL ART A FOTO
       ══════════════════════════════════════════ */

    var PASOS = [5, 8, 13, 21, 34, 55, 90, 150, 260];
    var tmp = document.createElement('canvas');
    var tctx = tmp.getContext('2d');

    function pintar(cv, img, nivel, suave) {
        var g = cv.getContext('2d');
        g.imageSmoothingEnabled = false;
        if (suave) {
            g.imageSmoothingEnabled = true;
            g.drawImage(img, 0, 0, cv.width, cv.height);
            return;
        }
        var w = nivel, h = Math.max(1, Math.round(nivel * img.naturalHeight / img.naturalWidth));
        tmp.width = w; tmp.height = h;
        tctx.imageSmoothingEnabled = false;
        tctx.drawImage(img, 0, 0, w, h);
        g.clearRect(0, 0, cv.width, cv.height);
        g.drawImage(tmp, 0, 0, w, h, 0, 0, cv.width, cv.height);
    }

    var marcos = Array.prototype.slice.call(document.querySelectorAll('.marco'));
    var fotos = [];

    marcos.forEach(function (m, i) {
        var cv = m.querySelector('canvas');
        var img = new Image();
        var ficha = { cv: cv, img: img, listo: false, revelado: false, aviso: m.querySelector('.cargando') };
        fotos.push(ficha);

        function alCargar() {
            if (ficha.listo) return;
            cv.width = 300;
            cv.height = Math.round(300 * (img.naturalHeight || 400) / (img.naturalWidth || 300));
            ficha.listo = true;
            if (ficha.aviso) ficha.aviso.remove();
            pintar(cv, img, PASOS[0], false);
            if (ficha.pedido) revelar(ficha);
        }

        img.onload = alCargar;
        img.onerror = function () {
            ficha.listo = true;
            if (ficha.aviso) ficha.aviso.textContent = 'ERROR';
        };
        img.src = m.dataset.foto;
        if (img.complete && img.naturalWidth > 0) {
            alCargar();
        }
    });

    function revelar(f) {
        if (!f.listo) { f.pedido = true; return; }
        if (f.revelado) return;
        f.revelado = true;
        if (quieto) { pintar(f.cv, f.img, 0, true); return; }
        var i = 0;
        var reloj = setInterval(function () {
            i++;
            if (i >= PASOS.length) {
                pintar(f.cv, f.img, 0, true);
                clearInterval(reloj);
                return;
            }
            pintar(f.cv, f.img, PASOS[i], false);
        }, 130);
    }

    /* ══════════════════════════════════════════
       6. APARICIONES
       ══════════════════════════════════════════ */

    var mirones = document.querySelectorAll('.aparece');

    if (!('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(mirones, function (el) { el.classList.add('visto'); });
        fotos.forEach(revelar);
    } else {
        var ojo = new IntersectionObserver(function (ent) {
            ent.forEach(function (x) {
                if (!x.isIntersecting && x.intersectionRatio <= 0) return;
                x.target.classList.add('visto');
                var idx = marcos.indexOf(x.target);
                if (idx > -1) revelar(fotos[idx]);
                ojo.unobserve(x.target);
            });
        }, { threshold: [0, 0.02, 0.05], rootMargin: '60px 0px 60px 0px' });
        Array.prototype.forEach.call(mirones, function (el) { ojo.observe(el); });
        marcos.forEach(function (m) { ojo.observe(m); });
    }

    /* ══════════════════════════════════════════
       7. COMBATE: LAS SEIS PREGUNTAS
       ══════════════════════════════════════════ */

    var PREGUNTAS = [
        { q: '¿Cuándo fue nuestro primer beso?', op: ['16 de agosto del 2025', '15 de agosto del 2025', '14 de agosto del 2025'], ok: 0 },
        { q: '¿Cuándo es mi cumpleaños?', op: ['30 de agosto', '31 de agosto', '29 de agosto'], ok: 0 },
        { q: '¿Soy el amor de tu vida?', op: ['Más o menos', 'No', 'Sí', 'No sé', 'Obvio que sí', 'Siempre lo serás'] },
        { q: '¿Crees que existen cosas por conocernos aún?', op: ['Un poco', 'No tanto', 'Sí', 'Demasiadas'] },
        { q: '¿Qué es lo que más te gusta de mí?', op: ['Mis ojos', 'Mi cariño', 'Mi sonrisa', 'Cómo te trato', 'Lo tierno que soy', 'Todo'] },
        { q: '¿Cuánto tiempo llevamos juntos?', op: ['8 meses, 3 semanas y 3 días', '8 meses, 3 semanas y 4 días', '8 meses, 3 semanas y 5 días', '8 meses, 3 semanas y 1 día'], ok: 1 }
    ];

    var elDial = document.getElementById('dialogo');
    var elMenu = document.getElementById('menu');
    var elAviso = document.getElementById('aviso');
    var elCont = document.getElementById('contador');
    var elReto = document.getElementById('reto');
    var elCarta = document.getElementById('carta');
    var actual = 0, escribiendo = null;

    function teclear(texto, alTerminar) {
        clearInterval(escribiendo);
        if (quieto) { elDial.textContent = texto; alTerminar(); return; }
        elDial.textContent = '';
        var cur = document.createElement('span');
        cur.className = 'cursor';
        elDial.appendChild(cur);
        var i = 0;
        escribiendo = setInterval(function () {
            i++;
            cur.remove();
            elDial.textContent = texto.slice(0, i);
            elDial.appendChild(cur);
            if (i >= texto.length) {
                clearInterval(escribiendo);
                setTimeout(function () { cur.remove(); alTerminar(); }, 180);
            }
        }, 24);
    }

    function pregunta() {
        var p = PREGUNTAS[actual];
        elCont.textContent = (actual + 1) + '/' + PREGUNTAS.length;
        elMenu.innerHTML = '';
        teclear(p.q, function () {
            p.op.forEach(function (txt, i) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'op';
                b.textContent = txt;
                b.addEventListener('click', function () { responder(b, p, i); });
                elMenu.appendChild(b);
            });
        });
    }

    function responder(b, p, i) {
        if (p.ok === undefined || i === p.ok) {
            b.classList.add('acierto');
            elAviso.textContent = '¡CORRECTO! +1 CORAZON';
            elAviso.className = 'aviso ok';
            actual++;
            pintarVidas(actual);
            setTimeout(function () {
                if (actual >= PREGUNTAS.length) ganar(true);
                else { elAviso.textContent = ''; pregunta(); }
            }, 620);
        } else {
            b.classList.add('fallo');
            elAviso.textContent = 'NO ES ESA... PRUEBA OTRA VEZ';
            elAviso.className = 'aviso';
            setTimeout(function () { b.classList.remove('fallo'); }, 620);
        }
    }

    function ganar(guardar) {
        elReto.classList.add('ganado');
        elDial.textContent = '¡Las respondiste todas! La carta es tuya.';
        elMenu.innerHTML = '';
        elAviso.textContent = 'OBJETO OBTENIDO: CARTA DE UN MES';
        elAviso.className = 'aviso ok';
        pintarVidas(TOTAL_P);
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn';
        b.textContent = 'ABRIR LA CARTA';
        b.addEventListener('click', abrirCarta);
        elMenu.appendChild(b);
        if (guardar) { try { localStorage.setItem(LLAVE, '1'); } catch (err) { } }
    }

    function abrirCarta() {
        elCarta.classList.add('abierta');
        setTimeout(function () {
            elCarta.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'start' });
        }, 120);
    }

    var hecho = false;
    try { hecho = localStorage.getItem(LLAVE) === '1'; } catch (err) { hecho = false; }

    if (hecho) {
        actual = PREGUNTAS.length;
        ganar(false);
        elCarta.classList.add('abierta');
    } else {
        pintarVidas(0);
        pregunta();
    }

    /* ══════════════════════════════════════════
       8. VISOR
       ══════════════════════════════════════════ */

    var visor = document.getElementById('visor');
    var visorImg = document.getElementById('visorImg');
    var enV = 0;

    function verFoto(i) {
        enV = (i + marcos.length) % marcos.length;
        visorImg.src = marcos[enV].dataset.foto;
        visorImg.alt = marcos[enV].dataset.alt || '';
        visor.classList.add('abierto');
        document.body.style.overflow = 'hidden';
        document.getElementById('vCerrar').focus();
    }

    function cerrar() {
        visor.classList.remove('abierto');
        document.body.style.overflow = '';
    }

    marcos.forEach(function (m, i) {
        m.addEventListener('click', function () { verFoto(i); });
    });

    document.getElementById('vCerrar').addEventListener('click', cerrar);
    document.getElementById('vPrev').addEventListener('click', function () { verFoto(enV - 1); });
    document.getElementById('vSig').addEventListener('click', function () { verFoto(enV + 1); });
    visor.addEventListener('click', function (ev) { if (ev.target === visor) cerrar(); });
    document.addEventListener('keydown', function (ev) {
        if (!visor.classList.contains('abierto')) return;
        if (ev.key === 'Escape') cerrar();
        else if (ev.key === 'ArrowLeft') verFoto(enV - 1);
        else if (ev.key === 'ArrowRight') verFoto(enV + 1);
    });

    /* ══════════════════════════════════════════
       9. MÚSICA
       ══════════════════════════════════════════ */

    var audio = document.getElementById('audio');
    var bSon = document.getElementById('son');
    var fundido = null;

    bSon.addEventListener('click', function () {
        if (audio.paused) {
            audio.volume = 0;
            var t = audio.play();
            if (t && t.catch) t.catch(function () { });
            clearInterval(fundido);
            var v = 0;
            fundido = setInterval(function () {
                v += .02;
                audio.volume = Math.min(.35, v);
                if (v >= .35) clearInterval(fundido);
            }, 60);
            bSon.setAttribute('aria-pressed', 'true');
            bSon.textContent = 'SON ON';
        } else {
            audio.pause();
            bSon.setAttribute('aria-pressed', 'false');
            bSon.textContent = 'SON OFF';
        }
    });
})();
