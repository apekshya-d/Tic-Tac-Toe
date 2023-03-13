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
  let activePlayer;
  let getActivePlayer = () => {
    if (activePlayer === firstPlayer) {
      activePlayer = secondPlayer;
    } else {
      activePlayer = firstPlayer;
    }
    return activePlayer;
  };

  const resetGame = () => {
    gameboard.splice(0, 3, [], [], []);
    activePlayer = undefined;
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
        const iconSelectMessage = document.createElement("p");
        let playerOne = document.createElement("input");
        playerOne.setAttribute("placeholder", "Player one name");
        playerOne.addEventListener("input", () => {
          let playerOneName = playerOne.value;
          game.firstPlayer.setName(playerOneName);
          if (game.firstPlayer.getName() && game.secondPlayer.getName()) {
            iconSelectMessage.textContent = `${game.firstPlayer.getName()} choose one:`;
            x.classList.remove("hide");
            o.classList.remove("hide");
          }
        });

        let playerTwo = document.createElement("input");
        playerTwo.setAttribute("placeholder", "Player Two name");
        gamePage.append(playerOne, playerTwo);
        playerTwo.addEventListener("input", () => {
          let playerTwoName = playerTwo.value;
          game.secondPlayer.setName(playerTwoName);
          if (game.firstPlayer.getName() && game.secondPlayer.getName()) {
            iconSelectMessage.textContent = `${game.firstPlayer.getName()} choose one:`;
            x.classList.remove("hide");
            o.classList.remove("hide");
          }
        });

        const x = document.createElement("button");
        x.classList.add("hide");
        x.textContent = "x";
        const o = document.createElement("button");
        o.textContent = "o";
        o.classList.add("hide");
        const startGameBtn = document.createElement("Button");
        startGameBtn.textContent = "start game";
        startGameBtn.classList.add("hide");
        startGameBtn.addEventListener("click", () => {
          game.stage = "gameMode";
          render();
        });
        x.addEventListener("click", () => {
          game.players[0].setSelection("x");
          game.players[1].setSelection("o");
          startGameBtn.classList.remove("hide");
        });

        o.addEventListener("click", () => {
          game.players[0].setSelection("o");
          game.players[1].setSelection("x");
          startGameBtn.classList.remove("hide");
        });
        gamePage.append(iconSelectMessage, x, o, startGameBtn);
        break;

      case "gameMode":
        gamePage.innerHTML = "";
        firstPage.classList.add("hide");
        const board = document.createElement("div");
        board.classList.add("board");
        const mainButton = document.createElement("button");
        mainButton.textContent = "Main Page";
        mainButton.addEventListener("click", () => {
          game.resetGame();
          game.stage = "initial";
          render();
        });
        const replay = document.createElement("button");
        replay.textContent = "replay";
        replay.addEventListener("click", () => {
          game.resetGame();
          game.stage = "gameMode";
          render();
        });

        gamePage.append(replay, mainButton, board);
        board.style.backgroundColor = "black";

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let cell = document.createElement("div");
            board.appendChild(cell);
            cell.style.backgroundColor = "white";
            cell.textContent = game.gameboard[i][j];
            cell.addEventListener("click", () => {
              if (cell.textContent === "") {
                game.gameboard[i][j] = game.getActivePlayer().getSelection();
                render();
                game.checkWinner();
                render();
              }
            });
          }
        }
        break;
      case "gameOver":
        const winnerAnnouncement = document.createElement("dialog");
        gamePage.appendChild(winnerAnnouncement);
        winnerAnnouncement.classList.add("dialog");
        winnerAnnouncement.showModal();
        if (game.getWinner() === game.firstPlayer.getSelection()) {
          winnerAnnouncement.textContent = `The winner is ${game.firstPlayer.getName()}`;
        } else if (game.getWinner() === game.secondPlayer.getSelection()) {
          winnerAnnouncement.textContent = `The winner is ${game.secondPlayer.getName()}`;
        } else {
          winnerAnnouncement.textContent = "It's a Tie!";
        }
        winnerAnnouncement.addEventListener("click", () =>
          winnerAnnouncement.close()
        );
        break;
    }
  };
})();
