// ── Timers ──
// Formato ISO obligatorio: 'YYYY-MM-DDTHH:mm:ss'. El formato con espacio
// ('2025-08-16 00:00:00') no está en la spec de ECMAScript y devuelve
// Invalid Date en Safari/iOS — justo donde más se abre este regalo.
document.addEventListener('DOMContentLoaded', () => {
    const fechaInicio = new Date('2025-08-16T00:00:00');
    const fechaEspera = new Date('2008-08-30T00:00:00');

    const UNIDADES = [
        { key: 'dias', label: 'días' },
        { key: 'horas', label: 'horas' },
        { key: 'minutos', label: 'minutos' },
        { key: 'segundos', label: 'segundos' }
    ];

    function partes(startDate) {
        const diferencia = Date.now() - startDate;
        return {
            dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
            horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
            minutos: Math.floor((diferencia / (1000 * 60)) % 60),
            segundos: Math.floor((diferencia / 1000) % 60)
        };
    }

    // Construye los bloques UNA sola vez y guarda los nodos de texto.
    // Antes se reescribía innerHTML entero cada segundo: 8 nodos destruidos y
    // recreados por tick, lo que impedía cualquier transición sobre los dígitos.
    function montar(contenedor) {
        contenedor.innerHTML = '';
        const refs = {};
        UNIDADES.forEach(({ key, label }) => {
            const block = document.createElement('div');
            block.className = 'time-block';

            const val = document.createElement('span');
            val.className = 'time-val';

            const lab = document.createElement('span');
            lab.className = 'time-label';
            lab.textContent = label;

            block.append(val, lab);
            contenedor.appendChild(block);

            // Cinta rodante: cada dígito sube y baja como un odómetro real.
            // Si el motor está apagado, devuelve un pintor de texto plano.
            refs[key] = { el: val, pintar: fxMontarOdometro(val), ultimo: null };
        });
        return refs;
    }

    // Sólo toca la unidad que cambió: los segundos ruedan cada tick,
    // los días una vez al día.
    function pintar(refs, valores) {
        for (const { key } of UNIDADES) {
            const r = refs[key];
            const nuevo = String(valores[key]);
            if (r.ultimo === nuevo) continue;
            r.ultimo = nuevo;
            r.pintar(nuevo);
        }
    }

    const relojes = [
        { refs: montar(document.getElementById('contador')), desde: fechaInicio },
        { refs: montar(document.getElementById('contador2')), desde: fechaEspera }
    ];

    function tick() {
        relojes.forEach(r => pintar(r.refs, partes(r.desde)));
    }

    tick();
    setInterval(tick, 1000);
});
