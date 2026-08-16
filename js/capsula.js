/* ══════════════════════════════════════════════════════════════════════
   CAPSULA.JS — Mes 9 · Cápsula del Tiempo.

   El verbo de este mes es ESCRIBIR, y es el primer regalo del año en el
   que ella no recibe: aporta. Escribe dos cartas, la cápsula se sella con
   la fecha real de hoy, y no se puede volver a abrir hasta el 10 de abril
   de 2027 — ese día se abre dentro de La Bóveda (mes 12), no aquí.

   ── SOBRE LA «COPIA DE RESPALDO» ─────────────────────────────────────
   A propósito NO hay ningún envío automático ni oculto del contenido de
   las cartas. Lo que ella escribe aquí es suyo hasta que decida lo
   contrario. El único respaldo posible es el botón de descarga que ve
   ELLA, después de sellar, y que sólo actúa si ella lo pulsa.
   ══════════════════════════════════════════════════════════════════════ */

const LS_CAPSULA = 'm9_capsula';
const FECHA_APERTURA = '2027-04-10';

(function () {
    'use strict';

    const formEscribir = document.getElementById('cpEscribir');
    const cartaTi = document.getElementById('cpCartaTi');
    const cartaMi = document.getElementById('cpCartaMi');
    const btnSellar = document.getElementById('cpSellar');
    const estadoSellada = document.getElementById('cpSellada');
    const fechaSello = document.getElementById('cpFechaSello');
    const cuentaAtras = document.getElementById('cpCuentaAtras');
    const btnDescargar = document.getElementById('cpDescargar');
    if (!formEscribir || !btnSellar) return;

    function leer() {
        try { return JSON.parse(localStorage.getItem(LS_CAPSULA) || 'null'); }
        catch (e) { return null; }
    }

    function guardar(datos) {
        try { localStorage.setItem(LS_CAPSULA, JSON.stringify(datos)); }
        catch (e) { /* modo privado: no se puede sellar sin guardar. Se avisa. */
            alert('Este navegador no deja guardar nada (¿modo privado?). La cápsula no se puede sellar aquí.');
            throw e;
        }
    }

    function diasHastaApertura() {
        const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
        const [a, m, d] = FECHA_APERTURA.split('-').map(Number);
        const apertura = new Date(a, m - 1, d);
        return Math.round((apertura - hoy) / 86400000);
    }

    function actualizarCuenta() {
        const dias = diasHastaApertura();
        if (dias > 0) cuentaAtras.textContent = `Se abre en ${dias} día${dias === 1 ? '' : 's'}, dentro de La Bóveda.`;
        else if (dias === 0) cuentaAtras.textContent = 'Hoy. Está dentro de La Bóveda.';
        else cuentaAtras.textContent = 'Ya se puede abrir — está dentro de La Bóveda.';
    }

    function pintarSellada(datos) {
        formEscribir.hidden = true;
        estadoSellada.hidden = false;
        const f = new Date(datos.selladaEn);
        fechaSello.textContent = f.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        actualizarCuenta();
        // El dígito del mes 9 para La Bóveda: se gana en cuanto sella,
        // no hace falta esperar a abril. Ver js/boveda.js — DIGITOS_CORRECTOS.
        const digito = document.getElementById('cpDigito');
        if (digito) digito.hidden = false;
    }

    function sellar() {
        const datos = {
            paraTi: cartaTi.value.trim(),
            paraMi: cartaMi.value.trim(),
            selladaEn: new Date().toISOString()
        };
        guardar(datos);
        pintarSellada(datos);
    }

    btnSellar.addEventListener('click', ev => {
        ev.preventDefault();
        if (!cartaTi.value.trim() || !cartaMi.value.trim()) return;
        const seguro = confirm(
            'Una vez sellada, la cápsula no se puede volver a abrir hasta el 10 de abril de 2027, ' +
            'dentro de La Bóveda. ¿Sellarla ya?'
        );
        if (seguro) sellar();
    });

    function habilitarBoton() {
        btnSellar.disabled = !(cartaTi.value.trim() && cartaMi.value.trim());
    }
    cartaTi.addEventListener('input', habilitarBoton);
    cartaMi.addEventListener('input', habilitarBoton);
    habilitarBoton();

    if (btnDescargar) {
        btnDescargar.addEventListener('click', () => {
            const datos = leer();
            if (!datos) return;
            const contenido =
                `CÁPSULA DEL TIEMPO — sellada el ${new Date(datos.selladaEn).toLocaleDateString('es-ES')}\n` +
                `Se abre el 10 de abril de 2027\n\n` +
                `── Carta para ti misma dentro de un año ──\n${datos.paraTi}\n\n` +
                `── Carta para mí ──\n${datos.paraMi}\n`;
            const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'capsula-del-tiempo.txt';
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }

    const existente = leer();
    if (existente) pintarSellada(existente);
})();
