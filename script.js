const bird = document.getElementById("bird");
const pipesContainer = document.getElementById("pipes");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");

let birdTop = 300;
let gravity = 0.5;
let velocity = 0;
let gameInterval;
let pipeInterval;
let pipeIntervals = [];
let score = 0;
let highscore = localStorage.getItem("flappyHighscore") || 0;
let isGameOver = false;

highscoreDisplay.textContent = `High Score: ${highscore}`;

// Jump function
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isGameOver) {
    e.preventDefault();
    velocity = -10;
  }
});

// Mobile tap support
document.addEventListener("click", () => {
  if (!isGameOver) {
    velocity = -10;
  }
});

function updateBird() {
  if (isGameOver) return;

  velocity += gravity;
  birdTop += velocity;
  bird.style.top = `${birdTop}px`;

  // Ground collision
  if (birdTop > 540) {
    endGame();
  }
}

function createPipe() {
  if (isGameOver) return;

  const pipeGap = 150;
  const minHeight = 50;
  const maxHeight = 350;
  const pipeHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;

  const topPipe = document.createElement("div");
  topPipe.className = "pipe";
  topPipe.style.height = `${pipeHeight}px`;
  topPipe.style.top = "0";

  const bottomPipe = document.createElement("div");
  bottomPipe.className = "pipe";
  bottomPipe.style.height = `${600 - pipeHeight - pipeGap}px`;
  bottomPipe.style.bottom = "0";

  pipesContainer.appendChild(topPipe);
  pipesContainer.appendChild(bottomPipe);

  let pipeLeft = 400;
  const pipeMoveInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(pipeMoveInterval);
      return;
    }

    pipeLeft -= 2;
    topPipe.style.left = `${pipeLeft}px`;
    bottomPipe.style.left = `${pipeLeft}px`;

    // Collision detection
    const birdRect = bird.getBoundingClientRect();
    const topPipeRect = topPipe.getBoundingClientRect();
    const bottomPipeRect = bottomPipe.getBoundingClientRect();

    if (
      birdRect.right > topPipeRect.left &&
      birdRect.left < topPipeRect.right &&
      (birdRect.bottom > topPipeRect.bottom || birdRect.top < bottomPipeRect.top)
    ) {
      endGame();
    }

    // Score increment
    if (pipeLeft === 50) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    // Remove pipes when off-screen
    if (pipeLeft < -60) {
      topPipe.remove();
      bottomPipe.remove();
      clearInterval(pipeMoveInterval);
      const index = pipeIntervals.indexOf(pipeMoveInterval);
      if (index > -1) pipeIntervals.splice(index, 1);
    }
  }, 20);

  pipeIntervals.push(pipeMoveInterval);
}

function endGame() {
  if (isGameOver) return;
  isGameOver = true;

  // Clear all intervals
  clearInterval(gameInterval);
  clearInterval(pipeInterval);
  pipeIntervals.forEach(interval => clearInterval(interval));
  pipeIntervals = [];

  // Remove all pipes
  document.querySelectorAll(".pipe").forEach(pipe => pipe.remove());

  // Update highscore
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("flappyHighscore", highscore);
    highscoreDisplay.textContent = `High Score: ${highscore}`;
  }

  // Reset game after alert
  alert(`Game Over! Score: ${score}\nPress OK to restart`);
  resetGame();
}

function resetGame() {
  isGameOver = false;
  birdTop = 300;
  velocity = 0;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  bird.style.top = "300px";
  startGame();
}

function startGame() {
  // Clear existing intervals (if any)
  clearInterval(gameInterval);
  clearInterval(pipeInterval);
  gameInterval = setInterval(updateBird, 20);
  pipeInterval = setInterval(createPipe, 1500);
}

startGame();
