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

  return { gameboard, firstPlayer, getActivePlayer, secondPlayer, players };
})();

const displayController = (() => {
  const playbutton = document.querySelector(".playButton");
  const x = document.querySelector(".xButton");
  const o = document.querySelector(".oButton");
  const board = document.querySelector("#board");
  playbutton.addEventListener("click", () => {
    for (i = 1; i <= 9; i++) {
      let cell = document.createElement("div");
      cell.style.backgroundColor = "white";
      board.appendChild(cell);
      board.style.backgroundColor = "black";
      cell.addEventListener("click", () => {
        cell.textContent = game.getActivePlayer().getSelection();
      });
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
