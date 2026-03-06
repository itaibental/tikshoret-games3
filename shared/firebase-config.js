// firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, push, set, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyCte4D5lS6eHAZbNvcKHY0I07yr2llh-HI",
    authDomain: "webpages-4aacb.firebaseapp.com",
    databaseURL: "https://webpages-4aacb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "webpages-4aacb",
    storageBucket: "webpages-4aacb.firebasestorage.app",
    messagingSenderId: "421209892208",
    appId: "1:421209892208:web:5a93172aaaad4f6e579bb5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export to window for global access
window.firebaseDB = database;
window.firebaseRef = ref;
window.firebasePush = push;
window.firebaseSet = set;
window.firebaseOnValue = onValue;

console.log('✅ Firebase initialized successfully!');
