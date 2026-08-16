        // ── Generate falling petals for declarar ──
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('dclPetals');
            if (!container) return;
            const emojis = ['💛', '✨', '🌟', '💫', '🌼', '⭐'];
            for (let i = 0; i < 22; i++) {
                const p = document.createElement('div');
                p.className = 'dcl-petal';
                p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                p.style.left = Math.random() * 100 + 'vw';
                p.style.animationDuration = (10 + Math.random() * 14) + 's';
                p.style.animationDelay = (Math.random() * 20) + 's';
                p.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
                container.appendChild(p);
            }
        });

        // ── Audio context (lazy) ──
        let _audioCtx = null;
        function getAudio() {
            if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            return _audioCtx;
        }

        function playEnvelopeSound() {
            try {
                const ctx = getAudio();
                // Soft wax-crack + magical shimmer chord
                const now = ctx.currentTime;

                // Low soft thud (envelope flap)
                const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
                const data = buf.getChannelData(0);
                for (let i = 0; i < data.length; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2) * 0.35;
                }
                const src = ctx.createBufferSource();
                src.buffer = buf;
                const lp = ctx.createBiquadFilter();
                lp.type = 'lowpass'; lp.frequency.value = 220;
                src.connect(lp); lp.connect(ctx.destination);
                src.start(now);

                // Magical shimmer — ascending gold chord
                const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
                notes.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + i * 0.09);
                    osc.frequency.exponentialRampToValueAtTime(freq * 1.004, now + i * 0.09 + 1.2);
                    gain.gain.setValueAtTime(0, now + i * 0.09);
                    gain.gain.linearRampToValueAtTime(0.13, now + i * 0.09 + 0.12);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 1.8);
                    osc.connect(gain); gain.connect(ctx.destination);
                    osc.start(now + i * 0.09);
                    osc.stop(now + i * 0.09 + 2);
                });

                // Sparkle high tones
                [2093, 2637, 3136].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0, now + 0.3 + i * 0.07);
                    gain.gain.linearRampToValueAtTime(0.06, now + 0.3 + i * 0.07 + 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.07 + 0.9);
                    osc.connect(gain); gain.connect(ctx.destination);
                    osc.start(now + 0.3 + i * 0.07);
                    osc.stop(now + 2);
                });
            } catch (e) { }
        }

        function spawnGoldParticles() {
            const wrap = document.querySelector('.dcl-envelope-wrap');
            const rect = wrap.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + 80;
            const emojis = ['✨', '💛', '⭐', '🌟', '💫', '✦'];
            for (let i = 0; i < 38; i++) {
                setTimeout(() => {
                    const p = document.createElement('div');
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 60 + Math.random() * 140;
                    const tx = Math.cos(angle) * speed;
                    const ty = Math.sin(angle) * speed - 60;
                    const size = 0.8 + Math.random() * 1.1;
                    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                    p.style.cssText = `
                        position:fixed; left:${cx}px; top:${cy}px;
                        font-size:${size}rem; pointer-events:none; z-index:9998;
                        transform:translate(-50%,-50%);
                        transition: transform ${0.7 + Math.random() * 0.6}s cubic-bezier(.2,.8,.4,1),
                                    opacity ${0.5 + Math.random() * 0.5}s ease ${0.4 + Math.random() * 0.3}s;
                        opacity:1;
                    `;
                    document.body.appendChild(p);
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        p.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
                        p.style.opacity = '0';
                    }));
                    setTimeout(() => p.remove(), 1600);
                }, i * 30);
            }
        }

        function flashGoldLight() {
            // Full-screen golden flash
            const flash = document.createElement('div');
            flash.style.cssText = `
                position:fixed; inset:0; z-index:9997; pointer-events:none;
                background: radial-gradient(ellipse 70% 60% at 50% 30%,
                    rgba(245,197,24,0.38) 0%, rgba(245,140,0,0.18) 40%, transparent 75%);
                opacity:0; transition: opacity 0.18s ease;
            `;
            document.body.appendChild(flash);
            requestAnimationFrame(() => {
                flash.style.opacity = '1';
                setTimeout(() => {
                    flash.style.opacity = '0';
                    flash.style.transition = 'opacity 1.1s ease';
                    setTimeout(() => flash.remove(), 1200);
                }, 220);
            });

            // Glow ring on envelope
            const env = document.getElementById('dclEnvelope');
            env.style.transition = 'box-shadow 0.2s ease';
            env.style.boxShadow = '0 0 80px rgba(245,197,24,0.7), 0 0 160px rgba(245,197,24,0.3)';
            setTimeout(() => {
                env.style.boxShadow = '';
                env.style.transition = '';
            }, 1400);
        }

        // ── Open envelope ──
        function openEnvelope() {
            const env = document.getElementById('dclEnvelope');
            const hint = document.getElementById('dclHint');
            const qWrap = document.getElementById('dclQuestion');
            if (env.classList.contains('open')) return;

            playEnvelopeSound();
            flashGoldLight();
            spawnGoldParticles();

            env.classList.add('open');
            if (hint) hint.style.opacity = '0';

            // La carta del escritorio de pixel art se abre a la vez que ésta:
            // las dos escenas cuentan el mismo gesto, no dos cosas distintas.
            if (window.PixelPregunta) window.PixelPregunta.abrir();

            // Show question after letter finishes revealing
            setTimeout(() => {
                qWrap.style.display = 'block';
            }, 1800);
        }

        // ── Answer the question ──
        function dclAnswer(yes) {
            document.querySelector('.dcl-btns').style.display = 'none';
            document.querySelector('.dcl-q-sub').style.display = 'none';
            if (yes) {
                document.getElementById('dclResSi').style.display = 'block';
                launchHearts();
            } else {
                document.getElementById('dclResNo').style.display = 'block';
            }
        }

        // ── Heart confetti on yes ──
        function launchHearts() {
            const emojis = ['💛', '❣️', '🌟', '💫', '✨', '💝'];
            for (let i = 0; i < 40; i++) {
                setTimeout(() => {
                    const h = document.createElement('div');
                    h.className = 'dcl-confetti-heart';
                    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                    h.style.left = Math.random() * 100 + 'vw';
                    h.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
                    h.style.animationDuration = (3 + Math.random() * 4) + 's';
                    h.style.animationDelay = '0s';
                    document.body.appendChild(h);
                    setTimeout(() => h.remove(), 7000);
                }, i * 80);
            }
        }

// ── Secuenciador de audio (reemplaza al bgMusic único) ──
        const dclSeq = (() => {
            // ── Playlist con tiempos globales (segundos) ──
            const tracks = [
                { file: 'music/1teesperaba.mp3', start: 0, end: 45, from: 64, fadeIn: 3, fadeOut: 3, vol: 0.25 },
                { file: 'music/2creoenti.mp3', start: 43, end: 90, from: 56, fadeIn: 4, fadeOut: 3, vol: 0.30 },
                { file: 'music/3vasaquedarte.mp3', start: 87, end: 135, from: 58, fadeIn: 4, fadeOut: 3, vol: 0.30 },
                { file: 'music/4eresmia.mp3', start: 132, end: 180, from: 71, fadeIn: 4, fadeOut: 3, vol: 0.25 },
                { file: 'music/5caritalinda.mp3', start: 177, end: 235, from: 56, fadeIn: 4, fadeOut: 4, vol: 0.35 },
                { file: 'music/6antesdeti.mp3', start: 231, end: 275, from: 58, fadeIn: 5, fadeOut: 3, vol: 0.20 },
                { file: 'music/beso.mp3', start: 272, end: 315, from: 38, fadeIn: 3, fadeOut: 3, vol: 0.22 },
                { file: 'music/7teregalo.mp3', start: 312, end: 355, from: 66, fadeIn: 4, fadeOut: 3, vol: 0.25 },
                { file: 'music/8propuestaindecente.mp3', start: 352, end: 395, from: 67, fadeIn: 3, fadeOut: 3, vol: 0.28 },
                { file: 'music/9arroyito.mp3', start: 392, end: 420, from: 52, fadeIn: 3, fadeOut: 5, vol: 0.20 }
            ];

            let nodes = [];   // { audio, track, fadeTimer, endTimer, startTimer }
            let globalTime = 0;
            let tickInterval = null;
            let running = false;

            function createNode(track) {
                const audio = new Audio(track.file);
                audio.volume = 0;
                audio.preload = 'auto';
                // currentTime sólo funciona después de que el audio cargó sus metadatos
                audio.addEventListener('loadedmetadata', () => {
                    audio.currentTime = track.from;
                }, { once: true });
                return audio;
            }

            function fadeVolume(audio, fromVol, toVol, durationMs) {
                const steps = 40;
                const interval = durationMs / steps;
                const delta = (toVol - fromVol) / steps;
                let current = fromVol;
                let count = 0;
                const timer = setInterval(() => {
                    count++;
                    current += delta;
                    audio.volume = Math.max(0, Math.min(1, current));
                    if (count >= steps) clearInterval(timer);
                }, interval);
                return timer;
            }

            function scheduleTrack(track) {
                const delay = (track.start - globalTime) * 1000;
                if (delay < -((track.end - track.start) * 1000)) return; // ya pasó

                const audio = createNode(track);
                const node = { audio, track, fadeTimer: null, endTimer: null, startTimer: null };
                nodes.push(node);

                node.startTimer = setTimeout(() => {
                    if (!running) return;
                    audio.play().catch(() => { });
                    // Fade in
                    fadeVolume(audio, 0, track.vol, track.fadeIn * 1000);

                    // Fade out antes del fin
                    const dur = (track.end - track.start) * 1000;
                    const fadeOutStart = dur - track.fadeOut * 1000;
                    node.fadeTimer = setTimeout(() => {
                        if (!running) return;
                        fadeVolume(audio, track.vol, 0, track.fadeOut * 1000);
                    }, fadeOutStart);

                    // Stop al final
                    node.endTimer = setTimeout(() => {
                        audio.pause();
                        audio.src = '';
                    }, dur + 200);

                }, Math.max(0, delay));
            }

            function tick() {
                globalTime += 0.25;
            }

            function start() {
                if (running) return;
                running = true;
                globalTime = 0;
                nodes = [];

                tracks.forEach(t => scheduleTrack(t));
                tickInterval = setInterval(tick, 250);
            }

            function stop() {
                if (!running) return;
                running = false;
                clearInterval(tickInterval);
                nodes.forEach(n => {
                    clearTimeout(n.startTimer);
                    clearTimeout(n.fadeTimer);
                    clearTimeout(n.endTimer);
                    try {
                        fadeVolume(n.audio, n.audio.volume, 0, 800);
                        setTimeout(() => { n.audio.pause(); n.audio.src = ''; }, 900);
                    } catch (e) { }
                });
                nodes = [];
            }

            return { start, stop };
        })();

// ── Arranque automático + botón de música (usa el secuenciador, no <audio id="bgMusic">) ──
document.addEventListener('DOMContentLoaded', () => {
    const musicBtn = document.getElementById('musicBtn');
    let isPlaying = false;

    // Mismo adorno que el resto del sitio (pastilla + ecualizador),
    // aunque aquí la música la maneje el secuenciador y no un <audio>.
    const pintar = initMusicButton(musicBtn);

    dclSeq.start();
    isPlaying = true;
    pintar(true);

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            if (isPlaying) dclSeq.stop();
            else dclSeq.start();
            isPlaying = !isPlaying;
            pintar(isPlaying);
        });
    }
});
