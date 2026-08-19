const start = document.getElementById('start');
const stopTime = document.getElementById('stop');
const reset = document.getElementById('reset');
const timer = document.getElementById('timer');
const addTime = document.getElementById('addTime');
const shortenTime = document.getElementById('shortenTime');
const menuButton = document.getElementById('menu-button');
const menuPopup = document.querySelector('.menu');
const closeButton = document.getElementById('close-button');
const sessionOverlay = document.getElementById('session-overlay');
const sessionMessage = document.getElementById('session-message');
const STORAGE_KEY = 'pomodoro-timer-state';

const SESSION_LENGTHS = {
    focus: 1500,
    break: 300,
};

const SESSION_MESSAGES = {
    focus: 'Focus Session Ended',
    break: 'Break Over',
};

const SESSION_LABELS = {
    focus: 'Focus',
    break: 'Break',
};

const SESSION_MINUTES = {
    focus: '25 minutes',
    break: '5 minutes',
};

const SESSION_END_MESSAGES = {
    focus: `Focus session ended! Break for ${SESSION_MINUTES.break}`,
    break: `Break ended! Focus session started for ${SESSION_MINUTES.focus}`,
};

let currentSession = 'focus';
let timeLeft = SESSION_LENGTHS[currentSession];
let timerInterval = null;
let targetEndAt = Date.now() + timeLeft * 1000;
let sessionAdvanceTimeout = null;

const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentSession,
        timeLeft,
        targetEndAt,
        isRunning: Boolean(timerInterval),
    }));
};

const restoreState = () => {
    const rawState = localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
        saveState();
        return;
    }

    try {
        const savedState = JSON.parse(rawState);
        currentSession = savedState.currentSession === 'break' ? 'break' : 'focus';
        const storedTimeLeft = Number(savedState.timeLeft);
        timeLeft = Number.isFinite(storedTimeLeft) ? storedTimeLeft : SESSION_LENGTHS[currentSession];

        if (typeof savedState.targetEndAt === 'number') {
            targetEndAt = savedState.targetEndAt;
            if (savedState.isRunning) {
                timeLeft = Math.max(0, Math.ceil((targetEndAt - Date.now()) / 1000));
            }
        }

        updateTimerDisplay();

        if (savedState.isRunning) {
            if (timeLeft <= 0) {
                handleSessionComplete();
            } else {
                timerInterval = setInterval(tick, 1000);
                tick();
            }
        }
    } catch {
        saveState();
    }
};

const clearSessionAdvanceTimeout = () => {
    if (sessionAdvanceTimeout) {
        clearTimeout(sessionAdvanceTimeout);
        sessionAdvanceTimeout = null;
    }
};

const tick = () => {
    timeLeft = Math.max(0, Math.ceil((targetEndAt - Date.now()) / 1000));
    updateTimerDisplay();
    saveState();

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        handleSessionComplete();
    }
};

const showSessionOverlay = (message) => {
    if (sessionMessage) {
        sessionMessage.textContent = message;
    }
    sessionOverlay?.classList.add('active');
};

const hideSessionOverlay = () => {
    sessionOverlay?.classList.remove('active');
};

const getNextSession = () => (currentSession === 'focus' ? 'break' : 'focus');

const updateTimerDisplay = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timer.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const startTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    clearSessionAdvanceTimeout();
    targetEndAt = Date.now() + timeLeft * 1000;
    saveState();
    timerInterval = setInterval(tick, 1000);
    tick();
};

const handleSessionComplete = () => {
    const finishedSession = currentSession;
    const nextSession = getNextSession();

    showSessionOverlay(SESSION_END_MESSAGES[finishedSession]);

    currentSession = nextSession;
    timeLeft = SESSION_LENGTHS[nextSession];
    targetEndAt = Date.now() + timeLeft * 1000;
    updateTimerDisplay();
    saveState();

    if (!timerInterval) {
        timerInterval = setInterval(tick, 1000);
    }

    sessionAdvanceTimeout = setTimeout(() => {
        hideSessionOverlay();
    }, 2500);
};

const stopTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    clearSessionAdvanceTimeout();
    hideSessionOverlay();
};

const resetTimer = () => {
    stopTimer();
    currentSession = 'focus';
    timeLeft = SESSION_LENGTHS.focus;
    targetEndAt = Date.now() + timeLeft * 1000;
    updateTimerDisplay();
    saveState();
};

const addFiveMinutes = () => {
    timeLeft += 300;
    updateTimerDisplay();
    if (timerInterval) {
        targetEndAt = Date.now() + timeLeft * 1000;
    }
    saveState();
};

const shortenFiveMinutes = () => {
    if (timeLeft >= 300) {
        timeLeft -= 300;
    } else {
        timeLeft = 0;
    }
    updateTimerDisplay();
    if (timerInterval) {
        targetEndAt = Date.now() + timeLeft * 1000;
    }
    saveState();
};

const toggleMenu = () => {
    menuPopup.classList.toggle('active');
};

const closeMenu = () => {
    menuPopup.classList.remove('active');
};

menuButton.addEventListener('click', toggleMenu);
closeButton.addEventListener('click', closeMenu);
start.addEventListener('click', startTimer);
stopTime.addEventListener('click', stopTimer);
reset.addEventListener('click', resetTimer);
addTime.addEventListener('click', addFiveMinutes);
shortenTime.addEventListener('click', shortenFiveMinutes);
restoreState();
updateTimerDisplay();