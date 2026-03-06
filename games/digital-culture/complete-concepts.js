// complete-concepts.js - כל 16 המושגים המלאים

window.conceptsData = {
    "תקשורת מסורתית": {
        shortDesc: "אמצעי תקשורת לפני העידן הדיגיטאלי",
        intro: `<h3>תקשורת מסורתית</h3>
            <p><strong>הגדרה:</strong> טלוויזיה, רדיו, עיתונות מודפסת.</p>`,
        questions: [
            { situation: "בתחנת טלוויזיה", question: "מהו הכינוי המטאפורי לתקשורת המסורתית?", answers: ["מדורת השבט", "החלון לעולם", "מלכת המדיה", "המסך הקסום"], correct: 0, difficulty: 1, difficultyName: "קל" },
            { situation: "פרויקט על תקשורת", question: "איזה אמצעי אינו תקשורת מסורתית?", answers: ["עיתון מודפס", "רדיו", "אינסטגרם", "טלוויזיה"], correct: 2, difficulty: 1, difficultyName: "קל" },
            { situation: "בעל עיתון", question: "מדוע עלות הפקת המידע גבוהה?", answers: ["ציוד יקר והפצה פיזית", "מעט צרכנים", "מיסים גבוהים", "מחירי נייר"], correct: 0, difficulty: 2, difficultyName: "סביר" },
            { situation: "זמן משבר", question: "תפקיד תקשורת מסורתית במשבר?", answers: ["מפצלת", "מאחדת ומלכדת", "גורמת פאניקה", "לא רלוונטית"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "חוקר תקשורת", question: "ההבדל במודל התקשורת?", answers: ["אין הבדל", "מסורתית חד-כיוונית, דיגיטלית דו-כיוונית", "שניהן דו-כיווניות", "שניהן חד-כיווניות"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },
    
    "תקשורת דיגיטלית": {
        shortDesc: "תקשורת על רשת האינטרנט",
        intro: `<h3>תקשורת דיגיטלית</h3><p><strong>הגדרה:</strong> מידע דיגיטלי ברשת.</p>`,
        questions: [
            { situation: "מבין מידע דיגיטלי", question: "המאפיין של מידע דיגיטלי?", answers: ["נדפס", "קובץ דיגיטלי (0 ו-1)", "יקר", "איטי"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "דוגמה דיגיטלית", question: "דוגמה לתקשורת דיגיטלית?", answers: ["עיתון", "רדיו", "אתר YNET", "ספר"], correct: 2, difficulty: 1, difficultyName: "קל" },
            { situation: "תפקיד הצרכן", question: "שינוי תפקיד הנמען?", answers: ["פסיבי", "אקטיבי - מגיב ויוצר", "נעלם", "אין שינוי"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "השפעה חברתית", question: "השפעה על פיצול?", answers: ["מאחדת", "כל קבוצה צורכת שונה - מעמיק פיצול", "מונעת פיצול", "אין השפעה"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "דמוקרטיה", question: "השפעה על דמוקרטיה?", answers: ["חיובית בלבד", "כפולה - נגישות וגם פייק ניוז", "שלילית בלבד", "אין קשר"], correct: 1, difficulty: 5, difficultyName: "למקצוענים" }
        ]
    },

    "רשתות חברתיות": {
        shortDesc: "תוכן מיוצר על ידי משתמשים",
        intro: `<h3>רשתות חברתיות</h3><p><strong>הגדרה:</strong> פייסבוק, אינסטגרם, טיקטוק.</p>`,
        questions: [
            { situation: "עיתון מול פייסבוק", question: "מאפיין מרכזי?", answers: ["ארגונים בלבד", "משתמשים יוצרים תוכן", "עיתונאים בלבד", "ממשלה"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "מושג היברידיות", question: "משמעות היברידיות?", answers: ["צבעים", "קהל גם נמען וגם מוען", "שפות", "טכנולוגיות"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "ארגון מחאה", question: "יתרון למעורבות?", answers: ["גיוס מהיר", "מונעת מעורבות", "יקר", "לא רלוונטי"], correct: 0, difficulty: 2, difficultyName: "סביר" },
            { situation: "תכנים מסוכנים", question: "סכנת היעדר פיקוח?", answers: ["אין סכנה", "התפשטות פייק ניוז והסתה", "אידיאלי", "מחירי פרסום"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "טוב או רע?", question: "תשובה מורכבת?", answers: ["טובות בלבד", "גם טוב וגם רע", "רעות בלבד", "אדישות"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },

    "בינה מלאכותית": {
        shortDesc: "מחשבים המחקים אינטליגנציה",
        intro: `<h3>בינה מלאכותית</h3><p><strong>הגדרה:</strong> ChatGPT, זיהוי פנים, המלצות.</p>`,
        questions: [
            { situation: "הסבר לסבתא", question: "מהי AI?", answers: ["רובוט פיזי", "מערכת מחשב עם אינטליגנציה", "משחק", "תוכנה פשוטה"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "דוגמה", question: "דוגמה ל-AI?", answers: ["מחשבון", "ChatGPT", "מקלדת", "מסך"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "למידה", question: "כיצד AI לומדת?", answers: ["לא לומדת", "אלגוריתמים מנתחים ומשתפרים", "מורה אנושי", "נולדה עם ידע"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "ניתוח מידע", question: "יתרון מרכזי?", answers: ["אין יתרון", "מהירות בניתוח עצום", "יצירתיות", "רגישות רגשית"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "החלפת עיתונאים", question: "תחליף עיתונאים?", answers: ["כן לגמרי", "חלקית - טכני כן, חקירתי לא", "לא בכלל", "במאות שנים"], correct: 1, difficulty: 5, difficultyName: "למקצוענים" }
        ]
    },

    "אלגוריתם": {
        shortDesc: "נוסחה המחליטה מה נראה",
        intro: `<h3>אלגוריתם</h3><p><strong>הגדרה:</strong> הקוד שמחליט מה תראה ברשתות.</p>`,
        questions: [
            { situation: "פיד אינסטגרם", question: "מי מחליט מה תראה?", answers: ["אתה בוחר", "אלגוריתם מחליט", "חברים", "מקרי"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "המלצות יוטיוב", question: "על מה מבוסס?", answers: ["מקרי", "התנהגות העבר שלך", "פופולריות בלבד", "הגרלה"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "בועת מידע", question: "מהי בועת סינון?", answers: ["ראיה מגוונת", "רואה רק תוכן דומה", "ראיה אקראית", "ראיה מלאה"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "פייק ניוז", question: "איך אלגוריתם מגביר פייק?", answers: ["בודק עובדות", "מעדיף תוכן ויראלי", "מונע שקרים", "אדיש"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "שליטה", question: "מי שולט בחיינו?", answers: ["אנחנו", "אלגוריתמים מכוונים התנהגות", "ממשלה", "אקראי"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },

    "פייק ניוז": {
        shortDesc: "חדשות מזויפות המתפרסמות כאמת",
        intro: `<h3>פייק ניוז</h3><p><strong>הגדרה:</strong> מידע שקרי שנראה אמיתי.</p>`,
        questions: [
            { situation: "כותרת מזעזעת", question: "מהו פייק ניוז?", answers: ["חדשות אמת", "מידע כוזב שנראה אמיתי", "סרט תיעודי", "פרסומת"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "מאמר מפוברק", question: "למה מפיצים פייק ניוז?", answers: ["בידור", "פוליטיקה, כסף, השפעה", "טעות", "מקרי"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "בדיקת מקור", question: "איך מזהים?", answers: ["מאמין לכל", "בודק מקור ועובדות", "מקור אחד מספיק", "לפי הרגש"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "התפשטות", question: "למה מתפשט מהר?", answers: ["אנשים שוקלים", "אנשים משתפים בלי בדיקה", "איטי", "נעצר מהר"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "דמוקרטיה", question: "השפעה על דמוקרטיה?", answers: ["מחזקת", "מערערת אמון ומטעה", "ניטרלית", "מייצבת"], correct: 1, difficulty: 5, difficultyName: "למקצוענים" }
        ]
    },

    "דיפ פייק": {
        shortDesc: "וידאו או אודיו מזויף באמצעות AI",
        intro: `<h3>דיפ פייק</h3><p><strong>הגדרה:</strong> AI יוצר וידאו מזויף מציאותי.</p>`,
        questions: [
            { situation: "וידאו מפוברק", question: "מהו דיפ פייק?", answers: ["סרטון אמיתי", "וידאו מזויף ב-AI", "תמונה", "טקסט"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "פוליטיקאי בוידאו", question: "טכנולוגיה?", answers: ["צילום רגיל", "AI משכפל קול ופנים", "עריכה פשוטה", "אנימציה"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "זיהוי", question: "איך מזהים?", answers: ["קל תמיד", "קשה - צריך כלים מתקדמים", "בעין בלתי מזוינת", "בלתי אפשרי"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "סכנה", question: "הסכנה?", answers: ["בידור", "מניפולציה ותקיפת מוניטין", "לימוד", "אמנות"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "עתיד", question: "איך נגן?", answers: ["בעין", "שילוב בדיקה טכנית וחינוך", "איגנור", "תאמין לכל"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },

    "בוטים": {
        shortDesc: "תוכנות אוטומטיות ברשתות",
        intro: `<h3>בוטים</h3><p><strong>הגדרה:</strong> תוכנות פועלות אוטומטית ברשתות.</p>`,
        questions: [
            { situation: "חשבון חשוד", question: "מהו בוט?", answers: ["אדם אמיתי", "תוכנה אוטומטית", "רובוט פיזי", "עורך"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "תגובות זהות", question: "איך מזהים?", answers: ["אי אפשר", "פעילות חוזרת ומהירה", "לפי תמונה", "שם משתמש"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "מניפולציה", question: "שימוש זדוני?", answers: ["בידור", "הפצת תעמולה והטעיה", "שירות לקוחות", "חינוך"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "בחירות", question: "השפעה?", answers: ["אין", "השפעה על דעה באמצעות פוסטים המוניים", "מונעים השפעה", "ניטרליים"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "חיובי", question: "שימוש חיובי?", answers: ["אין", "שירות לקוחות ומידע", "מזיק תמיד", "אסור"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },

    "טשטוש גבולות": {
        shortDesc: "היעלמות הגבול בין פרטי לציבורי",
        intro: `<h3>טשטוש גבולות</h3><p><strong>הגדרה:</strong> הפרטי הופך ציבורי ברשתות.</p>`,
        questions: [
            { situation: "פוסט אישי", question: "מה קורה?", answers: ["נשאר פרטי", "הפרטי הופך ציבורי", "נמחק", "מוגן"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "שיתוף מיקום", question: "סכנה?", answers: ["בטוח", "חשיפת מידע אישי", "מומלץ", "ניטרלי"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "עבודה ורשתות", question: "השפעה על קריירה?", answers: ["אין", "פוסטים משפיעים על תעסוקה", "מסייעת תמיד", "לא רלוונטי"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "זהות דיגיטלית", question: "מהו הסיכון?", answers: ["אין סיכון", "קושי לשלוט במידע עליך", "שליטה מלאה", "מוגן תמיד"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "התנהגות", question: "איך להתנהל?", answers: ["שתף הכל", "מודעות ושיקול דעת", "אל תשתף כלום", "אקראי"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },

    "ילידים ומהגרים דיגיטליים": {
        shortDesc: "הבדל בין דורות ביחס לטכנולוגיה",
        intro: `<h3>ילידים ומהגרים דיגיטליים</h3><p><strong>הגדרה:</strong> ילידים גדלו עם טכנולוגיה, מהגרים למדו אותה.</p>`,
        questions: [
            { situation: "דור Z מול הורים", question: "ההבדל?", answers: ["אין", "ילידים גדלו עם טכנולוגיה, מהגרים אימצו", "גיל בלבד", "מקום מגורים"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "שימוש בסמארטפון", question: "מי ילידים?", answers: ["כולם", "מי שגדל עם אינטרנט וסלולר", "זקנים", "אמריקאים"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "למידה", question: "איך ילידים לומדים?", answers: ["מספרים", "טבעי ואינטואיטיבי", "קורסים בלבד", "לא לומדים"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "פער דיגיטלי", question: "השלכות?", answers: ["אין פער", "קושי תקשורת בין דורות", "מתגבר בקלות", "לא משנה"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "שוויון", question: "כיצד לגשר?", answers: ["אי אפשר", "חינוך וסבלנות דו-כיווני", "מהגרים יסתגלו לבד", "ילידים ילמדו לבד"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },

    "חיברות": {
        shortDesc: "תרבות של שיתוף ויצירה משותפת",
        intro: `<h3>חיברות</h3><p><strong>הגדרה:</strong> ויקיפדיה, GitHub, קוד פתוח.</p>`,
        questions: [
            { situation: "ויקיפדיה", question: "מהי חיברות?", answers: ["שליטה מרכזית", "שיתוף ויצירה קולקטיבית", "תחרות", "בעלות יחיד"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "קוד פתוח", question: "דוגמה?", answers: ["מיקרוסופט", "לינוקס - קוד פתוח", "אפל", "חברה סגורה"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "יתרון", question: "יתרון מרכזי?", answers: ["רווח כספי", "חדשנות ונגישות", "סודיות", "בלעדיות"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "איכות", question: "איך נשמרת איכות?", answers: ["אין", "קהילה מפקחת ומתקנת", "מנכ״ל", "אלגוריתם"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "עתיד", question: "האם תחליף חברות?", answers: ["כן לגמרי", "משלימה - לא מחליפה", "לא בכלל", "רק במדינות עניות"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },

    "דטרמיניזם טכנולוגי": {
        shortDesc: "האמונה שטכנולוגיה קובעת את החברה",
        intro: `<h3>דטרמיניזם טכנולוגי</h3><p><strong>הגדרה:</strong> טכנולוגיה מעצבת חברה או חברה בוחרת?</p>`,
        questions: [
            { situation: "השפעת סמארטפון", question: "מהו דטרמיניזם?", answers: ["חברה קובעת", "טכנולוגיה קובעת התפתחות", "אין קשר", "אקראי"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "רשתות חברתיות", question: "דוגמה?", answers: ["אנחנו בוחרים", "הטלפון שינה תקשורת ויחסים", "אין שינוי", "זמני"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "ביקורת", question: "מה הבעיה בגישה?", answers: ["נכונה תמיד", "מתעלמת מבחירה אנושית", "מדויקת", "אין בעיה"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "חברה מול טכנולוגיה", question: "מי באמת קובע?", answers: ["טכנולוגיה בלבד", "אינטראקציה - חברה וטכנולוגיה יחד", "חברה בלבד", "אקראי"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "עתיד", question: "תפקידנו?", answers: ["להיכנע", "לעצב באופן מודע", "להתנגד", "לברוח"], correct: 1, difficulty: 5, difficultyName: "למקצוענים" }
        ]
    },

    "הגיון מעקבי": {
        shortDesc: "מעקב ואיסוף נתונים מתמיד",
        intro: `<h3>הגיון מעקבי</h3><p><strong>הגדרה:</strong> חברות עוקבות אחריך לפרסום וניתוח.</p>`,
        questions: [
            { situation: "פרסומת ממוקדת", question: "מהו?", answers: ["פרטיות", "איסוף נתונים מתמיד", "אבטחה", "חופש"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "קוקיז", question: "למה חברות עוקבות?", answers: ["ביטחון", "פרסום ממוקד ורווחים", "שירות", "חינם"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "מידע אישי", question: "מה נאסף?", answers: ["כלום", "מיקום, חיפושים, לייקים, קניות", "רק שם", "רק גיל"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "פרטיות", question: "סכנה?", answers: ["אין", "פגיעה בפרטיות ומניפולציה", "מוגן", "בטוח"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "הגנה", question: "איך להגן?", answers: ["אי אפשר", "מודעות, VPN, הגבלת הרשאות", "הסכמה לכל", "ניתוק"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },

    "FOMO": {
        shortDesc: "פחד לפספס (Fear Of Missing Out)",
        intro: `<h3>FOMO</h3><p><strong>הגדרה:</strong> חרדה שמפספסים משהו ברשתות.</p>`,
        questions: [
            { situation: "בדיקת פיד מתמדת", question: "מהו FOMO?", answers: ["שמחה", "פחד לפספס", "אדישות", "ביטחון"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "מסיבה ברשתות", question: "תסמין?", answers: ["רוגע", "חרדה שאחרים נהנים בלעדיך", "אושר", "שינה"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "השוואה", question: "למה זה קורה?", answers: ["אקראי", "רואים רק הצלחות אחרים", "ריאליסטי", "מדויק"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "בריאות נפשית", question: "השפעה?", answers: ["חיובית", "חרדה ודיכאון", "ניטרלית", "מרפאת"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "התמודדות", question: "פתרון?", answers: ["יותר רשתות", "הפסקות ומודעות", "התעלמות", "תרופות"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },

    "אושיות רשת": {
        shortDesc: "מפורסמים שנוצרו ברשתות",
        intro: `<h3>אושיות רשת</h3><p><strong>הגדרה:</strong> אינפלואנסרים, יוטיוברים, טיקטוקרים.</p>`,
        questions: [
            { situation: "יוטיובר מפורסם", question: "מי הם?", answers: ["שחקנים", "מפורסמים שנבנו ברשתות", "פוליטיקאים", "ספורטאים"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "פרסום מוצר", question: "איך משפיעים?", answers: ["לא משפיעים", "המלצות למעקבים", "כפייה", "איומים"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "הכנסה", question: "ממה מרוויחים?", answers: ["תרומות", "פרסומות וקידום מותגים", "משכורת", "מתנות"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "אמינות", question: "הבעיה?", answers: ["אמינים תמיד", "פרסום סמוי ללא גילוי", "כנים תמיד", "מוסריים"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "ילדים", question: "השפעה על נוער?", answers: ["אין", "עיצוב ציפיות ודימוי עצמי", "חיובית בלבד", "לא רלוונטי"], correct: 1, difficulty: 4, difficultyName: "למומחים" }
        ]
    },

    "אלימות ברשת": {
        shortDesc: "פגיעה מילולית והטרדה אונליין",
        intro: `<h3>אלימות ברשת</h3><p><strong>הגדרה:</strong> בריונות, הטרדה, איומים ברשתות.</p>`,
        questions: [
            { situation: "תגובות פוגעות", question: "מהי?", answers: ["ביקורת בונה", "פגיעה מילולית והשפלה", "דיון תרבותי", "שיחה רגילה"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "אנונימיות", question: "למה זה קורה?", answers: ["אנשים טובים", "אנונימיות מעודדת תוקפנות", "במקרה", "טעות"], correct: 1, difficulty: 1, difficultyName: "קל" },
            { situation: "קורבן", question: "השפעה על קורבן?", answers: ["אין", "טראומה ופגיעה נפשית", "מחזק", "משעשע"], correct: 1, difficulty: 2, difficultyName: "סביר" },
            { situation: "התפשטות", question: "למה מתפשט?", answers: ["נעצר מהר", "שיתוף המוני מגביר", "נדיר", "לא קורה"], correct: 1, difficulty: 3, difficultyName: "מאתגר" },
            { situation: "מניעה", question: "פתרון?", answers: ["התעלם", "דיווח, חינוך, אכיפה", "תקבל", "נקמה"], correct: 1, difficulty: 5, difficultyName: "למקצוענים" }
        ]
    }
};
