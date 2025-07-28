const start = document.getElementById('start');
const stop = document.getElementById('stop');   
const reset = document.getElementById('reset');
const timer = document.getElementById('timer');

let timeLeft = 1500; // 25 minutes in seconds
let timerInterval;

const updateTimerDisplay = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    timer.innerHTML= '${minutes.toString().padStart(2,"0")}: ${seconds.toString().padStart(2,"0")}';
}

const startTimer = () => {
    if(timerInterval) {
        clearInterval(timerInterval); // Clear any existing interval
    }
    interval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up!");
            timeLeft = 1500; // Reset to 25 minutes
            updateTimerDisplay(); }} , 1000); // Update the timer every second
    }

    const stopTimer = () => clearInterval(timerInterval);

    const resetTimer = () => {
        clearInterval(timerInterval);
        timeLeft = 1500; // Reset to 25 minutes
        updateTimerDisplay();
    }

    start.addEventListener('click', startTimer);
    stop.addEventListener('click', stopTimer);
    reset.addEventListener('click', resetTimer);
    updateTimerDisplay(); // Initial display update