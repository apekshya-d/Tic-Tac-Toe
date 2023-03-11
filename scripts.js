const Player = (name) => {
  let selectedOption;
  const getName = () => name;
  const getSelection = () => {
    return selectedOption;
  };
  const setSelection = (selection) => {
    selectedOption = selection;
  };

  return { getName, getSelection, setSelection };
};

const game = (() => {
  const gameboard = [[], [], []];
  const players = [Player("a"), Player("b")];
  const firstPlayer = players[0];
  const secondPlayer = players[1];
  let activePlayer;
  let getActivePlayer = () => {
    if (activePlayer === firstPlayer) {
      activePlayer = secondPlayer;
    } else {
      activePlayer = firstPlayer;
    }
    return activePlayer;
  };

  const checkWinner = () => {
    let value;
    let winner;
    let isFull = true;
    let isComplete;
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
      value = "";

      const matched = possibilities[i].every((item) => {
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

    return winner;
  };

  let stage;

  return {
    stage,
    gameboard,
    firstPlayer,
    getActivePlayer,
    secondPlayer,
    players,
    checkWinner,
  };
})();

const displayController = (() => {
  const firstPage = document.querySelector(".firstPage");
  const twoPlayers = document.querySelector("#twoPlayers");
  twoPlayers.addEventListener("click", () => {
    game.stage = "tokenSelection";
    render();
  });
  const gamePage = document.querySelector("#gamePage");

  const render = () => {
    switch (game.stage) {
      case "initial":
        gamePage.innerHTML = "";
        firstPage.classList.remove("hide");
        break;

      case "tokenSelection":
        const iconSelectMessage = document.createElement("p");
        iconSelectMessage.textContent = "choose one";
        const x = document.createElement("button");
        x.textContent = "x";
        const o = document.createElement("button");
        o.textContent = "o";
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
          game.gameboard = [[], [], []];
          game.stage = "initial";
          render();
        });
        const replay = document.createElement("button");
        replay.textContent = "replay";
        replay.addEventListener("click", () => {
          game.gameboard = [[], [], []];
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
                game.checkWinner();
                render();
              }
            });
          }
        }
        break;
    }
  };
})();
