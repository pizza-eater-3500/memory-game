const startButton = document.querySelector("#startButton")
const resetButton = document.querySelector("#resetButton")
const buttons = document.querySelectorAll(".buttons")
const playerHighScoreText = document.querySelector("#player-high-score-text")

const originalColors = {
    "top-left": document.querySelector("#top-left").style.backgroundColor,
    "top-right": document.querySelector("#top-right").style.backgroundColor,
    "bottom-left": document.querySelector("#bottom-left").style.backgroundColor,
    "bottom-right": document.querySelector("#bottom-right").style.backgroundColor,
}

const afterColors = {
    "top-left": "#a2ff7a",
    "top-right": "#ff837a",
    "bottom-left": "#f7fcc7",
    "bottom-right": "#7adeff"
}

const possibleButtons = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
]

let intervalId;
let buttonsChose = []
let finishedClicking = true
let playerIndex = 0;
let high_score = 0
let currentScore = 0 

const playBeepSound = () => {
    const audio = new Audio("beep.mp3")
    audio.play()
}

const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const deleteCookie = (cname) => {
    setCookie(cname, null, null)
}

const updateHighScore = () => {
    playerHighScoreText.textContent = "High Score: " + high_score
}

function changeColor(element, color) {
    element.style.backgroundColor = color
}

function selectRandomButton() {
    return possibleButtons[Math.floor(Math.random() * possibleButtons.length)]
}

function removeButtonEventListeners() {
    for (button of buttons) {
        button.removeEventListener("click", playerClicked)
    }
}

function reset() {
    removeButtonEventListeners()
    playerIndex = 0
    currentScore += 1
    if (currentScore > high_score) {
        high_score += 1
        updateHighScore()
        setCookie("high-score", high_score, 365)
    }
    computerTurn()
}

const gameReset = () => {
    buttonsChose = []
    resetButton.disabled = true
    startButton.disabled = false
    removeButtonEventListeners()
    playerIndex = 0
    currentScore = 0
    if (document.getElementById("failed-text")) {
        document.body.removeChild(document.getElementById("failed-text"))
    }
}

function playerClicked() {
    playBeepSound()
    if (playerIndex < buttonsChose.length) {
        if (finishedClicking) {
            finishedClicking = false
            const correctButton = buttonsChose[playerIndex]

            changeColor(this, afterColors[this.id])
            setTimeout(() => {
                finishedClicking = true
                changeColor(this, originalColors[this.id])
            }, 500)

            if (correctButton == this) {
                playerIndex += 1
                if (playerIndex == buttonsChose.length) {
                    reset()
                }
            }
            else {
                playerFailed()
                removeButtonEventListeners()
            }
        }
    }
    else {
        reset()
    }
}

function displayGameOver(){
    const failedText = document.createElement("h1")
    failedText.textContent = "You failed!"
    failedText.id = "failed-text"
    document.body.appendChild(failedText)
}

function playerFailed() {
    console.log("Player failed.")

    resetButton.disabled = false
    displayGameOver()
}

const playerTurn = () => {
    for (button of buttons) {
        button.addEventListener("click", playerClicked)
    }
}

const computerTurn = () => {
    console.log(document.cookie)
    setTimeout(() => {
        let computerIndex = 0

        const randomButtonId = selectRandomButton()
        const randomButtonElement = document.getElementById(randomButtonId)
        buttonsChose.push(randomButtonElement)

        intervalId = setInterval(() => {
            const currentButton = buttonsChose[computerIndex]
            if (computerIndex < buttonsChose.length) {
                playBeepSound()
                changeColor(currentButton, afterColors[currentButton.id])
                setTimeout(() => {
                    changeColor(currentButton, originalColors[currentButton.id])
                    computerIndex += 1
                }, 500)
            }
            else {
                playerTurn()
                clearInterval(intervalId)
            }
        }, 1000);
    }, 1000);
}

function startGame() {
    console.log("Game starting.")
    startButton.disabled = true
    resetButton.disabled = true
    computerTurn()
}

if (getCookie("high-score")){
    high_score = Number(getCookie("high-score"))
    updateHighScore()
}
else {
    setCookie("high-score", 0, 365)
}

startButton.addEventListener("click", startGame)
resetButton.addEventListener("click", gameReset)