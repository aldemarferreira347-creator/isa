/* ============================================================
   ✏️  CONFIG.JS — TODO LO EDITABLE ESTÁ AQUÍ
   Cambia textos, preguntas y mensajes sin tocar el resto
   del código. Guarda el archivo y recarga la página.
   ============================================================ */

const CONFIG = {

  // ---------- Nombres ----------
  nombre: "Isabela",

  // ---------- Pantalla de inicio ----------
  tituloInicio: "Una sorpresa especial para ti, Isabela 🌷",
  subtituloInicio:
    "Este 1 de agosto preparé un pequeño jardín solo para ti. " +
    "Cosecha el ramo, responde nuestra historia y descubre tu premio.",
  botonInicio: "Iniciar aventura 🌻",

  // ---------- Tu Jardín (regar y limpiar) ----------
  jardin: {
    numHierbas: 6,    // malas hierbas que brotan tras regar (se botan una por una)
    tituloRegar: "Oh no... tu jardín está marchito 🥀",
    instruccionRegar: "Arrastra la regadera 💧 sobre cada flor marchita y mantenla encima para mojarla",
    tituloHierbas: "¡Salieron malas hierbas! 🌿",
    instruccionHierbas: "Arrastra el guante 🧤 hasta una hierba para arrancarla y llévala al cubo 🪣 (una por una)",
    tituloEsplendor: "¡Tu jardín floreció en todo su esplendor! ✨",
    instruccionEsplendor: "Ahora sí... es hora de recolectar las flores para tu ramo.",
    botonCosechar: "Recolectar el ramo 💐"
  },

  // ---------- Minijuego de cosecha ----------
  juego: {
    metaFlores: 15,        // flores vivas necesarias para ganar
    vidas: 3,              // corazones (las espinas quitan uno)
    tiempoMarchitarse: 5000,   // ms que tarda en secarse una flor sin agua
    intervaloMarchitar: 6500,  // cada cuánto puede empezar a secarse una flor
    instrucciones: "Atrapa las flores con tu cesta, esquiva las ramas con espinas y usa las gotas de agua para salvar las flores que se marchitan."
  },

  mensajeDerrota: [
    "¡Ouch! Las espinas ganaron esta vez... ¿lo intentamos de nuevo, Isa? 💪",
    "¡Ay no! El jardín se puso rebelde. ¡Tú puedes, amor! 🌷",
    "Las espinas no saben con quién se metieron. ¡Otra vez! 😤💕"
  ],

  // ---------- Trivia ----------
  // ✏️ EDITA AQUÍ tus preguntas reales.
  //    "correcta" es la posición de la respuesta correcta (0 = primera opción).
  trivia: [
    {
      pregunta: "¿Cuál fue nuestra primera cita?",
      opciones: ["Un helado", "El cine", "Un café", "Una caminata"],
      correcta: 1
    },
    {
      pregunta: "¿Qué fecha es especial para nosotros?",
      opciones: ["1 de agosto", "14 de febrero", "10 de abril", "1 de septiembre"],
      correcta: 2
    },
    {
      pregunta: "¿Cuál es mi comida favorita?",
      opciones: ["Pizza", "Hamburguesa", "Sushi", "Tacos"],
      correcta: 1
    },
    {
      pregunta: "¿Cómo te digo de cariño?",
      opciones: ["Isa", "Amor", "Reina", "Todas las anteriores"],
      correcta: 3
    },
    {
      pregunta: "¿Qué es lo que más me gusta de ti?",
      opciones: ["Tu sonrisa", "Tu forma de ser", "Tus ojos", "Absolutamente todo"],
      correcta: 3
    },
    {
      pregunta: "¿Cuál fue tu primera impresión de mí?",
      tipo: "libre"
    },
    {
      pregunta: "¿En qué momento supiste que te gustaba?",
      tipo: "libre"
    },
    {
      pregunta: "¿Cuál ha sido tu recuerdo favorito conmigo?",
      tipo: "libre"
    },
    {
      pregunta: "¿Qué momento nuestro nunca quieres olvidar?",
      tipo: "libre"
    },
    {
      pregunta: "¿Cuál ha sido la cita que más te ha gustado?",
      tipo: "libre"
    }
  ],

  // Mensajes juguetones cuando se equivoca (se eligen al azar)
  mensajesError: [
    "¡Casi casi! Piénsalo con el corazón 💕",
    "Mmm... ¿segura, amor? 😏 Inténtalo otra vez",
    "¡Ups! Esa no era... pero te ves linda pensando 🌸",
    "Jajaja ¿en serio, Isa? ¡Otra oportunidad! 😜",
    "Frío, frío... ❄️ ¡Tú sabes la respuesta!"
  ],

  mensajeAcierto: [
    "¡Exacto! 💚",
    "¡Esa es mi niña! ✨",
    "¡Correcto, Linda! 🌷",
    "¡Lo sabías! 💛"
  ],

  // ---------- Pantalla final ----------
  tituloFinal: "🌟 La Flor Dorada es tuya 🌟",
  subtituloFinal:
    "Completaste el jardín y desbloqueaste la flor más rara de todas. " +
    "Pero eso no es todo... hay un premio de verdad esperándote:",

  cupon: {
    titulo: "VALE POR UN HELADO",
    detalle: "del sabor que quieras, donde tú quieras 🍦",
    nota: "Canjeable cuando quieras · No caduca · Se paga con un beso 💋",
    firma: "Con amor, para Isabela — 1 de agosto"
  },

  // ✏️ EDITA AQUÍ tu carta (borrador para que lo hagas tuyo)
  cartaTitulo: "Detalle final 🌅",
  carta:
    "Isabela, cada 1 de agosto el mundo celebra regalando flores, " +
    "pero yo tengo la suerte de celebrar que te tengo a ti.\n\n" +
    "Este pequeño jardín lo hice pensando en lo que eres para mí: " +
    "la flor más rara y más bonita, la que no se marchita nunca.\n\n" +
    "Gracias por cada risa, cada momento y cada día a tu lado. " +
    "Esto es solo un juego, pero lo que siento por ti es lo más real que tengo.\n\n" +
    "Feliz día, mi amor. 🌻",

  // ---------- Foto opcional ----------
  // Si guardas una foto de ustedes en assets/fotos/nosotros.jpg
  // aparecerá en la pantalla final. Si no existe, no pasa nada.
  fotoFinal: "assets/fotos/nosotros.jpg"
};
