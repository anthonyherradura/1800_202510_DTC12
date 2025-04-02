const start = document.getElementById("start")
const stop = document.getElementById("stop")
const reset = document.getElementById("reset")
const timer = document.getElementById("timer")

let timeLeft = 1500;
let interval = null;

const updateTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timer.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

}

const startTimer = () =>{
    if (interval !== null){
        return;
    }
    interval = setInterval(() =>{
        timeLeft--;
        updateTimer();

        if(timeLeft === 0){
            clearInterval(interval);
            alert("Time's up! Take a break for 5 minutes or start the timer again :)");
            timeLeft = 1500;
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
        timeLeft = 1500;
        updateTimer();
        interval = null;
}

start.addEventListener("click", startTimer);
stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);
