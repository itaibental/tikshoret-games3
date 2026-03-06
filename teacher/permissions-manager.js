// permissions-manager.js - ניהול הרשאות תלמידים עם שמירה בענן

const PermissionsManager = {
    // טעינת תלמידים מורשים (מקומי + ענן)
    async loadStudents() {
        // ניסיון טעינה מהענן
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
                console.warn('⚠️ לא ניתן לטעון מהענן, משתמש בנתונים מקומיים');
            }
        }
        
        // טעינה מקומית
        const localData = localStorage.getItem('allowedStudents');
        return localData ? JSON.parse(localData) : {};
    },
    
    // שמירת תלמידים (מקומי + ענן)
    async saveStudents(students) {
        // שמירה מקומית
        localStorage.setItem('allowedStudents', JSON.stringify(students));
        
        // שמירה בענן
        if (window.firebaseDB) {
            try {
                const ref = window.firebaseRef(window.firebaseDB, 'students-permissions');
                await window.firebaseSet(ref, students);
                console.log('✅ נשמר בענן:', Object.keys(students).length, 'תלמידים');
                return true;
            } catch (error) {
                console.error('❌ שגיאה בשמירה בענן:', error);
                return false;
            }
        }
        return true;
    },
    
    // הוספת תלמיד עם שם משתמש וסיסמה
    async addStudent(studentId, studentName, username, password) {
        if (!/^\d{9}$/.test(studentId)) {
            return { ok: false, msg: 'ת"ז חייבת להיות 9 ספרות' };
        }
        
        if (!studentName || studentName.trim().length < 2) {
            return { ok: false, msg: 'הזן שם תקין' };
        }
        
        if (!username || username.trim().length < 3) {
            return { ok: false, msg: 'שם משתמש חייב להיות 3+ תווים' };
        }
        
        if (!password || password.length < 4) {
            return { ok: false, msg: 'סיסמה חייבת להיות 4+ תווים' };
        }
        
        const students = await this.loadStudents();
        
        // בדיקה אם ת"ז כבר קיים
        if (students[studentId]) {
            return { ok: false, msg: 'תלמיד עם ת"ז זו כבר קיים' };
        }
        
        // בדיקה אם שם משתמש כבר קיים
        for (const id in students) {
            if (students[id].username === username.trim()) {
                return { ok: false, msg: 'שם משתמש זה כבר תפוס' };
            }
        }
        
        // יצירת תלמיד חדש
        students[studentId] = {
            id: studentId,
            name: studentName.trim(),
            username: username.trim(),
            password: password,
            created: new Date().toISOString(),
            source: 'manual'
        };
        
        await this.saveStudents(students);
        return { ok: true, student: students[studentId] };
    },
    
    // ייבוא מגוגל שיטס (עם שם משתמש + סיסמה)
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
            let errors = [];
            
            for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
                if (parts.length < 4) {
                    errors.push(`שורה ${i + 1}: חסרים נתונים`);
                    continue;
                }
                
                const studentId = parts[0].replace(/\D/g, '');
                const studentName = parts[1];
                const username = parts[2];
                const password = parts[3];
                
                if (/^\d{9}$/.test(studentId) && studentName && username && password) {
                    if (!students[studentId]) {
                        students[studentId] = {
                            id: studentId,
                            name: studentName,
                            username: username,
                            password: password,
                            created: new Date().toISOString(),
                            source: 'sheets'
                        };
                        added++;
                    }
                }
            }
            
            await this.saveStudents(students);
            
            let msg = `נוספו ${added} תלמידים`;
            if (errors.length > 0) {
                msg += `\n⚠️ ${errors.length} שגיאות`;
            }
            
            return { ok: true, msg, added, errors };
            
        } catch (error) {
            return { ok: false, msg: 'שגיאה: ' + error.message };
        }
    },
    
    // אימות תלמיד (שם משתמש + סיסמה)
    async authenticate(username, password) {
        const students = await this.loadStudents();
        
        for (const id in students) {
            const student = students[id];
            if (student.username === username && student.password === password) {
                return { 
                    ok: true, 
                    student: {
                        id: student.id,
                        name: student.name,
                        username: student.username
                    }
                };
            }
        }
        
        return { ok: false, msg: 'שם משתמש או סיסמה שגויים' };
    },
    
    // בדיקה אם תלמיד קיים לפי ת"ז
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
    
    // מחיקת נתונים של תלמיד
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
    
    // סנכרון ידני מהענן
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

window.PermissionsManager = PermissionsManager;
console.log('✅ מערכת הרשאות עם ענן מוכנה');
