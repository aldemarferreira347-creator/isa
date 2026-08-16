// ═══════════════════════════════════════════════════════════════
// FX-ENGINE.JS — motor de animación del sitio
//
// Por qué existe:
//   Antes cada efecto abría su propio requestAnimationFrame o su propio
//   listener de scroll/pointer. Con 8 efectos eso son 8 bucles compitiendo,
//   8 lecturas de layout por frame y saltos de cuadro en celular.
//   Aquí hay UN bucle, UNA lectura de scroll y UNA de puntero por frame,
//   y todo lo demás se suscribe.
//
// Reglas de la casa:
//   · Leer layout y escribir estilos nunca se mezclan en el mismo paso.
//   · will-change se enciende al empezar a animar y se apaga al terminar.
//   · Todo módulo se apaga solo si el dispositivo no da, o si el usuario
//     pidió menos movimiento.
// ═══════════════════════════════════════════════════════════════

const FX = (function () {
    'use strict';

    // ══════════════════════════════════════════════
    // 1. CAPACIDADES — cuánto puede el aparato
    // ══════════════════════════════════════════════
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');
    const mqHover = window.matchMedia('(hover: hover)');

    const cap = {
        get reduce() { return mqReduce.matches; },
        get tactil() { return mqCoarse.matches; },
        get hover() { return mqHover.matches; },
        nucleos: navigator.hardwareConcurrency || 4,
        memoria: navigator.deviceMemory || 4
    };

    // Anulación manual del nivel: ?fx=0|1|2 en la URL, o <html data-fx-nivel="2">.
    // Sirve para depurar y para forzar el modo completo en un equipo que el
    // autodetector clasificó como flojo (o al revés).
    function nivelForzado() {
        const p = new URLSearchParams(location.search).get('fx');
        const d = document.documentElement.dataset.fxNivel;
        const v = p !== null ? p : d;
        if (v === null || v === undefined) return null;
        const n = parseInt(v, 10);
        return (n === 0 || n === 1 || n === 2) ? n : null;
    }

    // Nivel 0 = quieto · 1 = sobrio · 2 = completo
    function calcularNivel() {
        const forzado = nivelForzado();
        if (forzado !== null) return forzado;
        if (cap.reduce) return 0;
        if (cap.nucleos <= 4 || cap.memoria <= 2 || window.innerWidth < 480) return 1;
        return 2;
    }
    let nivel = calcularNivel();

    // Si el usuario cambia la preferencia del sistema en caliente, obedecer
    const oyentesNivel = [];
    function alCambiarNivel(fn) { oyentesNivel.push(fn); }
    mqReduce.addEventListener('change', () => {
        nivel = calcularNivel();
        oyentesNivel.forEach(fn => fn(nivel));
    });

    // ══════════════════════════════════════════════
    // 2. TICKER — el único requestAnimationFrame
    // ══════════════════════════════════════════════
    const tareas = new Set();
    let rafId = null;
    let ultimoT = 0;

    function bucle(t) {
        rafId = requestAnimationFrame(bucle);

        // dt en segundos. Se recorta: si la pestaña estuvo oculta 3 minutos,
        // un dt gigante haría explotar cualquier integración física.
        let dt = (t - ultimoT) / 1000;
        ultimoT = t;
        if (!(dt > 0)) dt = 1 / 60;
        if (dt > 0.05) dt = 0.05;

        for (const tarea of tareas) {
            try { tarea(dt, t); }
            catch (e) { tareas.delete(tarea); console.error('[FX] tarea caída:', e); }
        }

        if (tareas.size === 0) { cancelAnimationFrame(rafId); rafId = null; }
    }

    function sumar(tarea) {
        tareas.add(tarea);
        if (rafId === null) { ultimoT = performance.now(); rafId = requestAnimationFrame(bucle); }
        return () => tareas.delete(tarea);
    }

    // En pestaña oculta no se anima: ahorra batería y evita el dt gigante
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        } else if (tareas.size > 0 && rafId === null) {
            ultimoT = performance.now();
            rafId = requestAnimationFrame(bucle);
        }
    });

    // ══════════════════════════════════════════════
    // 3. MUELLE — física en vez de easing fijo
    //
    // Un cubic-bezier siempre tarda lo mismo, venga de donde venga.
    // Un muelle arranca desde su velocidad actual, así que si el cursor
    // cambia de rumbo a mitad de camino el movimiento se dobla en vez
    // de reiniciarse. Eso es lo que hace que se sienta físico.
    // ══════════════════════════════════════════════
    function Muelle(inicial, rigidez, amortiguacion) {
        this.v = inicial || 0;
        this.destino = this.v;
        this.vel = 0;
        this.k = rigidez || 170;
        this.c = amortiguacion || 22;
    }
    // Paso máximo de integración. Euler semi-implícito es estable mientras
    // h < 2/sqrt(k); con k=900 (el muelle más rígido del motor) eso son ~0.066s.
    // 1/120 deja margen de sobra para cualquier rigidez que usemos.
    const H_MAX = 1 / 120;
    const SUBPASOS_MAX = 8;

    Muelle.prototype.paso = function (dt) {
        if (!(dt > 0)) return this.v;
        // Recorte duro: sin esto, un dt de varios segundos (pestaña que vuelve
        // del fondo, depurador pausado) manda el muelle al infinito.
        if (dt > 0.1) dt = 0.1;

        let n = Math.ceil(dt / H_MAX);
        if (n > SUBPASOS_MAX) n = SUBPASOS_MAX;
        const h = dt / n;

        for (let i = 0; i < n; i++) {
            const a = this.k * (this.destino - this.v) - this.c * this.vel;
            this.vel += a * h;
            this.v += this.vel * h;
        }
        return this.v;
    };
    Muelle.prototype.quieto = function (eps) {
        const e = eps || 0.0005;
        return Math.abs(this.vel) < e && Math.abs(this.destino - this.v) < e;
    };
    Muelle.prototype.fijar = function (v) { this.v = this.destino = v; this.vel = 0; };

    // ══════════════════════════════════════════════
    // 4. PUNTERO — una sola lectura por frame
    // ══════════════════════════════════════════════
    const puntero = { x: innerWidth / 2, y: innerHeight / 2, dentro: false, activo: false };
    if (cap.hover) {
        addEventListener('pointermove', e => {
            if (e.pointerType === 'touch') return;
            puntero.x = e.clientX; puntero.y = e.clientY;
            puntero.dentro = true; puntero.activo = true;
        }, { passive: true });
        addEventListener('pointerleave', () => { puntero.dentro = false; }, { passive: true });
    }

    // ══════════════════════════════════════════════
    // 5. SCROLL — una sola lectura por frame
    // ══════════════════════════════════════════════
    const scroll = { y: 0, prev: 0, vel: 0, progreso: 0 };
    let scrollSucio = true;
    addEventListener('scroll', () => { scrollSucio = true; }, { passive: true });
    addEventListener('resize', () => { scrollSucio = true; nivel = calcularNivel(); }, { passive: true });

    function leerScroll() {
        if (!scrollSucio) return;
        scrollSucio = false;
        scroll.prev = scroll.y;
        scroll.y = window.scrollY || document.documentElement.scrollTop;
        scroll.vel = scroll.y - scroll.prev;
        const max = document.documentElement.scrollHeight - innerHeight;
        scroll.progreso = max > 0 ? Math.min(1, Math.max(0, scroll.y / max)) : 0;
    }

    // ══════════════════════════════════════════════
    // 6. UTILIDADES
    // ══════════════════════════════════════════════
    const lim = (v, a, b) => v < a ? a : v > b ? b : v;
    const mezcla = (a, b, t) => a + (b - a) * t;
    const suave = t => { t = lim(t, 0, 1); return t * t * (3 - 2 * t); };

    // Divide texto en grafemas de verdad: "❣️" y "👩‍👧" son UN carácter visible,
    // aunque ocupen varios code points. Partirlos por índice los rompe.
    function grafemas(txt) {
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            const seg = new Intl.Segmenter('es', { granularity: 'grapheme' });
            return Array.from(seg.segment(txt), s => s.segment);
        }
        return Array.from(txt); // respeta pares suplentes, no secuencias ZWJ
    }

    function visible(el, margen) {
        const r = el.getBoundingClientRect();
        const m = margen || 0;
        return r.bottom > -m && r.top < innerHeight + m;
    }

    // ══════════════════════════════════════════════
    // 7. MÓDULO: INCLINACIÓN 3D CON DESTELLO
    // La tarjeta se inclina hacia el cursor y una luz recorre su superficie
    // según el ángulo, como si hubiera una lámpara fija en la sala.
    // ══════════════════════════════════════════════
    function tilt(selector, opciones) {
        if (nivel < 2 || !cap.hover) return;
        const o = Object.assign({ max: 9, escala: 1.02, alturaZ: 26, brillo: true }, opciones);
        const nodos = document.querySelectorAll(selector);
        if (!nodos.length) return;

        nodos.forEach(el => {
            const mx = new Muelle(0, 190, 24);
            const my = new Muelle(0, 190, 24);
            const ms = new Muelle(0, 190, 26); // 0 = reposo, 1 = activo
            let caja = null, parar = null, encima = false;

            if (o.brillo && !el.querySelector('.fx-glare')) {
                const g = document.createElement('span');
                g.className = 'fx-glare';
                g.setAttribute('aria-hidden', 'true');
                el.appendChild(g);
            }
            const glare = el.querySelector('.fx-glare');

            function animar(dt) {
                mx.paso(dt); my.paso(dt); ms.paso(dt);
                const s = ms.v;
                el.style.transform =
                    `perspective(900px) rotateX(${(-my.v * o.max).toFixed(3)}deg) ` +
                    `rotateY(${(mx.v * o.max).toFixed(3)}deg) ` +
                    `translate3d(0,${(-s * 6).toFixed(2)}px,${(s * o.alturaZ).toFixed(2)}px) ` +
                    `scale(${mezcla(1, o.escala, s).toFixed(4)})`;

                if (glare) {
                    glare.style.opacity = (s * 0.5).toFixed(3);
                    glare.style.backgroundPosition =
                        `${(50 - mx.v * 45).toFixed(1)}% ${(50 - my.v * 45).toFixed(1)}%`;
                }

                // Terminó el reposo: soltar el bucle y limpiar will-change
                if (!encima && mx.quieto() && my.quieto() && ms.quieto()) {
                    el.style.transform = '';
                    el.style.willChange = '';
                    if (glare) glare.style.opacity = '0';
                    if (parar) { parar(); parar = null; }
                }
            }

            function arrancar() {
                if (!parar) { el.style.willChange = 'transform'; parar = sumar(animar); }
            }

            el.addEventListener('pointerenter', e => {
                if (e.pointerType === 'touch') return;
                encima = true; caja = el.getBoundingClientRect();
                ms.destino = 1; arrancar();
            });
            el.addEventListener('pointermove', e => {
                if (e.pointerType === 'touch' || !caja) return;
                mx.destino = lim(((e.clientX - caja.left) / caja.width - .5) * 2, -1, 1);
                my.destino = lim(((e.clientY - caja.top) / caja.height - .5) * 2, -1, 1);
            });
            el.addEventListener('pointerleave', () => {
                encima = false;
                mx.destino = 0; my.destino = 0; ms.destino = 0;
                arrancar();
            });
        });
    }

    // ══════════════════════════════════════════════
    // 8. MÓDULO: BOTÓN MAGNÉTICO
    // Dentro de un radio, el botón se deja atraer por el cursor.
    // El texto se mueve menos que la cápsula: da sensación de capas.
    // ══════════════════════════════════════════════
    function magnetico(selector, opciones) {
        if (nivel < 2 || !cap.hover) return;
        const o = Object.assign({ radio: 110, fuerza: .34, fuerzaTexto: .16 }, opciones);
        document.querySelectorAll(selector).forEach(el => {
            const mx = new Muelle(0, 150, 18), my = new Muelle(0, 150, 18);
            let parar = null;
            const hijo = el.firstElementChild;

            function animar(dt) {
                mx.paso(dt); my.paso(dt);
                el.style.transform = `translate3d(${mx.v.toFixed(2)}px,${my.v.toFixed(2)}px,0)`;
                if (hijo) {
                    const f = o.fuerzaTexto / o.fuerza;
                    hijo.style.transform =
                        `translate3d(${(mx.v * f).toFixed(2)}px,${(my.v * f).toFixed(2)}px,0)`;
                }
                if (mx.destino === 0 && my.destino === 0 && mx.quieto(.02) && my.quieto(.02)) {
                    el.style.transform = ''; el.style.willChange = '';
                    if (hijo) hijo.style.transform = '';
                    if (parar) { parar(); parar = null; }
                }
            }

            sumar(function vigilar(dt) {
                if (!puntero.activo) return;
                const r = el.getBoundingClientRect();
                if (!r.width) return;
                const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
                const dx = puntero.x - cx, dy = puntero.y - cy;
                const dist = Math.hypot(dx, dy);
                const alcance = o.radio + Math.max(r.width, r.height) / 2;

                if (dist < alcance) {
                    const caida = 1 - dist / alcance;
                    mx.destino = dx * o.fuerza * caida;
                    my.destino = dy * o.fuerza * caida;
                    if (!parar) { el.style.willChange = 'transform'; parar = sumar(animar); }
                } else if (mx.destino !== 0 || my.destino !== 0) {
                    mx.destino = 0; my.destino = 0;
                    if (!parar) { parar = sumar(animar); }
                }
            });
        });
    }

    // ══════════════════════════════════════════════
    // 9. MÓDULO: PARALAJE POR SCROLL
    // Cada capa avanza a distinta velocidad. Sólo se calcula
    // lo que está en pantalla.
    // ══════════════════════════════════════════════
    function paralaje(selector, opciones) {
        if (nivel < 1) return;
        const o = Object.assign({ factor: .18, eje: 'y' }, opciones);
        const nodos = Array.from(document.querySelectorAll(selector));
        if (!nodos.length) return;

        const datos = nodos.map(el => ({
            el,
            f: parseFloat(el.dataset.fxParalaje) || o.factor,
            m: new Muelle(0, 90, 18)
        }));

        sumar(function (dt) {
            leerScroll();
            const mitad = innerHeight / 2;
            for (const d of datos) {
                if (!visible(d.el, 140)) continue;
                const r = d.el.getBoundingClientRect();
                const centro = r.top + r.height / 2;
                d.m.destino = (centro - mitad) * -d.f;
                d.m.paso(dt);
                d.el.style.transform = o.eje === 'x'
                    ? `translate3d(${d.m.v.toFixed(2)}px,0,0)`
                    : `translate3d(0,${d.m.v.toFixed(2)}px,0)`;
            }
        });
    }

    // ══════════════════════════════════════════════
    // 10. MÓDULO: TEXTO POR GRAFEMAS
    // Cada letra entra por separado. El texto original queda en aria-label
    // para que un lector de pantalla lo lea entero y no letra por letra.
    // ══════════════════════════════════════════════
    function partirTexto(el) {
        if (el.dataset.fxPartido) return el.querySelectorAll('.fx-ch');
        const original = el.textContent.trim();
        el.setAttribute('aria-label', original);

        // Sólo se tocan nodos de texto: los <br> y <em> internos sobreviven
        const trabajo = [];
        (function recorrer(nodo) {
            for (const hijo of Array.from(nodo.childNodes)) {
                if (hijo.nodeType === 3 && hijo.textContent.trim()) trabajo.push(hijo);
                else if (hijo.nodeType === 1) recorrer(hijo);
            }
        })(el);

        let i = 0;
        for (const nodoTexto of trabajo) {
            const frag = document.createDocumentFragment();
            for (const g of grafemas(nodoTexto.textContent)) {
                if (g === ' ') { frag.appendChild(document.createTextNode(' ')); continue; }
                const s = document.createElement('span');
                s.className = 'fx-ch';
                s.textContent = g;
                s.style.setProperty('--ci', i++);
                s.setAttribute('aria-hidden', 'true');
                frag.appendChild(s);
            }
            nodoTexto.parentNode.replaceChild(frag, nodoTexto);
        }
        el.dataset.fxPartido = '1';
        el.style.setProperty('--ctotal', i);
        return el.querySelectorAll('.fx-ch');
    }

    function textoEntra(selector) {
        document.querySelectorAll(selector).forEach(el => {
            if (nivel === 0) { el.classList.add('fx-texto-listo'); return; }
            partirTexto(el);
            el.classList.add('fx-texto');
            const io = new IntersectionObserver(es => {
                es.forEach(e => {
                    if (!e.isIntersecting) return;
                    e.target.classList.add('fx-texto-listo');
                    io.unobserve(e.target);
                });
            }, { threshold: .2 });
            io.observe(el);
        });
    }

    // ══════════════════════════════════════════════
    // 11. MÓDULO: CAMPO DE PARTÍCULAS EN CANVAS
    // 30 divs con animación CSS cuestan 30 capas de composición.
    // Un canvas cuesta una. Además permite unir las cercanas con líneas,
    // cosa imposible con elementos sueltos.
    // ══════════════════════════════════════════════
    function particulas(contenedor, opciones) {
        const host = typeof contenedor === 'string' ? document.querySelector(contenedor) : contenedor;
        if (!host || nivel === 0) return null;

        const o = Object.assign({
            densidad: nivel === 2 ? 1 : .45,
            color: '255,224,68',
            unir: nivel === 2,
            distUnion: 130,
            reaccionaPuntero: nivel === 2
        }, opciones);

        const cv = document.createElement('canvas');
        cv.className = 'fx-particulas';
        cv.setAttribute('aria-hidden', 'true');
        host.appendChild(cv);
        const ctx = cv.getContext('2d', { alpha: true });

        let W = 0, H = 0, dpr = 1, ps = [];

        function medir() {
            const r = host.getBoundingClientRect();
            dpr = Math.min(devicePixelRatio || 1, 2);
            W = Math.max(1, r.width); H = Math.max(1, r.height);
            cv.width = W * dpr; cv.height = H * dpr;
            cv.style.width = W + 'px'; cv.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            sembrar();
        }

        function sembrar() {
            const n = Math.round((W * H) / 26000 * o.densidad);
            ps = [];
            for (let i = 0; i < n; i++) {
                ps.push({
                    x: Math.random() * W, y: Math.random() * H,
                    vx: (Math.random() - .5) * 9, vy: (Math.random() - .5) * 9 - 5,
                    r: .7 + Math.random() * 2.1,
                    a: .18 + Math.random() * .5,
                    f: .4 + Math.random() * 1.5,   // frecuencia del parpadeo
                    p: Math.random() * Math.PI * 2 // fase
                });
            }
        }

        let t = 0;
        function dibujar(dt) {
            if (document.hidden) return;
            t += dt;
            ctx.clearRect(0, 0, W, H);

            const rHost = host.getBoundingClientRect();
            const px = puntero.x - rHost.left, py = puntero.y - rHost.top;
            const hayPuntero = o.reaccionaPuntero && puntero.dentro &&
                px > -80 && px < W + 80 && py > -80 && py < H + 80;

            for (const p of ps) {
                p.x += p.vx * dt; p.y += p.vy * dt;

                // El cursor empuja suavemente lo que tiene cerca
                if (hayPuntero) {
                    const dx = p.x - px, dy = p.y - py;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 12000 && d2 > 1) {
                        const inv = 1 / Math.sqrt(d2);
                        const f = (1 - Math.sqrt(d2) / 110) * 26;
                        p.x += dx * inv * f * dt; p.y += dy * inv * f * dt;
                    }
                }

                // Envolver por los bordes
                if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
                if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;

                const brillo = p.a * (.55 + .45 * Math.sin(t * p.f + p.p));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 6.283185);
                ctx.fillStyle = `rgba(${o.color},${brillo.toFixed(3)})`;
                ctx.fill();
            }

            // Hilos entre partículas cercanas
            if (o.unir) {
                const dm = o.distUnion, dm2 = dm * dm;
                ctx.lineWidth = .6;
                for (let i = 0; i < ps.length; i++) {
                    for (let j = i + 1; j < ps.length; j++) {
                        const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
                        const d2 = dx * dx + dy * dy;
                        if (d2 > dm2) continue;
                        ctx.strokeStyle = `rgba(${o.color},${(.13 * (1 - d2 / dm2)).toFixed(3)})`;
                        ctx.beginPath();
                        ctx.moveTo(ps[i].x, ps[i].y);
                        ctx.lineTo(ps[j].x, ps[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        medir();
        if (typeof ResizeObserver !== 'undefined') {
            let tmr = null;
            new ResizeObserver(() => { clearTimeout(tmr); tmr = setTimeout(medir, 160); }).observe(host);
        } else {
            addEventListener('resize', () => { clearTimeout(window.__fxPTmr); window.__fxPTmr = setTimeout(medir, 160); });
        }

        const parar = sumar(dibujar);
        return { parar: () => { parar(); cv.remove(); }, remedir: medir };
    }

    // ══════════════════════════════════════════════
    // 12. MÓDULO: CURSOR PROPIO
    // Un punto que sigue exacto y un anillo que llega tarde.
    // Ese desfase es lo que da la sensación de peso.
    // ══════════════════════════════════════════════
    function cursor() {
        if (nivel < 2 || !cap.hover || cap.tactil) return;

        const anillo = document.createElement('div');
        anillo.className = 'fx-cursor-anillo';
        anillo.setAttribute('aria-hidden', 'true');
        const punto = document.createElement('div');
        punto.className = 'fx-cursor-punto';
        punto.setAttribute('aria-hidden', 'true');
        document.body.append(anillo, punto);

        const ax = new Muelle(puntero.x, 120, 17), ay = new Muelle(puntero.y, 120, 17);
        const esc = new Muelle(1, 200, 20);
        const px = new Muelle(puntero.x, 900, 45), py = new Muelle(puntero.y, 900, 45);

        document.body.classList.add('fx-cursor-activo');

        sumar(function (dt) {
            ax.destino = puntero.x; ay.destino = puntero.y;
            px.destino = puntero.x; py.destino = puntero.y;
            ax.paso(dt); ay.paso(dt); esc.paso(dt); px.paso(dt); py.paso(dt);

            anillo.style.transform =
                `translate3d(${ax.v.toFixed(2)}px,${ay.v.toFixed(2)}px,0) translate(-50%,-50%) scale(${esc.v.toFixed(3)})`;
            punto.style.transform =
                `translate3d(${px.v.toFixed(2)}px,${py.v.toFixed(2)}px,0) translate(-50%,-50%)`;

            const op = puntero.dentro ? 1 : 0;
            anillo.style.opacity = op; punto.style.opacity = op;
        });

        // Sobre cualquier cosa pulsable el anillo crece
        const pulsable = 'a,button,.nav-card,.card,.photo-card,[role="button"],input,textarea,select';
        document.addEventListener('pointerover', e => {
            if (e.target.closest && e.target.closest(pulsable)) {
                esc.destino = 2.1; anillo.classList.add('es-activo');
            }
        }, { passive: true });
        document.addEventListener('pointerout', e => {
            if (e.target.closest && e.target.closest(pulsable)) {
                esc.destino = 1; anillo.classList.remove('es-activo');
            }
        }, { passive: true });
        document.addEventListener('pointerdown', () => { esc.destino *= .62; }, { passive: true });
        document.addEventListener('pointerup', () => {
            esc.destino = anillo.classList.contains('es-activo') ? 2.1 : 1;
        }, { passive: true });
    }

    // ══════════════════════════════════════════════
    // 13. MÓDULO: ONDA AL PULSAR
    // ══════════════════════════════════════════════
    function onda(selector) {
        if (nivel === 0) return;
        document.addEventListener('pointerdown', e => {
            const el = e.target.closest && e.target.closest(selector);
            if (!el) return;
            const r = el.getBoundingClientRect();
            const d = Math.max(r.width, r.height) * 2.1;
            const o = document.createElement('span');
            o.className = 'fx-onda';
            o.setAttribute('aria-hidden', 'true');
            o.style.cssText =
                `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
            if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
            el.appendChild(o);
            o.addEventListener('animationend', () => o.remove(), { once: true });
            setTimeout(() => o.remove(), 1200); // por si animationend no llega
        }, { passive: true });
    }

    // ══════════════════════════════════════════════
    // 14. MÓDULO: BARRA DE PROGRESO DE LECTURA
    // ══════════════════════════════════════════════
    function progresoLectura() {
        if (nivel === 0) return;
        if (document.documentElement.scrollHeight - innerHeight < 400) return;
        const barra = document.createElement('div');
        barra.className = 'fx-progreso';
        barra.setAttribute('aria-hidden', 'true');
        barra.innerHTML = '<i></i>';
        document.body.appendChild(barra);
        const relleno = barra.firstElementChild;
        const m = new Muelle(0, 120, 20);
        sumar(function (dt) {
            leerScroll();
            m.destino = scroll.progreso;
            m.paso(dt);
            relleno.style.transform = `scaleX(${lim(m.v, 0, 1).toFixed(4)})`;
        });
    }

    // ══════════════════════════════════════════════
    // 15. MÓDULO: ODÓMETRO
    // El dígito viejo sale por arriba y el nuevo entra por abajo,
    // en una ventana recortada. Sólo cambia la columna que cambió.
    // ══════════════════════════════════════════════
    function odometro(el) {
        let ultimo = '';
        const columnas = [];

        function nuevaColumna() {
            const c = document.createElement('span');
            c.className = 'fx-odo-col';
            const cinta = document.createElement('span');
            cinta.className = 'fx-odo-cinta';
            for (let i = 0; i <= 9; i++) {
                const d = document.createElement('span');
                d.className = 'fx-odo-d';
                d.textContent = i;
                cinta.appendChild(d);
            }
            c.appendChild(cinta);
            return { raiz: c, cinta, valor: -1 };
        }

        return function pintar(txt) {
            txt = String(txt);
            if (txt === ultimo) return;
            ultimo = txt;

            while (columnas.length < txt.length) {
                const c = nuevaColumna();
                columnas.push(c);
                el.appendChild(c.raiz);
            }
            while (columnas.length > txt.length) {
                const c = columnas.pop();
                c.raiz.remove();
            }

            for (let i = 0; i < txt.length; i++) {
                const n = parseInt(txt[i], 10);
                const c = columnas[i];
                if (c.valor === n) continue;
                c.valor = n;
                c.cinta.style.transform = `translateY(${-n * 10}%)`;
            }
        };
    }

    // ══════════════════════════════════════════════
    // 16. MÓDULO: REVELADO CON DIRECCIÓN DE SCROLL
    // Si vas bajando entra desde abajo; si subes, desde arriba.
    // ══════════════════════════════════════════════
    function revelar(selector, opciones) {
        const o = Object.assign({ umbral: .12, margen: '0px 0px -7% 0px' }, opciones);
        const nodos = document.querySelectorAll(selector);
        if (!nodos.length) return;

        if (nivel === 0) { nodos.forEach(n => n.classList.add('visible')); return; }

        const io = new IntersectionObserver(es => {
            leerScroll();
            const subiendo = scroll.vel < 0;
            es.forEach(e => {
                if (!e.isIntersecting) return;
                e.target.classList.toggle('desde-arriba', subiendo);
                e.target.classList.add('visible');
                io.unobserve(e.target);
            });
        }, { threshold: o.umbral, rootMargin: o.margen });

        nodos.forEach(n => io.observe(n));
    }

    // ══════════════════════════════════════════════
    // API
    // ══════════════════════════════════════════════
    return {
        get nivel() { return nivel; },
        cap, puntero, scroll,
        Muelle, sumar, lim, mezcla, suave, grafemas, visible,
        tilt, magnetico, paralaje, textoEntra, partirTexto,
        particulas, cursor, onda, progresoLectura, odometro, revelar,
        alCambiarNivel
    };
})();

// Un `const` de nivel superior vive en el ámbito léxico global, no en window:
// otros scripts clásicos lo ven, pero no es accesible desde fuera del documento
// (consola de otro frame, extensiones, pruebas). Se expone a propósito.
window.FX = FX;
