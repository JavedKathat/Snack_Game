const playBoard = document.querySelector(".play-board");
const scoreEl= document.querySelector(".score");
const highScoreEl= document.querySelector(".high-score");
const control = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 10, snakeY = 11;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;

const changeFoodPosition = () => {
    //Passing a random 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay.....");
    location.reload();
}

const changeDirection = (e ) => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1
    }else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0; 
    }
    else if (e.key === "ArrowRight" && velocityX != - 1) {
        velocityX = 1;
        velocityY = 0;
    }
}

control.forEach(key => {
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
})

const initGame = () => {
    if (gameOver) return handleGameOver();
    
    let htmlMArkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}" ></div>`;

    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push ([foodX, foodY]);
        score++;

        highScore = score >= highScore  ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreEl.innerHTML = `Score: ${score}`;
        highScoreEl.innerHTML = `High-Score: ${score}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        //shifting forward the value of the elements in the snake body by one
        snakeBody[i] = snakeBody[i -  1];
    }

    snakeBody[0] = [snakeX, snakeY]; //setting first element of snake body to current snake position

    //Updating the snke's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <=0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        //Adding a div for each part of the snake's body
        // htmlMArkup += `<div class="head" style="grid-area: ${snakeY} / ${snakeX}" ></div>`;
        htmlMArkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}" ></div>`;
        
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMArkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);