// зминни
let score = 0;
let isGameRunning = false;
let gameInterval;
let enemies = [];
let playerPosition = 50;
let soundOn = true;

// елементы
const startButton = document.getElementById('startGame');
const instructionsButton = document.getElementById('instructions');
const creditsButton = document.getElementById('credits');
const exitButton = document.getElementById('exit');
const mainMenu = document.getElementById('mainMenu');
const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');
const statusText = document.getElementById('statusText');
const bgMusic = document.getElementById('bgMusic');
const soundToggle = document.getElementById('soundToggle');

soundToggle.addEventListener('click', function() {
  soundOn = !soundOn;
  if (soundOn) {
    bgMusic.play();
    soundToggle.innerText = 'SOUND: ON';
  } else {
    bgMusic.pause();
    soundToggle.innerText = 'SOUND: OFF';
  }
});

window.addEventListener('load', function() {
  if (soundOn) {
    bgMusic.volume = 0.3;
    bgMusic.play();
  }
  
  generateRandomText();
});

function generateRandomText() {
  if (!isGameRunning) {
    const phrases = [
      "SCANNING NETWORK...",
      "FIREWALL BYPASSED.",
      "SYSTEM SECURE.",
      "CHECKING PROTOCOLS...",
      "DATA STREAM ACTIVE.",
      "MISSION PARAMETERS LOADED.",
      "AWAITING DEPLOYMENT...",
      "SYSTEM READY."
    ];
    
    statusText.innerText = phrases[Math.floor(Math.random() * phrases.length)];
    setTimeout(generateRandomText, 3000);
  }
}

document.addEventListener('keydown', function(e) {
  if (!isGameRunning) return;
  
  if (e.key === 'ArrowLeft' && playerPosition > 10) {
    playerPosition -= 5;
  } else if (e.key === 'ArrowRight' && playerPosition < 90) {
    playerPosition += 5;
  }
  
  player.style.left = playerPosition + '%';
});

gameArea.addEventListener('mousemove', function(e) {
  if (!isGameRunning) return;
  
  const rect = gameArea.getBoundingClientRect();
  const relativePosition = (e.clientX - rect.left) / rect.width * 100;
  
  if (relativePosition >= 5 && relativePosition <= 95) {
    playerPosition = relativePosition;
    player.style.left = playerPosition + '%';
  }
});

gameArea.addEventListener('touchmove', function(e) {
  if (!isGameRunning) return;
  e.preventDefault();
  
  const rect = gameArea.getBoundingClientRect();
  const relativePosition = (e.touches[0].clientX - rect.left) / rect.width * 100;
  
  if (relativePosition >= 5 && relativePosition <= 95) {
    playerPosition = relativePosition;
    player.style.left = playerPosition + '%';
  }
});

startButton.addEventListener('click', function() {
  mainMenu.style.display = 'none';
  gameArea.style.display = 'block';
  statusText.innerText = "MISSION ACTIVE - DEFEND THE SYSTEM";
  isGameRunning = true;
  score = 0;
  scoreDisplay.innerText = score;
  gameOverDisplay.style.display = 'none';
  
  gameInterval = setInterval(function() {
    spawnEnemy();
    if (score > 10 && Math.random() > 0.5) {
      spawnEnemy();
    }
  }, 1000);
});


function spawnEnemy() {
const enemy = document.createElement('div');
enemy.className = 'enemy';


const randomPosition = Math.random() * 90 + 5;
enemy.style.left = randomPosition + '%';

gameArea.appendChild(enemy);

let enemyInterval = setInterval(function() {
if (!isGameRunning) {
  clearInterval(enemyInterval);
  if (enemy.parentNode === gameArea) {
    enemy.remove();
  }
  return;
}


const playerRect = player.getBoundingClientRect();
const enemyRect = enemy.getBoundingClientRect();

if (enemyRect.bottom >= gameArea.getBoundingClientRect().bottom - 10) {
  clearInterval(enemyInterval);
  
  const collision = !(
    playerRect.right < enemyRect.left || 
    playerRect.left > enemyRect.right || 
    playerRect.bottom < enemyRect.top || 
    playerRect.top > enemyRect.bottom
  );
  
  if (collision) {
    score++;
    scoreDisplay.innerText = score;
    enemy.remove();
  } else {
    enemy.remove();
    gameOver();
  }
}
}, 50);

setTimeout(function() {
clearInterval(enemyInterval);
if (enemy.parentNode === gameArea) {
  enemy.remove();
}
}, 5000);
}

function gameOver() {
  isGameRunning = false;
  clearInterval(gameInterval);
  gameOverDisplay.style.display = 'block';
  statusText.innerText = "MISSION FAILED - SYSTEM COMPROMISED";
  
  const allEnemies = document.querySelectorAll('.enemy');
  allEnemies.forEach(enemy => enemy.remove());
  
  setTimeout(function() {
    gameArea.style.display = 'none';
    mainMenu.style.display = 'flex';
    gameOverDisplay.style.display = 'none';
  }, 3000);
}

instructionsButton.addEventListener('click', function() {
  statusText.innerText = "USE ARROW KEYS OR MOUSE TO MOVE. INTERCEPT INCOMING THREATS.";
  setTimeout(function() {
    statusText.innerText = "SYSTEM READY. AWAITING COMMAND.";
  }, 5000);
});

creditsButton.addEventListener('click', function() {
  statusText.innerText = "DEVELOPED BY PROGCRAFTERQ - VERSION 2.0";
  setTimeout(function() {
    statusText.innerText = "SYSTEM READY. AWAITING COMMAND.";
  }, 5000);
});

exitButton.addEventListener('click', function() {
  statusText.innerText = "SHUTTING DOWN SYSTEM...";
  
  document.body.style.opacity = 0.8;
  setTimeout(function() {
    document.body.style.opacity = 0.5;
  }, 500);
  setTimeout(function() {
    document.body.style.opacity = 0.2;
  }, 1000);
  setTimeout(function() {
    document.body.style.opacity = 1;
    statusText.innerText = "SYSTEM REBOOT COMPLETE. AWAITING COMMAND.";
  }, 1500);
});
