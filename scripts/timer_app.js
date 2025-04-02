const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const timer = document.getElementById("timer");
// const inputMinutes = document.getElementById("input_minutes").value;
const inputMinutesField = document.getElementById("input_minutes"); // Get input field
const setButton = document.getElementById("set_timer");

let timeLeft = 0;
let interval = null;

const updateTimer = () => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timer.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

}

const startTimer = () =>{
    if (interval !== null){
        return;
    }
    interval = setInterval(() =>{
        timeLeft--;
        updateTimer();

        if(timeLeft <= 0){
            clearInterval(interval);
            alert("Time's up! Take a break for 5 minutes or start the timer again :)");
            timeLeft = 0;
            updateTimer();
        }
    }, 1000)
}

const stopTimer = () => {
    if (interval !== null) {
        clearInterval(interval);
        interval = null;
    }
}

const resetTimer = () =>{
        clearInterval(interval);
        timeLeft = 0;
        updateTimer();
        interval = null;
}

const setTimer = (event) => {
    event.preventDefault(); // Prevent form submission (page refresh)
    stopTimer();
    let inputMinutes = parseInt(inputMinutesField.value);
    if (!isNaN(inputMinutes) && inputMinutes > 0) {
        timeLeft = inputMinutes * 60;
    } else {
        alert("Please enter a valid number of minutes.");
    }
    updateTimer();
};

set_timer.addEventListener("click", setTimer);
start.addEventListener("click", startTimer);
stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);
