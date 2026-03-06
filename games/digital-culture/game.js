// game.js - לוגיקת המשחק עם טיימר דקה וסאונד מובנה

// משתנים גלובליים
let selectedConcepts = [];
let currentConceptIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let studentName = '';
let studentId = '';
let studentResults = {};
let timer = null;
let timeLeft = 60; // דקה
let warningPlayed = false;

// מערכת צלילים מובנית
const SoundSystem = {
    context: null,
    
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio not supported');
        }
    },
    
    beep(frequency, duration, volume = 0.3) {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.value = volume;
        
        const now = this.context.currentTime;
        oscillator.start(now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        oscillator.stop(now + duration);
    },
    
    click() { this.beep(800, 0.1, 0.2); },
    
    correct() {
        this.beep(523, 0.1, 0.3);
        setTimeout(() => this.beep(659, 0.1, 0.3), 100);
        setTimeout(() => this.beep(784, 0.2, 0.3), 200);
    },
    
    incorrect() {
        this.beep(400, 0.15, 0.3);
        setTimeout(() => this.beep(300, 0.15, 0.3), 150);
        setTimeout(() => this.beep(200, 0.25, 0.3), 300);
    },
    
    warning() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.beep(800, 0.1, 0.4);
                setTimeout(() => this.beep(600, 0.1, 0.4), 150);
            }, i * 500);
        }
    },
    
    timeUp() {
        this.beep(600, 0.3, 0.4);
        setTimeout(() => this.beep(400, 0.3, 0.4), 300);
        setTimeout(() => this.beep(200, 0.5, 0.4), 600);
    },
    
    success() {
        const melody = [
            {freq: 523, time: 0},
            {freq: 659, time: 150},
            {freq: 784, time: 300},
            {freq: 1047, time: 450}
        ];
        melody.forEach(note => {
            setTimeout(() => this.beep(note.freq, 0.2, 0.3), note.time);
        });
    }
};

// אתחול בטעינת הדף
document.addEventListener('DOMContentLoaded', function() {
    SoundSystem.init();
    init();
});

// אתחול מערכת עם בדיקת זיהוי
document.addEventListener('click', function initAudio() {
    SoundSystem.init();
    document.removeEventListener('click', initAudio);
}, { once: true });

function init() {
    createConceptsDropdown();
}

// יצירת רשימה נפתחת
function createConceptsDropdown() {
    const container = document.getElementById('conceptsAccordion');
    const concepts = Object.keys(window.conceptsData);
    
    let html = `
        <div class="concepts-dropdown">
            <div class="dropdown-header" onclick="toggleDropdown()">
                <span class="dropdown-title">👇 לחץ לבחירת מושגים</span>
                <span class="dropdown-icon" id="dropdownIcon">▼</span>
            </div>
            <div class="dropdown-content" id="dropdownContent">
    `;
    
    concepts.forEach((name, index) => {
        html += `
            <div class="concept-item" onclick="event.stopPropagation();">
                <label class="concept-label">
                    <input type="checkbox" id="concept${index}" value="${name}" 
                           onchange="updateStartButton(); updateDropdownTitle();">
                    <span class="concept-name">${name}</span>
                    <span class="concept-desc">${window.conceptsData[name].shortDesc}</span>
                </label>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function toggleDropdown() {
    SoundSystem.click();
    const content = document.getElementById('dropdownContent');
    const icon = document.getElementById('dropdownIcon');
    
    content.classList.toggle('open');
    icon.classList.toggle('open');
}

function updateDropdownTitle() {
    const checkedBoxes = document.querySelectorAll('.concept-item input[type="checkbox"]:checked');
    const title = document.querySelector('.dropdown-title');
    
    if (checkedBoxes.length === 0) {
        title.textContent = '👇 לחץ לבחירת מושגים';
    } else if (checkedBoxes.length === 1) {
        title.textContent = `✓ נבחר מושג אחד`;
    } else {
        title.textContent = `✓ נבחרו ${checkedBoxes.length} מושגים`;
    }
}

function selectAllConcepts() {
    SoundSystem.click();
    const checkboxes = document.querySelectorAll('.concept-item input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
    updateStartButton();
    updateDropdownTitle();
}

function deselectAllConcepts() {
    SoundSystem.click();
    const checkboxes = document.querySelectorAll('.concept-item input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateStartButton();
    updateDropdownTitle();
}

function updateStartButton() {
    const checkedBoxes = document.querySelectorAll('.concept-item input[type="checkbox"]:checked');
    const startBtn = document.getElementById('startBtn');
    
    startBtn.disabled = checkedBoxes.length === 0;
}

function startGame() {
    SoundSystem.success();
    
    // קבלת ת"ז ושם מ-localStorage (נשמר באזור תלמיד)
    studentId = localStorage.getItem('studentId') || '';
    studentName = StudentManager.getStudentName(studentId) || 'תלמיד';
    
    if (!studentId) {
        alert('לא זוהית במערכת. חזור לאזור תלמיד והזדהה תחילה.');
        window.location.href = '../../student/index.html';
        return;
    }
    
    const checkedBoxes = document.querySelectorAll('.concept-item input[type="checkbox"]:checked');
    selectedConcepts = Array.from(checkedBoxes).map(cb => cb.value);
    
    currentConceptIndex = 0;
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    studentResults = {
        studentId: studentId,
        name: studentName,
        date: new Date().toLocaleString('he-IL'),
        concepts: {},
        gameId: 'digital-culture'
    };
    
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('gamePage').classList.remove('hidden');
    
    loadConcept();
}

function loadConcept() {
    if (currentConceptIndex >= selectedConcepts.length) {
        finishGame();
        return;
    }
    
    const conceptName = selectedConcepts[currentConceptIndex];
    const concept = window.conceptsData[conceptName];
    
    currentQuestionIndex = 0;
    studentResults.concepts[conceptName] = {
        questions: [],
        score: 0,
        correct: 0,
        incorrect: 0
    };
    
    showConceptModal(conceptName, concept);
}

function showConceptModal(conceptName, concept) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'conceptModal';
    modal.innerHTML = `
        <div class="modal-content">
            ${concept.intro}
            <button class="btn" onclick="startConceptQuestions()">
                🎯 התחל לענות על שאלות!
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

function startConceptQuestions() {
    SoundSystem.click();
    
    const modal = document.getElementById('conceptModal');
    if (modal) modal.remove();
    
    document.getElementById('questionContainer').classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    const conceptName = selectedConcepts[currentConceptIndex];
    const concept = window.conceptsData[conceptName];
    
    if (currentQuestionIndex >= 5) {
        showConceptResults();
        return;
    }
    
    const question = concept.questions[currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
        <div class="question-header">
            <div class="question-number">שאלה ${currentQuestionIndex + 1} מתוך 5</div>
            <div class="difficulty-badge difficulty-${question.difficulty}">
                ${question.difficultyName} (${question.difficulty} נקודות)
            </div>
        </div>
        <div class="timer-container">
            <div class="timer-bar">
                <div class="timer-fill" id="timerFill"></div>
            </div>
            <div class="timer-text" id="timerText">⏱️ דקה</div>
        </div>
        ${question.situation ? `<div class="situation-box">
            <div class="situation-icon">💡</div>
            <div class="situation-text">${question.situation}</div>
        </div>` : ''}
        <div class="question-text">${question.question}</div>
        <div class="answers">
            ${question.answers.map((answer, index) => `
                <div class="answer-option" onclick="selectAnswer(${index})">
                    <div class="answer-letter">${String.fromCharCode(65 + index)}</div>
                    <div class="answer-text">${answer}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    updateProgress();
    startTimer();
}

function startTimer() {
    timeLeft = 60; // דקה
    warningPlayed = false;
    
    const timerFill = document.getElementById('timerFill');
    const timerText = document.getElementById('timerText');
    
    if (timer) clearInterval(timer);
    
    timer = setInterval(() => {
        timeLeft--;
        
        const percentage = (timeLeft / 60) * 100;
        timerFill.style.width = percentage + '%';
        timerText.textContent = `⏱️ ${timeLeft} שניות`;
        
        if (timeLeft <= 10) {
            timerFill.style.background = 'linear-gradient(90deg, #dc3545, #ff6b6b)';
            timerText.style.color = '#dc3545';
            
            if (!warningPlayed) {
                SoundSystem.warning();
                warningPlayed = true;
            }
        } else if (timeLeft <= 30) {
            timerFill.style.background = 'linear-gradient(90deg, #ff9800, #ffb74d)';
            timerText.style.color = '#ff9800';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            SoundSystem.timeUp();
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    const conceptName = selectedConcepts[currentConceptIndex];
    const concept = window.conceptsData[conceptName];
    const question = concept.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.answer-option');
    
    options.forEach(opt => opt.style.pointerEvents = 'none');
    options[question.correct].classList.add('correct');
    options[question.correct].classList.add('timeout');
    
    incorrectAnswers++;
    studentResults.concepts[conceptName].incorrect++;
    
    studentResults.concepts[conceptName].questions.push({
        question: question.question,
        userAnswer: "לא נענה בזמן",
        correctAnswer: question.answers[question.correct],
        isCorrect: false,
        points: 0,
        difficulty: question.difficultyName,
        timedOut: true
    });
    
    updateScore();
    
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 3000);
}

function selectAnswer(answerIndex) {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    const conceptName = selectedConcepts[currentConceptIndex];
    const concept = window.conceptsData[conceptName];
    const question = concept.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.answer-option');
    
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    const isCorrect = answerIndex === question.correct;
    const points = question.difficulty;
    
    if (isCorrect) {
        SoundSystem.correct();
        score += points;
        correctAnswers++;
        studentResults.concepts[conceptName].score += points;
        studentResults.concepts[conceptName].correct++;
        options[answerIndex].classList.add('correct');
    } else {
        SoundSystem.incorrect();
        incorrectAnswers++;
        studentResults.concepts[conceptName].incorrect++;
        options[answerIndex].classList.add('incorrect');
        options[question.correct].classList.add('correct');
    }
    
    studentResults.concepts[conceptName].questions.push({
        question: question.question,
        userAnswer: question.answers[answerIndex],
        correctAnswer: question.answers[question.correct],
        isCorrect: isCorrect,
        points: isCorrect ? points : 0,
        difficulty: question.difficultyName,
        timeLeft: timeLeft
    });
    
    updateScore();
    
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000);
}

function updateScore() {
    document.getElementById('currentScore').textContent = score;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('incorrectCount').textContent = incorrectAnswers;
}

function updateProgress() {
    const totalQuestions = selectedConcepts.length * 5;
    const answeredQuestions = correctAnswers + incorrectAnswers;
    const progress = Math.round((answeredQuestions / totalQuestions) * 100);
    
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progress + '%';
    progressBar.textContent = progress + '%';
}

function showConceptResults() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    document.getElementById('questionContainer').classList.add('hidden');
    document.getElementById('navigationButtons').classList.remove('hidden');
}

function restartConcept() {
    SoundSystem.click();
    
    currentQuestionIndex = 0;
    const conceptName = selectedConcepts[currentConceptIndex];
    studentResults.concepts[conceptName] = {
        questions: [],
        score: 0,
        correct: 0,
        incorrect: 0
    };
    document.getElementById('navigationButtons').classList.add('hidden');
    loadQuestion();
}

function nextConcept() {
    SoundSystem.click();
    
    currentConceptIndex++;
    document.getElementById('navigationButtons').classList.add('hidden');
    loadConcept();
}

function finishGame() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    SoundSystem.success();
    saveToFirebase();
    
    alert(`כל הכבוד ${studentName}!\n\nסיימת את המשחק!\n\nניקוד סופי: ${score}\nתשובות נכונות: ${correctAnswers}\nתשובות שגויות: ${incorrectAnswers}`);
    
    showHomePage();
}

function saveToFirebase() {
    try {
        if (window.firebaseDB) {
            const resultsRef = window.firebaseRef(window.firebaseDB, 'game-results/digital-culture');
            const newResultRef = window.firebasePush(resultsRef);
            window.firebaseSet(newResultRef, {
                ...studentResults,
                totalScore: score,
                totalCorrect: correctAnswers,
                totalIncorrect: incorrectAnswers,
                timestamp: Date.now()
            });
            console.log('✅ Results saved to Firebase');
        }
    } catch (error) {
        console.error('❌ Firebase error:', error);
    }
}

function showHomePage() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    document.getElementById('gamePage').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
    
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    updateScore();
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressBar').textContent = '0%';
}
