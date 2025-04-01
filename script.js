const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: gridSize, y: 0 };
let food = generateFood();
let score = 0;
let speed = 300; // 默认速度
let gameInterval;
let gameStarted = false;
let gamePaused = false;

const speedLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let currentSpeedIndex = 2; // 默认速度为 3

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("pauseButton").addEventListener("click", pauseGame);
document.getElementById("increaseSpeed").addEventListener("click", () => adjustSpeed(1));
document.getElementById("decreaseSpeed").addEventListener("click", () => adjustSpeed(-1));

// 游戏开始
function startGame() {
    gameStarted = true;
    gamePaused = false;
    document.getElementById("startButton").style.display = "none";
    document.getElementById("pauseButton").style.display = "inline-block";
    document.getElementById("pauseButton").textContent = "暂停游戏";
    document.getElementById("pauseButton").classList.remove("green");
    document.getElementById("pauseButton").classList.add("yellow");

    gameInterval = setInterval(updateGame, speed);
}

// 暂停/继续游戏
function pauseGame() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        clearInterval(gameInterval);
        document.getElementById("pauseButton").textContent = "继续游戏";
        document.getElementById("pauseButton").classList.remove("yellow");
        document.getElementById("pauseButton").classList.add("green");
    } else {
        gameInterval = setInterval(updateGame, speed);
        document.getElementById("pauseButton").textContent = "暂停游戏";
        document.getElementById("pauseButton").classList.remove("green");
        document.getElementById("pauseButton").classList.add("yellow");
    }
}

// 游戏更新逻辑
function updateGame() {
    if (gamePaused) return;

    clearCanvas();
    updateSnake();
    drawFood();
    checkCollision();
}

// 清空画布
function clearCanvas() {
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 绘制蛇
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#e74c3c" : "#f1c40f";
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// 更新蛇的位置
function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        score++;
    } else {
        snake.pop();
    }

    drawSnake();
}

// 绘制食物
function drawFood() {
    ctx.fillStyle = "#27ae60";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// 生成食物
function generateFood() {
    const cols = Math.floor(canvas.width / gridSize);
    const rows = Math.floor(canvas.height / gridSize);

    let x, y;

    do {
        x = Math.floor(Math.random() * cols) * gridSize;
        y = Math.floor(Math.random() * rows) * gridSize;
    } while (
        x >= canvas.width / 2 - 200 && x <= canvas.width / 2 + 200 &&
        y >= canvas.height / 2 - 100 && y <= canvas.height / 2 + 100
    );

    return { x, y };
}

// 检查碰撞
function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

// 游戏结束
function endGame() {
    clearInterval(gameInterval);
    alert(`游戏结束！得分：${score}`);
    resetGame();
}

// 重置游戏
function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: gridSize, y: 0 };
    food = generateFood();
    score = 0;
    document.getElementById("speedValue").textContent = speedLabels[currentSpeedIndex];
    gameStarted = false;
    document.getElementById("startButton").style.display = "inline-block";
    document.getElementById("pauseButton").style.display = "none";
}

// 监听键盘事件
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});

// 调整速度
function adjustSpeed(increment) {
    currentSpeedIndex = Math.min(Math.max(currentSpeedIndex + increment, 0), speedLabels.length - 1);
    const speedMapping = [450, 400, 350, 300, 250, 200, 150, 120, 80];
    speed = speedMapping[currentSpeedIndex];
    document.getElementById("speedValue").textContent = speedLabels[currentSpeedIndex];

    if (gameStarted && !gamePaused) {
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, speed);
    }
}

// 页面加载时初始化
window.onload = () => {
    clearCanvas();
};

// 适配窗口大小变化
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    food = generateFood();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();