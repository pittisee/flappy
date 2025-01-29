const bird = document.getElementById("bird");
const pipesContainer = document.getElementById("pipes");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");

let birdTop = 300;
let gravity = 0.5;
let velocity = 0;
let gameInterval;
let pipeInterval;
let score = 0;
let highscore = localStorage.getItem("flappyHighscore") || 0;
let isGameOver = false; // New flag to prevent multiple game overs

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
  if (isGameOver) return; // Don't update if game is over

  velocity += gravity;
  birdTop += velocity;
  bird.style.top = `${birdTop}px`;

  // Ground collision
  if (birdTop > 560) {
    endGame();
  }
}

function createPipe() {
  if (isGameOver) return; // Don't create pipes if game is over

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
    if (
      pipeLeft < 90 && 
      pipeLeft > 50 &&
      (birdTop < pipeHeight || birdTop > pipeHeight + pipeGap - 40)
    ) {
      endGame();
    }

    // Score increment
    if (pipeLeft === 50) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    // Remove pipes
    if (pipeLeft < -60) {
      topPipe.remove();
      bottomPipe.remove();
      clearInterval(pipeMoveInterval);
    }
  }, 20);
}

function endGame() {
  if (isGameOver) return; // Prevent multiple triggers
  isGameOver = true;

  clearInterval(gameInterval);
  clearInterval(pipeInterval);
  document.querySelectorAll(".pipe").forEach(pipe => pipe.remove());

  if (score > highscore) {
    highscore = score;
    localStorage.setItem("flappyHighscore", highscore);
    highscoreDisplay.textContent = `High Score: ${highscore}`;
  }

  alert(`Game Over! Score: ${score}\nPress OK to restart`);
  resetGame();
}

function resetGame() {
  isGameOver = false; // Reset the flag
  birdTop = 300;
  velocity = 0;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  bird.style.top = "300px";
  startGame();
}

function startGame() {
  gameInterval = setInterval(updateBird, 20);
  pipeInterval = setInterval(createPipe, 1500);
}

startGame();
