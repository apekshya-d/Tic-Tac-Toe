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

  return {
    gameboard,
    firstPlayer,
    getActivePlayer,
    secondPlayer,
    players,
    checkWinner,
  };
})();

const displayController = (() => {
  const playbutton = document.querySelector(".playButton");
  const x = document.querySelector(".xButton");
  const o = document.querySelector(".oButton");
  const board = document.querySelector("#board");
  playbutton.addEventListener("click", () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let cell = document.createElement("div");
        board.appendChild(cell);
        board.style.backgroundColor = "black";
        cell.style.backgroundColor = "white";
        cell.addEventListener("click", () => {
          if (cell.textContent === "") {
            game.gameboard[i][j] = game.getActivePlayer().getSelection();
            cell.textContent = game.gameboard[i][j];
            game.checkWinner();
          }
        });
      }
    }
  });
  x.addEventListener("click", () => {
    game.players[0].setSelection("x");
    game.players[1].setSelection("o");
  });

  o.addEventListener("click", () => {
    game.players[0].setSelection("o");
    game.players[1].setSelection("x");
  });
})();
