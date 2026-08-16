/* ============================================================================
   CARTA CUMPLEAÑOS — capa DOM
   ----------------------------------------------------------------------------
   Bienvenida, página de la carta y sistema de música.
   La escena 3D vive aparte, en js/corazon-3d.js.

   Nada de lo que hay aquí toca el texto de la carta: sólo su decoración.
   ========================================================================== */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  //  ESTRELLAS PARPADEANTES (bienvenida + carta)
  //  Ahora con temperatura de color y tres tamaños de "magnitud", para que el
  //  cielo tenga jerarquía en vez de ser ruido uniforme.
  // ==========================================================================
  function spawnStars(containerId, count) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const frag = document.createDocumentFragment();
    const tintes = [
      'rgba(255,255,255,',
      'rgba(255,246,229,',
      'rgba(255,232,186,',
      'rgba(214,228,255,'
    ];
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'wstar';
      // magnitud sesgada: muchísimas débiles, unas pocas que destacan
      const m = Math.pow(Math.random(), 3.1);
      const sz = (0.7 + m * 3.4).toFixed(2);
      const tinte = tintes[(Math.random() * tintes.length) | 0];
      s.style.width = sz + 'px';
      s.style.height = sz + 'px';
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      s.style.top = (Math.random() * 100).toFixed(2) + '%';
      s.style.setProperty('--dur', (1.6 + Math.random() * 4.2).toFixed(2) + 's');
      s.style.setProperty('--delay', (Math.random() * 6).toFixed(2) + 's');
      s.style.setProperty('--tinte', tinte + '1)');
      s.style.setProperty('--halo', tinte + (0.35 + m * 0.45).toFixed(2) + ')');
      s.style.opacity = (0.10 + m * 0.75).toFixed(2);
      if (m > 0.72) s.classList.add('wstar--brillante');
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }
  spawnStars('welcome-stars', 220);
  spawnStars('letter-stars', 120);

  // ==========================================================================
  //  PÁGINA DE LA CARTA — revelado, progreso, ascuas, pistas
  // ==========================================================================
  (function () {
    const page = document.getElementById('letter-page');
    const scroller = document.getElementById('letter-scroll');
    const fadeBottom = document.getElementById('letter-fade-bottom');
    const scrollHint = document.getElementById('letter-scroll-hint');
    const progressFill = document.getElementById('letter-progress-fill');
    const closeBtn = document.getElementById('letter-close');
    if (!page || !scroller) return;

    // ---- revelado escalonado al entrar en vista -----------------------------
    const revealTargets = [
      document.getElementById('letter-head'),
      ...document.querySelectorAll('#letter-body > *'),
      document.getElementById('letter-footer')
    ].filter(Boolean);

    // Alternar el sentido de entrada rompe la monotonía de "todo sube igual".
    revealTargets.forEach((el, i) => {
      el.classList.add('rv');
      if (el.classList.contains('pull')) el.classList.add('rv--zoom');
      else if (el.classList.contains('q-list') || el.classList.contains('gifts')) el.classList.add('rv--escala');
      else el.classList.add(i % 3 === 1 ? 'rv--izq' : 'rv--abajo');
    });

    if (reduceMotion) {
      revealTargets.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        });
      }, { root: scroller, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
      revealTargets.forEach((el) => io.observe(el));
    }

    // ---- progreso de lectura + pistas --------------------------------------
    let ticking = false;
    let progresoActual = 0;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = scroller.scrollHeight - scroller.clientHeight;
        const frac = max > 0 ? Math.min(1, scroller.scrollTop / max) : 0;
        progresoActual = frac;
        if (progressFill) progressFill.style.width = (frac * 100).toFixed(2) + '%';
        const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 24;
        if (fadeBottom) fadeBottom.classList.toggle('hidden', atBottom);
        if (scrollHint) scrollHint.classList.toggle('hidden', scroller.scrollTop > 40 || atBottom);
        // el fondo se calienta conforme avanzas: la carta "arde" más al final
        page.style.setProperty('--avance', frac.toFixed(3));
        ticking = false;
      });
    }
    scroller.addEventListener('scroll', onScroll, { passive: true });

    // ---- ascuas doradas -----------------------------------------------------
    // Dos poblaciones: brasas grandes lentas al fondo y polvo fino veloz
    // delante. Se dibuja sólo mientras la carta está abierta.
    const emberCanvas = document.getElementById('letter-embers');
    const ectx = emberCanvas ? emberCanvas.getContext('2d') : null;
    let motes = [];
    let emberRAF = null;
    let emberLast = 0;
    let velocidadScroll = 0;
    let scrollPrev = 0;

    function sizeEmbers() {
      if (!emberCanvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      emberCanvas.width = Math.floor(page.clientWidth * dpr);
      emberCanvas.height = Math.floor(page.clientHeight * dpr);
      emberCanvas.style.width = page.clientWidth + 'px';
      emberCanvas.style.height = page.clientHeight + 'px';
      ectx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seedMotes() {
      const w = page.clientWidth, h = page.clientHeight;
      const count = Math.min(180, Math.round((w * h) / 14000));
      motes = [];
      for (let i = 0; i < count; i++) {
        const capa = Math.random();               // 0 = fondo, 1 = frente
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (0.5 + Math.random() * 1.6) * (0.6 + capa * 1.1),
          sp: (0.10 + Math.random() * 0.42) * (0.45 + capa * 1.3),
          drift: (Math.random() - 0.5) * 0.32,
          ph: Math.random() * Math.PI * 2,
          pf: 0.5 + Math.random() * 1.6,
          capa,
          calor: Math.random()                     // mezcla ámbar → pálido
        });
      }
    }
    function drawEmbers(ts) {
      emberRAF = requestAnimationFrame(drawEmbers);
      if (ts - emberLast < 16) return;
      const dt = Math.min(2.5, (ts - emberLast) / 16.67) || 1;
      emberLast = ts;

      const w = page.clientWidth, h = page.clientHeight;
      ectx.clearRect(0, 0, w, h);
      ectx.globalCompositeOperation = 'lighter';

      // el scroll empuja las brasas: da sensación de aire moviéndose
      const empuje = velocidadScroll * 0.06;
      velocidadScroll *= 0.90;

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.y -= (m.sp + empuje * (0.3 + m.capa)) * dt;
        m.x += (m.drift + Math.sin(m.y * 0.011 + m.ph) * 0.28) * dt;
        m.ph += 0.012 * dt;
        if (m.y < -8) { m.y = h + 8; m.x = Math.random() * w; }
        if (m.y > h + 12) { m.y = -8; m.x = Math.random() * w; }
        if (m.x < -10) m.x = w + 10; else if (m.x > w + 10) m.x = -10;

        const tw = 0.35 + 0.65 * Math.abs(Math.sin(m.ph * m.pf));
        const a = tw * (0.25 + m.capa * 0.75);
        const R = m.r * 3.4;
        const g = ectx.createRadialGradient(m.x, m.y, 0, m.x, m.y, R);
        const cal = m.calor;
        g.addColorStop(0, 'rgba(255,' + (232 + cal * 20 | 0) + ',' + (170 + cal * 60 | 0) + ',' + (0.85 * a).toFixed(3) + ')');
        g.addColorStop(0.38, 'rgba(255,' + (196 + cal * 30 | 0) + ',' + (78 + cal * 40 | 0) + ',' + (0.40 * a).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(255,178,54,0)');
        ectx.fillStyle = g;
        ectx.beginPath();
        ectx.arc(m.x, m.y, R, 0, Math.PI * 2);
        ectx.fill();
      }
      ectx.globalCompositeOperation = 'source-over';
    }
    function startEmbers() {
      if (reduceMotion || !emberCanvas) return;
      sizeEmbers();
      seedMotes();
      emberLast = performance.now();
      if (!emberRAF) emberRAF = requestAnimationFrame(drawEmbers);
    }
    function stopEmbers() {
      if (emberRAF) { cancelAnimationFrame(emberRAF); emberRAF = null; }
      if (ectx) ectx.clearRect(0, 0, page.clientWidth, page.clientHeight);
    }
    scroller.addEventListener('scroll', () => {
      velocidadScroll += Math.abs(scroller.scrollTop - scrollPrev) * 0.4;
      if (velocidadScroll > 26) velocidadScroll = 26;
      scrollPrev = scroller.scrollTop;
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (page.classList.contains('visible') && !reduceMotion) { sizeEmbers(); seedMotes(); }
    });

    // ---- abrir / cerrar ------------------------------------------------------
    window.openLetterPage = function () {
      page.classList.add('visible');
      document.body.classList.add('carta-abierta');
      scroller.scrollTop = 0;
      scrollPrev = 0;
      onScroll();
      startEmbers();
      if (window.MusicSystem) window.MusicSystem.triggerLetter();
    };

    window.closeLetterPage = function () {
      page.classList.remove('visible');
      document.body.classList.remove('carta-abierta');
      stopEmbers();
      if (window.MusicSystem) window.MusicSystem.triggerClose();
      // devolver la cámara al corazón, en lugar de dejar la escena congelada
      if (window.CorazonFX && typeof window.CorazonFX.volver === 'function') {
        window.CorazonFX.volver();
      }
    };

    if (closeBtn) closeBtn.addEventListener('click', window.closeLetterPage);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && page.classList.contains('visible')) window.closeLetterPage();
    });
  })();

  // ==========================================================================
  //  MÚSICA — lista de reproducción con fundidos
  // ==========================================================================
  (function () {
    const audio = document.getElementById('bg-audio');
    const ctrl = document.getElementById('music-ctrl');
    const trackLabel = document.getElementById('music-track-name');
    if (!audio || !ctrl) return;

    const PLAYLIST = [
      { src: 'music/videoplayback.m4a', label: 'Nuestra Canción' },
      { src: 'music/amorcompleto.mp3', label: 'Amor Completo' }
    ];

    let currentTrack = 0;
    let isMuted = false;
    let isStarted = false;
    let targetVol = 0.30;
    let fadeTimer = null;

    function fadeTo(vol, ms, cb) {
      clearInterval(fadeTimer);
      const start = audio.volume;
      const steps = 40;
      const d = (vol - start) / steps;
      let s = 0;
      fadeTimer = setInterval(() => {
        s++;
        audio.volume = Math.min(1, Math.max(0, start + d * s));
        if (s >= steps) {
          clearInterval(fadeTimer);
          audio.volume = Math.min(1, Math.max(0, vol));
          if (cb) cb();
        }
      }, ms / steps);
    }

    function loadAndPlay(idx, startVol, fadeDur, startTime) {
      fadeDur = fadeDur === undefined ? 1200 : fadeDur;
      startTime = startTime || 0;
      currentTrack = ((idx % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
      const t = PLAYLIST[currentTrack];
      audio.src = t.src;
      audio.volume = 0;
      audio.loop = false;
      audio.load();

      const playAudio = () => {
        if (startTime > 0) audio.currentTime = startTime;
        audio.play().catch(() => {});
        fadeTo(isMuted ? 0 : startVol, fadeDur);
        audio.removeEventListener('loadedmetadata', playAudio);
      };
      audio.addEventListener('loadedmetadata', playAudio);
      if (trackLabel) trackLabel.textContent = t.label;
    }

    audio.addEventListener('ended', () => {
      if (currentTrack === 0) loadAndPlay(1, targetVol, 1200, 8);
      else loadAndPlay(1, targetVol, 1200, 0);
    });

    // el ecualizador sólo se anima cuando de verdad suena algo
    function pintarEstado(sonando) {
      ctrl.classList.toggle('sonando', !!sonando);
      ctrl.classList.toggle('muted', !sonando);
    }

    window.MusicSystem = {
      startAmbient() {
        if (isStarted) return;
        isStarted = true;
        targetVol = 0.30;
        loadAndPlay(0, targetVol);
        ctrl.classList.add('show');
        pintarEstado(true);
      },
      triggerComet() {
        targetVol = 0.52;
        if (!isMuted) fadeTo(targetVol, 1500);
      },
      triggerLetter() {
        targetVol = 0.38;
        if (!isMuted) fadeTo(targetVol, 1200);
      },
      triggerClose() {
        targetVol = 0.30;
        if (!isMuted) fadeTo(targetVol, 800);
      }
    };

    ctrl.addEventListener('click', () => {
      isMuted = !isMuted;
      pintarEstado(!isMuted);
      fadeTo(isMuted ? 0 : targetVol, 400);
    });

    // pausar al ocultar la pestaña: ni música ni CPU en segundo plano
    document.addEventListener('visibilitychange', () => {
      if (!isStarted) return;
      if (document.hidden) fadeTo(0, 300, () => audio.pause());
      else { audio.play().catch(() => {}); fadeTo(isMuted ? 0 : targetVol, 600); }
    });
  })();

  // ==========================================================================
  //  TEXTO DE BIENVENIDA SEGÚN LA RUTA (?letter=1)
  //  Sólo cambia el rótulo de la pantalla previa, nunca el texto de la carta.
  // ==========================================================================
  if (window.location.search.indexOf('letter=1') !== -1) {
    const wt = document.getElementById('welcome-title');
    const wb = document.getElementById('welcome-btn');
    if (wt) wt.innerHTML = 'Es hora de leer<br>tu carta, mi amor';
    if (wb) wb.textContent = '✦ Leer carta ✦';
  }
})();
