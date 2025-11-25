// ============================================================
// ARRAY DELLE DOMANDE - Contiene tutte le 5 domande del quiz
// Ogni domanda ha: id, testo, opzioni (min 3, max 7) e risposta corretta
// ============================================================
const questions = [
    {
        id: 1,
        text: "Qual è la capitale dell'Italia?",
        options: ["Milano", "Roma", "Napoli", "Torino", "Venezia"],
        correctAnswer: 1 // Indice della risposta corretta (0-based)
    },
    {
        id: 2,
        text: "In che anno è stato firmato l'Atto di Unità d'Italia?",
        options: ["1861", "1870", "1848", "1945", "1920"],
        correctAnswer: 0
    },
    {
        id: 3,
        text: "Quale pianeta è il più grande del Sistema Solare?",
        options: ["Saturno", "Urano", "Giove", "Nettuno", "Marte"],
        correctAnswer: 2
    },
    {
        id: 4,
        text: "Chi ha scritto 'La Divina Commedia'?",
        options: ["Petrarca", "Dante Alighieri", "Boccaccio", "Ariosto", "Tasso"],
        correctAnswer: 1
    },
    {
        id: 5,
        text: "Qual è il fiume più lungo d'Europa?",
        options: ["Danubio", "Volga", "Tamigi", "Reno", "Po", "Senna", "Sava"],
        correctAnswer: 1 // Volga
    }
];

// ============================================================
// VARIABILI GLOBALI - Gestiscono lo stato del quiz
// ============================================================
let currentQuestionIndex = 0; // Indice della domanda attuale (0-4)
let score = 0; // Punteggio totale accumulate (0-50)
const pointsPerCorrectAnswer = 10; // Punti guadagnati per ogni risposta corretta
const maxQuestions = 5; // Numero totale di domande
const maxScore = maxQuestions * pointsPerCorrectAnswer; // 50 punti massimi

let userAnswers = []; // Array che memorizza le risposte dell'utente
let answeredCurrent = false; // Flag: l'utente ha risposto alla domanda attuale?

// ============================================================
// ELEMENTI DEL DOM - Riferimenti ai principali elementi HTML
// ============================================================
const quizContainer = document.getElementById("quizContainer");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("scoreDisplay");
const questionNumber = document.getElementById("questionNumber");
const progressFill = document.getElementById("progressFill");
const resultsContainer = document.getElementById("resultsContainer");
const finalScore = document.getElementById("finalScore");
const resultMessage = document.getElementById("resultMessage");
const resultsDetails = document.getElementById("resultsDetails");

// ============================================================
// FUNZIONE: Mostra la domanda attuale nella pagina
// Legge la domanda dall'array e crea i radio button per le opzioni
// ============================================================
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    let html = `
        <div class="question-container">
            <div class="question-title">
                ${question.text}
            </div>
            <div class="options-group">
    `;

    // Crea un radio button per ogni opzione
    question.options.forEach((option, index) => {
        const optionId = `option-${index}`;
        html += `
            <div class="option" data-index="${index}">
                <input 
                    type="radio" 
                    id="${optionId}" 
                    name="answer" 
                    value="${index}"
                    onchange="handleAnswerSelect(${index})"
                >
                <label for="${optionId}">${option}</label>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    // Inserisce il codice HTML nel contenitore
    quizContainer.innerHTML = html;

    // Se l'utente aveva già risposto a questa domanda, ripristina la selezione
    if (userAnswers[currentQuestionIndex] !== undefined) {
        const selectedOption = document.querySelector(
            `input[name="answer"][value="${userAnswers[currentQuestionIndex]}"]`
        );
        if (selectedOption) {
            selectedOption.checked = true;
            document.querySelector(`[data-index="${userAnswers[currentQuestionIndex]}"]`).classList.add("selected");
        }
    }
}

// ============================================================
// FUNZIONE: Gestisce la selezione di una risposta
// Aggiorna lo stato quando l'utente seleziona un'opzione
// ============================================================
function handleAnswerSelect(index) {
    // Se è la prima volta che risponde a questa domanda
    if (userAnswers[currentQuestionIndex] === undefined) {
        // Verifica se la risposta è corretta
        if (index === questions[currentQuestionIndex].correctAnswer) {
            score += pointsPerCorrectAnswer; // Aggiunge 10 punti
        }
        userAnswers[currentQuestionIndex] = index; // Memorizza la risposta
        answeredCurrent = true;
    } else {
        // L'utente cambia la propria risposta
        userAnswers[currentQuestionIndex] = index;
    }

    // Aggiorna l'interfaccia
    updateUI();

    // Abilita il pulsante "Prossima Domanda"
    nextBtn.disabled = false;
}

// ============================================================
// FUNZIONE: Aggiorna la visualizzazione (punteggio, progresso, etc.)
// Riflette lo stato attuale del quiz nell'interfaccia
// ============================================================
function updateUI() {
    // Aggiorna il numero della domanda
    questionNumber.textContent = `Domanda ${currentQuestionIndex + 1} di ${maxQuestions}`;

    // Aggiorna il punteggio visibile
    scoreDisplay.textContent = `Punti: ${score}/${maxScore}`;

    // Aggiorna la barra di progresso (percentuale completamento)
    const progressPercentage = ((currentQuestionIndex + 1) / maxQuestions) * 100;
    progressFill.style.width = `${progressPercentage}%`;

    // Aggiorna lo stile delle opzioni (selezionate, corrette, scorrette)
    updateOptionStyles();
}

// ============================================================
// FUNZIONE: Aggiorna gli stili delle opzioni
// Evidenzia l'opzione selezionata e mostra correttezza
// ============================================================
function updateOptionStyles() {
    const options = document.querySelectorAll(".option");

    options.forEach((option) => {
        const index = parseInt(option.dataset.index);
        option.classList.remove("selected", "correct", "incorrect");

        if (userAnswers[currentQuestionIndex] === index) {
            option.classList.add("selected");
        }
    });
}

// ============================================================
// FUNZIONE: Passa alla domanda successiva
// Incrementa l'indice e aggiorna la visualizzazione
// ============================================================
function nextQuestion() {
    // Se non ha ancora risposto, esci
    if (userAnswers[currentQuestionIndex] === undefined) {
        alert("Seleziona una risposta prima di continuare!");
        return;
    }

    // Se è l'ultima domanda, mostra i risultati
    if (currentQuestionIndex === maxQuestions - 1) {
        showResults();
        return;
    }

    // Vai alla prossima domanda
    currentQuestionIndex++;
    answeredCurrent = false;
    nextBtn.disabled = true;
    displayQuestion();
    updateUI();
}

// ============================================================
// FUNZIONE: Mostra i risultati finali
// Calcola il messaggio e i dettagli basati sul punteggio
// ============================================================
function showResults() {
    // Nascondi il quiz, mostra i risultati
    quizContainer.parentElement.style.display = "none";
    resultsContainer.classList.add("show");
    document.querySelector(".button-group").style.display = "none";

    // Mostra il punteggio finale
    finalScore.textContent = `${score}/${maxScore}`;

    // Calcola la percentuale e il messaggio
    const percentage = (score / maxScore) * 100;
    let message = "";

    if (percentage === 100) {
        message = "🏆 Perfetto! Hai risposto correttamente a tutte le domande!";
    } else if (percentage >= 80) {
        message = "🌟 Eccellente! Hai avuto un ottimo risultato!";
    } else if (percentage >= 60) {
        message = "👍 Bene! Hai superato il test con buoni risultati.";
    } else if (percentage >= 40) {
        message = "📚 Potevi fare meglio. Continua a studiare!";
    } else {
        message = "💪 Non hai raggiunto il 40%. Prova di nuovo!";
    }

    resultMessage.textContent = message;

    // Mostra i dettagli delle risposte
    let detailsHtml = "<strong>Dettagli delle risposte:</strong><br>";
    questions.forEach((question, index) => {
        const userAnswerIndex = userAnswers[index];
        const userAnswer = question.options[userAnswerIndex];
        const correctAnswer = question.options[question.correctAnswer];
        const isCorrect = userAnswerIndex === question.correctAnswer;

        detailsHtml += `
            <p>
                <strong>Domanda ${index + 1}:</strong> ${question.text}<br>
                La tua risposta: <span style="color: ${isCorrect ? "#4caf50" : "#f44336"}">${userAnswer}</span>
                ${!isCorrect ? `<br>Risposta corretta: <span style="color: #4caf50">${correctAnswer}</span>` : ""}
            </p>
        `;
    });

    resultsDetails.innerHTML = detailsHtml;
}

// ============================================================
// FUNZIONE: Resetta il quiz e ricomincia da capo
// Azzera tutte le variabili e riporta l'interfaccia al primo stato
// ============================================================
function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    answeredCurrent = false;
    nextBtn.disabled = true;

    // Mostra di nuovo il quiz
    quizContainer.parentElement.style.display = "block";
    resultsContainer.classList.remove("show");
    document.querySelector(".button-group").style.display = "flex";

    displayQuestion();
    updateUI();
}

// ============================================================
// EVENT LISTENERS - Connette i pulsanti alle funzioni
// ============================================================
nextBtn.addEventListener("click", nextQuestion);
resetBtn.addEventListener("click", resetQuiz);
restartBtn.addEventListener("click", resetQuiz);

// ============================================================
// INIZIALIZZAZIONE - Avvia il quiz al caricamento della pagina
// ============================================================
displayQuestion();
updateUI();
