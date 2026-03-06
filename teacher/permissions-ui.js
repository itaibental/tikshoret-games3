// permissions-ui.js - ממשק ניהול הרשאות

async function showPermissions() {
    const students = await PermissionsManager.getStudentsArray();
    
    const html = `
        <div id="permissionsModal" class="modal-overlay">
            <div class="modal-content" style="max-width: 950px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>🔐 ניהול הרשאות תלמידים</h3>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button onclick="syncCloud()" class="btn-sync" title="סנכרן מהענן">
                            🔄 סנכרון
                        </button>
                        <button class="close-btn" onclick="closePermissions()">×</button>
                    </div>
                </div>
                
                <div class="modal-body">
                    <!-- טאבים -->
                    <div class="tabs-row">
                        <button id="tabManual" class="tab-btn active" onclick="switchPermTab('manual')">
                            ➕ הוספה ידנית
                        </button>
                        <button id="tabSheets" class="tab-btn" onclick="switchPermTab('sheets')">
                            📊 ייבוא מגוגל שיטס
                        </button>
                        <button id="tabList" class="tab-btn" onclick="switchPermTab('list')">
                            📋 רשימת תלמידים (${students.length})
                        </button>
                    </div>
                    
                    <!-- הוספה ידנית -->
                    <div id="panelManual" class="tab-panel active">
                        <div class="info-box" style="background: rgba(33, 150, 243, 0.1); border: 2px solid #2196F3; margin-bottom: 20px;">
                            <strong style="color: #64B5F6;">💡 הסבר:</strong>
                            <p style="color: #aaa; margin: 5px 0 0 0;">
                                כל תלמיד יקבל שם משתמש וסיסמה להתחברות למערכת.<br>
                                הנתונים נשמרים אוטומטית בענן (Firebase).
                            </p>
                        </div>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label>תעודת זהות: *</label>
                                <input type="text" id="addId" placeholder="9 ספרות" maxlength="9"
                                       class="form-input">
                            </div>
                            <div class="form-group">
                                <label>שם מלא: *</label>
                                <input type="text" id="addName" placeholder="שם פרטי ומשפחה"
                                       class="form-input">
                            </div>
                            <div class="form-group">
                                <label>שם משתמש: *</label>
                                <input type="text" id="addUsername" placeholder="לפחות 3 תווים"
                                       class="form-input">
                            </div>
                            <div class="form-group">
                                <label>סיסמה: *</label>
                                <input type="password" id="addPassword" placeholder="לפחות 4 תווים"
                                       class="form-input" onkeypress="if(event.key==='Enter') doAddPermission()">
                            </div>
                        </div>
                        
                        <div id="addErr" class="error-msg"></div>
                        <div id="addSuccess" class="success-msg"></div>
                        
                        <button onclick="doAddPermission()" class="btn-add">
                            ✅ הוסף תלמיד והענק הרשאות
                        </button>
                    </div>
                    
                    <!-- ייבוא מגוגל שיטס -->
                    <div id="panelSheets" class="tab-panel">
                        <h4>ייבוא תלמידים מגוגל שיטס:</h4>
                        
                        <div class="info-box" style="background: rgba(255, 152, 0, 0.1); border: 2px solid #ff9800; margin-bottom: 20px;">
                            <strong style="color: #ff9800;">📋 פורמט הגיליון:</strong>
                            <p style="color: #aaa; margin: 10px 0 0 0;">
                                הגיליון חייב לכלול 4 עמודות בדיוק:<br>
                                <strong>תעודת זהות | שם מלא | שם משתמש | סיסמה</strong>
                            </p>
                        </div>
                        
                        <div class="example-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>תעודת זהות</th>
                                        <th>שם מלא</th>
                                        <th>שם משתמש</th>
                                        <th>סיסמה</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>123456789</td>
                                        <td>ישראל ישראלי</td>
                                        <td>israel123</td>
                                        <td>1234</td>
                                    </tr>
                                    <tr>
                                        <td>987654321</td>
                                        <td>שרה כהן</td>
                                        <td>sara987</td>
                                        <td>5678</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="info-box" style="background: rgba(33, 150, 243, 0.1); border: 2px solid #2196F3; margin: 20px 0;">
                            <strong style="color: #64B5F6;">📌 הוראות:</strong>
                            <ol style="margin: 10px 0 0 20px; line-height: 1.8; color: #aaa;">
                                <li>צור גיליון עם 4 עמודות כמו הדוגמה למעלה</li>
                                <li>File → Share → Get link → Anyone with the link can <strong>view</strong></li>
                                <li>העתק והדבק את הקישור למטה</li>
                            </ol>
                        </div>
                        
                        <input type="url" id="sheetsUrl" placeholder="https://docs.google.com/spreadsheets/..."
                               class="form-input" style="margin-bottom: 15px;">
                        
                        <div id="sheetsStatus"></div>
                        
                        <button onclick="doImportPermissions()" class="btn-import">
                            📥 ייבא תלמידים והרשאות
                        </button>
                    </div>
                    
                    <!-- רשימת תלמידים -->
                    <div id="panelList" class="tab-panel">
                        <div class="list-header">
                            <input type="text" id="searchBox" placeholder="🔍 חפש תלמיד (שם, ת״ז או משתמש)..." 
                                   oninput="filterPermList()" class="form-input" style="flex: 1;">
                            <button onclick="exportPermissions()" class="btn-export">
                                📥 ייצא לאקסל
                            </button>
                        </div>
                        
                        <div id="studentsList" class="students-grid">
                            ${students.length === 0 ? 
                                '<div class="empty-state">אין תלמידים במערכת. הוסף תלמידים דרך הטאבים למעלה.</div>' :
                                students.map(s => `
                                    <div class="student-card-full" data-id="${s.id}" data-name="${s.name}" data-username="${s.username}">
                                        <div class="student-main-info">
                                            <div class="student-id-badge">${s.id}</div>
                                            <div class="student-details">
                                                <div class="student-name-large">${s.name}</div>
                                                <div class="student-credentials">
                                                    👤 <strong>${s.username}</strong> | 
                                                    🔑 <span class="password-display" onclick="togglePassword(this)">
                                                        <span class="hidden-pass">••••••</span>
                                                        <span class="real-pass" style="display:none;">${s.password}</span>
                                                    </span>
                                                </div>
                                                <div class="student-meta-info">
                                                    ${s.source === 'manual' ? '✍️ הוסף ידנית' : '📊 יובא מגוגל שיטס'} • 
                                                    ${new Date(s.created).toLocaleDateString('he-IL')}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="student-actions-col">
                                            <button onclick="doDeletePermData('${s.id}', '${s.name}')" 
                                                    class="btn-delete" title="מחק נתונים">
                                                🗑️ מחק נתונים
                                            </button>
                                            <button onclick="doRemovePermission('${s.id}', '${s.name}')" 
                                                    class="btn-remove" title="הסר הרשאה">
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

function switchPermTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    
    document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
    document.getElementById('panel' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
}

async function doAddPermission() {
    const id = document.getElementById('addId').value.trim();
    const name = document.getElementById('addName').value.trim();
    const username = document.getElementById('addUsername').value.trim();
    const password = document.getElementById('addPassword').value;
    const errDiv = document.getElementById('addErr');
    const successDiv = document.getElementById('addSuccess');
    
    errDiv.textContent = '';
    successDiv.textContent = '';
    
    const result = await PermissionsManager.addStudent(id, name, username, password);
    
    if (result.ok) {
        document.getElementById('addId').value = '';
        document.getElementById('addName').value = '';
        document.getElementById('addUsername').value = '';
        document.getElementById('addPassword').value = '';
        
        successDiv.textContent = `✅ ${name} נוסף בהצלחה! שם משתמש: ${username}`;
        
        setTimeout(() => {
            closePermissions();
            showPermissions();
            switchPermTab('list');
        }, 2000);
    } else {
        errDiv.textContent = '❌ ' + result.msg;
    }
}

async function doImportPermissions() {
    const url = document.getElementById('sheetsUrl').value.trim();
    const status = document.getElementById('sheetsStatus');
    
    if (!url) {
        status.className = 'error-msg';
        status.textContent = '❌ הזן קישור לגיליון';
        return;
    }
    
    status.className = 'info-msg';
    status.textContent = '⏳ מייבא תלמידים והרשאות...';
    
    const result = await PermissionsManager.importFromSheets(url);
    
    if (result.ok) {
        status.className = 'success-msg';
        status.textContent = '✅ ' + result.msg;
        
        setTimeout(() => {
            closePermissions();
            showPermissions();
            switchPermTab('list');
        }, 2500);
    } else {
        status.className = 'error-msg';
        status.textContent = '❌ ' + result.msg;
    }
}

function filterPermList() {
    const term = document.getElementById('searchBox').value.toLowerCase();
    const cards = document.querySelectorAll('.student-card-full');
    
    cards.forEach(card => {
        const id = card.dataset.id;
        const name = card.dataset.name.toLowerCase();
        const username = card.dataset.username.toLowerCase();
        
        if (id.includes(term) || name.includes(term) || username.includes(term)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function togglePassword(el) {
    const hidden = el.querySelector('.hidden-pass');
    const real = el.querySelector('.real-pass');
    
    if (hidden.style.display === 'none') {
        hidden.style.display = '';
        real.style.display = 'none';
    } else {
        hidden.style.display = 'none';
        real.style.display = '';
    }
}

async function doDeletePermData(id, name) {
    if (!confirm(`מחק את כל הנתונים והתוצאות של ${name}?\n\nפעולה זו אינה הפיכה!`)) {
        return;
    }
    
    const result = await PermissionsManager.deleteStudentData(id);
    alert(result.ok ? '✅ ' + result.msg : '❌ ' + result.msg);
}

async function doRemovePermission(id, name) {
    if (!confirm(`הסר את ההרשאות של ${name}?\n\n(הנתונים שלו יישארו במערכת, רק ההרשאה תוסר)`)) {
        return;
    }
    
    await PermissionsManager.removeStudent(id);
    closePermissions();
    showPermissions();
    switchPermTab('list');
}

async function syncCloud() {
    const result = await PermissionsManager.syncFromCloud();
    if (result.ok) {
        alert(`✅ ${result.msg}\nנמצאו ${result.count} תלמידים`);
        closePermissions();
        showPermissions();
    } else {
        alert('❌ ' + result.msg);
    }
}

async function exportPermissions() {
    const students = await PermissionsManager.getStudentsArray();
    
    let csv = '\ufeffתעודת זהות,שם מלא,שם משתמש,סיסמה,תאריך יצירה,מקור\n';
    students.forEach(s => {
        csv += `${s.id},${s.name},${s.username},${s.password},${new Date(s.created).toLocaleDateString('he-IL')},${s.source === 'manual' ? 'ידני' : 'גוגל שיטס'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students-permissions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

function closePermissions() {
    const modal = document.getElementById('permissionsModal');
    if (modal) modal.remove();
}

// CSS מעודכן
const style = document.createElement('style');
style.textContent = `
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    color: #aaa;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 14px;
}

.form-input {
    width: 100%;
    padding: 12px;
    background: #2a2a2a;
    border: 2px solid #444;
    border-radius: 8px;
    color: white;
    font-size: 15px;
}

.form-input:focus {
    outline: none;
    border-color: #64B5F6;
    box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.2);
}

.error-msg {
    color: #dc3545;
    background: rgba(220, 53, 69, 0.1);
    padding: 12px;
    border-radius: 8px;
    margin: 10px 0;
    font-weight: 600;
}

.success-msg {
    color: #28a745;
    background: rgba(40, 167, 69, 0.1);
    padding: 12px;
    border-radius: 8px;
    margin: 10px 0;
    font-weight: 600;
}

.info-msg {
    color: #ffc107;
    background: rgba(255, 193, 7, 0.1);
    padding: 12px;
    border-radius: 8px;
    margin: 10px 0;
}

.example-table {
    margin: 20px 0;
    overflow-x: auto;
}

.example-table table {
    width: 100%;
    border-collapse: collapse;
    background: #2a2a2a;
    border-radius: 8px;
    overflow: hidden;
}

.example-table th {
    background: #1a1a1a;
    color: #64B5F6;
    padding: 12px;
    text-align: right;
    font-weight: 700;
}

.example-table td {
    padding: 12px;
    border-top: 1px solid #333;
    color: #e0e0e0;
}

.student-card-full {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: rgba(50, 50, 50, 0.6);
    border: 2px solid rgba(100, 181, 246, 0.2);
    border-radius: 12px;
    transition: all 0.3s;
    margin-bottom: 15px;
}

.student-card-full:hover {
    background: rgba(60, 60, 60, 0.8);
    border-color: #64B5F6;
    transform: translateX(-5px);
}

.student-main-info {
    display: flex;
    gap: 20px;
    align-items: center;
    flex: 1;
}

.student-id-badge {
    font-family: 'Courier New', monospace;
    font-size: 20px;
    font-weight: 700;
    color: #64B5F6;
    background: rgba(100, 181, 246, 0.1);
    padding: 15px 20px;
    border-radius: 10px;
    border: 2px solid rgba(100, 181, 246, 0.3);
}

.student-details {
    flex: 1;
}

.student-name-large {
    font-size: 18px;
    font-weight: 700;
    color: #e0e0e0;
    margin-bottom: 8px;
}

.student-credentials {
    font-size: 15px;
    color: #aaa;
    margin-bottom: 5px;
}

.password-display {
    cursor: pointer;
    padding: 2px 6px;
    background: rgba(255, 193, 7, 0.1);
    border-radius: 4px;
    transition: all 0.3s;
}

.password-display:hover {
    background: rgba(255, 193, 7, 0.2);
}

.student-meta-info {
    font-size: 13px;
    color: #666;
}

.student-actions-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.btn-sync {
    padding: 8px 15px;
    background: linear-gradient(135deg, #28a745, #20c997);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-sync:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
}

.btn-delete, .btn-remove {
    padding: 10px 15px;
    border: 2px solid;
    background: transparent;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
}

.btn-delete {
    border-color: #dc3545;
    color: #dc3545;
}

.btn-delete:hover {
    background: #dc3545;
    color: white;
}

.btn-remove {
    border-color: #ffc107;
    color: #ffc107;
}

.btn-remove:hover {
    background: #ffc107;
    color: #1a1a1a;
}
`;
document.head.appendChild(style);

window.showPermissions = showPermissions;
