const start = document.getElementById('start');
const stopTime = document.getElementById('stop');   
const reset = document.getElementById('reset');
const timer = document.getElementById('timer');

let timeLeft = 1500; // 25 minutes in seconds
let timerInterval;
let count = 0;

const updateTimerDisplay = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    timer.innerHTML = `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}

const startTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval); // Clear any existing interval
    }
    count++;
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if(count % 2 === 0) {
            if(timeLeft <= 0) {
                clearInterval(timerInterval);
                alert("Break time is over! Back to work!");
                timeLeft = 1500; // Reset to 25 minutes
                updateTimerDisplay();
            }
        }else{
            if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Take a break!");
            timeLeft = 300; // Reset to 5 minutes
            updateTimerDisplay();
            
        }
        }
        
    }, 1000); // Update the timer every second
}

const stopTimer = () => clearInterval(timerInterval);

const resetTimer = () => {
    clearInterval(timerInterval);
    timeLeft = 1500; // Reset to 25 minutes
    updateTimerDisplay();
}
document.querySelector( "#retrobg-sun" ).onclick = () => {
	document.querySelector( "#retrobg" ).classList.toggle( "retrobg-shutdown" );
};

start.addEventListener('click', startTimer);
stopTime.addEventListener('click', stopTimer);
reset.addEventListener('click', resetTimer);
updateTimerDisplay(); // Initial display update