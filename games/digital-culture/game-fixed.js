// game-fixed.js - משחק מתוקן עם כל 16 המושגים

// משתנים גלובליים
let selectedConcepts = [];
let currentConceptIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let studentName = '';
let studentId = '';
let timer = null;
let timeLeft = 60;
let warningPlayed = false;

// מערכת צלילים
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
    correct() { this.beep(600, 0.2, 0.3); setTimeout(() => this.beep(800, 0.2, 0.3), 100); },
    wrong() { this.beep(200, 0.3, 0.3); },
    warning() { this.beep(400, 0.1, 0.2); setTimeout(() => this.beep(400, 0.1, 0.2), 150); },
    success() { 
        this.beep(523, 0.15, 0.25);
        setTimeout(() => this.beep(659, 0.15, 0.25), 150);
        setTimeout(() => this.beep(784, 0.3, 0.25), 300);
    }
};

SoundSystem.init();

// אתחול המשחק
function initGame() {
    // בדיקת זיהוי תלמיד
    studentId = localStorage.getItem('studentId') || '';
    studentName = localStorage.getItem('studentName') || '';
    
    if (!studentId) {
        alert('לא זוהית במערכת. חזור לאזור תלמיד.');
        window.location.href = '../../student/index.html';
        return;
    }
    
    // איפוס התקדמות ישנה
    if (window.ProgressManager) {
        ProgressManager.clearOldProgress();
    }
    
    // טעינת רשימת מושגים
    loadConceptsList();
}

// טעינת רשימת מושגים לבחירה
function loadConceptsList() {
    const container = document.getElementById('conceptsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!window.conceptsData) {
        container.innerHTML = '<p style="color: red;">שגיאה: לא נטענו מושגים</p>';
        return;
    }
    
    Object.keys(window.conceptsData).forEach(conceptName => {
        const concept = window.conceptsData[conceptName];
        const item = document.createElement('div');
        item.className = 'concept-item';
        item.innerHTML = `
            <input type="checkbox" id="concept-${conceptName}" value="${conceptName}" onchange="updateStartButton()">
            <label for="concept-${conceptName}">
                <strong>${conceptName}</strong>
                <span class="concept-short-desc">${concept.shortDesc}</span>
            </label>
        `;
        container.appendChild(item);
    });
}

// עדכון כפתור התחלה
function updateStartButton() {
    const checkedBoxes = document.querySelectorAll('.concept-item input[type="checkbox"]:checked');
    const startBtn = document.getElementById('startBtn');
    startBtn.disabled = checkedBoxes.length === 0;
}

// בחירת כל המושגים
function selectAllConcepts() {
    document.querySelectorAll('.concept-item input[type="checkbox"]').forEach(cb => cb.checked = true);
    updateStartButton();
}

// ביטול בחירת כל המושגים
function deselectAllConcepts() {
    document.querySelectorAll('.concept-item input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateStartButton();
}

// התחלת משחק
function startGame() {
    SoundSystem.success();
    
    const checkedBoxes = document.querySelectorAll('.concept-item input[type="checkbox"]:checked');
    selectedConcepts = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (selectedConcepts.length === 0) {
        alert('בחר לפחות מושג אחד');
        return;
    }
    
    // איפוס משתנים
    currentConceptIndex = 0;
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    
    // הסתרת מסך בחירה
    document.getElementById('selectionScreen').style.display = 'none';
    
    // התחלת מושג ראשון
    startConcept();
}

// התחלת מושג
function startConcept() {
    const conceptName = selectedConcepts[currentConceptIndex];
    const concept = window.conceptsData[conceptName];
    
    if (!concept) {
        alert('שגיאה: מושג לא נמצא');
        return;
    }
    
    // הצגת הקדמה
    document.getElementById('conceptIntro').innerHTML = concept.intro;
    document.getElementById('introScreen').style.display = 'block';
}

// התחלת שאלות
function startQuestions() {
    SoundSystem.click();
    document.getElementById('introScreen').style.display = 'none';
    currentQuestionIndex = 0;
    showQuestion();
}

// הצגת שאלה
function showQuestion() {
    const conceptName = selectedConcepts[currentConceptIndex];
    const concept = window.conceptsData[conceptName];
    const question = concept.questions[currentQuestionIndex];
    
    // עדכון כותרת
    document.getElementById('currentConcept').textContent = conceptName;
    document.getElementById('questionNumber').textContent = `שאלה ${currentQuestionIndex + 1} מתוך ${concept.questions.length}`;
    
    // הצגת שאלה
    document.getElementById('situationText').textContent = question.situation;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('difficultyBadge').textContent = question.difficultyName;
    
    // הצגת תשובות
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(index, question.correct, question.difficulty);
        answersContainer.appendChild(btn);
    });
    
    // הצגת מסך שאלה
    document.getElementById('questionScreen').style.display = 'block';
    
    // התחלת טיימר
    startTimer();
}

// טיימר
function startTimer() {
    timeLeft = 60;
    warningPlayed = false;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 10 && !warningPlayed) {
            SoundSystem.warning();
            warningPlayed = true;
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(-1, 0, 1); // תשובה שגויה
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timer');
    timerEl.textContent = `${timeLeft}s`;
    
    if (timeLeft > 10) {
        timerEl.style.color = '#4CAF50';
    } else if (timeLeft > 5) {
        timerEl.style.color = '#FF9800';
    } else {
        timerEl.style.color = '#f44336';
    }
}

// בדיקת תשובה
function checkAnswer(selectedIndex, correctIndex, difficulty) {
    clearInterval(timer);
    
    const answersContainer = document.getElementById('answersContainer');
    const buttons = answersContainer.querySelectorAll('.answer-btn');
    
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex) {
            btn.classList.add('wrong');
        }
    });
    
    if (selectedIndex === correctIndex) {
        SoundSystem.correct();
        score += difficulty;
        correctAnswers++;
    } else {
        SoundSystem.wrong();
        incorrectAnswers++;
    }
    
    // עדכון ניקוד
    document.getElementById('scoreDisplay').textContent = score;
    
    setTimeout(() => {
        currentQuestionIndex++;
        const conceptName = selectedConcepts[currentConceptIndex];
        const concept = window.conceptsData[conceptName];
        
        if (currentQuestionIndex < concept.questions.length) {
            showQuestion();
        } else {
            finishConcept();
        }
    }, 2000);
}

// סיום מושג
function finishConcept() {
    document.getElementById('questionScreen').style.display = 'none';
    
    currentConceptIndex++;
    
    if (currentConceptIndex < selectedConcepts.length) {
        document.getElementById('summaryScreen').style.display = 'block';
        document.getElementById('summaryText').textContent = 
            `סיימת את המושג! ניקוד נוכחי: ${score}`;
    } else {
        finishGame();
    }
}

// מעבר למושג הבא
function nextConcept() {
    SoundSystem.click();
    document.getElementById('summaryScreen').style.display = 'none';
    startConcept();
}

// סיום משחק
async function finishGame() {
    document.getElementById('summaryScreen').style.display = 'none';
    
    // שמירת תוצאות
    const result = {
        studentId: studentId,
        studentName: studentName,
        totalScore: score,
        totalCorrect: correctAnswers,
        totalIncorrect: incorrectAnswers,
        concepts: selectedConcepts,
        timestamp: Date.now()
    };
    
    // שמירה ב-Firebase
    if (window.firebaseDB) {
        try {
            const ref = window.firebaseRef(window.firebaseDB, 'game-results/digital-culture');
            const newRef = window.firebasePush(ref);
            await window.firebaseSet(newRef, result);
        } catch (e) {
            console.warn('Firebase save failed:', e);
        }
    }
    
    // שמירת התקדמות
    if (window.ProgressManager) {
        await ProgressManager.saveProgress(studentId, {
            completedConcepts: selectedConcepts,
            lastScore: score,
            lastPlayed: Date.now()
        });
    }
    
    // הצגת תוצאות
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalCorrect').textContent = correctAnswers;
    document.getElementById('finalIncorrect').textContent = incorrectAnswers;
    document.getElementById('resultsScreen').style.display = 'block';
    
    SoundSystem.success();
}

// משחק חדש
function playAgain() {
    SoundSystem.click();
    document.getElementById('resultsScreen').style.display = 'none';
    document.getElementById('selectionScreen').style.display = 'block';
    
    // איפוס בחירות
    document.querySelectorAll('.concept-item input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateStartButton();
}

// חזרה לתפריט
function goBack() {
    SoundSystem.click();
    if (confirm('האם אתה בטוח? התקדמותך תישמר.')) {
        window.location.href = '../../student/index.html';
    }
}

// אתחול בטעינת עמוד
window.addEventListener('load', initGame);
