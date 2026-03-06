// sounds.js - מערכת צלילים למשחק

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio context not supported');
            this.enabled = false;
        }
    }

    createBeep(frequency, duration, volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.value = volume;

        const now = this.audioContext.currentTime;
        oscillator.start(now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        oscillator.stop(now + duration);
    }

    playClick() {
        this.createBeep(800, 0.1, 0.2);
    }

    playCorrect() {
        // צליל חיובי - שלושה צלילים עולים
        this.createBeep(523, 0.1, 0.3); // C
        setTimeout(() => this.createBeep(659, 0.1, 0.3), 100); // E
        setTimeout(() => this.createBeep(784, 0.2, 0.3), 200); // G
    }

    playIncorrect() {
        // צליל שלילי - צליל יורד
        this.createBeep(400, 0.15, 0.3);
        setTimeout(() => this.createBeep(300, 0.15, 0.3), 150);
        setTimeout(() => this.createBeep(200, 0.25, 0.3), 300);
    }

    playSuccess() {
        // צליל הצלחה - מנגינה שמחה
        const melody = [
            {freq: 523, time: 0},
            {freq: 659, time: 150},
            {freq: 784, time: 300},
            {freq: 1047, time: 450}
        ];
        
        melody.forEach(note => {
            setTimeout(() => this.createBeep(note.freq, 0.2, 0.3), note.time);
        });
    }

    playStart() {
        this.createBeep(600, 0.15, 0.3);
        setTimeout(() => this.createBeep(800, 0.2, 0.3), 150);
    }

    playWarning() {
        // אזעקה - 3 צלילים קצרים חוזרים
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createBeep(800, 0.1, 0.4);
                setTimeout(() => this.createBeep(600, 0.1, 0.4), 150);
            }, i * 500);
        }
    }

    playTimeUp() {
        // צליל זמן נגמר - צליל ארוך יורד
        this.createBeep(600, 0.3, 0.4);
        setTimeout(() => this.createBeep(400, 0.3, 0.4), 300);
        setTimeout(() => this.createBeep(200, 0.5, 0.4), 600);
    }
}

// יצירת instance גלובלי
window.soundManager = new SoundManager();

// אתחול כשהדף נטען
document.addEventListener('DOMContentLoaded', () => {
    window.soundManager.init();
});

// אתחול גם בלחיצה ראשונה (בגלל מגבלות דפדפן)
document.addEventListener('click', function initAudio() {
    if (window.soundManager && !window.soundManager.audioContext) {
        window.soundManager.init();
    }
    document.removeEventListener('click', initAudio);
}, { once: true });
