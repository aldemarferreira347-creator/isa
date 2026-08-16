# Mes a Mes — el año completo

Un regalo cada día 10, desde el 10 de mayo de 2026 hasta el 10 de abril de 2027.

**Este archivo es para ti, no para ella.** Contiene lo que todavía no ha pasado. No lo subas a ningún sitio donde ella pueda entrar.

---

## Cómo funciona el apartado

Todo el hilo del index se dibuja desde un solo array en [`js/meses.js`](js/meses.js). Para abrir un mes cuando llegue su día 10:

1. Cambia `estado: 'porVenir'` por `estado: 'abierto'`.
2. Escribe su `titulo`, `desc` y `href`.

Y ya. El hilo se enciende un tramo más, el anillo sube, la cuenta regresiva salta al mes siguiente y la fila deja de ser un candado. No hay que tocar ni el HTML ni el CSS.

Mientras un mes esté `porVenir` **no se ve su título**: en su sitio va la `pista`, y debajo cuánto falta (`faltan 33 días`, `faltan 5 meses`), que se recalcula cada vez que ella entra. Es a propósito. Esta página la abre ella, y un título de más arruina la sorpresa de un mes entero.

### Los tres estados de una fila

Sólo hay dos valores de `estado`, pero tres cosas que puede ser una fila, porque el tercer estado se deduce del `href`:

| Lo que pones | Cómo sale | ¿Cuenta en el anillo? |
|---|---|---|
| `estado: 'porVenir'` | candado, pista y cuánto falta | no |
| `estado: 'abierto'` **sin** `href` | «en camino», con puntos que laten. No es un enlace | **no** |
| `estado: 'abierto'` **con** `href` | puerta: se puede entrar | sí |

Eso último importa: **el anillo cuenta puertas, no meses marcados como abiertos.** Antes contaba 4/12 con sólo tres regalos entrables, porque el mes 3 estaba `abierto` con el `href` vacío y aun así se pintaba como una puerta — al tocarla salía un aviso de disculpa. Ahora una fila sin destino no finge ser una puerta y el anillo no la suma. En cuanto pegues el enlace, las dos cosas se arreglan solas.

**El mes 3** está justo en ese estado: `href: ''` esperando su enlace. Pegarlo entre las comillas es todo lo que hace falta.

Y un aviso: el `desc` de cada mes **lo lee ella**. No dejes ahí instrucciones para ti (el mes 3 tenía «El enlace se pone aquí abajo»); para eso están los comentarios del archivo.

---

## La regla que sostiene el año

**Ningún mes puede repetir el verbo de otro.** No basta con que el tema sea distinto: lo que ella *hace* con las manos tiene que ser distinto, porque eso es lo que se recuerda.

Lo que ya está usado y por tanto queda prohibido:

| Ya existe | Verbo gastado |
|---|---|
| `un-mes` | jugar un RPG por niveles, pelear un combate |
| `el-camino` | correr y saltar por un escenario lateral |
| `1agosto` | regar, atrapar cosas con una cesta, responder trivia |
| `romantico` | mirar una galería de fotos |
| `flores-amarillas` | ver un lienzo que se dibuja solo |
| `carta-cumpleanos` | girar un corazón 3D |
| las cinco cartas | leer |
| `mes-2` | mantener pulsado, rociar |

---

## Los ocho que faltan

### Mes 5 · 10 de septiembre de 2026 — **La Radio de Nosotros**
> *pista en el hilo: «algo que se escucha»*

Un dial de radio analógico. Se gira con el dedo y entre frecuencia y frecuencia hay estática; cuando el dial cae justo encima de una emisora, entra una canción de las que ya están en `music/` y, debajo, por qué esa y no otra.

**Verbo nuevo: escuchar.** Ninguna página del regalo ha hecho de la música el contenido — hasta ahora siempre ha sido fondo.

Lo que lo hace funcionar: **la estática**. Si las canciones estuvieran en una lista, sería una playlist. Al haber que buscarlas girando, encontrar cada una se siente como encontrarla de verdad. Material listo: ya tienes 19 mp3.

---

### Mes 6 · 10 de octubre de 2026 — **Constelación**
> *«algo que se dibuja»* · **medio año**

Un cielo con estrellas sueltas. Ella arrastra el dedo de una a otra y, cuando cierra una figura, la constelación se enciende y suelta el recuerdo que guardaba. Ocho o nueve figuras en total.

**Verbo nuevo: dibujar.**

Por qué encaja justo en el sexto: la idea es literal. Los puntos ya estaban todos ahí desde el principio, sueltos y sin significar nada. Sólo forman una figura cuando alguien se toma el trabajo de unirlos. A los seis meses eso ya se puede decir sin sonar exagerado.

---

### Mes 7 · 10 de noviembre de 2026 — **Receta para Dos**
> *«algo que se mezcla»*

Una encimera con ingredientes etiquetados: *una taza de terquedad*, *dos cucharadas de risa a las 2 a.m.*, *una pizca de celos*, *ralladura de domingo*. Ella los arrastra a la olla. Según el orden y lo que eche, el plato final cambia de nombre — y hay algún ingrediente que sólo aparece si echó otro antes.

Al final sale la receta impresa y **un vale real**: una cena cocinada por ti, con fecha en blanco para que la ponga ella.

**Verbo nuevo: mezclar** (arrastrar y soltar).

El vale es lo importante. Es el único mes que termina obligándote a ti a hacer algo.

---

### Mes 8 · 10 de diciembre de 2026 — **El Mapa**
> *«algo que se recorre»*

Un mapa ilustrado que se arrastra y se acerca. Chinchetas de dos clases: las **vividas** se abren y cuentan qué pasó ahí; las **futuras** están apagadas y son promesas de viaje, y no se abren — sólo dicen a dónde.

**Verbo nuevo: recorrer** (navegación espacial).

Diciembre ya tiene su carta de navidad, así que este mes no puede ir de fiestas. Va de lo contrario: de lo que queda por hacer. Y las chinchetas apagadas son la primera vez que el regalo promete algo en vez de recordarlo.

---

### Mes 9 · 10 de enero de 2027 — **Cápsula del Tiempo**
> *«algo que se escribe»*

Ella escribe. Dos cartas: una a sí misma dentro de un año y otra a ti. Al terminar, la cápsula **se sella con fecha real** y no se puede volver a abrir hasta el 10 de abril.

**Verbo nuevo: escribir.** Es el primer regalo de todo el año en el que ella no recibe: aporta.

Hasta aquí el regalo ha sido siempre en una dirección. En el noveno mes se da la vuelta, y eso solo ya lo hace el más distinto de los doce.

Detalle técnico: guardar en `localStorage` y bloquear por fecha. Y guardar **una copia que puedas recuperar tú**, porque si ella borra los datos del navegador se pierde — mejor que al sellar también te llegue el texto de alguna forma.

---

### Mes 10 · 10 de febrero de 2027 — **24 Horas**
> *«algo que se gira»*

Una rueda de 24 horas que se gira con el dedo. En cada hora, un micro-momento de un día cualquiera: *07:14 — el mensaje de buenos días que nunca falla*, *15:40 — el audio de tres minutos quejándote del trabajo*, *23:52 — «ya me duermo» y seguimos hasta la 1*.

**Verbo nuevo: girar** (recorrer una escala temporal).

Todos los meses anteriores hablan de días grandes: la pregunta, el primer mes, el cumpleaños. Este habla de un martes. Va de que lo que sostiene una relación no son las fechas señaladas sino las 24 horas que nadie apunta.

Febrero es mes de San Valentín y precisamente por eso el regalo no puede ir de eso. Va de lo ordinario.

---

### Mes 11 · 10 de marzo de 2027 — **Diccionario Privado**
> *«algo que se busca»*

Un diccionario de verdad, con buscador y entradas alfabéticas, pero de las palabras que sólo existen entre ustedes dos: los apodos, las palabras mal dichas que se quedaron, las frases que significan otra cosa. Cada entrada con su categoría gramatical, su definición y su ejemplo de uso fechado.

**Verbo nuevo: buscar.**

Es el más raro de los doce y por eso el que más se va a recordar. Toda pareja que dura acaba inventando un idioma; casi nadie lo escribe.

Marzo ya tiene la dedicatoria del 8M, así que este mes no compite con eso: es lo más íntimo posible, para dos personas y nadie más.

---

### Mes 12 · 10 de abril de 2027 — **La Bóveda**
> *«algo que se abre»* · **un año**

Una cerradura de combinación. Para abrirla hace falta una cifra que ella no tiene en ningún sitio.

**El truco: cada uno de los once meses anteriores esconde un dígito.** Uno en una frecuencia de la radio, otro en una constelación, otro en una chincheta del mapa. No están señalados como pistas; están puestos ahí desde el principio. Al llegar al mes 12 hay que volver a recorrer el año entero para poder abrirlo.

Dentro: la **cápsula del mes 9**, que lleva tres meses sellada y se abre justo aquí. Y lo que decidas poner tú.

**Verbo nuevo: abrir.**

Por qué este cierre y no una carta: una carta final habría sido el duodécimo regalo. Esto convierte los doce en uno solo. Ningún mes se puede saltar, porque sin sus once dígitos la bóveda no abre — el año entero se vuelve, retroactivamente, una sola cosa.

**Ojo con esto:** los dígitos hay que ir sembrándolos desde el mes 5. Apunta cuál va en cada uno según los vayas construyendo, o en abril te toca inventarlos a la fuerza.

| Mes | Dígito | Dónde está escondido |
|---|---|---|
| 1 | `5` | Un Mes Juntos — al final de la carta, tras ganar el combate final |
| 2 | `8` | Lo Que Se Abraza — en la carta final, tras abrir los dos objetos |
| 3 | *pendiente* | depende de lo que construyas aquí |
| 4 | `0` | El Camino a Ti — en la carta final, tras el último capítulo |
| 5 | `7` | La Radio de Nosotros — encontrar las 18 estaciones |
| 6 | `2` | Constelación — encender las 8 figuras |
| 7 | `9` | Receta para Dos — cocinar con el ingrediente secreto (se desbloquea con «celos») |
| 8 | `4` | El Mapa — tocar las 8 chinchetas, vividas y futuras |
| 9 | `1` | Cápsula del Tiempo — se gana al sellarla |
| 10 | `6` | 24 Horas — dar la vuelta completa al reloj |
| 11 | `3` | Diccionario Privado — abrir cualquier palabra |

Los valores de verdad viven en `js/boveda.js` → `DIGITOS_CORRECTOS`. Sólo
falta el mes 3: en cuanto tenga página real, esconde ahí su dígito y
rellena ese `null` — hasta entonces la bóveda avisa que falta uno y no
finge que ya funciona.

---

## Resumen: doce verbos, ninguno repetido

| Mes | Regalo | Verbo |
|---|---|---|
| 1 | Un Mes Juntos | jugar |
| 2 | Lo Que Se Abraza | abrazar y oler |
| 3 | *(el tuyo)* | |
| 4 | El Camino a Ti | caminar |
| 5 | La Radio de Nosotros | escuchar |
| 6 | Constelación | dibujar |
| 7 | Receta para Dos | mezclar |
| 8 | El Mapa | recorrer |
| 9 | Cápsula del Tiempo | escribir |
| 10 | 24 Horas | girar |
| 11 | Diccionario Privado | buscar |
| 12 | La Bóveda | abrir |

Si alguno de los ocho no te convence, cámbialo — pero cámbialo por algo cuyo verbo no esté ya en esta columna. Esa es la única regla que no conviene romper.
