document.addEventListener("DOMContentLoaded", () => {
  const startPopup = document.getElementById("startPopup");
  const chooseVehicle = document.getElementById("chooseVehicle");
  const vsBotBtn = document.getElementById("vsBotBtn");
  const carBtn = document.getElementById("carBtn");
  const bikeBtn = document.getElementById("bikeBtn");
  const vsFriendBtn = document.getElementById("vsFriendBtn");
  const game = document.getElementById("game");
  const board = document.getElementById("board");
  const infoIcon = document.getElementById("infoIcon");
  const infoPopup = document.getElementById("infoPopup");
  const closeInfo = document.getElementById("closeInfo");
  const resultPopup = document.getElementById("resultPopup");
  const resultMessage = document.getElementById("resultMessage");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const turnText = document.getElementById("turnText");
  const h2 = document.querySelector("#startPopup h2");

  let currentPlayer;
  let gameMode;
  let playerIcon;
  let botIcon;
  let boardState;
  let gameFinished = false;

  // Random Car Facts 
  const carFacts = [
    "The average car has more than 100 miles of code in the vehicle’s internal computer.",
    "The average person spends nearly two weeks of their life sitting at red lights.",
    "It would take nearly a month to drive to the moon at 60 MPH.",
    "In the United States, a car is stolen every 45 seconds.",
    "The most popular car color is white. The least favorite color is purple.",
    "The average car spends about 95% of its life parked.",
    "It is predicted that by 2030, one in ten cars will be self-driving.",
    "The first car was built in 1885 by Karl Benz.",
    "There are more than one billion cars in use worldwide.",
    "The average car has over 30,000 parts.",
  ];

  // Random Bike Facts 
  const bikeFacts = [
    "About 15 bikes can fit in the same area of a single car. That saves a lot of parking space!",
    "Wearing a helmet reduces the risk of head injury by 85%.",
    "In 1887, Yamaha started as a piano manufacturer, but today it is also a major motorcycle producer.",
    "The longest motorcycle journey took over 10 years, covering 457,000 miles across 232 countries.",
    "On average, motorcycles are about twice as fuel efficient as cars.",
    "The famous Japanese motorcycle manufacturer, Kawasaki, constructs ships, power factories, industrial tools, robots, and spacecraft as well.",
    "The world's longest motorcycle is 31 feet long and can accommodate 16 riders.",
    "The first constructed bike was almost entirely made of wood.",
    "A bike can stay upright without a rider as long as it’s moving at 8 mph or faster.",
  ];

  // Function to initialize the game to original state
  function init() {
    startPopup.classList.remove("hidden");
    chooseVehicle.classList.add("hidden");
    game.classList.add("hidden");
    resultPopup.classList.add("hidden");
    gameFinished = false;
    turnText.style.display = "inline";
    vsBotBtn.style.opacity = "100%";
    h2.innerText = "Choose Game Mode";
  }

  // Function to start the game
  function startGame(mode) {
    gameMode = mode;
    startPopup.classList.add("hidden");
    vsFriendBtn.classList.remove("hidden");
    chooseVehicle.classList.add("hidden");
    game.classList.remove("hidden");
    infoPopup.classList.add("hidden");
    resultPopup.classList.add("hidden");
    initGame();
  }

  // Function to initialize game variables
  function initGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "player1";
    render();
    if (gameMode === "bot" && currentPlayer === "player2") {
      setTimeout(() => {
        botMove();
      }, 500);
    }
  }

  // Function to render the game board
  function render() {
    board.innerHTML = "";
    boardState.forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.dataset.index = index;
      if (cell === "car") {
        cellDiv.innerHTML = '<img src="img/car.png" alt="Car">';
      } else if (cell === "bike") {
        cellDiv.innerHTML = '<img src="img/bike.png" alt="Bike">';
      }
      cellDiv.addEventListener("click", handleCellClick);
      board.appendChild(cellDiv);
    });
    displayTurn();
  }

  // Function to handle cell clicks
  function handleCellClick(e) {
    if (gameFinished) return;
    const selectedIndex = e.target.dataset.index;
    if (boardState[selectedIndex] === "" && currentPlayer === "player1") {
      boardState[selectedIndex] = playerIcon;
      currentPlayer = "player2";
      render();
      if (checkWin(playerIcon)) {
        const fact =
          playerIcon === "car"
            ? carFacts[Math.floor(Math.random() * carFacts.length)]
            : bikeFacts[Math.floor(Math.random() * bikeFacts.length)];
        showResult(
          `Player riding ${
            playerIcon === "car" ? "Car" : "Bike"
          } won the race!`,
          fact
        );
      } else if (checkDraw()) {
        showResult("It's a tie! Both players played well.", "");
      }
      if (gameMode === "bot") {
        setTimeout(() => {
          botMove();
        }, 500);
      }
    } else if (
      gameMode === "friend" &&
      boardState[selectedIndex] === "" &&
      currentPlayer === "player2"
    ) {
      boardState[selectedIndex] = botIcon;
      currentPlayer = "player1";
      render();
      if (checkWin(botIcon)) {
        const fact =
          botIcon === "car"
            ? carFacts[Math.floor(Math.random() * carFacts.length)]
            : bikeFacts[Math.floor(Math.random() * bikeFacts.length)];
        showResult(
          `Player riding ${botIcon === "car" ? "Car" : "Bike"} won the race!`,
          fact
        );
      } else if (checkDraw()) {
        showResult("It's a tie! Both players played well.", "");
      }
    }
  }

  // Function to check for a win
  function checkWin(icon) {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];
    const win = winConditions.find((combination) => {
      return combination.every((index) => boardState[index] === icon);
    });
    if (win) {
      win.forEach((index) => {
        board.children[index].style.backgroundColor = "lightgreen";
      });
      return true;
    }
    return false;
  }

  // Function to check for a draw
  function checkDraw() {
    return boardState.every((cell) => cell !== "");
  }

  // Function to display whose turn it is
  function displayTurn() {
    if (currentPlayer === "player1") {
      turnText.innerHTML = `Player <b>${
        playerIcon === "car" ? "Car" : "Bike"
      }</b> turn`;
    } else {
      turnText.innerHTML = `Player <b>${
        botIcon === "car" ? "Car" : "Bike"
      }</b> turn`;
    }
  }

  // Function to show the result popup
  function showResult(message, fact) {
    gameFinished = true;
    resultMessage.innerHTML = `${message}  <p> Made By Raghvendra Singh</p> `;
    resultPopup.classList.remove("hidden");
    turnText.style.display = "none"; //my change
  }
  // Function to make a move for the bot
  function botMove() {
    if (gameFinished) return;
    const emptyCells = boardState.reduce((acc, cell, index) => {
      if (cell === "") acc.push(index);
      return acc;
    }, []);
    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    boardState[randomIndex] = botIcon;
    currentPlayer = "player1";
    render();
    if (checkWin(botIcon)) {
      showResult(
        `Player riding ${botIcon === "car" ? "car" : "bike"} won the race!`
      );
    } else if (checkDraw()) {
      showResult("It's a draw!");
    }
  }

  // Event listener for starting the game with bot
  vsBotBtn.addEventListener("click", () => {
    vsBotBtn.style.opacity = "50%";
    h2.innerText = "Game Mode:";
    chooseVehicle.classList.remove("hidden");
    vsFriendBtn.classList.add("hidden");
  });

  // Event listener for selecting vehicle
  carBtn.addEventListener("click", () => {
    playerIcon = "car";
    botIcon = "bike";
    startGame("bot");
  });

  bikeBtn.addEventListener("click", () => {
    playerIcon = "bike";
    botIcon = "car";
    startGame("bot");
  });

  // Event listener for starting the game with a friend
  vsFriendBtn.addEventListener("click", () => {
    playerIcon = "car"; // Default
    botIcon = "bike";
    startGame("friend");
  });

  // Event listener for info icon
  infoIcon.addEventListener("click", () => {
    infoPopup.classList.remove("hidden");
  });

  // Event listener for closing the info popup
  closeInfo.addEventListener("click", () => {
    infoPopup.classList.add("hidden");
  });

  // Event listener for play again button
  playAgainBtn.addEventListener("click", () => {
    init();
  });

  // Initialize the game
  init();
});
