// Declaring variables
let isJumping = false;
let upTime, downTime;
let btn = document.getElementsByClassName("start-btn")[0];
let btnReplay = document.getElementsByClassName("btn-replay")[0];
let startBox = document.getElementById("start-box");

// GameOvervariables
let gameoverbox = document.getElementById("gameover");
let gameover = false;

// Getting character and its styling property values
let character = document.getElementById("character");
let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
let characterRight = parseInt(window.getComputedStyle(character).getPropertyValue('right'));
let characterWidth = parseInt(window.getComputedStyle(character).getPropertyValue('width'));

// Getting ground and its styling property values
let ground = document.getElementById("ground");
let groundBottom = parseInt(window.getComputedStyle(ground).getPropertyValue('bottom'));
let groundheight = parseInt(window.getComputedStyle(ground).getPropertyValue('height'));


btn.addEventListener("click", () => {



  startBox.style.display = "none";
  character.style.animation = "animateball 1.2s linear infinite";

  // generating and moving the obstacles
  function generateObstacle() {
    let obstacles = document.querySelector(".obstacles");
    let obstacle = document.createElement("div");
    obstacle.setAttribute("class", "obstacle");
    obstacles.appendChild(obstacle);

    let obstacleRight = -30;
    let obstacleBottom = 100;
    let obstacleWidth = 30;
    let obstacleHeight = Math.floor(Math.random() * 50) + 50;
    let randomTimeOut = Math.floor(Math.random() * 1100) + 1000;
    obstacle.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`

    // Moving the obstacles
    function moveObstacle() {
      if (!gameover) {
        obstacleRight += 5;
      }
      obstacle.style.right = obstacleRight + "px";
      obstacle.style.bottom = obstacleBottom + "px";
      obstacle.style.height = obstacleHeight + "px";
      obstacle.style.width = obstacleWidth + "px";

      // Game Over Logic
      if (characterRight - 2 > obstacleRight - characterWidth && characterRight < obstacleRight + obstacleWidth && characterBottom < obstacleBottom + obstacleHeight) {
        // Saving High Scores in Local Storage
        if (score > hiscoreval) {
          hiscoreval = score;
          localStorage.setItem("HighScore", JSON.stringify(hiscoreval));
        }
        gameover = true;
        character.style.animation = "none";
        gameoverbox.style.display = "flex";

        // setTimeout(() => {
          // }, 2500);
          btnReplay.addEventListener("click",()=>{
            location.reload();
        })
      }

    }

    let obstacleInterval = setInterval(moveObstacle, 20);
    let obstacleTimeOut = setTimeout(generateObstacle, randomTimeOut)

    if (gameover) {
      clearInterval(obstacleInterval);
      clearTimeout(obstacleTimeOut);
    }

  }

  if (!gameover) {
    generateObstacle();
  }

  // generating and moving Clouds
  function generateCloud() {
    let clouds = document.querySelector(".clouds");
    let cloud = document.createElement("img");
    cloud.setAttribute("class", "cloud");
    cloud.setAttribute("src", "images/cloud.png");
    clouds.appendChild(cloud);

    // Moving Cloud
    let cloudtop = Math.floor(Math.random() * 100);
    let cloudRight = -100;

    function moveCloud() {
      if (!gameover) {
        cloudRight += 5;
      }
      cloud.style.top = cloudtop + "px";
      cloud.style.right = cloudRight + "px";
    }

    let cloudInterval = setInterval(moveCloud, 20);
    let cloudTimeOut = setTimeout(generateCloud, Math.floor(Math.random() * 1200) + 1000)

    if (gameover) {
      clearInterval(cloudInterval);
      clearTimeout(cloudTimeOut);
    }

  }

  if (!gameover) {
    generateCloud();
  }

  // Jumping Logic
  function jump() {
    if (isJumping) return
    upTime = setInterval(() => {
      if (characterBottom >= groundheight + 250) {
        clearInterval(upTime);
        downTime = setInterval(() => {
          if (characterBottom <= groundheight + 5) {
            clearInterval(downTime);
            isJumping = false;
          }
          if (!gameover) {
            characterBottom -= 5;
          }
          character.style.bottom = characterBottom + 'px';

        }, 10);
      }
      if (!gameover) {
        characterBottom += 5;
      }
      character.style.bottom = characterBottom + 'px';
      isJumping = true;
    }, 10);
  }
  setTimeout(() => {
    
    document.body.addEventListener("click", () => {
      jump();
    })
  }, 100);
  function control(e) {
    if (e.key == 'ArrowUp' || e.key == ' ') {
      jump();
    }
  }

  document.addEventListener("keydown", control);

  // Displaying Game Score and saving high scores
  let score = 0;
  function showScore() {
    if (!gameover) {
      score++;
    }
    displayScore.innerText = `Score: ${score}`;
  }
  setInterval(showScore, 100);
});

// This is out of the function to display the high scores when the game is not started yet
let displayScore = document.getElementById("score");
let displayHighScore = document.getElementById("highscore");
let highScore = localStorage.getItem("HighScore");
if (highScore === null) {
  hiscoreval = 0;
  localStorage.setItem("HighScore", JSON.stringify(0))
} else {
  hiscoreval = JSON.parse(highScore);
  displayHighScore.innerHTML = `High Score: ${hiscoreval}`;
}