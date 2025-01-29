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

function checkCollision(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  // Adjust for 2px border buffer
  return !(
    rect1.right - 2 < rect2.left + 2 ||
    rect1.left + 2 > rect2.right - 2 ||
    rect1.bottom - 2 < rect2.top + 2 ||
    rect1.top + 2 > rect2.bottom - 2
  );
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isGameOver) {
    e.preventDefault();
    velocity = -10;
  }
});

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

  // Ground collision with buffer
  if (birdTop >= 542) {
    console.log("Ground collision detected!");
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
  let scored = false;

  const pipeMoveInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(pipeMoveInterval);
      return;
    }

    pipeLeft -= 2;
    topPipe.style.left = `${pipeLeft}px`;
    bottomPipe.style.left = `${pipeLeft}px`;

    // Check for collision with bird
    if (checkCollision(bird, topPipe) || checkCollision(bird, bottomPipe)) {
      console.log("Pipe collision detected!");
      endGame();
    }

    // Increment score if the bird passes the pipes
    if (!scored && pipeLeft < 50) {
      score++;
      scored = true;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    // Remove pipes when they go off-screen
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

  clearInterval(gameInterval);
  clearInterval(pipeInterval);
  pipeIntervals.forEach(interval => clearInterval(interval));
  pipeIntervals = [];

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
  isGameOver = false;
  birdTop = 300;
  velocity = 0;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  bird.style.top = "300px";
  startGame();
}

function startGame() {
  clearInterval(gameInterval);
  clearInterval(pipeInterval);
  gameInterval = setInterval(updateBird, 20);
  pipeInterval = setInterval(createPipe, 1500);
}

startGame();
