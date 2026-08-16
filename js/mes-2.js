/* ══════════════════════════════════════════════════════════════════════
   MES-2.JS — dos objetos que no caben en una pantalla.

   El peluche se abraza manteniendo pulsado. El frasco se rocía, y cada
   pulsación suelta una nota de la pirámide olfativa (salida, corazón,
   fondo) — que es exactamente cómo se estructura un perfume de verdad:
   lo primero que se huele no es lo que se queda.

   Los dos dejan rastro, pero de distinta forma. El frasco deja una
   pirámide ordenada, que es lo que es un perfume. El peluche deja un
   registro: las frases que ya dijo, apiladas y sin etiquetas, como
   cosas dichas en voz baja. Que el peluche NO dejara nada era el
   agujero más grande de esta página — sus seis frases salían y se
   borraban para siempre, y la mitad del mes se quedaba sin memoria.

   Todo el texto está aquí abajo. Es lo único que hay que editar.
   ══════════════════════════════════════════════════════════════════════ */

const M2 = {

    /* ── EL PELUCHE ──
       Frases que van saliendo mientras se mantiene el abrazo, una cada
       pocos segundos. Se pueden poner las que quieras: cada una se queda
       guardada en el registro cuando sale por primera vez, y el registro
       se completa cuando han salido todas. */
    abrazo: [
        'Ahí está.',
        'No se cansa. Puede estar así toda la noche.',
        'Yo hago exactamente esto cuando pienso en ti.',
        'No aprieta, no pide nada, no se va.',
        'Cuando lo abrazas a él, me estás abrazando a mí un poquito.',
        'Y si algún día lo abrazas llorando, también vale.'
    ],

    /* Segundos de abrazo acumulados para abrir su parte del final. */
    abrazoMeta: 12,

    /* ── EL FRASCO ──
       Siete notas. Las tres primeras son de salida (lo que se huele al
       instante), las dos siguientes de corazón, las dos últimas de fondo.
       Si añades o quitas, ajusta `piramide` más abajo. */
    notas: [
        { texto: 'La primera vez que te la pusiste sin preguntarme.' },
        { texto: 'Mi camisa, que un día dejó de oler a mí y empezó a oler a las dos.' },
        { texto: 'El taxi de vuelta, cuando ya no quedaba nada más que decir.' },
        { texto: 'Las noches en que hueles la almohada antes de dormirte. Sé que lo haces.' },
        { texto: 'Los jueves. Todos los jueves.' },
        { texto: 'Que un olor te pueda devolver a un día entero en medio segundo.' },
        { texto: 'Que dentro de años vas a oler esto en la calle, en otra persona, y vas a girar la cabeza.' }
    ],

    /* Dónde termina cada tramo de la pirámide (índice de nota, empezando en 0) */
    piramide: [
        { nombre: 'Notas de salida', hasta: 3 },
        { nombre: 'Notas de corazón', hasta: 5 },
        { nombre: 'Notas de fondo', hasta: 7 }
    ],

    /* ── LA CARTA FINAL ──
       Sale cuando los dos objetos están abiertos. Un párrafo por línea. */
    final: [
        'Un perfume se va en unas horas y un peluche se despeluca. Los dos regalos de este mes se acaban, y lo sabía cuando los di.',
        'Pero por eso mismo los elegí. Nada de lo que te di este mes sirve para mirarlo: sirve para tocarlo. Y lo que se toca todos los días se vuelve costumbre, y la costumbre es lo único que de verdad dura.',
        'Así que quédate con el olor mientras dure y con el peluche mientras aguante. Cuando se acaben los dos, yo sigo aquí.'
    ],

    /* Textos de estado (los pequeñitos, bajo cada botón) */
    estados: {
        pelucheInicio: 'Todavía no lo has abrazado.',
        // `s` siempre es el total acumulado, nunca el de la pulsación
        // suelta: ver por qué en el comentario de `pintarEstado`.
        pelucheCurso: s => `${s} ${s === 1 ? 'segundo' : 'segundos'} abrazado…`,
        pelucheTotal: s => `Llevas ${s} ${s === 1 ? 'segundo' : 'segundos'} abrazándolo.`,
        pelucheListo: '✓ Ya sabe que estás ahí.',
        frascoInicio: 'Sin abrir.',
        frascoCurso: (a, b) => `${a} de ${b} notas`,
        frascoListo: '✓ La pirámide completa.'
    },

    /* Textos de los dos botones */
    botones: {
        abrazar: 'Mantén pulsado para abrazarlo',
        abrazarOtraVez: 'Abrázalo otra vez',
        rociar: 'Rocía una vez',
        rociarVacio: 'El frasco está vacío'
    }
};


(function () {
    'use strict';

    const REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LS_ABRAZO = 'm2_abrazo_segundos';
    const LS_FRASES = 'm2_frases_dichas';
    const LS_NOTAS = 'm2_notas_abiertas';

    // localStorage falla en modo privado en algunos navegadores. Nada de lo
    // que hay aquí es crítico: si no se puede guardar, se juega igual y no
    // se rompe nada.
    function leer(clave, porDefecto) {
        try { return parseInt(localStorage.getItem(clave), 10) || porDefecto; }
        catch (e) { return porDefecto; }
    }
    function guardar(clave, valor) {
        try { localStorage.setItem(clave, String(valor)); } catch (e) { }
    }

    let segundosAbrazo = leer(LS_ABRAZO, 0);
    let frasesDichas = Math.min(leer(LS_FRASES, 0), M2.abrazo.length);
    let notasAbiertas = Math.min(leer(LS_NOTAS, 0), M2.notas.length);

    const $ = id => document.getElementById(id);


    /* ══════════════════════════════════════════════════════════════
       FOTOS
       Si el archivo todavía no está, el marco se queda con su dibujo a
       trazo. No es un error ni un hueco: es un estado terminado, y la
       página se ve igual de bien así que con la foto puesta.
       ══════════════════════════════════════════════════════════════ */
    function prepararFoto(idFoto, idMarco) {
        const img = $(idFoto), marco = $(idMarco);
        if (!img || !marco) return;

        const sinFoto = () => {
            marco.classList.add('m2-marco--vacio');
            img.remove();
        };

        // `complete` con naturalWidth 0 = ya falló antes de que llegáramos.
        if (img.complete) {
            if (!img.naturalWidth) sinFoto();
        } else {
            img.addEventListener('error', sinFoto, { once: true });
        }
    }


    /* ══════════════════════════════════════════════════════════════
       EL PELUCHE
       ══════════════════════════════════════════════════════════════ */
    function montarPeluche(alAbrir) {
        const btn = $('btnAbrazo');
        const marco = $('marcoPeluche');
        const aro = document.querySelector('.m2-aro-trazo');
        const estado = $('pelucheEstado');
        const frase = $('pelucheFrase');
        const registro = $('pelucheRegistro');
        const etiqueta = btn && btn.querySelector('.m2-accion-txt');
        if (!btn || !marco) return () => false;

        // Circunferencia real del SVG: así el aro no depende de un número
        // mágico repetido en el CSS.
        let circ = 0;
        if (aro) {
            circ = 2 * Math.PI * aro.r.baseVal.value;
            aro.style.strokeDasharray = circ.toFixed(2);
            aro.style.strokeDashoffset = circ.toFixed(2);
        }

        const cumplido = () => segundosAbrazo >= M2.abrazoMeta;

        let abrazando = false;
        let desde = 0;
        let bucle = 0;
        let ultimaFrase = -1;
        // Último entero escrito en la región `status`. Sin esto el bucle de
        // animación reescribía el mismo texto 60 veces por segundo: para un
        // lector de pantalla eso son 60 anuncios por segundo.
        let ultimoSegundoDicho = -1;

        function pintarEstado() {
            if (!estado) return;
            if (cumplido()) {
                estado.textContent = M2.estados.pelucheListo;
                estado.classList.add('m2-estado--listo');
            } else if (segundosAbrazo > 0) {
                estado.textContent = M2.estados.pelucheTotal(segundosAbrazo);
            } else {
                estado.textContent = M2.estados.pelucheInicio;
            }
            if (etiqueta) {
                etiqueta.textContent = cumplido()
                    ? M2.botones.abrazarOtraVez
                    : M2.botones.abrazar;
            }
        }

        function pintarAro(v) {
            if (aro) aro.style.strokeDashoffset = (circ * (1 - v)).toFixed(2);
        }

        /* El registro: las frases que ya salieron, en el orden en que
           salieron. Sin etiquetas ni viñetas — se distingue a propósito de
           la pirámide del frasco, que sí está ordenada por tramos porque
           un perfume lo está. Aquí sólo son cosas dichas, una detrás de
           otra. */
        function pintarRegistro(animarUltima) {
            if (!registro) return;
            registro.innerHTML = '';
            for (let i = 0; i < frasesDichas; i++) {
                const li = document.createElement('li');
                li.className = 'm2-recuerdo';
                li.textContent = M2.abrazo[i];
                if (animarUltima && i === frasesDichas - 1) {
                    li.classList.add('m2-recuerdo--nuevo');
                }
                registro.appendChild(li);
            }
            registro.classList.toggle('m2-registro--completo',
                frasesDichas >= M2.abrazo.length);
        }

        // Muestra la frase viva y, si es nueva, la guarda en el registro.
        function mostrarFrase() {
            // Se van diciendo en orden; cuando se acaban, vuelven a empezar
            // (el peluche no se calla, sólo deja de tener frases nuevas).
            const nueva = frasesDichas < M2.abrazo.length;
            const i = nueva
                ? frasesDichas
                : Math.floor(Math.random() * M2.abrazo.length);

            if (frase) {
                frase.textContent = M2.abrazo[i];
                frase.classList.remove('visible');
                // Reinicia la animación de entrada: sin esto, dos frases
                // seguidas no se distinguen porque la clase ya estaba puesta.
                void frase.offsetWidth;
                frase.classList.add('visible');
            }

            if (nueva) {
                frasesDichas++;
                guardar(LS_FRASES, frasesDichas);
                pintarRegistro(true);
            }
        }

        function tic() {
            if (!abrazando) return;
            const transcurridos = (performance.now() - desde) / 1000;
            const total = segundosAbrazo + transcurridos;

            pintarAro(Math.min(total / M2.abrazoMeta, 1));

            /* El contador dice el TOTAL, no lo que dura esta pulsación.
               Antes mostraba sólo la pulsación: si ella llevaba 8 segundos
               acumulados y volvía a pulsar, el número caía a 0 y al soltar
               saltaba a 9. Parecía que se hubieran perdido. */
            const enteros = Math.floor(total);
            if (estado && enteros !== ultimoSegundoDicho) {
                ultimoSegundoDicho = enteros;
                estado.textContent = M2.estados.pelucheCurso(enteros);
            }

            // Una frase nueva cada 2,4 s de abrazo continuo
            const paso = Math.floor(transcurridos / 2.4);
            if (paso !== ultimaFrase) {
                ultimaFrase = paso;
                mostrarFrase();
            }

            bucle = requestAnimationFrame(tic);
        }

        function empezar(ev) {
            if (abrazando) return;
            // Sin esto, mantener pulsado en el móvil selecciona texto o abre
            // el menú de «copiar imagen» a la mitad del abrazo.
            if (ev && ev.cancelable) ev.preventDefault();
            abrazando = true;
            desde = performance.now();
            ultimaFrase = -1;
            ultimoSegundoDicho = -1;
            marco.classList.add('m2-marco--abrazado');
            btn.classList.add('m2-accion--activa');
            bucle = requestAnimationFrame(tic);
        }

        function soltar() {
            if (!abrazando) return;
            abrazando = false;
            cancelAnimationFrame(bucle);
            marco.classList.remove('m2-marco--abrazado');
            btn.classList.remove('m2-accion--activa');

            const yaEstaba = cumplido();
            segundosAbrazo = Math.round(segundosAbrazo + (performance.now() - desde) / 1000);
            guardar(LS_ABRAZO, segundosAbrazo);
            pintarEstado();
            pintarAro(Math.min(segundosAbrazo / M2.abrazoMeta, 1));

            if (!yaEstaba && cumplido()) alAbrir();
        }

        btn.addEventListener('pointerdown', empezar);
        btn.addEventListener('pointerup', soltar);
        btn.addEventListener('pointercancel', soltar);
        btn.addEventListener('pointerleave', soltar);
        // El navegador puede quitar el foco (cambio de pestaña, llamada
        // entrante) sin mandar nunca el pointerup: el abrazo se quedaría
        // corriendo para siempre. En móvil, cambiar de app no siempre
        // dispara `blur`, pero sí `visibilitychange`.
        window.addEventListener('blur', soltar);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) soltar();
        });

        // Teclado: espacio o intro, mantenidos. El `repeat` hay que filtrarlo
        // o cada repetición del sistema reiniciaría el cronómetro.
        btn.addEventListener('keydown', ev => {
            if ((ev.key === ' ' || ev.key === 'Enter') && !ev.repeat) {
                ev.preventDefault();
                empezar();
            }
        });
        btn.addEventListener('keyup', ev => {
            if (ev.key === ' ' || ev.key === 'Enter') soltar();
        });

        pintarEstado();
        pintarRegistro(false);
        pintarAro(Math.min(segundosAbrazo / M2.abrazoMeta, 1));
        return cumplido;
    }


    /* ══════════════════════════════════════════════════════════════
       EL FRASCO
       ══════════════════════════════════════════════════════════════ */
    function montarFrasco(alAbrir) {
        const btn = $('btnRociar');
        const vaho = $('vaho');
        const marco = $('marcoFrasco');
        const estado = $('frascoEstado');
        const lista = $('piramide');
        const etiqueta = btn && btn.querySelector('.m2-accion-txt');
        if (!btn || !lista) return () => false;

        const vacio = () => notasAbiertas >= M2.notas.length;

        function tramoDe(indice) {
            return M2.piramide.find(t => indice < t.hasta);
        }

        function pintarEstado() {
            if (vacio()) {
                if (estado) {
                    estado.textContent = M2.estados.frascoListo;
                    estado.classList.add('m2-estado--listo');
                }
                btn.disabled = true;
                if (etiqueta) etiqueta.textContent = M2.botones.rociarVacio;
            } else if (estado) {
                estado.textContent = notasAbiertas === 0
                    ? M2.estados.frascoInicio
                    : M2.estados.frascoCurso(notasAbiertas, M2.notas.length);
            }
        }

        // Dibuja las notas ya abiertas. `animar` sólo para la última, para
        // que al recargar la página no se reproduzca todo otra vez.
        function pintarNotas(animarUltima) {
            lista.innerHTML = '';
            let tramoPrevio = null;

            for (let i = 0; i < notasAbiertas; i++) {
                const tramo = tramoDe(i);
                if (tramo && tramo !== tramoPrevio) {
                    tramoPrevio = tramo;
                    const cab = document.createElement('li');
                    cab.className = 'm2-tramo';
                    cab.textContent = tramo.nombre;
                    lista.appendChild(cab);
                }
                const li = document.createElement('li');
                li.className = 'm2-nota';
                li.textContent = M2.notas[i].texto;
                if (animarUltima && i === notasAbiertas - 1) li.classList.add('m2-nota--nueva');
                lista.appendChild(li);
            }
        }

        // El vaho: unas cuantas motas que suben y se abren. Se limpian solas
        // al terminar, así el DOM no crece con cada pulsación.
        function rociarVisual() {
            if (!vaho || REDUCIDO) return;
            for (let i = 0; i < 14; i++) {
                const p = document.createElement('i');
                p.className = 'm2-mota';
                p.style.setProperty('--dx', (Math.random() * 120 - 60).toFixed(0) + 'px');
                p.style.setProperty('--dy', (-70 - Math.random() * 90).toFixed(0) + 'px');
                p.style.setProperty('--esc', (0.6 + Math.random() * 1.5).toFixed(2));
                p.style.animationDelay = (Math.random() * 140).toFixed(0) + 'ms';
                p.style.animationDuration = (1400 + Math.random() * 900).toFixed(0) + 'ms';
                vaho.appendChild(p);
                p.addEventListener('animationend', () => p.remove(), { once: true });
            }
            if (marco) {
                marco.classList.remove('m2-marco--rociado');
                void marco.offsetWidth;
                marco.classList.add('m2-marco--rociado');
            }
        }

        btn.addEventListener('click', () => {
            if (vacio()) return;
            notasAbiertas++;
            guardar(LS_NOTAS, notasAbiertas);
            rociarVisual();
            pintarNotas(true);
            pintarEstado();
            if (vacio()) alAbrir();
        });

        pintarNotas(false);
        pintarEstado();
        return vacio;
    }


    /* ══════════════════════════════════════════════════════════════
       LA CARTA FINAL
       ══════════════════════════════════════════════════════════════ */
    function montarFinal() {
        const seccion = $('final');
        const texto = $('finalTexto');
        if (!seccion || !texto) return () => { };

        let yaSalio = false;

        return function revelar(instantaneo) {
            if (yaSalio) return;
            yaSalio = true;

            texto.innerHTML = M2.final.map(p => `<p>${p}</p>`).join('');
            seccion.hidden = false;

            if (instantaneo || REDUCIDO) {
                seccion.classList.add('visible');
                return;
            }

            // Dos fotogramas: uno para que exista en el flujo, otro para que
            // el navegador tenga un estado inicial desde el que animar.
            requestAnimationFrame(() => requestAnimationFrame(() => {
                seccion.classList.add('visible');
                seccion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }));
        };
    }


    /* ══════════════════════════════════════════════════════════════
       ARRANQUE
       ══════════════════════════════════════════════════════════════ */
    function arrancar() {
        prepararFoto('fotoPeluche', 'marcoPeluche');
        prepararFoto('fotoFrasco', 'marcoFrasco');

        const revelarFinal = montarFinal();

        // Cada objeto avisa cuando se abre; el final espera a los dos.
        let pelucheListo = () => false;
        let frascoListo = () => false;
        const comprobar = () => {
            if (pelucheListo() && frascoListo()) revelarFinal(false);
        };

        pelucheListo = montarPeluche(comprobar);
        frascoListo = montarFrasco(comprobar);

        // Al volver a la página con los dos ya abiertos, la carta está
        // puesta desde el principio: no se hace ganar dos veces lo mismo.
        if (pelucheListo() && frascoListo()) revelarFinal(true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', arrancar);
    } else {
        arrancar();
    }
})();
