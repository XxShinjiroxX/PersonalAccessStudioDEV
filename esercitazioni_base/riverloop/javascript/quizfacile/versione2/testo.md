# ISTRUZIONI PER IMPLEMENTARE LA PAGINA FINALE E IL TIMER

## PARTE 1: PAGINA FINALE DEI RISULTATI (Manualmente)

### Cosa fare:
1. Nel file `tipobruto.js`, la funzione `showResults()` esiste già e nasconde il quiz
2. Devi MODIFICARE la funzione `showResults()` per:
   - Aggiungere un contenitore visibile con il punteggio finale
   - Mostrare i dettagli di ogni risposta (giuste/sbagliate)
   - Aggiungere messaggi motivazionali basati sul punteggio
   - Includere un pulsante "Ricomincia" che chiama `resetQuiz()`

### Passaggi:
1. Apri `tipobruto.js`
2. Cerca la funzione `showResults()`
3. Modifica il codice per mostrare:
   ```
   - Titolo "Quiz Completato! 🎉"
   - Punteggio finale grande (es: 40/50)
   - Percentuale e messaggio (Perfetto! / Eccellente! / Bene! / Ricorda di studiare!)
   - Dettagli di ogni domanda (Domanda X: La tua risposta vs Risposta corretta)
   - Pulsante "Ricomincia Quiz"
   ```
4. Il pulsante deve richiamare `resetQuiz()` per riportare lo stato iniziale

---

## PARTE 2: TIMER CON BARRA ROSSA (Manualmente)

### Cosa fare:
Aggiungere un timer di 30 secondi per domanda che mostra una barra rossa che si restringe.

set timeout
set interval sono stati suggeriti dal prof

### Step-by-step:

#### 1. AGGIUNGI L'HTML (in `tipotimido.html`):
```html
<!-- Prima del quizContainer, aggiungi: -->
<div id="timerBar" class="timer-bar"></div>
```

#### 2. AGGIUNGI IL CSS (in `tipoganzo.css`):
```css
.timer-bar {
    height: 8px;
    background: linear-gradient(90deg, #ff6b6b 0%, #d32f2f 100%);
    width: 100%;
    position: relative;
    margin-bottom: 20px;
    border-radius: 4px;
    animation: none;
}

@keyframes timerCountdown {
    from {
        width: 100%;
    }
    to {
        width: 0%;
    }
}
```

#### 3. MODIFICA IL JAVASCRIPT (in `tipobruto.js`):

**Aggiungi queste variabili GLOBALI all'inizio:**
```javascript
let timerInterval;
let remainingTime = 30; // Secondi per domanda
const TIMER_DURATION = 30; // Costante timer
```

**Aggiungi questa FUNZIONE per il timer:**
```javascript
function startTimer() {
    const timerBar = document.getElementById("timerBar");
    remainingTime = TIMER_DURATION;
    
    // Anima la barra da 100% a 0%
    timerBar.style.animation = `timerCountdown ${TIMER_DURATION}s linear forwards`;
    
    timerInterval = setInterval(() => {
        remainingTime--;
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timeoutUser(); // Funzione che chiama quando tempo scade
        }
    }, 1000);
}
```

**Aggiungi questa FUNZIONE per gestire il timeout:**
```javascript
function timeoutUser() {
    // Blocca eventuali interazioni
    nextBtn.disabled = true;
    document.querySelectorAll("input[name='answer']").forEach(input => {
        input.disabled = true;
    });
    
    // Riproduci suono
    playTimeoutSound();
    
    // Mostra pagina di timeout
    showTimeoutMessage();
    
    // Dopo 2 secondi, ripristina il quiz dal principio
    setTimeout(() => {
        resetQuiz();
    }, 2000);
}
```

**Aggiungi questa FUNZIONE per il suono:**
```javascript
function playTimeoutSound() {
    // Crea un suono semplice con Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}
```

**Aggiungi questa FUNZIONE per il messaggio di timeout:**
```javascript
function showTimeoutMessage() {
    const timeoutOverlay = document.createElement("div");
    timeoutOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    timeoutOverlay.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
        ">
            <h2 style="color: #d32f2f; margin-bottom: 20px;">⏰ Tempo Scaduto!</h2>
            <p style="font-size: 18px; color: #555; margin-bottom: 20px;">
                Il tempo per questa domanda è finito.<br>
                Il quiz ricomincerà da capo...
            </p>
        </div>
    `;
    
    document.body.appendChild(timeoutOverlay);
    
    // Rimuovi overlay dopo 2 secondi
    setTimeout(() => {
        timeoutOverlay.remove();
    }, 2000);
}
```

**Modifica la funzione `displayQuestion()`:**
Alla fine della funzione, prima della chiusura, aggiungi:
```javascript
    // Ripristina la barra del timer
    const timerBar = document.getElementById("timerBar");
    timerBar.style.animation = "none";
    timerBar.offsetHeight; // Trigger reflow
    
    // Avvia il timer per questa domanda
    clearInterval(timerInterval);
    startTimer();
}
```

**Modifica la funzione `resetQuiz()`:**
Alla fine della funzione, aggiungi:
```javascript
    // Pulisci il timer
    clearInterval(timerInterval);
}
```

---

## RIEPILOGO DELLE MODIFICHE:

| File | Azione |
|------|--------|
| `tipotimido.html` | ✅ Aggiungi `<div id="timerBar">` prima di `quizContainer` |
| `tipoganzo.css` | ✅ Aggiungi `.timer-bar` e `@keyframes timerCountdown` |
| `tipobruto.js` | ✅ Aggiungi variabili globali: timerInterval, remainingTime, TIMER_DURATION |
| `tipobruto.js` | ✅ Aggiungi funzioni: startTimer(), timeoutUser(), playTimeoutSound(), showTimeoutMessage() |
| `tipobruto.js` | ✅ Modifica `displayQuestion()` e `resetQuiz()` |

---

## NOTE IMPORTANTI:

1. **Timer**: 30 secondi per domanda (puoi modificare `TIMER_DURATION` a un valore diverso)
2. **Barra**: Rossa e gradiente, si restringe da 100% a 0% usando animazione CSS
3. **Suono**: Generato con Web Audio API (non necessita file audio esterno)
4. **Overlay**: Mostra messaggio di timeout con sfondo semi-trasparente nero
5. **Reset automatico**: Dopo 2 secondi dal timeout, il quiz ricomincia da capo azzerando punteggio e risposte

---

## SPIEGAZIONE DELLE FUNZIONI:

### startTimer()
- Attiva l'animazione CSS che riduce la larghezza della barra
- Avvia un setInterval che conta alla rovescia ogni secondo
- Quando il tempo raggiunge 0, chiama `timeoutUser()`

### timeoutUser()
- Blocca il pulsante "Prossima Domanda"
- Disabilita tutti i radio button
- Riproduce un suono d'allarme
- Mostra un overlay con il messaggio di timeout
- Ricomincia il quiz dopo 2 secondi

### playTimeoutSound()
- Usa Web Audio API per generare un suono semplice
- Non necessita file audio, è tutto generato in JavaScript
- Suono di allarme a 800Hz per 0.5 secondi

### showTimeoutMessage()
- Crea un div overlay semi-trasparente
- Mostra un messaggio "Tempo Scaduto!"
- Rimuove l'overlay dopo 2 secondi

---

## TESTING:

1. Apri il quiz nel browser
2. Aspetta 30 secondi senza selezionare una risposta
3. Dovresti vedere:
   - ✅ Barra rossa che si restringe da sinistra a destra
   - ✅ Suono d'allarme al termine del timer
   - ✅ Overlay "Tempo Scaduto!" con sfondo scuro
   - ✅ Reset automatico del quiz dopo 2 secondi

---

## BONUS: Personalizzazioni

Se vuoi modificare il timer da 30 secondi a un altro valore:
- Cambia `TIMER_DURATION = 30` a qualsiasi altro numero (es: 20, 15, 45)
- Cambia la frequenza del suono modificando `oscillator.frequency.value = 800` 

Buon lavoro! 🚀
