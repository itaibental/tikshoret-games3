// simple-permissions-ui.js - ממשק פשוט לניהול הרשאות

async function showSimplePermissions() {
    const students = await SimplePermissions.getStudentsArray();
    
    const html = `
        <div id="permissionsModal" class="modal-overlay">
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>🔐 ניהול הרשאות תלמידים</h3>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button onclick="syncSimpleCloud()" class="btn-sync" title="סנכרן מהענן">
                            🔄 סנכרון
                        </button>
                        <button class="close-btn" onclick="closeSimplePermissions()">×</button>
                    </div>
                </div>
                
                <div class="modal-body">
                    <!-- טאבים -->
                    <div class="tabs-row">
                        <button id="tabManual" class="tab-btn active" onclick="switchSimpleTab('manual')">
                            ➕ הוספה ידנית
                        </button>
                        <button id="tabSheets" class="tab-btn" onclick="switchSimpleTab('sheets')">
                            📊 ייבוא מגוגל שיטס
                        </button>
                        <button id="tabList" class="tab-btn" onclick="switchSimpleTab('list')">
                            📋 רשימת תלמידים (${students.length})
                        </button>
                    </div>
                    
                    <!-- הוספה ידנית -->
                    <div id="panelManual" class="tab-panel active">
                        <div class="info-box" style="background: rgba(33, 150, 243, 0.1); border: 2px solid #2196F3; margin-bottom: 20px;">
                            <strong style="color: #64B5F6;">💡 פשוט וקל:</strong>
                            <p style="color: #aaa; margin: 5px 0 0 0;">
                                רק שם ותעודת זהות - <strong>הת"ז משמשת גם כסיסמה!</strong><br>
                                התלמיד יכנס עם תעודת הזהות שלו והנתונים נשמרים בענן.
                            </p>
                        </div>
                        
                        <div class="form-row" style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px;">
                            <div class="form-group">
                                <label>תעודת זהות: *</label>
                                <input type="text" id="addId" placeholder="9 ספרות" maxlength="9"
                                       class="form-input" style="width: 100%; padding: 12px; background: #2a2a2a; border: 2px solid #444; border-radius: 8px; color: white;">
                            </div>
                            <div class="form-group">
                                <label>שם מלא: *</label>
                                <input type="text" id="addName" placeholder="שם התלמיד"
                                       class="form-input" style="width: 100%; padding: 12px; background: #2a2a2a; border: 2px solid #444; border-radius: 8px; color: white;"
                                       onkeypress="if(event.key==='Enter') doAddSimple()">
                            </div>
                        </div>
                        
                        <div id="addErr" style="color: #dc3545; background: rgba(220, 53, 69, 0.1); padding: 12px; border-radius: 8px; margin: 10px 0; display: none;"></div>
                        <div id="addSuccess" style="color: #28a745; background: rgba(40, 167, 69, 0.1); padding: 12px; border-radius: 8px; margin: 10px 0; display: none;"></div>
                        
                        <button onclick="doAddSimple()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #28a745, #20c997); border: none; border-radius: 10px; color: white; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 15px;">
                            ✅ הוסף תלמיד
                        </button>
                    </div>
                    
                    <!-- ייבוא מגוגל שיטס -->
                    <div id="panelSheets" class="tab-panel">
                        <h4>ייבוא תלמידים מגוגל שיטס:</h4>
                        
                        <div class="info-box" style="background: rgba(255, 152, 0, 0.1); border: 2px solid #ff9800; margin-bottom: 20px;">
                            <strong style="color: #ff9800;">📋 פורמט הגיליון (2 עמודות בלבד):</strong>
                        </div>
                        
                        <div class="example-table">
                            <table style="width: 100%; border-collapse: collapse; background: #2a2a2a; border-radius: 8px; overflow: hidden;">
                                <thead>
                                    <tr style="background: #1a1a1a;">
                                        <th style="padding: 12px; color: #64B5F6; text-align: right;">תעודת זהות</th>
                                        <th style="padding: 12px; color: #64B5F6; text-align: right;">שם מלא</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="padding: 12px; border-top: 1px solid #333; color: #e0e0e0;">123456789</td>
                                        <td style="padding: 12px; border-top: 1px solid #333; color: #e0e0e0;">ישראל ישראלי</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px; border-top: 1px solid #333; color: #e0e0e0;">987654321</td>
                                        <td style="padding: 12px; border-top: 1px solid #333; color: #e0e0e0;">שרה כהן</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="info-box" style="background: rgba(33, 150, 243, 0.1); border: 2px solid #2196F3; margin: 20px 0;">
                            <strong style="color: #64B5F6;">📌 הוראות:</strong>
                            <ol style="margin: 10px 0 0 20px; line-height: 1.8; color: #aaa;">
                                <li>צור גיליון עם 2 עמודות: <strong>תעודת זהות | שם מלא</strong></li>
                                <li>File → Share → Get link → Anyone with the link can <strong>view</strong></li>
                                <li>העתק והדבק את הקישור למטה</li>
                            </ol>
                        </div>
                        
                        <input type="url" id="sheetsUrl" placeholder="https://docs.google.com/spreadsheets/..."
                               style="width: 100%; padding: 12px; background: #2a2a2a; border: 2px solid #444; border-radius: 8px; color: white; margin-bottom: 15px;">
                        
                        <div id="sheetsStatus"></div>
                        
                        <button onclick="doImportSimple()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #2196F3, #64B5F6); border: none; border-radius: 10px; color: white; font-size: 16px; font-weight: bold; cursor: pointer;">
                            📥 ייבא תלמידים
                        </button>
                    </div>
                    
                    <!-- רשימת תלמידים -->
                    <div id="panelList" class="tab-panel">
                        <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                            <input type="text" id="searchBox" placeholder="🔍 חפש תלמיד (שם או ת״ז)..." 
                                   oninput="filterSimpleList()" style="flex: 1; padding: 12px; background: #2a2a2a; border: 2px solid #444; border-radius: 8px; color: white;">
                            <button onclick="exportSimple()" style="padding: 12px 20px; background: linear-gradient(135deg, #ff9800, #ffb74d); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer;">
                                📥 ייצא לאקסל
                            </button>
                        </div>
                        
                        <div id="studentsList" style="display: grid; gap: 15px; max-height: 500px; overflow-y: auto;">
                            ${students.length === 0 ? 
                                '<div style="text-align: center; padding: 60px; color: #888; font-size: 18px;">אין תלמידים במערכת.<br>הוסף תלמידים דרך הטאבים למעלה.</div>' :
                                students.map(s => `
                                    <div class="student-card-simple" data-id="${s.id}" data-name="${s.name}">
                                        <div style="display: flex; gap: 20px; align-items: center; flex: 1;">
                                            <div style="font-family: 'Courier New', monospace; font-size: 20px; font-weight: 700; color: #64B5F6; background: rgba(100, 181, 246, 0.1); padding: 15px 20px; border-radius: 10px; border: 2px solid rgba(100, 181, 246, 0.3);">
                                                ${s.id}
                                            </div>
                                            <div style="flex: 1;">
                                                <div style="font-size: 18px; font-weight: 700; color: #e0e0e0; margin-bottom: 5px;">
                                                    ${s.name}
                                                </div>
                                                <div style="font-size: 13px; color: #666;">
                                                    ${s.source === 'manual' ? '✍️ הוסף ידנית' : '📊 יובא מגוגל שיטס'} • 
                                                    ${new Date(s.created).toLocaleDateString('he-IL')}
                                                </div>
                                                <div style="font-size: 14px; color: #888; margin-top: 5px;">
                                                    🔑 הסיסמה: <strong style="color: #64B5F6;">${s.id}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="display: flex; flex-direction: column; gap: 10px;">
                                            <button onclick="doDeleteSimpleData('${s.id}', '${s.name}')" 
                                                    style="padding: 10px 15px; border: 2px solid #dc3545; background: transparent; color: #dc3545; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
                                                🗑️ מחק נתונים
                                            </button>
                                            <button onclick="doRemoveSimple('${s.id}', '${s.name}')" 
                                                    style="padding: 10px 15px; border: 2px solid #ffc107; background: transparent; color: #ffc107; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
                                                ✖️ הסר הרשאה
                                            </button>
                                        </div>
                                    </div>
                                `).join('')
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

function switchSimpleTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    
    document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
    document.getElementById('panel' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
}

async function doAddSimple() {
    const id = document.getElementById('addId').value.trim();
    const name = document.getElementById('addName').value.trim();
    const errDiv = document.getElementById('addErr');
    const successDiv = document.getElementById('addSuccess');
    
    errDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    const result = await SimplePermissions.addStudent(id, name);
    
    if (result.ok) {
        document.getElementById('addId').value = '';
        document.getElementById('addName').value = '';
        
        successDiv.textContent = `✅ ${name} נוסף בהצלחה! הסיסמה היא תעודת הזהות: ${id}`;
        successDiv.style.display = 'block';
        
        setTimeout(() => {
            closeSimplePermissions();
            showSimplePermissions();
            switchSimpleTab('list');
        }, 2000);
    } else {
        errDiv.textContent = '❌ ' + result.msg;
        errDiv.style.display = 'block';
    }
}

async function doImportSimple() {
    const url = document.getElementById('sheetsUrl').value.trim();
    const status = document.getElementById('sheetsStatus');
    
    if (!url) {
        status.style.cssText = 'color: #dc3545; background: rgba(220, 53, 69, 0.1); padding: 12px; border-radius: 8px; margin: 10px 0;';
        status.textContent = '❌ הזן קישור לגיליון';
        return;
    }
    
    status.style.cssText = 'color: #ffc107; background: rgba(255, 193, 7, 0.1); padding: 12px; border-radius: 8px; margin: 10px 0;';
    status.textContent = '⏳ מייבא תלמידים...';
    
    const result = await SimplePermissions.importFromSheets(url);
    
    if (result.ok) {
        status.style.cssText = 'color: #28a745; background: rgba(40, 167, 69, 0.1); padding: 12px; border-radius: 8px; margin: 10px 0;';
        status.textContent = '✅ ' + result.msg;
        
        setTimeout(() => {
            closeSimplePermissions();
            showSimplePermissions();
            switchSimpleTab('list');
        }, 2500);
    } else {
        status.style.cssText = 'color: #dc3545; background: rgba(220, 53, 69, 0.1); padding: 12px; border-radius: 8px; margin: 10px 0;';
        status.textContent = '❌ ' + result.msg;
    }
}

function filterSimpleList() {
    const term = document.getElementById('searchBox').value.toLowerCase();
    const cards = document.querySelectorAll('.student-card-simple');
    
    cards.forEach(card => {
        const id = card.dataset.id;
        const name = card.dataset.name.toLowerCase();
        
        if (id.includes(term) || name.includes(term)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

async function doDeleteSimpleData(id, name) {
    if (!confirm(`מחק את כל הנתונים והתוצאות של ${name}?\n\nפעולה זו אינה הפיכה!`)) {
        return;
    }
    
    const result = await SimplePermissions.deleteStudentData(id);
    alert(result.ok ? '✅ ' + result.msg : '❌ ' + result.msg);
}

async function doRemoveSimple(id, name) {
    if (!confirm(`הסר את ההרשאות של ${name}?\n\n(הנתונים שלו יישארו במערכת)`)) {
        return;
    }
    
    await SimplePermissions.removeStudent(id);
    closeSimplePermissions();
    showSimplePermissions();
    switchSimpleTab('list');
}

async function syncSimpleCloud() {
    const result = await SimplePermissions.syncFromCloud();
    if (result.ok) {
        alert(`✅ ${result.msg}\nנמצאו ${result.count} תלמידים`);
        closeSimplePermissions();
        showSimplePermissions();
    } else {
        alert('❌ ' + result.msg);
    }
}

async function exportSimple() {
    const students = await SimplePermissions.getStudentsArray();
    
    let csv = '\ufeffתעודת זהות,שם מלא,תאריך יצירה,מקור\n';
    students.forEach(s => {
        csv += `${s.id},${s.name},${new Date(s.created).toLocaleDateString('he-IL')},${s.source === 'manual' ? 'ידני' : 'גוגל שיטס'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

function closeSimplePermissions() {
    const modal = document.getElementById('permissionsModal');
    if (modal) modal.remove();
}

// CSS
const style = document.createElement('style');
style.textContent = `
.student-card-simple {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: rgba(50, 50, 50, 0.6);
    border: 2px solid rgba(100, 181, 246, 0.2);
    border-radius: 12px;
    transition: all 0.3s;
}
.student-card-simple:hover {
    background: rgba(60, 60, 60, 0.8);
    border-color: #64B5F6;
    transform: translateX(-5px);
}
`;
document.head.appendChild(style);

window.showPermissions = showSimplePermissions;
