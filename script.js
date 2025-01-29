const bird = document.getElementById("bird");
const pipesContainer = document.getElementById("pipes");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");

let birdTop = 250;
let gravity = 0.6;
let velocity = 0;
let gameInterval;
let pipeInterval;
let score = 0;
let highscore = 0;

// Jump function
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    velocity = -10;
  }
});

// Update bird position
function updateBird() {
  velocity += gravity;
  birdTop += velocity;
  bird.style.top = birdTop + "px";

  // Check for collision with ground or sky
  if (birdTop < 0 || birdTop > 560) {
    endGame();
  }
}

// Create pipes
function createPipe() {
  const pipeGap = 150;
  const pipeHeight = Math.floor(Math.random() * (400 - 100)) + 100;

  const topPipe = document.createElement("div");
  topPipe.className = "pipe";
  topPipe.style.height = pipeHeight + "px";
  topPipe.style.top = "0";
  topPipe.style.left = "400px";

  const bottomPipe = document.createElement("div");
  bottomPipe.className = "pipe";
  bottomPipe.style.height = (600 - pipeHeight - pipeGap) + "px";
  bottomPipe.style.bottom = "0";
  bottomPipe.style.left = "400px";

  pipesContainer.appendChild(topPipe);
  pipesContainer.appendChild(bottomPipe);

  // Move pipes
  let pipeLeft = 400;
  const pipeMoveInterval = setInterval(() => {
    pipeLeft -= 2;
    topPipe.style.left = pipeLeft + "px";
    bottomPipe.style.left = pipeLeft + "px";

    // Check for collision with bird
    if (
      pipeLeft < 90 &&
      pipeLeft > 50 &&
      (birdTop < pipeHeight || birdTop > pipeHeight + pipeGap - 40)
    ) {
      endGame();
    }

    // Remove pipes when they go off screen
    if (pipeLeft < -60) {
      clearInterval(pipeMoveInterval);
      pipesContainer.removeChild(topPipe);
      pipesContainer.removeChild(bottomPipe);
      score++;
      scoreDisplay.textContent = "Score: " + score;
    }
  }, 20);
}

// End game
function endGame() {
  clearInterval(gameInterval);
  clearInterval(pipeInterval);
  alert("Game Over! Your score: " + score);

  // Update highscore
  if (score > highscore) {
    highscore = score;
    highscoreDisplay.textContent = "High Score: " + highscore;
  }

  // Reset game
  score = 0;
  scoreDisplay.textContent = "Score: " + score;
  birdTop = 250;
  bird.style.top = birdTop + "px";
  pipesContainer.innerHTML = "";
  startGame();
}

// Start game
function startGame() {
  gameInterval = setInterval(updateBird, 20);
  pipeInterval = setInterval(createPipe, 2000);
}

startGame();
