/* ============================================================
   AMBIENTE.JS — atmósfera viva detrás de todas las pantallas:
   pétalos que flotan a la deriva y luciérnagas doradas.
   ============================================================ */

const Ambiente = (() => {
  let canvas, ctx, W, H;
  let particulas = [];
  let rafId = null;

  const COLORES_PETALO = [
    "rgba(242, 167, 188, 0.5)",
    "rgba(255, 214, 165, 0.45)",
    "rgba(240, 198, 76, 0.35)",
    "rgba(255, 240, 245, 0.4)"
  ];

  const quieto = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ajustar() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function crearPetalo(desdeArriba) {
    return {
      tipo: "petalo",
      x: Math.random() * W,
      y: desdeArriba ? -20 : Math.random() * H,
      vy: 10 + Math.random() * 22,
      tam: 4 + Math.random() * 7,
      fase: Math.random() * Math.PI * 2,
      giro: 0.4 + Math.random() * 1.2,
      color: COLORES_PETALO[Math.floor(Math.random() * COLORES_PETALO.length)]
    };
  }

  function crearLuciernaga() {
    return {
      tipo: "luz",
      x: Math.random() * W,
      y: H * 0.3 + Math.random() * H * 0.65,
      r: 1.2 + Math.random() * 2,
      fase: Math.random() * Math.PI * 2,
      velFase: 0.5 + Math.random() * 1.1,
      dx: (Math.random() - 0.5) * 14,
      dy: (Math.random() - 0.5) * 10
    };
  }

  function dibujar(dt, t) {
    ctx.clearRect(0, 0, W, H);
    for (const p of particulas) {
      if (p.tipo === "petalo") {
        p.y += p.vy * dt;
        p.fase += dt * p.giro;
        p.x += Math.sin(p.fase) * 0.5;
        if (p.y > H + 20) Object.assign(p, crearPetalo(true));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.fase) * 0.9);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.tam, p.tam * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        p.fase += dt * p.velFase;
        p.x += Math.cos(p.fase * 0.7) * p.dx * dt;
        p.y += Math.sin(p.fase * 0.5) * p.dy * dt;
        const alfa = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(p.fase * 2));
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        glow.addColorStop(0, `rgba(255, 232, 150, ${alfa})`);
        glow.addColorStop(1, "rgba(255, 232, 150, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  let lastTs = 0;
  function ciclo(ts) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    dibujar(dt, ts);
    rafId = requestAnimationFrame(ciclo);
  }

  function iniciar() {
    canvas = document.getElementById("ambiente");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    ajustar();
    window.addEventListener("resize", ajustar);

    particulas = [
      ...Array.from({ length: 22 }, () => crearPetalo(false)),
      ...Array.from({ length: 14 }, crearLuciernaga)
    ];

    if (quieto()) {
      dibujar(0, 0); // una sola imagen fija
      return;
    }
    rafId = requestAnimationFrame(ciclo);
  }

  document.addEventListener("DOMContentLoaded", iniciar);
  return {};
})();
