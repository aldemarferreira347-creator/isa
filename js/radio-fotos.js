/* ══════════════════════════════════════════════════════════════════════
   RADIO-FOTOS.JS — Mes 5 · Asociación de fotos por temática con cada
   canción de la Radio de Nosotros.
   Cada una de las 224 fotos cuenta con un mensaje y cumplido 100%
   único y fielmente referente a lo que se aprecia en la imagen.
   ══════════════════════════════════════════════════════════════════════ */

const FOTOS_POR_ESTACION = {
  "0": {
    "titulo": "Te Esperaba",
    "tema": "Destino, miradas que esperaron toda la vida y el comienzo de nuestro camino.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.51 PM (1).jpeg",
        "cumplido": "Yo con mi gorra negra sonriendo a la cámara mientras tú estabas bien concentrada mirando el celular... qué rico recordar esos ratos juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.51 PM (1).jpeg",
        "estacion": 0
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.51 PM.jpeg",
        "cumplido": "Los dos con una sonrisa de oreja a oreja en el SENA; verte recostada en mi hombro siempre me llena de paz.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.51 PM.jpeg",
        "estacion": 0
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.35 PM (1).jpeg",
        "cumplido": "Ese guiño gracioso y esa carita que pusiste bajo los árboles... amo cada una de tus ocurrencias cuando nos tomamos fotos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.35 PM (1).jpeg",
        "estacion": 0
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.35 PM (4).jpeg",
        "cumplido": "Una toma desde arriba disfrutando la tarde; yo con mis gafas y tú iluminando todo con esa mirada tan dulce.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.35 PM (4).jpeg",
        "estacion": 0
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.35 PM.jpeg",
        "cumplido": "Esa carita arrugada y divertida que hiciste ese día me hace sonreír cada vez que la veo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.35 PM.jpeg",
        "estacion": 0
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.55 PM (1).jpeg",
        "cumplido": "Pegadito a tu mejilla y sintiendo tu calorcito; me encanta cómo brilla ese collar dorado en tu cuello.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.55 PM (1).jpeg",
        "estacion": 0
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.55 PM.jpeg",
        "cumplido": "Tú tirando piquito a la cámara y yo mirándote embobado con el delantal puesto... qué tarde tan especial pasamos ese día.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.55 PM.jpeg",
        "estacion": 0
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.34 PM (2).jpeg",
        "cumplido": "Nuestros días en el SENA juntos; qué bonito es compartir la rutina y tenerte cerquita en cada clase.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.34 PM (2).jpeg",
        "estacion": 0
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.34 PM (3).jpeg",
        "cumplido": "Esa risa compartida tan genuina y alegre... verte sonreír así de feliz me alegra la vida entera.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.34 PM (3).jpeg",
        "estacion": 0
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.34 PM (4).jpeg",
        "cumplido": "Tus rizos preciosos sobre mi hombro y esa tranquilidad que solo encuentro a tu lado.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.34 PM (4).jpeg",
        "estacion": 0
      }
    ]
  },
  "1": {
    "titulo": "Museo",
    "tema": "Obras de arte, miradas elegantes y la infinita belleza de contemplarte.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.51 PM (2).jpeg",
        "cumplido": "Te ves divina en medio de todos esos bambús y plantas, con tus gafas oscuras pareces una modelo de revista.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.51 PM (2).jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.51 PM (3).jpeg",
        "cumplido": "Ese espejo en el pasillo te hizo justicia; con esa blusa blanca y ese fondo verde te veías absolutamente preciosa.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.51 PM (3).jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.34 PM (1).jpeg",
        "cumplido": "Ese vestido negro de pepitas blancas te queda perfecto; te ves elegante, hermosa y con una figura espectacular.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.34 PM (1).jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.41 PM (1).jpeg",
        "cumplido": "Midiéndote ese vestido amarillo en el probador... ese color te resalta divino y te queda como mandado a hacer.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.41 PM (1).jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.41 PM.jpeg",
        "cumplido": "Otra foto en el probador con el vestido amarillo, esa sonrisa demostraba lo hermosa que te sentías.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.41 PM.jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.23 PM (1).jpeg",
        "cumplido": "Con ese vestido blanco pareces un angelito recién bajado del cielo; qué mujer tan preciosa eres.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.23 PM (1).jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.23 PM (2).jpeg",
        "cumplido": "Esa sonrisa abierta en el espejo con tu vestido blanco me vuelve loco de amor.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.23 PM (2).jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.23 PM.jpeg",
        "cumplido": "Qué elegancia y qué porte tienes mi niña; te ves radiante y llena de luz en ese vestido.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.23 PM.jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.24 PM.jpeg",
        "cumplido": "Inclinando tu cabecita con tanta ternura frente al espejo... eres la mujer más linda de este planeta.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.24 PM.jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.33 PM (3).jpeg",
        "cumplido": "Foto de cuerpo entero en el espejo con tu blusa a cuadros y tus jeans; qué bien te queda ese look.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.33 PM (3).jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.40 PM (4).jpeg",
        "cumplido": "Mano en la cintura y posando en el probador con tu vestido amarillo; una diosa total.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.40 PM (4).jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.05 PM (2).jpeg",
        "cumplido": "Ese vestido negro largo con abertura en la pierna... Dios mío, te ves impresionante, elegante y super linda.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.05 PM (2).jpeg",
        "estacion": 1
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.22 PM (4).jpeg",
        "cumplido": "Otra toma con tu vestido blanco; me encanta cómo te queda y la pureza que transmite tu sonrisa.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.22 PM (4).jpeg",
        "estacion": 1
      }
    ]
  },
  "2": {
    "titulo": "Carita Linda",
    "tema": "Caritas tiernas, pucheros adorables, muecas y sonrisas de cerca.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.34 PM.jpeg",
        "cumplido": "Esa mueca arrugando la nariz con tu camisa azul... eres la niña más linda y tierna de este mundo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.34 PM.jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.41 PM (3).jpeg",
        "cumplido": "Esa sonrisita tímida y tus rizos tan hermosos; eres una obra de arte de pies a cabeza.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.41 PM (3).jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.41 PM (4).jpeg",
        "cumplido": "Haciendo un corazoncito con tus manos en tu ojo; me encanta la delicadeza y ternura de tus gestos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.41 PM (4).jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.41 PM (5).jpeg",
        "cumplido": "Haciendo trompeta con el uniforme del SENA... hasta cuando haces muecas te ves irresistible.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.41 PM (5).jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.29 PM (1).jpeg",
        "cumplido": "Tú con ese puchero tan consentido que adoro y yo feliz de tenerte pegadita a mí.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.29 PM (1).jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.29 PM (3).jpeg",
        "cumplido": "Ese guiño travieso sacando la lengua... me fascina lo divertida y auténtica que eres cuando estamos juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.29 PM (3).jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.33 PM (1).jpeg",
        "cumplido": "Ese besito al aire mientras te recuestas en mí; qué rico ese día tan lleno de arrunchis.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.33 PM (1).jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.33 PM (2).jpeg",
        "cumplido": "Nuestras caras juntitas y esa carita mimada tuya que me despierta las ganas de consentirte siempre.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.33 PM (2).jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.40 PM (1).jpeg",
        "cumplido": "Los dos haciendo trompita contra la pared de ladrillo; qué risa y qué lindo pasar el rato haciéndonos caras.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.40 PM (1).jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.40 PM (3).jpeg",
        "cumplido": "Esa carita inflada de mejillas que hiciste... amo que tengamos tanta confianza para ser unos payasos juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.40 PM (3).jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.40 PM.jpeg",
        "cumplido": "Caras aplastadas y miradas divertidas contra la pared; contigo cualquier rincón se vuelve nuestro lugar favorito.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.40 PM.jpeg",
        "estacion": 2
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.05 PM (1).jpeg",
        "cumplido": "Sentada en la mecedora azul tirándome un piquito; qué rico ese día y qué hermosa te veías con ese top blanco.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.05 PM (1).jpeg",
        "estacion": 2
      }
    ]
  },
  "3": {
    "titulo": "Persona Favorita",
    "tema": "Complicidad pura, risas espontáneas y nuestro refugio seguro.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.05 PM.jpeg",
        "cumplido": "Recuerda que este hombre con sombrero vueltiao y camisa pintada es el amor de tu vida, feliz y orgulloso de ti.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.05 PM.jpeg",
        "estacion": 3
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.39 PM (1).jpeg",
        "cumplido": "Tú acostadita sacándome la lengua con tu camiseta de reno y yo mirándote desde arriba enamorado.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.39 PM (1).jpeg",
        "estacion": 3
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.39 PM (2).jpeg",
        "cumplido": "Yo mandándote un besote desde arriba mientras tú no parabas de sonreír; me encanta jugar contigo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.39 PM (2).jpeg",
        "estacion": 3
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.39 PM (3).jpeg",
        "cumplido": "Tú dándome un beso en la mejilla mientras yo descansaba tranquilo; sentir tu cariño es mi mayor calma.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.39 PM (3).jpeg",
        "estacion": 3
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.39 PM.jpeg",
        "cumplido": "Tú acostada en mis piernas sonriendo y yo dándote el pulgar arriba; qué rico recuerdo de esa tarde relajados.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.39 PM.jpeg",
        "estacion": 3
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.42 PM (1).jpeg",
        "cumplido": "Acomodándote el cabello con la mano y sacando la lengua en el SENA; tus rizos y tu frescura son únicos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.42 PM (1).jpeg",
        "estacion": 3
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.42 PM (2).jpeg",
        "cumplido": "Ese guiño pícaro con tu camisa del SENA... me fascinas en todas tus fotos espontáneas.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.42 PM (2).jpeg",
        "estacion": 3
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.42 PM (3).jpeg",
        "cumplido": "Esa carita de consentida enojada mientras estabas acostada... hasta haciendo pucheros te ves adorable.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.42 PM (3).jpeg",
        "estacion": 3
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.42 PM (4).jpeg",
        "cumplido": "Foto de cabeza sacando la lengua; me fascina tu sentido del humor y lo libre que eres conmigo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.42 PM (4).jpeg",
        "estacion": 3
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.42 PM.jpeg",
        "cumplido": "Esa sonrisa achinadita bajo el sol del mediodía... transmites una alegría que contagia a cualquiera.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.42 PM.jpeg",
        "estacion": 3
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.22 PM (1).jpeg",
        "cumplido": "Nuestros rostros pegaditos bajo la sombra de los árboles; con ese vestido negro sin mangas te veías preciosa.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.22 PM (1).jpeg",
        "estacion": 3
      }
    ]
  },
  "4": {
    "titulo": "Arroyito",
    "tema": "Atardeceres dorados frente al mar, brisa fresca y la flor amarilla en tu cabello.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.52 PM (1).jpeg",
        "cumplido": "Nuestra mano sosteniendo el sol en el atardecer frente al mar; qué rico ese día en la playa, un recuerdo inolvidable.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.52 PM (1).jpeg",
        "estacion": 4
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.52 PM (2).jpeg",
        "cumplido": "El atardecer en el mar enmarcado con los dedos y los barquitos a lo lejos... un momento mágico que vivimos juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.52 PM (2).jpeg",
        "estacion": 4
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.52 PM (3).jpeg",
        "cumplido": "Tus ojitos llenos de paz recostada a mi lado; no necesito nada más en el mundo teniéndote tan cerca.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.52 PM (3).jpeg",
        "estacion": 4
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.49 PM (1).jpeg",
        "cumplido": "El espejo afuera en el patio de la finca; esa blusita negra de flores te luce muchísimo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.49 PM (1).jpeg",
        "estacion": 4
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.49 PM (2).jpeg",
        "cumplido": "Sonriendo frente al espejo con el paisaje campestre de fondo; qué rico ese día tan tranquilo de paseo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.49 PM (2).jpeg",
        "estacion": 4
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.49 PM (3).jpeg",
        "cumplido": "Esa flor amarilla en tu cabello te queda perfecta; resaltaba tu belleza natural y la luz de tus ojos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.49 PM (3).jpeg",
        "estacion": 4
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.49 PM.jpeg",
        "cumplido": "La flor amarilla más hermosa de ese jardín eras tú; qué sonrisa tan deslumbrante bajo el sol.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.49 PM.jpeg",
        "estacion": 4
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.11 PM (1).jpeg",
        "cumplido": "Mano en la cintura y pose de reina en el espejo del patio; siempre tienes un estilazo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.11 PM (1).jpeg",
        "estacion": 4
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.11 PM (2).jpeg",
        "cumplido": "Primer plano de tu carita con la flor amarilla; mirar esta foto me recuerda por qué me enamoré de ti.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.11 PM (2).jpeg",
        "estacion": 4
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.11 PM.jpeg",
        "cumplido": "Entre las hojas de plátano con tu florecita; pareces una flor silvestre llena de vida y alegría.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.11 PM.jpeg",
        "estacion": 4
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.17 PM.jpeg",
        "cumplido": "Esa sonrisa amplia en el espejo del campo; qué rico recordar ese paseo y lo bien que la pasamos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.17 PM.jpeg",
        "estacion": 4
      }
    ]
  },
  "5": {
    "titulo": "Antes de Ti",
    "tema": "Cómo cambió el mundo al encontrarte, tu cumpleaños 19 y tu luz única.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.46 PM (1).jpeg",
        "cumplido": "Con esa blusa folclórica de arandelas de colores... qué orgullo verte lucir nuestras tradiciones tan hermosa.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.46 PM (1).jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.46 PM (2).jpeg",
        "cumplido": "La flor en tu cabello combinada con esa blusa típica; te veías radiante, alegre y auténtica.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.46 PM (2).jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.46 PM.jpeg",
        "cumplido": "Lista para bailar y festejar con tu blusa folclórica; tienes un porte y una gracia incomparables.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.46 PM.jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.06 PM (1).jpeg",
        "cumplido": "Con ese top de rayas azules y tu short de jean; me encanta lo fresca y linda que te ves con ropa relajada.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.06 PM (1).jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.25 PM (1).jpeg",
        "cumplido": "La luz azul del espejo enmarcando tu silueta con el vestido blanco; pareces una pintura viva.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.25 PM (1).jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.25 PM (2).jpeg",
        "cumplido": "El día de tu cumpleaños 19 en tu cama: tus rosas rosadas, los globos y esa sonrisa que merecía el mundo entero.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.25 PM (2).jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.25 PM (3).jpeg",
        "cumplido": "Celebrando tus 19 añitos con tus regalos y tus flores; verte tan consentida y feliz fue mi mayor alegría.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.25 PM (3).jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.25 PM.jpeg",
        "cumplido": "Con tu falda beige y tu blusa blanca frente al espejo; qué buen gusto tienes siempre para vestirte.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.25 PM.jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.30 PM (1).jpeg",
        "cumplido": "Ese estilo urbano con jeans anchos, tenis blancos y top blanco te queda genial; qué flow tan bacano.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.30 PM (1).jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.30 PM (2).jpeg",
        "cumplido": "Con tu falda de jean y camiseta de rayas; te veías super tierna y hermosa para salir.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.30 PM (2).jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.19 PM (1).jpeg",
        "cumplido": "Otra foto con tu blusa folclórica y la flor en el pelo; te lucía increíble para la muestra cultural.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.19 PM (1).jpeg",
        "estacion": 5
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.19 PM.jpeg",
        "cumplido": "Manos a la cintura mostrando con orgullo tu traje típico; qué hermosa te veías ese día de fiesta.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.19 PM.jpeg",
        "estacion": 5
      }
    ]
  },
  "6": {
    "titulo": "Prometo",
    "tema": "El corazón con las manos, promesas sinceras y compromiso de amor eterno.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.29 PM (2).jpeg",
        "cumplido": "Nuestras manos unidas formando un corazón sobre nuestros ojos; una de mis fotos favoritas de los dos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.29 PM (2).jpeg",
        "estacion": 6
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.33 PM.jpeg",
        "cumplido": "Haciendo el corazón con los dedos mirando a través de él... qué lindo recordar ese momento de complicidad.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.33 PM.jpeg",
        "estacion": 6
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.30 PM.jpeg",
        "cumplido": "Mano en la cintura y jeans rotos frente al espejo; me encanta esa actitud y lo hermosa que te ves.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.30 PM.jpeg",
        "estacion": 6
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.31 PM (1).jpeg",
        "cumplido": "Nuestras manos formando ese corazoncito perfecto en nuestros ojos; un símbolo de lo mucho que nos queremos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.31 PM (1).jpeg",
        "estacion": 6
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.31 PM (3).jpeg",
        "cumplido": "Esa trompita tuya pidiendo beso... siempre me sacas una sonrisa con tus caritas tan consentidas.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.31 PM (3).jpeg",
        "estacion": 6
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.31 PM (4).jpeg",
        "cumplido": "Guiñando el ojo y con la lengua afuera; la mejor compañera de risas y locuras que la vida me pudo dar.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.31 PM (4).jpeg",
        "estacion": 6
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.31 PM.jpeg",
        "cumplido": "Mirándonos a través de nuestro propio corazón de manos; qué promesa tan bonita encierra este gesto.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.31 PM.jpeg",
        "estacion": 6
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.37 PM (2).jpeg",
        "cumplido": "De blanco y negro en el espejo de la pieza con el globito amarillo en la cama; sencilla y divina.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.37 PM (2).jpeg",
        "estacion": 6
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.37 PM.jpeg",
        "cumplido": "Recostando mi cabeza en tu hombro con todo el amor del mundo; ahí encuentro siempre mi descanso.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.37 PM.jpeg",
        "estacion": 6
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.30 PM (3).jpeg",
        "cumplido": "Haciendo nuestro corazón con los dedos; cada vez que nos miramos a través de él recuerdo lo mucho que te amo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.30 PM (3).jpeg",
        "estacion": 6
      }
    ]
  },
  "7": {
    "titulo": "Creo en Ti",
    "tema": "Paz profunda, miradas a los ojos, confianza y serenidad absoluta.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.48 PM (1).jpeg",
        "cumplido": "Acostaditos al aire libre en la finca con los árboles de fondo; qué rico ese día respirando aire puro juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.48 PM (1).jpeg",
        "estacion": 7
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.48 PM (2).jpeg",
        "cumplido": "Tú jalándome la cabeza jugando y sacando la lengua; amo nuestras payasadas y cómo nos divertimos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.48 PM (2).jpeg",
        "estacion": 7
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.48 PM.jpeg",
        "cumplido": "Posando en el espejo campestre con tu blusita de flores; tienes una sonrisa que ilumina el día entero.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.48 PM.jpeg",
        "estacion": 7
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.12 PM (1).jpeg",
        "cumplido": "Los dos mirando al cielo desde el pasto en la finca; qué paz tan inmensa se siente estar acostado a tu lado.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.12 PM (1).jpeg",
        "estacion": 7
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.12 PM (2).jpeg",
        "cumplido": "Haciendo señas y sonriendo frente al espejo al aire libre; qué paseo tan agradable compartimos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.12 PM (2).jpeg",
        "estacion": 7
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.12 PM.jpeg",
        "cumplido": "Otra de nuestras locuras agarrándome la cabeza; no hay momento aburrido contigo mi niña.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.12 PM.jpeg",
        "estacion": 7
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.04 PM (1).jpeg",
        "cumplido": "Listos para salir frente al espejo de tu cuarto; qué elegantes nos veíamos los dos combinados.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.04 PM (1).jpeg",
        "estacion": 7
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.04 PM (2).jpeg",
        "cumplido": "Los dos sonriendo al espejo con la Virgencita atrás; bendecido me siento de tenerte en mi vida.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.04 PM (2).jpeg",
        "estacion": 7
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.38 PM.jpeg",
        "cumplido": "Ese look en blanco y negro te queda perfecto; siempre tan bonita y bien arregladita.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.38 PM.jpeg",
        "estacion": 7
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.52 PM.jpeg",
        "cumplido": "Foto en el espejo del baño con tu camisa del corazón; esa sonrisa natural es mi mayor debilidad.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.52 PM.jpeg",
        "estacion": 7
      }
    ]
  },
  "8": {
    "titulo": "Falta de Querer",
    "tema": "Dibujos a mano, detalles nostálgicos y recuerdos que vencen la distancia.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.41 PM (2).jpeg",
        "cumplido": "Tu nombre grabado con tinta en mi piel: 'ISABELA' con corona y flecha, porque tú reinas en mi corazón.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.41 PM (2).jpeg",
        "estacion": 8
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.22 PM (2).jpeg",
        "cumplido": "El cartel de 'SE BUSCA' que te hice: culpable de robarme el corazón y condenada a recibir besos infinitos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.22 PM (2).jpeg",
        "estacion": 8
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.20 PM (1).jpeg",
        "cumplido": "Recuerda que este pelao de chaqueta de cuero y gafas es el amor de tu vida, loco por ti desde el primer día.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.20 PM (1).jpeg",
        "estacion": 8
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.20 PM (2).jpeg",
        "cumplido": "Un collage con cuatro de nuestros mejores momentos sonriendo; cada foto guarda un pedacito de nuestra historia.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.20 PM (2).jpeg",
        "estacion": 8
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.20 PM.jpeg",
        "cumplido": "Ese dibujo a bolígrafo recreando nuestro abrazo frente al espejo... qué detalle tan hermoso y significativo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.20 PM.jpeg",
        "estacion": 8
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.52 PM (1).jpeg",
        "cumplido": "La luz azul neón del espejo resaltando tu vestido negro; pareces salida de una sesión de fotos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.52 PM (1).jpeg",
        "estacion": 8
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.52 PM (2).jpeg",
        "cumplido": "Acomodándote el cabello con la luz azul de fondo; qué porte y qué belleza tan hipnotizante tienes.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.52 PM (2).jpeg",
        "estacion": 8
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.19 PM (2).jpeg",
        "cumplido": "Recuerda que este hombre de gafas y polo negra en la oficina es el amor de tu vida, pensando siempre en ti.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.19 PM (2).jpeg",
        "estacion": 8
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.19 PM (3).jpeg",
        "cumplido": "Top blanco, jeans azules y el espejo azul; un conjunto casual que en ti se ve como de pasarela.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.19 PM (3).jpeg",
        "estacion": 8
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.19 PM (4).jpeg",
        "cumplido": "Ese retrato dibujado a mano en el cuaderno de espiral capturó a la perfección nuestras sonrisas.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.19 PM (4).jpeg",
        "estacion": 8
      }
    ]
  },
  "9": {
    "titulo": "Eres Mía",
    "tema": "La luz dorada del atardecer, cercanía intensa y dos almas que se pertenecen.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.01 PM (1).jpeg",
        "cumplido": "Los dos sonriendo al espejo antes de salir; me encanta cómo nos vemos juntos, somos el mejor equipo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.01 PM (1).jpeg",
        "estacion": 9
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.01 PM.jpeg",
        "cumplido": "Con tus pantalones blancos holgados y blusa negra; qué porte tan elegante y moderno tienes.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.01 PM.jpeg",
        "estacion": 9
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.02 PM (1).jpeg",
        "cumplido": "Listos y sonrientes frente al espejo; cada salida a tu lado es una aventura que guardo con amor.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.02 PM (1).jpeg",
        "estacion": 9
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.02 PM (2).jpeg",
        "cumplido": "Más cerquita del espejo con nuestras cabezas juntitas; adoro sentir tu cercanía y tu calor.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.02 PM (2).jpeg",
        "estacion": 9
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.28 PM.jpeg",
        "cumplido": "Esa camiseta de rayas amarillas te hacía lucir super radiante, haciendo juego con los globos de tu cumple.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.28 PM.jpeg",
        "estacion": 9
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.29 PM (1).jpeg",
        "cumplido": "Esa carita graciosa y sorprendida frente al espejo; me encantan tus ocurrencias cuando te tomas fotos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.29 PM (1).jpeg",
        "estacion": 9
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.29 PM (4).jpeg",
        "cumplido": "La luz dorada de la lámpara de atardecer bañando tu carita; pareces sacada de un sueño de lo hermosa que te ves.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.29 PM (4).jpeg",
        "estacion": 9
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.29 PM (5).jpeg",
        "cumplido": "Riendo a carcajadas bajo la luz cálida de la lámpara; esa alegría tuya es el sol que alumbra mi vida.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.29 PM (5).jpeg",
        "estacion": 9
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.29 PM.jpeg",
        "cumplido": "Inclinando la cabeza con tu camiseta amarilla y los globos arriba; qué niña tan dulce y especial eres.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.29 PM.jpeg",
        "estacion": 9
      }
    ]
  },
  "10": {
    "titulo": "Incondicional",
    "tema": "Amor familiar con el bebé, la camiseta de Colombia y apoyo en todo momento.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.50 PM (1).jpeg",
        "cumplido": "Los dos alzando al bebé con esa sonrisota; qué momento tan tierno y qué hermosa te veías consintiéndolo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.50 PM (1).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.50 PM (2).jpeg",
        "cumplido": "Con tu crop top de rayas azules y tu short; me fascina cómo te ves con ese estilo veraniego.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.50 PM (2).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.50 PM.jpeg",
        "cumplido": "Reflejada en ese espejo redondo con la luna en la pared; una verdadera reina frente a su luna.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.50 PM.jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.47 PM (1).jpeg",
        "cumplido": "Con la camiseta azul de la Selección Colombia; esa camiseta te queda hermosa, la hincha más linda.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.47 PM (1).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.47 PM (2).jpeg",
        "cumplido": "Cerrando los ojitos con orgullo luciendo la camiseta de Colombia; me derrito con esa ternura.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.47 PM (2).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.47 PM (3).jpeg",
        "cumplido": "Mano a la cadera en el patio campestre; qué rico ese día descansando lejos del ruido.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.47 PM (3).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.47 PM (4).jpeg",
        "cumplido": "Otra sonrisa al espejo en la finca; me encanta verte disfrutar de la naturaleza.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.47 PM (4).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.47 PM.jpeg",
        "cumplido": "Mano en la cintura con la camiseta de la selección; tienes una pose y una simpatía únicas.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.47 PM.jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.18 PM (1).jpeg",
        "cumplido": "Haciendo la señal de paz con la camiseta de Colombia; eres la hincha más hermosa de mi corazón.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.18 PM (1).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.18 PM (2).jpeg",
        "cumplido": "Esa sonrisota hermosa que tienes apoyando a la selección; verte sonreír me hace el día.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.18 PM (2).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.18 PM (3).jpeg",
        "cumplido": "Mirada tierna frente al espejo con la tricolor; cada foto tuya con esa camiseta es una joya.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.18 PM (3).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.18 PM (4).jpeg",
        "cumplido": "Recuerda que este bailarín con pañuelo verde y sombrero es el amor de tu vida, dedicado a hacerte sonreír siempre.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.18 PM (4).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.18 PM (5).jpeg",
        "cumplido": "Foto en el espejo con tus hombros descubiertos y la flor folclórica; qué mujer tan preciosa eres.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.18 PM (5).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.18 PM.jpeg",
        "cumplido": "El sol de la tarde iluminando el patio de la finca y a ti en el espejo; qué lindo recuerdo de ese viaje.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.18 PM.jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.21 PM (4).jpeg",
        "cumplido": "Señal de victoria con la camiseta negra de la selección Colombia; qué bien te queda ese uniforme mi reina.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.21 PM (4).jpeg",
        "estacion": 10
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.44 PM.jpeg",
        "cumplido": "Haciendo la 'V' de la victoria con la camiseta negra de Colombia frente al espejo; qué estilo tan bacano.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.44 PM.jpeg",
        "estacion": 10
      }
    ]
  },
  "11": {
    "titulo": "Amor Completo",
    "tema": "Noches elegantes, armonía perfecta y la dicha de no necesitar nada más.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.06 PM.jpeg",
        "cumplido": "De negro elegante en el espejo de la alcoba; tienes una figura y una presencia que roban suspiros.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.06 PM.jpeg",
        "estacion": 11
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.36 PM (1).jpeg",
        "cumplido": "Abrazándote por la cintura frente al espejo; con ese top negro con escote en V te veías despampanante.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.36 PM (1).jpeg",
        "estacion": 11
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.36 PM.jpeg",
        "cumplido": "Mi barbilla en tu cabeza y tú sonriendo feliz con el celular; qué bien se siente tenerte en mis brazos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.36 PM.jpeg",
        "estacion": 11
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.37 PM (1).jpeg",
        "cumplido": "Sonriendo juntos en el pasillo; qué pareja tan bonita hacemos cuando estamos así de felices.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.37 PM (1).jpeg",
        "estacion": 11
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.53 PM (1).jpeg",
        "cumplido": "Ese vestido negro ajustado con la luz azul detrás... qué espectáculo de mujer eres.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.53 PM (1).jpeg",
        "estacion": 11
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.53 PM (2).jpeg",
        "cumplido": "Presumiendo ese vestidazo negro en el espejo; tienes una figura y un porte envidiables.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.53 PM (2).jpeg",
        "estacion": 11
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.53 PM.jpeg",
        "cumplido": "Inclinándote hacia el espejo con tu vestido negro; cada ángulo tuyo es puro arte.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.53 PM.jpeg",
        "estacion": 11
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.00 PM (2).jpeg",
        "cumplido": "Los dos sonriendo al espejo en tu cuarto; la complicidad y el amor se nos notan en los ojos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.00 PM (2).jpeg",
        "estacion": 11
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.03 PM (1).jpeg",
        "cumplido": "Besándote la sien cerquita de tus rizos; estar abrazado a ti es mi lugar seguro.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.03 PM (1).jpeg",
        "estacion": 11
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.03 PM.jpeg",
        "cumplido": "Diciéndote cositas lindas al oído mientras te daba un beso; qué rico ese día juntos en tu casa.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.03 PM.jpeg",
        "estacion": 11
      }
    ]
  },
  "12": {
    "titulo": "Te Regalo",
    "tema": "Cita de cerámica pintando a Winnie Pooh, código en Python y regalos del corazón.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.29 PM (2).jpeg",
        "cumplido": "Las pestañas del navegador con cada página y sorpresa que te he programado; cada una hecha con mi alma para ti.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.29 PM (2).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.29 PM (3).jpeg",
        "cumplido": "El cupón del 'Vale por un helado' y nuestras preguntas de pareja; qué bonito recordar cada respuesta de nuestra historia.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.29 PM (3).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.53 PM (4).jpeg",
        "cumplido": "Las alcancías de cerámica que pintamos juntos: el venadito y Winnie Pooh; qué tarde tan creativa e inolvidable.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.53 PM (4).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.53 PM (5).jpeg",
        "cumplido": "Winnie Pooh con su chalequito rojo terminado; qué talento y qué paciencia le pusimos a esa tarde de pintura.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.53 PM (5).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.36 PM (1).jpeg",
        "cumplido": "El corazón de código que programé para ti en Python con tu nombre: 'Así de grande es mi amor por ti, Te amo Isabela'.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.36 PM (1).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.36 PM (2).jpeg",
        "cumplido": "Nuestra tarjeta pixel art: 'CARLO + ISA' con el corazón en el centro; programar detalles para ti me llena el alma.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.36 PM (2).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.54 PM (1).jpeg",
        "cumplido": "Nuestra cita pintando cerámica con delantales a cuadros; tú sacándome la lengua y yo con el pincel en la mano.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.54 PM (1).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.54 PM (2).jpeg",
        "cumplido": "Cerrando los ojos y con la lengua afuera en la mesa de pintura; qué divertido y especial fue pintar juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.54 PM (2).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.54 PM (3).jpeg",
        "cumplido": "Recuerda que este artista con delantal concentrado pintando a Winnie Pooh es el amor de tu vida, haciéndote detalles con amor.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.54 PM (3).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.54 PM (4).jpeg",
        "cumplido": "Recostando mi mejilla en tu frente con los delantales puestos; qué mirada tan llena de amor me diste.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.54 PM (4).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.54 PM (5).jpeg",
        "cumplido": "Otra de tus muecas consentidas en el taller de pintura; qué tarde tan maravillosa compartimos ese día.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.54 PM (5).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.54 PM.jpeg",
        "cumplido": "El venadito portalápices que pintamos terminado; quedó hermoso y es un lindo recuerdo de nuestra cita creativa.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.54 PM.jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.58 PM (1).jpeg",
        "cumplido": "Winnie Pooh en blanco antes de empezar a pintarlo; el inicio de una tarde llena de risas y colores.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.58 PM (1).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.58 PM (2).jpeg",
        "cumplido": "La figurita de yeso esperando que le diéramos vida con nuestras manos; qué bonito compartir momentos así contigo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.58 PM (2).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.58 PM (3).jpeg",
        "cumplido": "Tú haciendo trompita recostada hacia mí con nuestras cerámicas pintadas en la mesa; me encantas.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.58 PM (3).jpeg",
        "estacion": 12
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.59 PM.jpeg",
        "cumplido": "Sonriendo felices en el taller con nuestras piezas de arte en la mesa; una tarde perfecta de los dos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.59 PM.jpeg",
        "estacion": 12
      }
    ]
  },
  "13": {
    "titulo": "Airplane",
    "tema": "Paseos en auto, ricas comidas, la cita de manillas y aventuras compartidas.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.36 PM.jpeg",
        "cumplido": "Los dos con las camisas del SENA bajo el techo; yo con mis gafas oscuras y tú con esa carita tan linda.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.36 PM.jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.58 PM.jpeg",
        "cumplido": "Ese primer plano de tu carita y tus labios haciendo puchero; eres una tentación de ternura.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.58 PM.jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.45 PM (1).jpeg",
        "cumplido": "Nuestra cita haciendo manillas en la mesa de cuentas con paredes de colores; qué rico ese día creando cosas juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.45 PM (1).jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.45 PM (2).jpeg",
        "cumplido": "Tú tirando besito al espejo con tu camisa de cebra y yo feliz de estar compartiendo esa tarde contigo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.45 PM (2).jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.45 PM.jpeg",
        "cumplido": "Yo con la mano en la mejilla mirándote con amor mientras tú tomabas la foto frente al espejo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.45 PM.jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.59 PM (1).jpeg",
        "cumplido": "Paseando en el carro juntos; tú haciéndome caras divertidas y yo disfrutando cada kilómetro a tu lado.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.59 PM (1).jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.59 PM (2).jpeg",
        "cumplido": "Viajando juntitos en el carro; qué rico sentir tu cabecita cerquita de mí mientras rodamos por la ciudad.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.59 PM (2).jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.21 PM (2).jpeg",
        "cumplido": "Tú mostrándome la herramienta para ensartar mostacillas con cara pícara; qué risa y qué lindo pasar el rato así.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.21 PM (2).jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.21 PM (3).jpeg",
        "cumplido": "Los dos sentados en la mesita con las cuentas de colores; me encanta compartir cualquier plan contigo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.21 PM (3).jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.31 PM (1).jpeg",
        "cumplido": "Ese plato de patacones con queso derretido que pedimos para picar; qué rico ese día comiendo rico juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.31 PM (1).jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.31 PM (2).jpeg",
        "cumplido": "La salchipapa gigante con guacamole y queso que nos comimos; qué delicia de comida y qué linda compañía.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.31 PM (2).jpeg",
        "estacion": 13
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.43 PM (5).jpeg",
        "cumplido": "Con ese sombrero blanco vaquero pareces de novela; qué porte tan espectacular y qué carita tan hermosa.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.43 PM (5).jpeg",
        "estacion": 13
      }
    ]
  },
  "14": {
    "titulo": "Beso",
    "tema": "Besos en la mejilla, piquitos cariñosos, caricias y ternura infinita.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.35 PM (2).jpeg",
        "cumplido": "Un recuerdo de aquel beso en la mejilla que te di mientras sonreías; darte besos es mi vicio favorito.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.35 PM (2).jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.35 PM (3).jpeg",
        "cumplido": "Yo dándote un beso y tú con esa trompita tan consentida que me mata... imposible no amarte con locura.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.35 PM (3).jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.29 PM.jpeg",
        "cumplido": "Un recuerdo de aquel beso apretado en la mejilla; sentir tu piel suavecita es lo más rico del mundo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.29 PM.jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.31 PM (2).jpeg",
        "cumplido": "Un recuerdo de aquel beso escondido en tu cuello; qué rico ese día sintiendo la paz de estar contigo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.31 PM (2).jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.57 PM.jpeg",
        "cumplido": "Yo plantándote un beso en la mejilla bajo el arco verde; no me canso de besarte en cualquier lugar.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.57 PM.jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.04 PM.jpeg",
        "cumplido": "Un recuerdo de aquel beso robado en el espejo antes de salir; me encanta llenarte de besos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.04 PM.jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.01 PM (2).jpeg",
        "cumplido": "Un recuerdo de aquel beso tierno en la mejilla frente al espejo; qué rico ese día de paseo juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.01 PM (2).jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.02 PM.jpeg",
        "cumplido": "Inclinándome para darte otro beso en la mejilla; eres mi imán, no puedo evitar estar pegado a ti.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.02 PM.jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.00 PM (1).jpeg",
        "cumplido": "Un recuerdo de aquel beso suave en tu mejilla en tu habitación; qué delicia de abrazo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.00 PM (1).jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.00 PM.jpeg",
        "cumplido": "Otro beso apretadito a mi niña consentida; nunca me cansaré de llenarte de besos la cara.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.00 PM.jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.21 PM (1).jpeg",
        "cumplido": "Un recuerdo de aquel beso en la mejilla frente al espejo del baño; qué linda te veías con ese top de cebra.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.21 PM (1).jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.30 PM (4).jpeg",
        "cumplido": "Tú tirando trompita al aire y yo feliz a tu lado disfrutando la brisa; qué rico ese día tan tranquilo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.30 PM (4).jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.32 PM (1).jpeg",
        "cumplido": "Yo dándote un beso y tú sacando la lengua con picardía; me vuelves loco con tu forma de ser.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.32 PM (1).jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.32 PM (3).jpeg",
        "cumplido": "Carita con carita y miradas brillantes; qué lindo es compartir la vida y saber que nos tenemos el uno al otro.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.32 PM (3).jpeg",
        "estacion": 14
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.56 PM.jpeg",
        "cumplido": "Esa trompita tan tierna recostada a mi hombro; qué rico ese día descansando juntos después de caminar.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.56 PM.jpeg",
        "estacion": 14
      }
    ]
  },
  "15": {
    "titulo": "Propuesta Indecente",
    "tema": "Cenas con lámparas de colores, elegancia nocturna y sonrisas cómplices.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.22 PM (3).jpeg",
        "cumplido": "Ese espejo redondo con luz en la pared de mármol negro te hizo brillar; ese top blanco resalta tu figura.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.22 PM (3).jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.22 PM.jpeg",
        "cumplido": "Sentadita en el restaurante bajo las lámparas de colores con tu chaqueta deportiva... qué linda te veías esa noche.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.22 PM.jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.11.52 PM.jpeg",
        "cumplido": "Ese espejo con marco de madera reflejando tu outfit de falda negra y blusa blanca; qué mujer tan espectacular.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.11.52 PM.jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.21 PM (5).jpeg",
        "cumplido": "Esa sonrisita hermosa en el restaurante bajo el techo lleno de luces de colores; iluminabas todo el lugar.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.21 PM (5).jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.44 PM (1).jpeg",
        "cumplido": "Tu carita iluminada por las luces de colores del restaurante; esa sonrisa tuya enamora a cualquiera.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.44 PM (1).jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.44 PM (2).jpeg",
        "cumplido": "Qué linda te veías sentada esa noche con tu chaqueta deportiva; los colores del lugar te hacían resaltar.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.44 PM (2).jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.44 PM (3).jpeg",
        "cumplido": "Paseando bajo la sombra de los árboles; verte tan feliz a mi lado es todo lo que le pido a Dios.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.44 PM (3).jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.44 PM (4).jpeg",
        "cumplido": "Nuestras frentes pegaditas y dos sonrisas que lo dicen todo; no hay nada más real que este amor.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.44 PM (4).jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.44 PM (5).jpeg",
        "cumplido": "Arrugando la nariz y sacando la lengua jugando; amo tu espontaneidad y esa alegría tan tuya.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.44 PM (5).jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.35 PM (1).jpeg",
        "cumplido": "Los dos frente al espejo del pasillo; qué elegante te veías y qué rico ese día compartiendo juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.35 PM (1).jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.35 PM (2).jpeg",
        "cumplido": "Abrazándote por la cintura y mirándote con orgullo; me encanta salir contigo y presumirte ante el mundo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.35 PM (2).jpeg",
        "estacion": 15
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.35 PM.jpeg",
        "cumplido": "Mi mentón apoyado en tu cabecita y tú sonriendo plena; ese abrazo en el pasillo lo guardo en mi corazón.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.35 PM.jpeg",
        "estacion": 15
      }
    ]
  },
  "16": {
    "titulo": "Vas a Quedarte",
    "tema": "Abrazos apretados en tu alcoba, cobijo en el cine y cariño eterno.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.57 PM (1).jpeg",
        "cumplido": "Los dos bajo el arco de hojas verdes sonriendo al espejo; qué lindo recuerdo de esa salida juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.57 PM (1).jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.53 PM (3).jpeg",
        "cumplido": "Cuatro momentos bajo el arco de hojas y flores; besándote y abrazándote donde sea, siempre juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.53 PM (3).jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.56 PM (1).jpeg",
        "cumplido": "Juntitos bajo las flores y el follaje del arco; qué foto tan hermosa nos quedó de esa salida.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.56 PM (1).jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.56 PM (2).jpeg",
        "cumplido": "Mirándote embelesado en el espejo bajo el arco de flores; qué mujer tan espectacular eres Isabela.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.56 PM (2).jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.43 PM (1).jpeg",
        "cumplido": "Tú dormidita y acurrucada detrás de mi hombro en el cine; qué delicia de arrunche esperando la película.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.43 PM (1).jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.43 PM (2).jpeg",
        "cumplido": "Asomando tu carita por encima de mi espalda con una sonrisa tierna; adoro tenerte como mi sombra consentida.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.43 PM (2).jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.43 PM (3).jpeg",
        "cumplido": "Recostada en mi espalda con esa paz tan bonita; en mis hombros siempre vas a tener tu refugio.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.43 PM (3).jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.43 PM (4).jpeg",
        "cumplido": "Recuerda que este hombre sentado esperándote en el centro comercial es el amor de tu vida, contando los minutos para verte.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.43 PM (4).jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.43 PM.jpeg",
        "cumplido": "Tú con esa carita de sueño apoyada en mi hombro en el cine; me encanta cuidarte y tenerte cerquita.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.43 PM.jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.26 PM (1).jpeg",
        "cumplido": "Un abrazo apretado escondiendo tu carita en mi cuello frente al espejo; qué rico ese día lleno de cariño.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.26 PM (1).jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.26 PM (2).jpeg",
        "cumplido": "Yo envolviéndote con mis brazos por detrás mientras te tomabas la foto; abrazarte así me da toda la paz del mundo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.26 PM (2).jpeg",
        "estacion": 16
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.26 PM.jpeg",
        "cumplido": "Cuatro tomas de ese abrazo apretado en tu alcoba; la ternura de estar pegaditos sin querer soltarnos jamás.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.26 PM.jpeg",
        "estacion": 16
      }
    ]
  },
  "17": {
    "titulo": "Nuestra Melodía",
    "tema": "Celebraciones de vida, el festejo de mis 18 años y la torta de arequipe.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.30 PM (3).jpeg",
        "cumplido": "Recuerda que este cumpleañero sentado con su rosa preservada y sus globos es el amor de tu vida, agradecido por tenerte.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.30 PM (3).jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.31 PM.jpeg",
        "cumplido": "Recuerda que este hombre sentado en su cumpleaños con su rosa eterna es el amor de tu vida, inmensamente feliz a tu lado.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.31 PM.jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.32 PM (1).jpeg",
        "cumplido": "Recuerda que este muchacho sonriendo en su cumpleaños 18 frente a su pastel es el amor de tu vida, bendecido de celebrarlo contigo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.32 PM (1).jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.32 PM.jpeg",
        "cumplido": "Ese platazo de comida con huevo frito, chicharrón y aguacate que compartimos en mi cumpleaños; qué delicia de almuerzo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.32 PM.jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.33 PM (2).jpeg",
        "cumplido": "Los dos sonriendo juntos detrás de la torta de arequipe; celebrar mis 18 años contigo fue el regalo más hermoso.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.33 PM (2).jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.33 PM (3).jpeg",
        "cumplido": "Nuestras sonrisas iluminadas por las bombillas sobre el pastel; qué noche tan mágica y llena de dicha compartimos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.33 PM (3).jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.33 PM (4).jpeg",
        "cumplido": "Sentaditos en la mesa del restaurante bien pegaditos; esa carita tuya llena de amor me derrite por completo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.33 PM (4).jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.33 PM.jpeg",
        "cumplido": "Recuerda que este hombre soplando las velas de sus 18 años pidió el deseo de amarte y estar contigo toda la vida.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.33 PM.jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.34 PM (1).jpeg",
        "cumplido": "Un recuerdo de aquel beso en la mejilla que me diste en la mesa de mi cumpleaños; qué rico sentir tu cariño en un día tan especial.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.34 PM (1).jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.34 PM (2).jpeg",
        "cumplido": "Sonriendo felices en el restaurante; gracias por hacer de mi cumpleaños una fecha que jamás voy a olvidar.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.34 PM (2).jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.34 PM (4).jpeg",
        "cumplido": "Los dos bien pegaditos frente al espejo del pasillo; qué bien combinamos y qué dicha es salir juntos.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.34 PM (4).jpeg",
        "estacion": 17
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.34 PM.jpeg",
        "cumplido": "Mirándonos de cerca en la mesa del festejo; tus ojitos hermosos reflejaban todo el amor tan puro que nos une.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.34 PM.jpeg",
        "estacion": 17
      }
    ]
  },
  "18": {
    "titulo": "Mon Amour",
    "tema": "Nuestros recuerdos más amorosos: besos inolvidables en los labios y la promesa de amar a Mon Amour por siempre.",
    "fotos": [
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.40 PM (2).jpeg",
        "cumplido": "Un beso suave e íntimo que detuvo el tiempo; la dulzura de tus labios no la cambio por nada en la vida.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.40 PM (2).jpeg",
        "estacion": 18
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.21 PM.jpeg",
        "cumplido": "Un recuerdo de aquel beso en los labios en medio de la cita; tus besos son lo más dulce que existe en este mundo.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.21 PM.jpeg",
        "estacion": 18
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.28 PM.jpeg",
        "cumplido": "Un beso suave en tu mejilla mientras cerrabas los ojos; sentir tu respiración y tu piel es pura magia.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.28 PM.jpeg",
        "estacion": 18
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.30 PM (1).jpeg",
        "cumplido": "Escondiendo mi rostro en tu cuello para llenarte de mimos; qué delicia de arrunche bajo el cielo abierto.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.30 PM (1).jpeg",
        "estacion": 18
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.30 PM (2).jpeg",
        "cumplido": "Los dos mandando piquito a la cámara; no hay duda de que somos tal para cual hasta para las muecas.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.30 PM (2).jpeg",
        "estacion": 18
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.30 PM.jpeg",
        "cumplido": "Un recuerdo de aquel beso en los labios tan tierno y sincero; besarte hace que todo el mundo desaparezca.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.30 PM.jpeg",
        "estacion": 18
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.32 PM (2).jpeg",
        "cumplido": "La magia de besarnos con los ojos cerrados; tus labios tienen la calma y la felicidad exacta que necesito.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.32 PM (2).jpeg",
        "estacion": 18
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.32 PM.jpeg",
        "cumplido": "Apretando mi boca contra tu mejilla con todo el cariño del mundo; eres mi mayor bendición.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.32 PM.jpeg",
        "estacion": 18
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.13.56 PM (3).jpeg",
        "cumplido": "Un recuerdo de aquel beso apasionado en la mejilla bajo las flores del arco; me fascinas entera.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.13.56 PM (3).jpeg",
        "estacion": 18
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.33 PM (1).jpeg",
        "cumplido": "Un recuerdo de aquel beso en los labios sobre el pastel de cumpleaños; el mejor deseo que pude pedir fue tenerte a mi lado.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.33 PM (1).jpeg",
        "estacion": 18
      },
      {
        "src": "Fotos/contenido visual/fotos-pareja/WhatsApp Image 2026-09-06 at 4.14.34 PM (3).jpeg",
        "cumplido": "Sosteniendo tu mejilla con mi mano mientras te daba un beso apasionado; tú eres el amor de mi vida Isabela.",
        "nombre": "WhatsApp Image 2026-09-06 at 4.14.34 PM (3).jpeg",
        "estacion": 18
      }
    ]
  }
};

// Array plano con todas las 224 fotos únicas de la pareja y sus cumplidos exclusivos
const FOTOS_PAREJA = Object.values(FOTOS_POR_ESTACION).flatMap(e => e.fotos);
