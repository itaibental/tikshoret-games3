// simple-permissions.js - ניהול הרשאות פשוט - רק שם ות"ז

const SimplePermissions = {
    // טעינת תלמידים (מקומי + ענן)
    async loadStudents() {
        if (window.firebaseDB) {
            try {
                const ref = window.firebaseRef(window.firebaseDB, 'students-permissions');
                const snapshot = await window.firebaseGet(ref);
                
                if (snapshot.exists()) {
                    const cloudData = snapshot.val();
                    localStorage.setItem('allowedStudents', JSON.stringify(cloudData));
                    console.log('✅ נטענו תלמידים מהענן:', Object.keys(cloudData).length);
                    return cloudData;
                }
            } catch (error) {
                console.warn('⚠️ לא ניתן לטעון מהענן');
            }
        }
        
        const localData = localStorage.getItem('allowedStudents');
        return localData ? JSON.parse(localData) : {};
    },
    
    // שמירת תלמידים (מקומי + ענן)
    async saveStudents(students) {
        localStorage.setItem('allowedStudents', JSON.stringify(students));
        
        if (window.firebaseDB) {
            try {
                const ref = window.firebaseRef(window.firebaseDB, 'students-permissions');
                await window.firebaseSet(ref, students);
                console.log('✅ נשמר בענן');
                return true;
            } catch (error) {
                console.error('❌ שגיאה בשמירה בענן:', error);
            }
        }
        return true;
    },
    
    // הוספת תלמיד - רק שם ות"ז
    async addStudent(studentId, studentName) {
        if (!/^\d{9}$/.test(studentId)) {
            return { ok: false, msg: 'ת"ז חייבת להיות 9 ספרות' };
        }
        
        if (!studentName || studentName.trim().length < 2) {
            return { ok: false, msg: 'הזן שם תקין' };
        }
        
        const students = await this.loadStudents();
        
        if (students[studentId]) {
            return { ok: false, msg: 'תלמיד עם ת"ז זו כבר קיים' };
        }
        
        students[studentId] = {
            id: studentId,
            name: studentName.trim(),
            created: new Date().toISOString(),
            source: 'manual'
        };
        
        await this.saveStudents(students);
        return { ok: true, student: students[studentId] };
    },
    
    // ייבוא מגוגל שיטס - 2 עמודות בלבד
    async importFromSheets(sheetsUrl) {
        try {
            const match = sheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
            if (!match) {
                return { ok: false, msg: 'קישור לא תקין' };
            }
            
            const sheetId = match[1];
            const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
            
            const response = await fetch(csvUrl);
            if (!response.ok) {
                return { ok: false, msg: 'לא ניתן לגשת. ודא שהגיליון ציבורי' };
            }
            
            const csvText = await response.text();
            const lines = csvText.trim().split('\n');
            const startIndex = lines[0].includes('ת') ? 1 : 0;
            
            const students = await this.loadStudents();
            let added = 0;
            
            for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
                if (parts.length < 2) continue;
                
                const studentId = parts[0].replace(/\D/g, '');
                const studentName = parts[1];
                
                if (/^\d{9}$/.test(studentId) && studentName) {
                    if (!students[studentId]) {
                        students[studentId] = {
                            id: studentId,
                            name: studentName,
                            created: new Date().toISOString(),
                            source: 'sheets'
                        };
                        added++;
                    }
                }
            }
            
            await this.saveStudents(students);
            return { ok: true, msg: `נוספו ${added} תלמידים`, added };
            
        } catch (error) {
            return { ok: false, msg: 'שגיאה: ' + error.message };
        }
    },
    
    // אימות תלמיד - ת"ז משמשת כסיסמה
    async authenticate(studentId) {
        if (!/^\d{9}$/.test(studentId)) {
            return { ok: false, msg: 'ת"ז חייבת להיות 9 ספרות' };
        }
        
        const students = await this.loadStudents();
        
        if (students[studentId]) {
            return { 
                ok: true, 
                student: {
                    id: students[studentId].id,
                    name: students[studentId].name
                }
            };
        }
        
        return { ok: false, msg: 'תעודת זהות זו אינה מורשית במערכת' };
    },
    
    // בדיקה אם תלמיד קיים
    async isAllowed(studentId) {
        const students = await this.loadStudents();
        return !!students[studentId];
    },
    
    // קבלת שם תלמיד
    async getStudentName(studentId) {
        const students = await this.loadStudents();
        return students[studentId]?.name || null;
    },
    
    // קבלת כל התלמידים כמערך
    async getStudentsArray() {
        const students = await this.loadStudents();
        return Object.values(students);
    },
    
    // הסרת תלמיד
    async removeStudent(studentId) {
        const students = await this.loadStudents();
        delete students[studentId];
        await this.saveStudents(students);
        return { ok: true };
    },
    
    // מחיקת נתונים
    async deleteStudentData(studentId) {
        try {
            if (window.firebaseDB) {
                const resultsRef = window.firebaseRef(window.firebaseDB, 'game-results/digital-culture');
                const snapshot = await window.firebaseGet(resultsRef);
                
                if (snapshot.exists()) {
                    const allResults = snapshot.val();
                    let deleted = 0;
                    
                    for (const key in allResults) {
                        if (allResults[key].studentId === studentId) {
                            const resultRef = window.firebaseRef(
                                window.firebaseDB,
                                'game-results/digital-culture/' + key
                            );
                            await window.firebaseRemove(resultRef);
                            deleted++;
                        }
                    }
                    
                    return { ok: true, msg: `נמחקו ${deleted} רשומות` };
                }
            }
            return { ok: true, msg: 'אין נתונים למחוק' };
        } catch (error) {
            return { ok: false, msg: 'שגיאה במחיקה' };
        }
    },
    
    // סנכרון מהענן
    async syncFromCloud() {
        if (window.firebaseDB) {
            try {
                const ref = window.firebaseRef(window.firebaseDB, 'students-permissions');
                const snapshot = await window.firebaseGet(ref);
                
                if (snapshot.exists()) {
                    const cloudData = snapshot.val();
                    localStorage.setItem('allowedStudents', JSON.stringify(cloudData));
                    return { ok: true, msg: 'סונכרן מהענן', count: Object.keys(cloudData).length };
                }
                return { ok: false, msg: 'אין נתונים בענן' };
            } catch (error) {
                return { ok: false, msg: 'שגיאה בסנכרון' };
            }
        }
        return { ok: false, msg: 'Firebase לא זמין' };
    }
};

window.SimplePermissions = SimplePermissions;
console.log('✅ מערכת הרשאות פשוטה מוכנה');
