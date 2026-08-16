// Generate stars for buenas noches section
// 60 estrellas DOM (el canvas de ambiente.js ya pone 110 encima).
// Las 120 originales + escala CSS en cada frame era la causa principal
// de la caída de FPS. Con 60 y sin scale() la composición es pura GPU.
document.addEventListener('DOMContentLoaded', () => {
    const bnStars = document.getElementById('bnStars');
    if (!bnStars) return;
    const N = 60;
    for (let i = 0; i < N; i++) {
        const s = document.createElement('div');
        s.className = 'bn-star';
        const size = Math.random() * 2 + 0.5;
        // Delay distribuido uniformemente: evita que muchas estrellas
        // lleguen al pico de opacity al mismo tiempo (batch de repaint).
        const delay = (i / N) * 5 + Math.random() * 1.5;
        s.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${2.5 + Math.random() * 3.5}s;
            animation-delay: ${delay}s;
        `;
        bnStars.appendChild(s);
    }
});
