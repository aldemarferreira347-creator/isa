document.addEventListener('DOMContentLoaded', () => {

    // ── Winner ──
    const winnerBox = document.getElementById('winnerBox');
    let winnerTriggered = false;
    const winnerObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !winnerTriggered) {
                winnerTriggered = true;
                setTimeout(() => {
                    document.getElementById('winnerLoader').style.display = 'none';
                    document.getElementById('winnerTitle').style.display = 'none';
                    document.getElementById('winnerMessage').style.display = 'block';
                }, 5000);
            }
        });
    }, { threshold: 0.6 });
    winnerObserver.observe(winnerBox);

    // ── Heart ──
    const btnSi = document.getElementById('btnSi');
    const btnNo = document.getElementById('btnNo');
    const heartArt = document.getElementById('heartArt');
    const heartOk = document.getElementById('heartOk');
    const heartQuestion = document.querySelector('.heart-question');
    const heartBtns = document.querySelector('.heart-btns');

    const heartTemplate = `
    @@@@@@@@@@@@@       @@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@@
 @@@@@@@@@@@@@@@@@@@ @@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       @@@@@@@@@@@@@@@@@@@@@@@@@@@
        @@@@@@@@@@@@@@@@@@@@@@@@@
         @@@@@@@@@@@@@@@@@@@@@@@
          @@@@@@@@@@@@@@@@@@@@@
           @@@@@@@@@@@@@@@@@@@
            @@@@@@@@@@@@@@@@@
             @@@@@@@@@@@@@@@
              @@@@@@@@@@@@@
               @@@@@@@@@@@
                @@@@@@@@@
                 @@@@@@@
                  @@@@@
                   @@@
                    @

                   @@@
                 @@@@@@@
                 @@@@@@@
                   @@@`;

    btnNo.addEventListener('click', () => {
        heartQuestion.style.display = 'none';
        heartBtns.style.display = 'none';
        heartOk.textContent = 'ok';
        heartOk.style.display = 'block';
    });

    btnSi.addEventListener('click', () => {
        const nombreInput = prompt('Nombre de tu persona especial:', 'Isa');
        const nombre = (nombreInput && nombreInput.trim()) || 'Isa';
        heartQuestion.style.display = 'none';
        heartBtns.style.display = 'none';
        heartArt.style.display = 'block';

        let romantizado = heartTemplate;
        let i = 0;
        while (romantizado.includes('@')) {
            romantizado = romantizado.replace('@', nombre[i % nombre.length]);
            i++;
        }

        const lines = romantizado.split('\n');
        let currentLine = 0;
        const printLine = () => {
            if (currentLine < lines.length) {
                heartArt.textContent += lines[currentLine] + '\n';
                currentLine++;
                setTimeout(printLine, 100);
            } else {
                const msg = document.createElement('p');
                msg.style.marginTop = '20px';
                msg.style.color = 'var(--gold2)';
                msg.style.fontWeight = '600';
                msg.textContent = `Te quiero mucho ${nombre}! ❣️`;
                document.getElementById('heartBox').appendChild(msg);
            }
        };
        printLine();
    });

    // ── Isa ──
    const isaQuestion = document.getElementById('isaQuestion');
    const isaBtns = document.getElementById('isaBtns');
    const isaBtnSi = document.getElementById('isaBtnSi');
    const isaBtnNo = document.getElementById('isaBtnNo');
    const isaMessage = document.getElementById('isaMessage');
    let isStepTwo = false;

    isaBtnSi.addEventListener('click', () => {
        if (!isStepTwo) {
            isaQuestion.style.display = 'none';
            isaBtns.style.display = 'none';
            isaMessage.innerHTML = `
                <p style="font-weight:600;color:var(--gold2);display:block;margin-bottom:10px;">🌹 Para mi Isa</p>
                eso esta muy bien.<br>mañana le doy un beso 😘.
            `;
            isaMessage.style.display = 'block';
        } else {
            isaQuestion.style.display = 'none';
            isaBtns.style.display = 'none';
            isaMessage.innerHTML = `
                <p style="font-weight:600;color:var(--gold2);display:block;margin-bottom:10px;">💖 Isabela, me haces muy feliz</p>
                Cada día contigo es especial, me encanta tu forma de ser, tu sonrisa y lo mucho que iluminas mis días.<br>
                Gracias por ser tú, por quererme y por dejarme quererte. ❤️
            `;
            isaMessage.style.display = 'block';
        }
    });

    isaBtnNo.addEventListener('click', () => {
        if (!isStepTwo) {
            isStepTwo = true;
            isaQuestion.innerHTML = '¿Y me quieres mucho? 💕';
        } else {
            isaQuestion.style.display = 'none';
            isaBtns.style.display = 'none';
            isaMessage.innerHTML = `
                <p style="font-weight:600;color:#9ca3af;display:block;margin-bottom:10px;">🧸 Bueno...</p>
                Igual te quiero un montón, aunque digas que no.
            `;
            isaMessage.style.display = 'block';
        }
    });

    // ── Questionnaire ──
    let questStep = 1;
    const questText = document.getElementById('questText');
    const questBtns = document.getElementById('questBtns');

    window.handleQuest = function (ans) {
        if (questStep === 1) {
            if (ans === 'si') {
                questText.innerHTML = '¡Me alegra que lo sepas! 😊<br>pero apuesto a que no las sabes todas... 😉<br>Déjame contarte:';
            } else {
                questText.innerHTML = 'Déjame contarte algunas razones...';
            }
            document.getElementById('razonesList').style.display = 'block';
            questBtns.innerHTML = `<button class="quest-btn btn-primary" onclick="handleQuest('next1')">Siguiente</button>`;
            questStep = 2;

        } else if (questStep === 2) {
            questText.innerHTML = '¿Quieres saber qué más me gusta de ti? 😊';
            document.getElementById('razonesList').style.display = 'none';
            questBtns.innerHTML = `
                <button class="quest-btn btn-primary" onclick="handleQuest('gusto_si')">Sí</button>
                <button class="quest-btn btn-secondary" onclick="handleQuest('gusto_no')">No</button>
            `;
            questStep = 3;

        } else if (questStep === 3) {
            if (ans === 'gusto_si') {
                questText.innerHTML = '¿Estamos en horario familiar? 😇';
                questBtns.innerHTML = `
                    <button class="quest-btn btn-primary" onclick="handleQuest('familia_si')">Sí</button>
                    <button class="quest-btn btn-secondary" onclick="handleQuest('familia_no')">No</button>
                `;
            } else {
                questText.innerHTML = '¡AJJAJA, sabía que dirías eso! 😂<br>¿Lista? (si/no):';
                questBtns.innerHTML = `
                    <button class="quest-btn btn-primary" onclick="handleQuest('lista_si')">Sí</button>
                    <button class="quest-btn btn-secondary" onclick="handleQuest('lista_no')">No</button>
                `;
            }
            questStep = 4;

        } else if (questStep === 4) {
            if (ans === 'familia_si') {
                questText.innerHTML = 'Es una lástima que no pueda decírtelo ahora mismo entonces... 😔<br>Pero mira esto:';
                questBtns.innerHTML = `<button class="quest-btn btn-primary" onclick="showSunflower()">Continuar ❤️</button>`;
            } else if (ans === 'familia_no' || ans === 'lista_si') {
                questText.innerHTML = `
                    1. me encanta tu mirada<br>
                    2. me encanta tu sonrisa<br>
                    3. me encanta tus pucheros<br>
                    4. me encanta cuando te pones melosa<br>
                    5. me encanta como te acaricio<br>
                    6. me encanta todo de ti ❤️
                `;
                questBtns.innerHTML = `
                    <p style="margin-top:20px;color:#fff;">¿Quieres que suba el nivel a más morboso? 😉</p>
                    <div class="quest-btns">
                        <button class="quest-btn btn-primary" onclick="handleQuest('morboso_si')">Sí</button>
                        <button class="quest-btn btn-secondary" onclick="handleQuest('morboso_no')">No</button>
                    </div>
                `;
            } else {
                questText.innerHTML = 'Está bien, lo dejamos aquí por ahora 😊';
                questBtns.innerHTML = `<button class="quest-btn btn-primary" onclick="showSunflower()">Continuar ❤️</button>`;
            }
            questStep = 5;

        } else if (questStep === 5) {
            if (ans === 'morboso_si') {
                questText.innerHTML = `
                    7. me encanta tu cuerpo<br>
                    8. me encanta tu piel<br>
                    9. me encanta cuando me dejas besarte<br>
                    10. me encanta cuando me dejas tocarte<br>
                    11. me encanta cuando me robas besos<br>
                    12. me encanta cuando me besas el cuello<br>
                    13. me encanta cuando me manoseas.... AJAJJAJA
                `;
            } else {
                questText.innerHTML = '¡Está bien! Lo guardo para después 😉';
            }
            questBtns.innerHTML = `<button class="quest-btn btn-primary" onclick="showSunflower()">Continuar ❤️</button>`;
        }
    };

    // Al terminar el quest, en el index original se revelaba el girasol animado
    // (sección que ahora vive en flores-amarillas.html) — aquí navegamos hacia allá.
    window.showSunflower = function () {
        window.location.href = 'flores-amarillas.html';
    };
});
