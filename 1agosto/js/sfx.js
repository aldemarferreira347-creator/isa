/* ============================================================
   SFX.JS — efectos de sonido generados con Web Audio
   (sin archivos: campanitas, gotas y acordes sintetizados)
   ============================================================ */

const Sfx = (() => {
  let ctx = null;
  let activo = true;

  function init() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { /* sin audio, no pasa nada */ }
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
  }

  function setActivo(v) { activo = v; }

  function tono(freq, { dur = 0.2, tipo = "sine", vol = 0.09, delay = 0, hasta = null } = {}) {
    if (!ctx || !activo) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = tipo;
    o.frequency.setValueAtTime(freq, t);
    if (hasta) o.frequency.exponentialRampToValueAtTime(hasta, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.03);
  }

  // -------- vocabulario del juego --------
  const atrapar = () => { tono(740, { tipo: "triangle", dur: 0.14 }); tono(1108, { tipo: "sine", dur: 0.18, delay: 0.03, vol: 0.05 }); };
  const gota = () => tono(1300, { tipo: "sine", dur: 0.22, hasta: 420, vol: 0.1 });
  const espina = () => { tono(130, { tipo: "sawtooth", dur: 0.2, vol: 0.11 }); tono(92, { tipo: "square", dur: 0.22, delay: 0.02, vol: 0.06 }); };
  const florecer = () => { tono(659, { dur: 0.16 }); tono(880, { dur: 0.22, delay: 0.09 }); };
  const arrancarHierba = () => tono(500, { tipo: "triangle", dur: 0.1, hasta: 260, vol: 0.08 });
  const bien = () => { tono(523, { dur: 0.15 }); tono(659, { dur: 0.15, delay: 0.09 }); tono(784, { dur: 0.28, delay: 0.18 }); };
  const mal = () => { tono(233, { tipo: "square", dur: 0.16, vol: 0.05 }); tono(208, { tipo: "square", dur: 0.26, delay: 0.12, vol: 0.05 }); };
  const fanfarria = () => {
    [523, 659, 784, 1046].forEach((f, i) => tono(f, { dur: 0.24, delay: i * 0.11 }));
    tono(1318, { dur: 0.5, delay: 0.46, vol: 0.07 });
  };

  return { init, setActivo, atrapar, gota, espina, florecer, arrancarHierba, bien, mal, fanfarria };
})();
