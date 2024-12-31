const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const turtle = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    color: "green",
    speed: 5,
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
};

const obstacles = [];
const obstacleTypes = [
    { color: "red", width: 50, height: 30, speed: 3 }, // Birds
    { color: "brown", width: 80, height: 40, speed: 2 }, // Alligators
    { color: "white", width: 30, height: 20, speed: 4 }, // Fish
];

function createObstacle() {
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const yPosition = Math.random() * (canvas.height - 400) + 200;
    const direction = Math.random() > 0.5 ? 1 : -1;

    obstacles.push({
        x: direction === 1 ? -type.width : canvas.width,
        y: yPosition,
        width: type.width,
        height: type.height,
        speed: type.speed * direction,
        color: type.color,
    });
}

function drawObstacles() {
    obstacles.forEach((obstacle) => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.x += obstacle.speed;

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0 || obstacle.x > canvas.width) {
            obstacles.splice(index, 1);
        }

        // Check collision with turtle
        if (
            turtle.x < obstacle.x + obstacle.width &&
            turtle.x + turtle.width > obstacle.x &&
            turtle.y < obstacle.y + obstacle.height &&
            turtle.y + turtle.height > obstacle.y
        ) {
            alert("Game Over!");
            document.location.reload();
        }
    });
}

let keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function moveTurtle() {
    if (keys["ArrowUp"]) turtle.y -= turtle.speed;
    if (keys["ArrowDown"]) turtle.y += turtle.speed;
    if (keys["ArrowLeft"]) turtle.x -= turtle.speed;
    if (keys["ArrowRight"]) turtle.x += turtle.speed;

    // Keep turtle within bounds
    turtle.x = Math.max(0, Math.min(canvas.width - turtle.width, turtle.x));
    turtle.y = Math.max(0, Math.min(canvas.height - turtle.height, turtle.y));
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = "#228B22"; // Grass
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1E90FF"; // River
    ctx.fillRect(0, 200, canvas.width, 200);

    // Draw turtle
    turtle.draw();

    // Update and draw obstacles
    updateObstacles();
    drawObstacles();

    // Move turtle
    moveTurtle();

    requestAnimationFrame(gameLoop);
}

// Generate obstacles periodically
setInterval(createObstacle, 1500);

// Start the game loop
gameLoop();
