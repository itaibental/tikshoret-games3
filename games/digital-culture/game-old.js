// game.js - לוגיקת המשחק

// משתנים גלובליים
let selectedConcepts = [];
let currentConceptIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let studentName = '';
let studentResults = {};

// אתחול בטעינת הדף
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    createAccordion();
    document.getElementById('studentName').addEventListener('input', updateStartButton);
}

// יצירת אקורדיון
function createAccordion() {
    const accordion = document.getElementById('conceptsAccordion');
    const concepts = Object.keys(window.conceptsData);
    
    accordion.innerHTML = concepts.map((name, index) => `
        <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(${index})">
                <input type="checkbox" id="concept${index}" value="${name}" 
                       onclick="event.stopPropagation(); updateStartButton();">
                <span class="accordion-title">${name}</span>
                <span class="accordion-icon" id="icon${index}">▼</span>
            </div>
            <div class="accordion-content" id="content${index}">
                <div class="accordion-body">
                    ${window.conceptsData[name].shortDesc}
                </div>
            </div>
        </div>
    `).join('');
}

// פתיחה/סגירה של אקורדיון
function toggleAccordion(index) {
    window.soundManager.playClick();
    const content = document.getElementById(`content${index}`);
    const icon = document.getElementById(`icon${index}`);
    
    content.classList.toggle('open');
    icon.classList.toggle('open');
}

// בחירת כל המושגים
function selectAllConcepts() {
    window.soundManager.playClick();
    const checkboxes = document.querySelectorAll('.accordion-header input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
    updateStartButton();
}

// ביטול כל המושגים
function deselectAllConcepts() {
    window.soundManager.playClick();
    const checkboxes = document.querySelectorAll('.accordion-header input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateStartButton();
}

// עדכון כפתור התחלה
function updateStartButton() {
    const name = document.getElementById('studentName').value.trim();
    const checkedBoxes = document.querySelectorAll('.accordion-header input[type="checkbox"]:checked');
    const startBtn = document.getElementById('startBtn');
    
    startBtn.disabled = !(name && checkedBoxes.length > 0);
}

// התחלת משחק
function startGame() {
    window.soundManager.playStart();
    
    studentName = document.getElementById('studentName').value.trim();
    const checkedBoxes = document.querySelectorAll('.accordion-header input[type="checkbox"]:checked');
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
        gameId: 'digital-culture' // מזהה המשחק
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
        <div class="question-text">${question.question}</div>
        <div class="answers">
            ${question.answers.map((answer, index) => `
                <div class="answer-option" onclick="selectAnswer(${index})">
                    ${answer}
                </div>
            `).join('')}
        </div>
    `;
    
    updateProgress();
}

// בחירת תשובה
function selectAnswer(answerIndex) {
    const conceptName = selectedConcepts[currentConceptIndex];
    const concept = window.conceptsData[conceptName];
    const question = concept.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.answer-option');
    
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
    
    studentResults.concepts[conceptName].questions.push({
        question: question.question,
        userAnswer: question.answers[answerIndex],
        correctAnswer: question.answers[question.correct],
        isCorrect: isCorrect,
        points: isCorrect ? points : 0,
        difficulty: question.difficultyName
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
    document.getElementById('gamePage').classList.add('hidden');
    document.getElementById('adminPage').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
    
    document.getElementById('studentName').value = '';
    const checkboxes = document.querySelectorAll('.accordion-header input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateStartButton();
    
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    updateScore();
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressBar').textContent = '0%';
}
