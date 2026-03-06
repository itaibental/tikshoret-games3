// progress-manager.js - ניהול התקדמות נפרד לכל תלמיד

const ProgressManager = {
    // קבלת מפתח ייחודי לתלמיד
    getStudentKey(studentId) {
        return `student_progress_${studentId}`;
    },
    
    // שמירת התקדמות
    saveProgress(studentId, gameData) {
        const key = this.getStudentKey(studentId);
        const progress = {
            studentId: studentId,
            gameData: gameData,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(key, JSON.stringify(progress));
        
        // גם ב-Firebase
        if (window.firebaseDB) {
            try {
                const ref = window.firebaseRef(
                    window.firebaseDB, 
                    `student-progress/digital-culture/${studentId}`
                );
                window.firebaseSet(ref, progress);
            } catch (e) {
                console.warn('Firebase save failed:', e);
            }
        }
    },
    
    // טעינת התקדמות
    async loadProgress(studentId) {
        const key = this.getStudentKey(studentId);
        
        // נסה לטעון מ-Firebase
        if (window.firebaseDB) {
            try {
                const ref = window.firebaseRef(
                    window.firebaseDB, 
                    `student-progress/digital-culture/${studentId}`
                );
                const snapshot = await window.firebaseGet(ref);
                
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    localStorage.setItem(key, JSON.stringify(data));
                    return data.gameData;
                }
            } catch (e) {
                console.warn('Firebase load failed:', e);
            }
        }
        
        // טעינה מקומית
        const local = localStorage.getItem(key);
        if (local) {
            return JSON.parse(local).gameData;
        }
        
        return null;
    },
    
    // איפוס התקדמות
    async resetProgress(studentId) {
        const key = this.getStudentKey(studentId);
        localStorage.removeItem(key);
        
        // גם ב-Firebase
        if (window.firebaseDB) {
            try {
                const ref = window.firebaseRef(
                    window.firebaseDB, 
                    `student-progress/digital-culture/${studentId}`
                );
                await window.firebaseRemove(ref);
            } catch (e) {
                console.warn('Firebase reset failed:', e);
            }
        }
    },
    
    // מחיקת התקדמות ישנה (ניקוי)
    clearOldProgress() {
        // מחק את המפתחות הישנים שלא קשורים לתלמיד ספציפי
        const oldKeys = [
            'gameProgress_digital-culture',
            'completedConcepts',
            'conceptScores'
        ];
        
        oldKeys.forEach(key => localStorage.removeItem(key));
    }
};

window.ProgressManager = ProgressManager;

// ניקוי אוטומטי בטעינה
ProgressManager.clearOldProgress();
