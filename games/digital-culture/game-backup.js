// game.js - לוגיקת המשחק עם טיימר ורשימה נפתחת

// משתנים גלובליים
let selectedConcepts = [];
let currentConceptIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let studentName = '';
let studentResults = {};
let timer = null;
let timeLeft = 30;
let warningPlayed = false;

// אתחול בטעינת הדף
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    createConceptsDropdown();
    document.getElementById('studentName').addEventListener('input', updateStartButton);
}

// יצירת רשימה נפתחת במקום אקורדיון
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

// פתיחה/סגירה של הרשימה הנפתחת
function toggleDropdown() {
    window.soundManager.playClick();
    const content = document.getElementById('dropdownContent');
    const icon = document.getElementById('dropdownIcon');
    
    content.classList.toggle('open');
    icon.classList.toggle('open');
}

// עדכון כותרת הרשימה
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

// בחירת כל המושגים
function selectAllConcepts() {
    window.soundManager.playClick();
    const checkboxes = document.querySelectorAll('.concept-item input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
    updateStartButton();
    updateDropdownTitle();
}

// ביטול כל המושגים
function deselectAllConcepts() {
    window.soundManager.playClick();
    const checkboxes = document.querySelectorAll('.concept-item input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateStartButton();
    updateDropdownTitle();
}

// עדכון כפתור התחלה
function updateStartButton() {
    const name = document.getElementById('studentName').value.trim();
    const checkedBoxes = document.querySelectorAll('.concept-item input[type="checkbox"]:checked');
    const startBtn = document.getElementById('startBtn');
    
    startBtn.disabled = !(name && checkedBoxes.length > 0);
}

// התחלת משחק
function startGame() {
    window.soundManager.playStart();
    
    studentName = document.getElementById('studentName').value.trim();
    const checkedBoxes = document.querySelectorAll('.concept-item input[type="checkbox"]:checked');
    selectedConcepts = Array.from(checkedBoxes).map(cb => cb.value);
    
    currentConceptIndex = 0;
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    studentResults = {
        name: studentName,
        date: new Date().toLocaleString('he-IL'),
        concepts: {},
        gameId: 'digital-culture'
    };
    
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('gamePage').classList.remove('hidden');
    
    loadConcept();
}

// טעינת מושג
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

// הצגת מודאל המושג
function showConceptModal(conceptName, concept) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'conceptModal';
    modal.innerHTML = `
        <div class="modal-content">
            ${concept.intro}
            <button class="btn" onclick="startConceptQuestions()">
                🎯 התחל משחק!
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// התחלת שאלות המושג
function startConceptQuestions() {
    window.soundManager.playStart();
    
    const modal = document.getElementById('conceptModal');
    if (modal) {
        modal.remove();
    }
    
    document.getElementById('questionContainer').classList.remove('hidden');
    loadQuestion();
}

// טעינת שאלה
function loadQuestion() {
    const conceptName = selectedConcepts[currentConceptIndex];
    const concept = window.conceptsData[conceptName];
    
    if (currentQuestionIndex >= 5) {
        showConceptResults();
        return;
    }
    
    const question = concept.questions[currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    container.classList.remove('hidden');
    
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
            <div class="timer-text" id="timerText">⏱️ 30 שניות</div>
        </div>
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

// הפעלת טיימר
function startTimer() {
    timeLeft = 30;
    warningPlayed = false;
    
    const timerFill = document.getElementById('timerFill');
    const timerText = document.getElementById('timerText');
    
    if (timer) clearInterval(timer);
    
    timer = setInterval(() => {
        timeLeft--;
        
        // עדכון תצוגה
        const percentage = (timeLeft / 30) * 100;
        timerFill.style.width = percentage + '%';
        timerText.textContent = `⏱️ ${timeLeft} שניות`;
        
        // שינוי צבע לפי זמן
        if (timeLeft <= 10) {
            timerFill.style.background = 'linear-gradient(90deg, #dc3545, #ff6b6b)';
            timerText.style.color = '#dc3545';
            
            // אזעקה 10 שניות לפני סוף
            if (!warningPlayed) {
                window.soundManager.playWarning();
                warningPlayed = true;
            }
        } else if (timeLeft <= 20) {
            timerFill.style.background = 'linear-gradient(90deg, #ff9800, #ffb74d)';
            timerText.style.color = '#ff9800';
        }
        
        // זמן נגמר
        if (timeLeft <= 0) {
            clearInterval(timer);
            window.soundManager.playTimeUp();
            handleTimeout();
        }
    }, 1000);
}

// טיפול בזמן שנגמר
function handleTimeout() {
    const conceptName = selectedConcepts[currentConceptIndex];
    const concept = window.conceptsData[conceptName];
    const question = concept.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.answer-option');
    
    // מניעת לחיצה
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    // סימון התשובה הנכונה
    options[question.correct].classList.add('correct');
    options[question.correct].classList.add('timeout');
    
    // רישום תשובה שגויה
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

// בחירת תשובה
function selectAnswer(answerIndex) {
    // עצירת טיימר
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    const conceptName = selectedConcepts[currentConceptIndex];
    const concept = window.conceptsData[conceptName];
    const question = concept.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.answer-option');
    
    // מניעת בחירה נוספת
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    const isCorrect = answerIndex === question.correct;
    const points = question.difficulty;
    
    if (isCorrect) {
        window.soundManager.playCorrect();
        score += points;
        correctAnswers++;
        studentResults.concepts[conceptName].score += points;
        studentResults.concepts[conceptName].correct++;
        options[answerIndex].classList.add('correct');
    } else {
        window.soundManager.playIncorrect();
        incorrectAnswers++;
        studentResults.concepts[conceptName].incorrect++;
        options[answerIndex].classList.add('incorrect');
        options[question.correct].classList.add('correct');
    }
    
    // שמירת תשובה
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

// עדכון ניקוד
function updateScore() {
    document.getElementById('currentScore').textContent = score;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('incorrectCount').textContent = incorrectAnswers;
}

// עדכון פס התקדמות
function updateProgress() {
    const totalQuestions = selectedConcepts.length * 5;
    const answeredQuestions = correctAnswers + incorrectAnswers;
    const progress = Math.round((answeredQuestions / totalQuestions) * 100);
    
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progress + '%';
    progressBar.textContent = progress + '%';
}

// הצגת תוצאות מושג
function showConceptResults() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    document.getElementById('questionContainer').classList.add('hidden');
    document.getElementById('navigationButtons').classList.remove('hidden');
}

// חזרה לתחילת פרק
function restartConcept() {
    window.soundManager.playClick();
    
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

// מעבר למושג הבא
function nextConcept() {
    window.soundManager.playClick();
    
    currentConceptIndex++;
    document.getElementById('navigationButtons').classList.add('hidden');
    loadConcept();
}

// סיום משחק
function finishGame() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    window.soundManager.playSuccess();
    
    saveToFirebase();
    
    alert(`כל הכבוד ${studentName}!\n\nסיימת את המשחק!\n\nניקוד סופי: ${score}\nתשובות נכונות: ${correctAnswers}\nתשובות שגויות: ${incorrectAnswers}`);
    
    showHomePage();
}

// שמירה ל-Firebase
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

// חזרה לדף הראשי
function showHomePage() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    document.getElementById('gamePage').classList.add('hidden');
    document.getElementById('adminPage').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
    
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    updateScore();
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressBar').textContent = '0%';
}
