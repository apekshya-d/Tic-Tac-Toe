const Player = () => {
  let selectedOption;
  let name;
  const setName = (n) => {
    name = n;
  };
  const getName = () => name;
  const getSelection = () => {
    return selectedOption;
  };
  const setSelection = (selection) => {
    selectedOption = selection;
  };

  return { getName, getSelection, setSelection, setName };
};

const game = (() => {
  const gameboard = [[], [], []];
  const players = [Player(), Player()];
  const firstPlayer = players[0];
  const secondPlayer = players[1];
  let winner;
  let activePlayer = firstPlayer;
  const getActivePlayer = () => activePlayer;
  let getNextPlayer = () => {
    if (activePlayer === firstPlayer) {
      activePlayer = secondPlayer;
    } else {
      activePlayer = firstPlayer;
    }
  };

  const resetGame = () => {
    gameboard.splice(0, 3, [], [], []);
    activePlayer = firstPlayer;
    winner = undefined;
  };

  const checkWinner = () => {
    let isFull = true;
    let isComplete = true;
    let matched;
    const possibilities = [
      [gameboard[0][0], gameboard[0][1], gameboard[0][2]],
      [gameboard[1][0], gameboard[1][1], gameboard[1][2]],
      [gameboard[2][0], gameboard[2][1], gameboard[2][2]],
      [gameboard[0][0], gameboard[1][0], gameboard[2][0]],
      [gameboard[0][1], gameboard[1][1], gameboard[2][1]],
      [gameboard[0][2], gameboard[1][2], gameboard[2][2]],
      [gameboard[0][0], gameboard[1][1], gameboard[2][2]],
      [gameboard[0][2], gameboard[1][1], gameboard[2][0]],
    ];

    for (let i = 0; i < possibilities.length; i++) {
      let value;
      matched = possibilities[i].every((item) => {
        value = item;
        return item === possibilities[i][0];
      });

      isFull = possibilities[i].every((item) => {
        return typeof item === "string";
      });

      if (isFull === false) {
        isComplete = false;
      }

      if (value === "x" && matched && isFull) {
        winner = "x";
        break;
      } else if (value === "o" && matched && isFull) {
        winner = "o";
        break;
      }
    }

    if (isComplete && !matched) {
      winner = "Tie";
    }

    if (winner !== undefined) {
      game.stage = "gameOver";
    }
  };

  let stage;

  const getWinner = () => winner;

  return {
    stage,
    gameboard,
    resetGame,
    firstPlayer,
    getActivePlayer,
    getNextPlayer,
    secondPlayer,
    players,
    checkWinner,
    getWinner,
  };
})();

const displayController = (() => {
  const firstPage = document.querySelector(".firstPage");
  const twoPlayers = document.querySelector("#twoPlayers");
  twoPlayers.addEventListener("click", () => {
    game.stage = "playerSelection";
    render();
  });
  const gamePage = document.querySelector("#gamePage");

  const render = () => {
    switch (game.stage) {
      case "initial":
        gamePage.innerHTML = "";
        firstPage.classList.remove("hide");
        break;

      case "playerSelection":
        gamePage.innerHTML = "";
        const iconSelectMessage = document.createElement("p");
        const playerInputContainer = document.createElement("div");
        playerInputContainer.classList.add("playerInputContainer");
        let playerOne = document.createElement("input");
        playerOne.setAttribute("placeholder", "Player one name");
        playerOne.addEventListener("input", () => {
          let playerOneName = playerOne.value;
          game.firstPlayer.setName(playerOneName);
          if (game.firstPlayer.getName() && game.secondPlayer.getName()) {
            iconSelectMessage.textContent = `${game.firstPlayer.getName()} pick your side:`;
            xoContainer.classList.remove("hide");
          }
        });

        let playerTwo = document.createElement("input");
        playerTwo.setAttribute("placeholder", "Player Two name");
        playerInputContainer.append(playerOne, playerTwo);
        playerTwo.addEventListener("input", () => {
          let playerTwoName = playerTwo.value;
          game.secondPlayer.setName(playerTwoName);
          if (game.firstPlayer.getName() && game.secondPlayer.getName()) {
            iconSelectMessage.textContent = `${game.firstPlayer.getName()} pick your side:`;
            xoContainer.classList.remove("hide");
          }
        });
        const xoContainer = document.createElement("div");
        xoContainer.classList.add("xoContainer");
        const x = document.createElement("button");
        x.textContent = "x";
        const o = document.createElement("button");
        o.textContent = "o";
        xoContainer.classList.add("hide");
        xoContainer.append(x, o);
        const startGameBtnContainer = document.createElement("div");
        const startGameBtn = document.createElement("Button");
        startGameBtn.textContent = "Let's Play";
        startGameBtnContainer.classList.add("hide");
        startGameBtnContainer.classList.add("startGameBtnContainer");
        startGameBtnContainer.appendChild(startGameBtn);
        startGameBtn.addEventListener("click", () => {
          game.stage = "gameMode";
          render();
        });
        x.addEventListener("click", () => {
          game.players[0].setSelection("x");
          game.players[1].setSelection("o");
          startGameBtnContainer.classList.remove("hide");
          x.classList.add("selected");
          o.classList.remove("selected");
        });

        o.addEventListener("click", () => {
          game.players[0].setSelection("o");
          game.players[1].setSelection("x");
          startGameBtnContainer.classList.remove("hide");
          o.classList.add("selected");
          x.classList.remove("selected");
        });
        gamePage.append(
          playerInputContainer,
          iconSelectMessage,
          xoContainer,
          startGameBtnContainer
        );
        break;

      case "gameMode":
        gamePage.innerHTML = "";
        firstPage.classList.add("hide");
        const board = document.createElement("div");
        board.classList.add("board");
        const gameModeBtnContainer = document.createElement("div");
        gameModeBtnContainer.classList.add("gameModeBtnContainer");
        const mainButton = document.createElement("button");
        mainButton.classList.add("mainBtn");
        mainButton.addEventListener("click", () => {
          game.resetGame();
          game.stage = "initial";
          render();
        });
        const replay = document.createElement("button");
        replay.classList.add("replayBtn");
        replay.addEventListener("click", () => {
          game.resetGame();
          game.stage = "gameMode";
          render();
        });

        const playerTurn = document.createElement("p");
        playerTurn.textContent = `It's ${game
          .getActivePlayer()
          .getName()}'s turn`;

        gameModeBtnContainer.append(replay, mainButton);
        gamePage.append(gameModeBtnContainer, playerTurn, board);

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let cell = document.createElement("div");
            board.appendChild(cell);
            cell.textContent = game.gameboard[i][j];
            cell.addEventListener("click", () => {
              if (cell.textContent === "") {
                game.gameboard[i][j] = game.getActivePlayer().getSelection();
                game.getNextPlayer();
                render();
                game.checkWinner();
                render();
              }
            });
          }
        }
        break;
      case "gameOver":
        let existingDialog = document.querySelector(".dialog");
        if (existingDialog) {
          existingDialog.remove();
        }
        const main = document.querySelector(".main");
        const winnerAnnouncement = document.createElement("dialog");
        gamePage.appendChild(winnerAnnouncement);
        winnerAnnouncement.classList.add("dialog");
        main.classList.add("blur");
        winnerAnnouncement.showModal();
        if (game.getWinner() === game.firstPlayer.getSelection()) {
          winnerAnnouncement.textContent = `The winner is ${game.firstPlayer.getName()}`;
        } else if (game.getWinner() === game.secondPlayer.getSelection()) {
          winnerAnnouncement.textContent = `The winner is ${game.secondPlayer.getName()}`;
        } else {
          winnerAnnouncement.textContent = "It's a Tie!";
        }
        winnerAnnouncement.addEventListener("click", () => {
          main.classList.remove("blur");
          winnerAnnouncement.close();
        });
        break;
    }
  };
})();
