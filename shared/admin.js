// admin.js - ממשק ניהול למורה

let adminPassword = '1234';

// התחברות למורה
function showAdminLogin() {
    window.soundManager.playClick();
    
    const password = prompt('הזן סיסמת מורה:');
    if (password === adminPassword) {
        showAdminPanel();
    } else if (password !== null) {
        alert('❌ סיסמה שגויה!');
    }
}

// הצגת פאנל ניהול
function showAdminPanel() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('gamePage').classList.add('hidden');
    document.getElementById('adminPage').classList.remove('hidden');
    
    switchTab('results');
    loadAdminResults();
}

// החלפת טאבים
function switchTab(tabName) {
    window.soundManager.playClick();
    
    // הסרת active מכל הטאבים
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    
    // הוספת active לטאב הנבחר
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.remove('hidden');
}

// טעינת תוצאות
function loadAdminResults() {
    const container = document.getElementById('adminResults');
    container.innerHTML = '<p style="color:#aaa;">טוען תוצאות...</p>';
    
    try {
        if (window.firebaseDB) {
            const resultsRef = window.firebaseRef(window.firebaseDB, 'game-results/digital-culture');
            window.firebaseOnValue(resultsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    displayAdminResults(data);
                } else {
                    container.innerHTML = '<p style="color:#aaa;">אין תוצאות עדיין.</p>';
                }
            });
        } else {
            container.innerHTML = '<p style="color:#f44;">Firebase לא מחובר. בדוק את ההגדרות.</p>';
        }
    } catch (error) {
        console.error('Error loading results:', error);
        container.innerHTML = '<p style="color:#f44;">שגיאה בטעינת התוצאות.</p>';
    }
}

// הצגת תוצאות
function displayAdminResults(data) {
    const container = document.getElementById('adminResults');
    const results = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
    
    let html = `<h3 style="color:#ff9900; margin-bottom:20px;">סה"כ ${results.length} משתתפים</h3>`;
    
    results.forEach((result, index) => {
        html += `
            <div class="student-result">
                <h4>${index + 1}. ${result.name} - ${result.date}</h4>
                <div class="result-details" style="color:#d0d0d0;">
                    <div><strong>ניקוד כולל:</strong> ${result.totalScore}</div>
                    <div><strong>תשובות נכונות:</strong> ${result.totalCorrect}</div>
                    <div><strong>תשובות שגויות:</strong> ${result.totalIncorrect}</div>
                    <div><strong>אחוז הצלחה:</strong> ${Math.round(result.totalCorrect / (result.totalCorrect + result.totalIncorrect) * 100)}%</div>
                </div>
                <details style="margin-top: 15px;">
                    <summary style="cursor: pointer; font-weight: bold; color:#ff6600;">פירוט לפי מושגים ▼</summary>
                    ${Object.entries(result.concepts).map(([concept, data]) => `
                        <div style="margin: 10px 0; padding: 10px; background: rgba(40,40,40,0.6); border-radius: 8px;">
                            <strong style="color:#ff9900;">${concept}</strong><br>
                            ניקוד: ${data.score} | נכונות: ${data.correct} | שגויות: ${data.incorrect}
                        </div>
                    `).join('')}
                </details>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// עדכון סיסמה
function updatePassword() {
    window.soundManager.playClick();
    
    const newPassword = document.getElementById('adminPassword').value;
    if (newPassword && newPassword.length >= 4) {
        adminPassword = newPassword;
        alert('✅ הסיסמה עודכנה בהצלחה!');
    } else {
        alert('❌ הסיסמה חייבת להיות לפחות 4 תווים');
    }
}
