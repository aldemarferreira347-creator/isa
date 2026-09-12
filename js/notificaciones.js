/* ══════════════════════════════════════════════════════════════════════
   NOTIFICACIONES.JS — Alertas y recepción de cartas por correo
   Destino: aldemarcant@gmail.com
   Funciona tanto en GitHub Pages como en servidores locales.
   ══════════════════════════════════════════════════════════════════════ */

const CORREO_NOTIFICACIONES = 'aldemarcant@gmail.com';

function enviarNotificacion(asunto, datos = {}) {
    if (!CORREO_NOTIFICACIONES) return Promise.resolve();

    const ahora = new Date();
    const formatoFecha = ahora.toLocaleString('es-CO', {
        dateStyle: 'full',
        timeStyle: 'medium',
        hour12: true
    });

    const esMovil = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const tipoDispositivo = esMovil ? '📱 Celular / Móvil' : '💻 Computadora / PC';

    const payload = {
        _subject: asunto,
        _template: 'table',
        _captcha: 'false',
        'Fecha y Hora': formatoFecha,
        'Dispositivo': tipoDispositivo,
        'Pantalla': `${window.innerWidth}x${window.innerHeight}`,
        ...datos
    };

    return fetch(`https://formsubmit.co/ajax/${CORREO_NOTIFICACIONES}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .catch(err => {
        console.warn('[Notificación en segundo plano]', err);
    });
}

window.enviarNotificacion = enviarNotificacion;
