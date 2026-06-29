const GAME_TIME = 50;
const MOLE_SPEED = 700;

const board = document.getElementById("board");

const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const message = document.getElementById("message");

const playerForm = document.getElementById("playerForm");
const playerInput = document.getElementById("playerName");

const saveButton = document.getElementById("saveName");
const startButton = document.getElementById("start");
const resetRanking = document.getElementById("resetRanking");

let playerName = "";

let score = 0;
let time = GAME_TIME;

let currentHole = -1;
let gameRunning = false;

let moleInterval = null;
let timerInterval = null;

const holes = [];
const moles = [];


for(let i = 0; i < 9; i++){

    const hole = document.createElement("div");
    hole.className = "hole";

    const mole = document.createElement("div");
    mole.className = "mole";

    hole.appendChild(mole);

    hole.addEventListener("click", () => {

        if(!gameRunning) return;

        if(currentHole !== i) return;

        score++;

        scoreText.textContent = score;

        mole.classList.remove("up");

        hole.classList.add("hit");

        setTimeout(() => {

            hole.classList.remove("hit");

        },200);

        currentHole = -1;

    });

    board.appendChild(hole);

    holes.push(hole);

    moles.push(mole);

}


function randomMole(){

    moles.forEach(m => m.classList.remove("up"));

    let next;

    do{

        next = Math.floor(Math.random()*moles.length);

    }while(next === currentHole && moles.length > 1);

    currentHole = next;

    moles[currentHole].classList.add("up");

}


function startGame(){

    clearInterval(moleInterval);
    clearInterval(timerInterval);

    score = 0;
    time = GAME_TIME;

    gameRunning = true;

    scoreText.textContent = score;
    timeText.textContent = time;

    message.innerHTML = "";

    randomMole();

    moleInterval = setInterval(randomMole, MOLE_SPEED);

    timerInterval = setInterval(() => {

        time--;

        timeText.textContent = time;

        if(time <= 0){

            endGame();

        }

    },1000);

}


function endGame(){

    gameRunning = false;

    clearInterval(moleInterval);
    clearInterval(timerInterval);

    moles.forEach(m => m.classList.remove("up"));

    currentHole = -1;

    message.innerHTML = `
        🏆 <strong>${playerName}</strong><br>
        Punteggio: <strong>${score}</strong>
    `;

    saveScore();

    playerForm.style.display = "flex";

    startButton.disabled = true;

    playerInput.focus();

}


function saveScore(){

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.push({

        name: playerName,

        score: score

    });

    ranking.sort((a,b)=>b.score-a.score);

    ranking = ranking.slice(0,10);

    localStorage.setItem("ranking", JSON.stringify(ranking));

    showRanking();

}


function showRanking(){

    const tbody = document.querySelector("#ranking tbody");

    tbody.innerHTML = "";

    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.forEach((player,index)=>{

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index+1}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
        `;

        tbody.appendChild(row);

    });

}



startButton.disabled = true;



saveButton.addEventListener("click", () => {

    const name = playerInput.value.trim();

    if(name.length < 3){

        alert("Inserisci un nome di almeno 3 caratteri.");

        playerInput.focus();

        return;

    }

    playerName = name;

    playerForm.style.display = "none";

    startButton.disabled = false;

});



startButton.addEventListener("click", () => {

    if(playerName === ""){

        alert("Inserisci il tuo nome.");

        playerForm.style.display = "flex";

        playerInput.focus();

        return;

    }

    startButton.disabled = true;

    startGame();

});



resetRanking.addEventListener("click", () => {

    const conferma = confirm(
        "Vuoi eliminare tutta la classifica?"
    );

    if(!conferma){

        return;

    }

    localStorage.removeItem("ranking");

    showRanking();

    message.innerHTML = "🗑 Classifica eliminata!";

    score = 0;

    scoreText.textContent = score;

});



playerInput.addEventListener("keydown", (e) => {

    if(e.key === "Enter"){

        saveButton.click();

    }

});



scoreText.textContent = 0;

timeText.textContent = GAME_TIME;

message.innerHTML = "";



showRanking();
