/* ══════════════════════════════════════════════════════════════════════
   NOTIFICACIONES.JS — Sistema infalible de alertas y recepción por correo
   Destino: aldemarcant@gmail.com
   Garantiza que cualquier acción, texto escrito o interacción sea notificada.
   Funciona en GitHub Pages, servidores locales (Node.js) y redes móviles.
   Incluye:
   - Cola persistente en localStorage con reintentos automáticos offline
   - Doble entrega: FormSubmit por correo + servidor local en tiempo real
   - keepalive: true para asegurar entrega al cambiar de página o cerrar pestaña
   - Detección automática de visitas a páginas con resolución y dispositivo
   - Captura automática de textos completos y borradores en tiempo real
   - Captura global de clics en botones y enlaces interactivos
   - Detección de lectura completa (scroll 80%+)
   - Prevención de fallos silenciosos y duplicados innecesarios
   ══════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const CORREO_NOTIFICACIONES = 'aldemarcant@gmail.com';
    const ENDPOINT_FORMSUBMIT = `https://formsubmit.co/ajax/${CORREO_NOTIFICACIONES}`;
    const CLAVE_COLA = '_notif_cola_v2';
    const CLAVE_HISTORIAL = '_notif_historial_v2';
    const CLAVE_ULTIMA_VISITA = '_notif_visita_';

    // ── 1. MAPA DE NOMBRES DE PÁGINAS ──────────────────────────────────
    function obtenerNombrePagina() {
        const path = window.location.pathname.toLowerCase();
        if (path.endsWith('/') || (path.endsWith('/index.html') && !path.includes('el-camino') && !path.includes('1agosto'))) {
            return 'Menú Principal 🌼';
        }
        if (path.includes('un-mes')) return 'Mes 1 · Un Mes Juntos (Pixel Art) 🎮';
        if (path.includes('mes-2')) return 'Mes 2 · Lo Que Se Abraza (Peluche & Perfume) 🧸';
        if (path.includes('horas')) return '24 Horas Contigo (Mes 10) ⏰';
        if (path.includes('el-camino')) return 'Mes 4 · El Camino a Ti 🌲';
        if (path.includes('radio-nosotros')) return 'Mes 5 · La Radio de Nosotros 📻';
        if (path.includes('constelacion')) return 'Mes 6 · Constelación de Momentos ✨';
        if (path.includes('receta')) return 'Mes 7 · Receta para Dos 🍳';
        if (path.includes('mapa')) return 'Mes 8 · El Mapa de Nosotros 🗺️';
        if (path.includes('capsula')) return 'Mes 9 · Cápsula del Tiempo ✉️';
        if (path.includes('diccionario')) return 'Mes 11 · Diccionario Privado 📖';
        if (path.includes('boveda')) return 'Mes 12 · La Bóveda Final 🔐';
        if (path.includes('la-pregunta')) return 'La Pregunta (Propuesta) 💍';
        if (path.includes('entrega-final')) return 'La Entrega Final (Tu Cárcel) 🎶';
        if (path.includes('1agosto')) return '1 de Agosto · Jardín de Recuerdos 🌻';
        if (path.includes('momentos-cumpleanos')) return 'Cumpleaños · Momentos y Recuerdos 🎂';
        if (path.includes('carta-cumpleanos')) return 'Cumpleaños · Carta Especial 3D 💌';
        if (path.includes('flores-amarillas')) return 'Flores Amarillas · Jardín Nocturno 🌼';
        if (path.includes('dedicatoria')) return 'Dedicatoria 8M (Día de la Mujer) ✨';
        if (path.includes('buenas-noches')) return 'Buenas Noches 🌙';
        if (path.includes('carta-de-promesa')) return 'Carta de Promesa 💌';
        if (path.includes('carta-de-navidad')) return 'Carta de Navidad 🎄';
        if (path.includes('romantico')) return 'Romántico · Contadores y Recuerdos 💕';

        return document.title || window.location.pathname;
    }

    function esServidorLocal() {
        const host = window.location.hostname;
        return host === 'localhost' || host === '127.0.0.1' ||
               host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.') ||
               window.location.port === '8000';
    }

    // ── 2. COLA PERSISTENTE Y GESTIÓN OFFLINE ───────────────────────────
    let colaEnMemoria = [];
    let procesandoCola = false;

    function leerCola() {
        try {
            const str = localStorage.getItem(CLAVE_COLA);
            return str ? JSON.parse(str) : [];
        } catch (e) {
            return colaEnMemoria;
        }
    }

    function guardarCola(cola) {
        colaEnMemoria = cola;
        try {
            localStorage.setItem(CLAVE_COLA, JSON.stringify(cola));
        } catch (e) { /* modo privado o quota */ }
    }

    function guardarEnHistorial(item) {
        try {
            const raw = localStorage.getItem(CLAVE_HISTORIAL);
            const hist = raw ? JSON.parse(raw) : [];
            hist.unshift({
                asunto: item.payload._subject,
                fecha: new Date().toISOString(),
                datos: item.payload
            });
            if (hist.length > 80) hist.pop();
            localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(hist));
        } catch (e) { }
    }

    // ── 3. ENVÍO DE ELEMENTO INDIVIDUAL CON VALIDACIÓN ESTRICTA ───────
    async function enviarElemento(item) {
        const payload = item.payload;

        // 1. Envío al servidor local Node.js si está disponible
        if (esServidorLocal()) {
            try {
                fetch('/api/notificar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(() => {});
            } catch (e) {}
        } else if (window.location.protocol === 'file:') {
            // Si está abierto como archivo local, intentar notificar al servidor si está activo en 8000
            try {
                fetch('http://127.0.0.1:8000/api/notificar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(() => {});
            } catch (e) {}
        }

        // 2. Envío a FormSubmit (Email aldemarcant@gmail.com)
        if (window.location.protocol === 'file:') {
            // FormSubmit rechaza explícitamente páginas abiertas con file://
            return true;
        }

        const res = await fetch(ENDPOINT_FORMSUBMIT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
            keepalive: true
        });

        if (!res.ok) {
            throw new Error(`FormSubmit HTTP error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json().catch(() => ({ success: true }));
        if (data.success === 'false' || data.success === false) {
            throw new Error(`FormSubmit rechazo: ${data.message || 'Error desconocido'}`);
        }

        return true;
    }

    async function procesarCola() {
        if (procesandoCola) return;
        const cola = leerCola();
        if (!cola.length) return;

        procesandoCola = true;
        const ahora = Date.now();

        try {
            while (cola.length > 0) {
                const item = cola[0];

                // Si tiene una espera de reintento configurada y aún no vence, posponer
                if (item.reintentarEn && ahora < item.reintentarEn) {
                    break;
                }

                try {
                    await enviarElemento(item);
                    guardarEnHistorial(item);
                    cola.shift();
                    guardarCola(cola);
                    // Pausa de 600ms entre correos para respetar rate limits de FormSubmit
                    await new Promise(r => setTimeout(r, 600));
                } catch (err) {
                    item.intentos = (item.intentos || 0) + 1;
                    // Exponential backoff: espera progresiva antes de reintentar
                    const esperaMs = Math.min(300000, 1000 * Math.pow(2, item.intentos));
                    item.reintentarEn = Date.now() + esperaMs;

                    if (item.intentos > 8) {
                        console.warn('[Notificaciones] Límite de reintentos alcanzado para:', item.payload._subject);
                        cola.shift();
                    }
                    guardarCola(cola);
                    break;
                }
            }
        } finally {
            procesandoCola = false;
        }
    }

    // ── 4. FUNCIÓN PRINCIPAL EXPORTADA: ENVIAR NOTIFICACIÓN ────────────
    let ultimoPayloadStr = '';
    let tiempoUltimoEnvio = 0;

    function enviarNotificacion(asunto, datos = {}) {
        const ahora = new Date();
        const formatoFecha = ahora.toLocaleString('es-CO', {
            dateStyle: 'full',
            timeStyle: 'medium',
            hour12: true
        });

        const esMovil = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        const tipoDispositivo = esMovil ? '📱 Celular / Móvil' : '💻 Computadora / PC';
        const nombrePagina = obtenerNombrePagina();

        const asuntoLimpio = asunto.startsWith('[Isa') ? asunto : `[Isa ❣️] ${asunto}`;

        const payload = {
            _subject: asuntoLimpio,
            _template: 'table',
            _captcha: 'false',
            'Página': nombrePagina,
            'Fecha y Hora': formatoFecha,
            'Dispositivo': tipoDispositivo,
            'Pantalla': `${window.innerWidth}x${window.innerHeight}`,
            ...datos
        };

        // Prevención de duplicados exactos en ráfaga (menos de 2.5 segundos)
        const payloadStr = JSON.stringify({ s: asuntoLimpio, d: datos });
        const ahoraMs = Date.now();
        if (payloadStr === ultimoPayloadStr && (ahoraMs - tiempoUltimoEnvio) < 2500) {
            return Promise.resolve({ success: true, duplicated: true });
        }
        ultimoPayloadStr = payloadStr;
        tiempoUltimoEnvio = ahoraMs;

        const item = {
            id: 'n_' + ahoraMs + '_' + Math.random().toString(36).substr(2, 6),
            payload,
            intentos: 0,
            creado: ahoraMs
        };

        const cola = leerCola();
        cola.push(item);
        guardarCola(cola);

        // Procesar de inmediato en segundo plano
        setTimeout(procesarCola, 10);
        return Promise.resolve({ success: true, queued: true });
    }

    // ── 5. HELPERS DE ALTO NIVEL PARA INTERACCIONES Y TEXTOS ─────────────
    let tiempoUltimaAccionExplicita = 0;

    function notificarAccion(arg1, arg2, arg3) {
        tiempoUltimaAccionExplicita = Date.now();
        let categoria = '';
        let accion = '';
        let detalle = '';
        let extra = {};

        if (typeof arg3 === 'string') {
            categoria = arg1;
            accion = arg2;
            detalle = arg3;
        } else if (typeof arg3 === 'object' && arg3 !== null) {
            categoria = arg1;
            accion = arg2;
            detalle = typeof arg2 === 'string' ? arg2 : '';
            extra = arg3;
        } else {
            accion = arg1 || 'Interacción';
            detalle = typeof arg2 === 'string' ? arg2 : '';
            if (typeof arg2 === 'object' && arg2 !== null) extra = arg2;
        }

        const asunto = categoria ? `⚡ [${categoria}] ${accion}` : `⚡ Acción: ${accion}`;
        const payload = {
            'Acción': accion,
            'Detalle': detalle,
            ...extra
        };
        if (categoria) payload['Categoría'] = categoria;

        return enviarNotificacion(asunto, payload);
    }

    function notificarTextoEscrito(nombreCampo, texto, datosExtra = {}) {
        tiempoUltimaAccionExplicita = Date.now();
        if (!texto || !texto.trim()) return Promise.resolve();
        const extra = typeof datosExtra === 'string' ? { 'Contexto': datosExtra } : (datosExtra || {});
        return enviarNotificacion(`✍️ Isa escribió en: ${nombreCampo}`, {
            'Campo': nombreCampo,
            'Texto escrito': texto.trim(),
            'Longitud': `${texto.trim().length} caracteres`,
            ...extra
        });
    }

    function notificarRespuesta(pregunta, respuesta, opcionesExtra = {}) {
        tiempoUltimaAccionExplicita = Date.now();
        const extra = typeof opcionesExtra === 'string' ? { 'Contexto': opcionesExtra } : (opcionesExtra || {});
        return enviarNotificacion(`💬 Respuesta: ${pregunta}`, {
            'Pregunta': pregunta,
            'Respuesta de Isa': respuesta,
            ...extra
        });
    }

    // ── 6. AUTO-DETECCIÓN DE VISITAS A PÁGINA ──────────────────────────
    function autoNotificarVisita() {
        const nombrePagina = obtenerNombrePagina();
        const claveSesion = CLAVE_ULTIMA_VISITA + window.location.pathname;
        const ultimaVisita = parseInt(sessionStorage.getItem(claveSesion) || '0', 10);
        const ahora = Date.now();

        // Si ya se notificó esta misma página hace menos de 2 minutos en la misma pestaña, no spammear
        if (ahora - ultimaVisita < 120000) {
            return;
        }

        try { sessionStorage.setItem(claveSesion, String(ahora)); } catch (e) {}

        enviarNotificacion(`👁️ Isa entró a: ${nombrePagina}`, {
            'Evento': 'Apertura de página',
            'Ruta': window.location.pathname,
            'Referrer': document.referrer || 'Acceso directo'
        });
    }

    // ── 7. AUTO-CAPTURA INTELIGENTE DE TEXTOS Y BORRADORES ─────────────
    const MAPA_CAMPOS_CONOCIDOS = {
        'cpcartati': 'Carta para su yo del futuro (en 1 año) ✉️',
        'cpcartami': 'Carta para Carlo (Aldemar) 💌',
        'modaltextarea': 'Carta final editada en Tocadiscos 🎶',
        'dcbuscador': 'Búsqueda en Diccionario Privado 📖',
        'rcvalefecha': 'Fecha elegida para la cena especial 🍳'
    };

    function resolverNombreCampo(el) {
        const idLower = (el.id || '').toLowerCase();
        if (MAPA_CAMPOS_CONOCIDOS[idLower]) return MAPA_CAMPOS_CONOCIDOS[idLower];

        // Revisar si es slot de bóveda
        if (el.classList && el.classList.contains('bv-slot')) {
            const mesNum = el.parentElement ? el.parentElement.querySelector('.bv-slot-mes')?.textContent : '';
            return `Dígito Bóveda (Mes ${mesNum || '?'}) 🔐`;
        }

        if (el.id) {
            const label = document.querySelector(`label[for="${el.id}"]`);
            if (label && label.textContent.trim()) return label.textContent.trim();
        }

        const padreLabel = el.closest('label');
        if (padreLabel && padreLabel.textContent.trim()) return padreLabel.textContent.trim();

        // Buscar encabezado previo o contenedor con título
        const contenedor = el.closest('.cp-carta-col, .carta-modal-caja, .rc-vale-fila, .modal-caja');
        if (contenedor) {
            const h = contenedor.querySelector('h2, h3, h4, .cp-carta-titulo, .carta-modal-sub');
            if (h && h.textContent.trim()) return h.textContent.trim();
        }

        const placeholder = el.getAttribute('placeholder');
        if (placeholder && placeholder.length > 2 && !placeholder.includes('Escribe aquí')) {
            return placeholder;
        }

        const aria = el.getAttribute('aria-label') || el.getAttribute('title');
        if (aria) return aria;

        return el.id || el.name || 'Campo de texto';
    }

    const ultimosTextosEnviados = new Map();
    const temporizadoresBorrador = new Map();

    function autoCapturarCampos() {
        function esCampoTexto(el) {
            if (!el) return false;
            if (el.tagName === 'TEXTAREA') return true;
            if (el.isContentEditable) return true;
            if (el.tagName === 'INPUT') {
                const tipo = (el.type || 'text').toLowerCase();
                return ['text', 'search', 'date', 'email', 'number', 'tel', 'url'].includes(tipo);
            }
            return false;
        }

        function obtenerValor(el) {
            if (el.isContentEditable) return el.innerText.trim();
            return (el.value || '').trim();
        }

        // 1. Captura completa cuando el usuario sale del campo (blur / focusout)
        document.addEventListener('focusout', ev => {
            const t = ev.target;
            if (!esCampoTexto(t)) return;

            const valor = obtenerValor(t);
            if (!valor || valor.length < 2) return;
            if (ultimosTextosEnviados.get(t) === valor) return;

            ultimosTextosEnviados.set(t, valor);
            const nombreCampo = resolverNombreCampo(t);
            notificarTextoEscrito(nombreCampo, valor);
        }, true);

        // 2. Guardado automático de borrador en tiempo real mientras escribe
        document.addEventListener('input', ev => {
            const t = ev.target;
            if (!esCampoTexto(t)) return;

            const valor = obtenerValor(t);
            if (valor.length < 5) return;

            if (temporizadoresBorrador.has(t)) {
                clearTimeout(temporizadoresBorrador.get(t));
            }

            // Debounce de 2.8 segundos de pausa en la escritura
            temporizadoresBorrador.set(t, setTimeout(() => {
                if (ultimosTextosEnviados.get(t) === valor) return;
                ultimosTextosEnviados.set(t, valor);

                const nombreCampo = resolverNombreCampo(t);
                enviarNotificacion(`📝 Borrador en tiempo real: ${nombreCampo}`, {
                    'Campo': nombreCampo,
                    'Texto escrito hasta el momento': valor,
                    'Longitud': `${valor.length} caracteres`,
                    'Estado': 'Guardado preventivo mientras escribe'
                });
            }, 2800));
        }, true);

        // 3. Captura cambios directos en inputs de fecha
        document.addEventListener('change', ev => {
            const t = ev.target;
            if (!t || t.tagName !== 'INPUT' || t.type !== 'date') return;
            const valor = (t.value || '').trim();
            if (!valor) return;
            if (ultimosTextosEnviados.get(t) === valor) return;

            ultimosTextosEnviados.set(t, valor);
            const nombreCampo = resolverNombreCampo(t);
            notificarTextoEscrito(nombreCampo, valor, { 'Tipo': 'Fecha seleccionada' });
        }, true);
    }

    // ── 8. CAPTURA GLOBAL DE INTERACCIONES Y CLICS NO NOTIFICADOS ───────
    // Red de seguridad: si la usuaria hace clic en cualquier botón o enlace
    // que no haya disparado una notificación explícita, este monitor
    // lo detecta y envía la alerta para garantizar cobertura del 100%.
    function autoCapturarClicsGlobales() {
        document.addEventListener('click', ev => {
            const ahora = Date.now();
            // Si hace menos de 800ms se disparó una acción explícita, no duplicar
            if (ahora - tiempoUltimaAccionExplicita < 800) return;

            const elemento = ev.target.closest('button, a, .nav-card, .photo-card, .card, [role="button"]');
            if (!elemento) return;

            // Ignorar clics internos de control técnico
            if (elemento.id === 'debug' || elemento.classList.contains('cst-boton')) return;

            // Revisar si es un enlace saliente
            const href = elemento.getAttribute('href');
            if (href && (href.startsWith('http://') || href.startsWith('https://')) && !href.includes(window.location.hostname)) {
                notificarAccion('Navegación Externa', 'Saliendo a enlace externo', href);
                return;
            }

            // Esperar un instante corto para verificar si algún script local dispara notificación
            const elementoCopiado = elemento;
            setTimeout(() => {
                if (Date.now() - tiempoUltimaAccionExplicita < 900) return;

                const texto = (
                    elementoCopiado.innerText ||
                    elementoCopiado.getAttribute('aria-label') ||
                    elementoCopiado.getAttribute('title') ||
                    elementoCopiado.id ||
                    elementoCopiado.className ||
                    'Botón'
                ).trim().replace(/\s+/g, ' ').slice(0, 80);

                if (!texto || texto.length < 2) return;

                // Solo registrar si es interactivo y visible
                notificarAccion(obtenerNombrePagina(), 'Clic en elemento', texto);
            }, 250);
        }, true);
    }

    // ── 9. DETECCIÓN AUTOMÁTICA DE LECTURA COMPLETA (SCROLL 80%) ────────
    let lecturaNotificada = false;
    function autoDetectarLecturaCompleta() {
        if (lecturaNotificada) return;

        function checkScroll() {
            if (lecturaNotificada) return;
            const totalActual = document.documentElement.scrollHeight - window.innerHeight;
            if (totalActual < 160) return;
            const scrollActual = window.scrollY || document.documentElement.scrollTop;
            const porcentaje = (scrollActual / totalActual) * 100;

            if (porcentaje >= 78) {
                lecturaNotificada = true;
                window.removeEventListener('scroll', checkScroll);
                const nombrePagina = obtenerNombrePagina();
                enviarNotificacion(`📜 Isa leyó la página completa: ${nombrePagina}`, {
                    'Evento': 'Lectura completa',
                    'Detalle': 'Llegó al final de la carta o página'
                });
            }
        }

        window.addEventListener('scroll', checkScroll, { passive: true });
    }

    // ── 10. ASEGURAR ENVÍOS AL CERRAR PESTAÑA O NAVEGAR ────────────────
    function asegurarTextosPendientes() {
        document.querySelectorAll('textarea, input[type="text"], input[type="search"], input[type="date"]').forEach(t => {
            const valor = (t.value || '').trim();
            if (valor && valor.length >= 2 && ultimosTextosEnviados.get(t) !== valor) {
                ultimosTextosEnviados.set(t, valor);
                const nombreCampo = resolverNombreCampo(t);
                notificarTextoEscrito(nombreCampo, valor, { 'Momento': 'Al salir de la página' });
            }
        });
        procesarCola();
    }

    window.addEventListener('pagehide', asegurarTextosPendientes);
    window.addEventListener('beforeunload', asegurarTextosPendientes);
    window.addEventListener('online', () => { procesarCola(); });
    setInterval(procesarCola, 12000);

    // ── 11. INICIALIZACIÓN COMPLETA ────────────────────────────────────
    function iniciar() {
        autoNotificarVisita();
        autoCapturarCampos();
        autoCapturarClicsGlobales();
        autoDetectarLecturaCompleta();
        procesarCola();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }

    // Exportar API global infalible
    window.enviarNotificacion = enviarNotificacion;
    window.notificarAccion = notificarAccion;
    window.notificarTextoEscrito = notificarTextoEscrito;
    window.notificarRespuesta = notificarRespuesta;

})();
