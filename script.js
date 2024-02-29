document.addEventListener('DOMContentLoaded', initGame);

const gameArea = document.getElementById("gameArea");
const gameSize = 20;
let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
let apple = {x: 5, y: 5, type: "normal"};
let score = 0;
let startTime = Date.now();
const backgroundColors = ["#111", "#222", "#333", "#444"];

function initGame() {
    window.addEventListener("keydown", changeDirection);
    setInterval(drawGame, 200);
    setInterval(updateTimer, 1000);
    setInterval(changeBackgroundColor, 15000);
    spawnApple(); // Assicurati di spawnare una mela all'inizio
}

function drawGame() {
    gameArea.innerHTML = '';
    snake.forEach(part => {
        const snakeElement = document.createElement("div");
        snakeElement.style.setProperty("--x", part.x);
        snakeElement.style.setProperty("--y", part.y);
        snakeElement.classList.add("snake");
        gameArea.appendChild(snakeElement);
    });

    const appleElement = document.createElement("div");
    appleElement.style.setProperty("--x", apple.x);
    appleElement.style.setProperty("--y", apple.y);
    appleElement.innerHTML = apple.type === "normal" ? "🍎" : "🌟";
    appleElement.classList.add("apple");
    gameArea.appendChild(appleElement);

    moveSnake();
    checkCollision();
    if (snake[0].x === apple.x && snake[0].y === apple.y) {
        eatApple();
    }
}

function changeBackgroundColor() {
    const randomColorIndex = Math.floor(Math.random() * backgroundColors.length);
    document.body.style.backgroundColor = backgroundColors[randomColorIndex];
}

function eatApple() {
    if (apple.type === "golden") {
        for (let i = 0; i < 5; i++) {
            snake.push({ ...snake[snake.length - 1] });
        }
    } else {
        snake.push({ ...snake[snake.length - 1] });
    }
    score += apple.type === "golden" ? 5 : 1;
    document.getElementById("score").textContent = score.toString();
    spawnApple();
}

function spawnApple() {
    apple.x = Math.floor(Math.random() * gameSize) + 1;
    apple.y = Math.floor(Math.random() * gameSize) + 1;
    apple.type = Math.random() > 0.9 ? "golden" : "normal";
}

function moveSnake() {
    const newHead = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    snake.unshift(newHead);
    if (!(snake[0].x === apple.x && snake[0].y === apple.y)) {
        snake.pop();
    }
}

function changeDirection(event) {
    const keyPressed = event.key;
    switch(keyPressed) {
        case "ArrowLeft":
            if (direction.x === 0) direction = {x: -1, y: 0};
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = {x: 1, y: 0};
            break;
        case "ArrowUp":
            if (direction.y === 0) direction = {x: 0, y: -1};
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = {x: 0, y: 1};
            break;
    }
}

function checkCollision() {
    if (snake[0].x < 1 || snake[0].x > gameSize || snake[0].y < 1 || snake[0].y > gameSize || snake.slice(1).some(part => part.x === snake[0].x && part.y === snake[0].y)) {
        alert('Game Over. Score: ' + score);
        snake = [{x: 10, y: 10}];
        direction = {x: 0, y: 0};
        score = 0;
        document.getElementById("score").textContent = score.toString();
        startTime = Date.now();
        spawnApple();
    }
}

function updateTimer() {
    const now = Date.now();
    const diff = now - startTime;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    document.getElementById("timer").textContent = minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}
