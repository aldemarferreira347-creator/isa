# 🌻 Jardín de Recuerdos — Edición 1 de Agosto

Un regalo interactivo para Isabela: revivir su jardín marchito → cosechar las flores → trivia de nuestra historia → Flor Dorada con cupón de helado y carta.

## ✏️ Qué editar antes de entregarlo

**Todo lo editable está en un solo archivo: [`js/config.js`](js/config.js)**. Ábrelo con el Bloc de notas o VS Code:

1. **Trivia (IMPORTANTE)**: las 6 preguntas son de ejemplo y dicen `✏️(EDITA ESTA PREGUNTA)`. Reemplázalas por preguntas reales. En cada una, `correcta` es la posición de la respuesta buena empezando en `0` (0 = primera opción, 1 = segunda...).
2. **La carta** (`carta:`): hay un borrador escrito — hazlo tuyo.
3. **El cupón** (`cupon:`): ya dice "Vale por un helado", ajusta si quieres.
4. Los demás textos y mensajes también se pueden cambiar ahí.

## 🎵 Música

Ya incluye `assets/musica.mp3`: **"Piano Romantic" de AtlasAudio** (Pixabay, licencia libre, sin atribución obligatoria). Para cambiarla, reemplaza ese archivo por cualquier otro mp3 **con el mismo nombre** (`musica.mp3`). Si borras el archivo, el juego funciona igual pero sin música.

## 📷 Foto opcional

Si guardas una foto de ustedes como `assets/fotos/nosotros.jpg`, aparecerá automáticamente en la pantalla final. Si no, no aparece nada (no da error).

## 🖥️ Probarlo en tu PC

Doble clic a `index.html` y se abre en el navegador. Para probarlo "como se verá en el celular": F12 → icono de móvil (Ctrl+Shift+M).

## 🚀 Publicarlo en GitHub Pages (para enviarle el enlace)

1. Entra a [github.com](https://github.com) e inicia sesión.
2. Botón **+** (arriba a la derecha) → **New repository**. Nombre: `jardin-de-recuerdos`. Déjalo **Public** → **Create repository**.
3. En la página del repo nuevo: **uploading an existing file** → arrastra TODOS los archivos y carpetas de este proyecto (`index.html`, `css`, `js`, `assets`) → **Commit changes**.
   - ⚠️ Arrastra las carpetas completas para que se conserve la estructura. La carpeta `.claude` no hace falta subirla.
4. En el repo: **Settings** → **Pages** (menú izquierdo) → en "Branch" elige `main` y carpeta `/ (root)` → **Save**.
5. Espera 1–2 minutos y recarga: arriba aparecerá el enlace, algo como
   `https://TU-USUARIO.github.io/jardin-de-recuerdos/`
6. Ábrelo en tu celular para probarlo y luego... envíaselo a Isabela 💌

## 🎮 Cómo se juega

- **Tu Jardín**: el jardín empieza marchito 🥀. Toca cada flor para regarla 💧; cuando todo florece brotan malas hierbas 🌿 que hay que arrancar tocándolas. Limpio el jardín, queda en todo su esplendor ✨ y se desbloquea la cosecha.
- **Cosecha**: atrapa 15 flores con la cesta (arrastrando el dedo o con flechas ◀ ▶). Esquiva las espinas 🌵 (3 vidas). Si una flor del ramo se empieza a secar, atrapa una gota 💧 para salvarla.
- **Trivia**: responde las preguntas; si falla puede reintentar.
- **Final**: Flor Dorada, cupón descargable como imagen y la carta.
