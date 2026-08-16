/* ============================================================
   MAIN.JS — flujo de pantallas, música y arranque
   ============================================================ */

const App = (() => {
  const $ = (id) => document.getElementById(id);
  let musica, btnAudio;
  let hayMusica = true;

  // ---------- pantallas ----------
  function irA(id) {
    document.querySelectorAll(".pantalla").forEach((p) => p.classList.remove("activa"));
    $(id).classList.add("activa");
    if (id !== "pantalla-juego") Juego.detener();
  }

  // ---------- música ----------
  function configurarMusica() {
    musica = $("musica");
    btnAudio = $("btn-audio");
    musica.volume = 0.55;

    // si no existe assets/musica.mp3, se oculta el botón y no pasa nada
    const sinMusica = () => {
      hayMusica = false;
      btnAudio.classList.add("oculto");
    };
    musica.addEventListener("error", sinMusica);
    // el error puede haber disparado antes de llegar aquí
    if (musica.error || musica.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      sinMusica();
    }

    btnAudio.addEventListener("click", () => {
      if (hayMusica && musica.paused) {
        musica.play().catch(() => {});
        Sfx.setActivo(true);
        btnAudio.textContent = "🔊";
      } else if (hayMusica) {
        musica.pause();
        Sfx.setActivo(false);
        btnAudio.textContent = "🔇";
      }
    });
  }

  function intentarReproducir() {
    if (!hayMusica) return;
    musica.play()
      .then(() => { btnAudio.textContent = "🔊"; })
      .catch(() => { btnAudio.textContent = "🔇"; });
  }

  // ---------- arranque ----------
  function iniciar() {
    // textos de la pantalla de inicio desde config.js
    $("titulo-inicio").textContent = CONFIG.tituloInicio;
    $("subtitulo-inicio").textContent = CONFIG.subtituloInicio;
    $("btn-iniciar").textContent = CONFIG.botonInicio;

    configurarMusica();
    Jardin.preparar();
    Juego.preparar();
    Final.preparar();

    $("btn-iniciar").addEventListener("click", () => {
      Sfx.init();           // gesto del usuario → desbloquea el audio
      intentarReproducir();
      irA("pantalla-jardin");
      Jardin.iniciar();
    });
  }

  document.addEventListener("DOMContentLoaded", iniciar);

  return { irA };
})();
