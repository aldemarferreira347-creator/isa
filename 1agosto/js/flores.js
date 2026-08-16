/* ============================================================
   FLORES.JS — flores, espinas, gotas y cesta dibujadas
   a mano con Canvas 2D (nada de emojis planos).
   Todas las funciones dibujan centradas en (0,0); usar
   FloresArt.draw(ctx, tipo, x, y, radio, rotacion).
   ============================================================ */

const FloresArt = (() => {

  function petalos(ctx, n, rx, ry, dist, color, color2) {
    for (let i = 0; i < n; i++) {
      ctx.save();
      ctx.rotate((i / n) * Math.PI * 2);
      ctx.fillStyle = (color2 && i % 3 === 0) ? color2 : color;
      ctx.beginPath();
      ctx.ellipse(0, -dist, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function girasol(ctx, s) {
    petalos(ctx, 12, s * 0.24, s * 0.55, s * 0.55, "#F6C244", "#EFB52E");
    ctx.fillStyle = "#7A4A21";
    ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#5C3717";
    ctx.beginPath(); ctx.arc(0, 0, s * 0.24, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.12, s * 0.09, 0, Math.PI * 2); ctx.fill();
  }

  function rosa(ctx, s) {
    petalos(ctx, 6, s * 0.38, s * 0.38, s * 0.5, "#E2688C", "#DA5C80");
    ctx.fillStyle = "#CE4A70";
    ctx.beginPath(); ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#B83860";
    ctx.beginPath(); ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#8F2547";
    ctx.lineWidth = Math.max(1.2, s * 0.07);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.16, -0.6, Math.PI * 1.1);
    ctx.stroke();
  }

  function margarita(ctx, s) {
    petalos(ctx, 10, s * 0.22, s * 0.52, s * 0.5, "#FFF7EC", "#FFF1DE");
    ctx.fillStyle = "#F2B93B";
    ctx.beginPath(); ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#D99B22";
    ctx.beginPath(); ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2); ctx.fill();
  }

  function tulipan(ctx, s) {
    ctx.fillStyle = "#EE7FA0";
    ctx.beginPath();
    ctx.moveTo(-s * 0.52, -s * 0.1);
    ctx.bezierCurveTo(-s * 0.56, -s * 0.75, -s * 0.15, -s * 0.85, 0, -s * 0.42);
    ctx.bezierCurveTo(s * 0.15, -s * 0.85, s * 0.56, -s * 0.75, s * 0.52, -s * 0.1);
    ctx.bezierCurveTo(s * 0.5, s * 0.45, -s * 0.5, s * 0.45, -s * 0.52, -s * 0.1);
    ctx.fill();
    ctx.fillStyle = "#F7A6BE";
    ctx.beginPath();
    ctx.moveTo(-s * 0.22, -s * 0.35);
    ctx.bezierCurveTo(-s * 0.1, -s * 0.72, s * 0.1, -s * 0.72, s * 0.22, -s * 0.35);
    ctx.lineTo(s * 0.16, s * 0.38);
    ctx.lineTo(-s * 0.16, s * 0.38);
    ctx.closePath();
    ctx.fill();
  }

  function espina(ctx, s) {
    // rama espinosa
    ctx.strokeStyle = "#6B4226";
    ctx.lineWidth = Math.max(2.5, s * 0.16);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-s * 0.7, s * 0.25);
    ctx.quadraticCurveTo(0, -s * 0.35, s * 0.7, s * 0.1);
    ctx.stroke();
    ctx.fillStyle = "#54331D";
    const puntas = [[-0.45, -0.02, -0.6], [-0.1, -0.22, -0.5], [0.28, -0.16, -0.4], [0.55, 0.0, -0.45]];
    for (const [px, py, dir] of puntas) {
      ctx.beginPath();
      ctx.moveTo(s * px - s * 0.09, s * py);
      ctx.lineTo(s * px + s * 0.09, s * py);
      ctx.lineTo(s * px + s * 0.02, s * py + s * dir);
      ctx.closePath();
      ctx.fill();
    }
  }

  function gota(ctx, s) {
    ctx.save();
    ctx.shadowColor = "rgba(120, 190, 230, 0.9)";
    ctx.shadowBlur = s * 0.5;
    const g = ctx.createLinearGradient(0, -s * 0.7, 0, s * 0.6);
    g.addColorStop(0, "#BFE6F7");
    g.addColorStop(1, "#3D95C9");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.72);
    ctx.bezierCurveTo(s * 0.5, -s * 0.05, s * 0.48, s * 0.55, 0, s * 0.55);
    ctx.bezierCurveTo(-s * 0.48, s * 0.55, -s * 0.5, -s * 0.05, 0, -s * 0.72);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.ellipse(-s * 0.15, -s * 0.05, s * 0.1, s * 0.2, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function cesta(ctx, w) {
    const h = w * 0.58;
    // asa
    ctx.strokeStyle = "#8A5A2B";
    ctx.lineWidth = w * 0.06;
    ctx.beginPath();
    ctx.arc(0, -h * 0.42, w * 0.32, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
    // cuerpo
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, "#CE9250");
    g.addColorStop(1, "#A96F33");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h * 0.42);
    ctx.lineTo(w / 2, -h * 0.42);
    ctx.lineTo(w * 0.36, h * 0.5);
    ctx.quadraticCurveTo(0, h * 0.62, -w * 0.36, h * 0.5);
    ctx.closePath();
    ctx.fill();
    // tejido
    ctx.strokeStyle = "rgba(107, 66, 38, 0.55)";
    ctx.lineWidth = Math.max(1.2, w * 0.02);
    for (let i = 1; i <= 3; i++) {
      const y = -h * 0.42 + (h * 0.92 * i) / 4;
      const enc = 1 - (i / 4) * 0.28;
      ctx.beginPath();
      ctx.moveTo(-w * 0.5 * enc, y);
      ctx.quadraticCurveTo(0, y + h * 0.08, w * 0.5 * enc, y);
      ctx.stroke();
    }
    // borde superior
    ctx.fillStyle = "#8A5A2B";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-w * 0.54, -h * 0.5, w * 1.08, h * 0.16, w * 0.04);
    else ctx.rect(-w * 0.54, -h * 0.5, w * 1.08, h * 0.16);
    ctx.fill();
  }

  const FLORES = { girasol, rosa, margarita, tulipan };

  function draw(ctx, tipo, x, y, s, rot = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    if (FLORES[tipo]) FLORES[tipo](ctx, s);
    else if (tipo === "espina") espina(ctx, s);
    else if (tipo === "agua") gota(ctx, s);
    ctx.restore();
  }

  function drawCesta(ctx, x, y, w) {
    ctx.save();
    ctx.translate(x, y);
    cesta(ctx, w);
    ctx.restore();
  }

  return { draw, drawCesta, tipos: Object.keys(FLORES) };
})();
