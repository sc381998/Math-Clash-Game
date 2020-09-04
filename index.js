let dimension = 6;
let currentSum = 0;
let score = 0;
let highScore = 0;
let width = 217;
let target;
let grid = [];
let count = 0;
let music = new Audio("Game-Menu.mp3");

const getStringId = (i, j) => {
  return i.toString() + j.toString();
};

const addCells = () => {
  let arr = [];

  for (let i = 0; i < dimension; i++) {
    let obj = {};
    obj.value = Math.ceil(Math.random() * 9);
    obj.selected = false;
    arr.push(obj);
  }
  // console.log(arr);
  // grid.pop();
  grid.unshift(arr);
};

const updateBoard = () => {
  // console.log(grid);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const el = document.getElementById(getStringId(i, j));
      el.innerHTML = grid[i][j].value;

      if (grid[i][j].value) {
        el.classList.add("bg-gray");
      } else {
        el.classList.remove("bg-gray");
      }
      // el.className = "text-white";
      if (grid[i][j].selected === true) {
        el.classList.add("selected");
      } else if (el.classList.contains("selected")) {
        el.classList.remove("selected");
      }
    }
  }
};

const gameOver = () => {
  // console.log(grid);
  if (grid.length < dimension) {
    return false;
  }
  for (let i = 0; i < dimension; i++) {
    if (grid[dimension - 1][i].value !== "") {
      return true;
    }
  }
  // if(lastRowId1.value !== "" || lastRowId2.value !== "" || lastRowId3.value !== "" || lastRowId4.value !== "" || lastRowId5.value !== "")
  //   return true;
  return false;
};

const startNewGame = () => {
  grid = [];
  width = 217;
  currentSum = 0;
  score = 0;
  music.play();
  document.getElementById("gameOverContainer").classList.add("hide");
  document.getElementById("game").classList.remove("abs");
  let el = document.getElementById("cell-container");
  document.getElementById("board").removeChild(el);
  initBoard();
  startTimer();
};

const startTimer = () => {
  let timerId = setInterval(() => {
    addCells();
    updateBoard();

    if (gameOver()) {
      music.pause();
      let gameOverMusic = new Audio("You-lose-game-over.mp3");
      gameOverMusic.play();

      document.getElementById("game").classList.add("abs");
      document.getElementById("gameOverContainer").classList.remove("hide");
      document.getElementById("score1").innerHTML = score;
      highScore = Math.max(score, highScore);
      document.getElementById("highScore").innerHTML = highScore;

      clearInterval(timerId);
      clearInterval(rectangleTimer);
      // startNewGame();
      return;
    }
  }, 5000);

  let rectangleTimer = setInterval(() => {
    width -= 4.35;
    if (width > 0) {
      let rec = document.getElementById("innerRectangle");
      rec.style.width = width + "px";
    } else {
      width = 217;
    }
  }, 100);
};

const deselectAllSelected = () => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].selected = false;
    }
  }
};

const removeAllSelected = () => {
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j].selected) {
        count++;
        grid[i][j].value = "";
        grid[i][j].selected = false;
      }
    }
  }
  return count;
};

const initTarget = () => {
  target = 10 + Math.ceil(Math.random() * 40);
  document.getElementById("target").innerHTML = target;
};

const updateScore = (score) => {
  document.getElementById("score").innerHTML = score;
};

const upwardshiftBoard = () => {
  console.log(grid);
  for (let i = 0; i < grid.length; i++) {
    let col = "";
    for (let j = 0; j < grid[i].length; j++) {
      col += grid[j][i].value;
    }

    let j = 0;
    for (j = 0; j < col.length; j++) {
      grid[j][i].value = +col.charAt(i);
      //console.log(board[i][c]);
    }
    while (j < grid[i].length) {
      grid[j][i].value = "";
      j++;
    }
  }
  //updateBoard();
};

const handleClick = (cell, i, j) => {
  // console.log(grid);
  if (grid[i][j].value === "") return;
  grid[i][j].selected = !grid[i][j].selected;

  if (grid[i][j].selected) {
    currentSum += grid[i][j].value;
  } else {
    currentSum -= grid[i][j].value;
  }

  if (currentSum > target) {
    let gamealertMusic = new Audio("Wrong-answer-sound-effect.mp3");
    gamealertMusic.play();
    currentSum = 0;
    deselectAllSelected();
  } else if (currentSum === target) {
    let gamewinMusic = new Audio("Video-game-bonus-bell-sound-effect.mp3");
    gamewinMusic.play();
    currentSum = 0;
    let noOfCellsRemoved = removeAllSelected();
    score += noOfCellsRemoved;
    initTarget();
    updateScore(score);
    // upwardshiftBoard();
  }

  document.getElementById("currentSum").innerHTML = currentSum;
  updateBoard();
  // console.log(grid);
};

const initBoard = () => {
  let board = document.getElementById("board");
  let cellContainer = document.createElement("div");
  // cellContainer.className = "d-flex";
  cellContainer.id = "cell-container";
  for (let i = 0; i < dimension; i++) {
    let rowEl = document.createElement("div");
    rowEl.className = " d-flex grid-row";
    for (let j = 0; j < dimension; j++) {
      let cellEl = document.createElement("div");
      cellEl.id = getStringId(i, j);
      cellEl.className = "cell center";
      cellEl.addEventListener("click", () => handleClick(cellEl, i, j));
      rowEl.appendChild(cellEl);
    }
    cellContainer.appendChild(rowEl);
  }

  board.appendChild(cellContainer);
  addCells();
  addCells();
  updateBoard();
  initTarget();
  updateScore(0);
};

const exit = () => {
  window.location.reload();
};

const startGame = () => {
  music.play();
  document.getElementById("game").classList.remove("hide");
  document.getElementById("startPage").classList.add("hide");
  initBoard();
  startTimer();
};

const nextbtn = () => {
  if (count === 0) {
    document.getElementById("mathClashImg").setAttribute("src", "img1.png");
    document.getElementById("rules").innerHTML =
      "If you cross the target value while adding up, you'll have to tap again.";
    count++;
  } else if (count === 1) {
    document.getElementById("rules").innerHTML =
      "You will lose when all the number grid occupies the game space.";
    count++;
    document.getElementById("mathClashImg").setAttribute("src", "img2.png");
    let startBtn = document.getElementById("startButton");
    startBtn.setAttribute("onclick", "startGame()");
    startBtn.innerHTML = "Start Game";
    startBtn.classList.add("bg-orange");
    document.getElementById("skipButton").classList.add("hide");
  } else {
    count = 0;
  }
};
// If you cross the target value while adding up, you'll have to tap again. You will lose when all the number grid occupies the game space.
