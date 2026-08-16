// Generate stars for buenas noches section
document.addEventListener('DOMContentLoaded', () => {
    const bnStars = document.getElementById('bnStars');
    if (!bnStars) return;
    for (let i = 0; i < 120; i++) {
        const s = document.createElement('div');
        s.className = 'bn-star';
        const size = Math.random() * 2.5 + 0.5;
        s.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${2.5 + Math.random() * 4}s;
            animation-delay: ${Math.random() * 5}s;
        `;
        bnStars.appendChild(s);
    }
});
