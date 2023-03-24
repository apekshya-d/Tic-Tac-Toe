/* eslint-disable no-plusplus */
const Player = () => {
  let selectedOption;
  let name;
  let isAI;
  const setName = (n) => {
    name = n;
  };

  const getIsAI = () => isAI;

  const setAi = (a) => {
    isAI = a;
  };
  const getName = () => name;
  const getSelection = () => selectedOption;
  const setSelection = (selection) => {
    selectedOption = selection;
  };

  return { getName, getSelection, setSelection, setName, getIsAI, setAi };
};

const game = (() => {
  const gameboard = [[], [], []];
  let winningRow = [];
  let stage;
  const players = [Player(), Player()];
  const firstPlayer = players[0];
  const secondPlayer = players[1];
  let activePlayer = firstPlayer;
  const getActivePlayer = () => activePlayer;
  const getNextPlayer = () => {
    if (activePlayer === firstPlayer) {
      activePlayer = secondPlayer;
    } else {
      activePlayer = firstPlayer;
    }
  };

  const resetGame = () => {
    gameboard.splice(0, 3, [], [], []);
    activePlayer = firstPlayer;
    winningRow = [];
  };
  const getWinningRow = () => winningRow;

  const checkWinner = () => {
    winningRow = [];
    let winner;
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

    const winningRowsPossibilities = [
      ["00", "01", "02"],
      ["10", "11", "12"],
      ["20", "21", "22"],
      ["00", "10", "20"],
      ["01", "11", "21"],
      ["02", "12", "22"],
      ["00", "11", "22"],
      ["02", "11", "20"],
    ];

    for (let i = 0; i < possibilities.length; i++) {
      let value;
      matched = possibilities[i].every((item) => {
        value = item;
        return item === possibilities[i][0];
      });

      isFull = possibilities[i].every((item) => typeof item === "string");

      if (isFull === false) {
        isComplete = false;
      }

      if (value === "x" && matched && isFull) {
        winner = "x";
        winningRow = winningRowsPossibilities[i];

        break;
      } else if (value === "o" && matched && isFull) {
        winner = "o";
        winningRow = winningRowsPossibilities[i];
        break;
      }
    }

    if (isComplete && !matched) {
      winner = "Tie";
    }

    return winner;
  };

  function minimax(isMaximizing) {
    const scores = {
      [secondPlayer.getSelection()]: 1,
      [firstPlayer.getSelection()]: -1,
      Tie: 0,
    };

    const result = checkWinner();
    if (result) {
      return scores[result];
    }

    let bestScore;

    if (isMaximizing) {
      bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!gameboard[i][j]) {
            gameboard[i][j] = secondPlayer.getSelection();
            const score = minimax(false);
            gameboard[i][j] = undefined;
            bestScore = Math.max(score, bestScore);
          }
        }
      }
    } else {
      bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!gameboard[i][j]) {
            gameboard[i][j] = firstPlayer.getSelection();
            const score = minimax(true);
            gameboard[i][j] = undefined;
            bestScore = Math.min(score, bestScore);
          }
        }
      }
    }

    return bestScore;
  }

  const bestMove = () => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!gameboard[i][j]) {
          gameboard[i][j] = secondPlayer.getSelection();
          const score = minimax(false);
          gameboard[i][j] = undefined;
          bestScore = Math.max(score, bestScore);
          if (bestScore === score) {
            move = [i, j];
          }
        }
      }
    }
    return move;
  };

  const playAiMove = () => {
    const aiMove = bestMove();
    gameboard[aiMove[0]][aiMove[1]] = getActivePlayer().getSelection();
    getNextPlayer();
  };

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
    playAiMove,
    getWinningRow,
  };
})();

(() => {
  const firstPage = document.querySelector(".firstPage");
  const gamePage = document.querySelector("#gamePage");
  const twoPlayers = document.querySelector("#twoPlayers");
  twoPlayers.addEventListener("click", () => {
    game.stage = "twoPlayerMode";

    twoPlayers.classList.add("selected");
    // eslint-disable-next-line no-use-before-define
    playAI.classList.remove("selected");
    // eslint-disable-next-line no-use-before-define
    render();
  });

  const playAI = document.querySelector("#playAI");
  playAI.addEventListener("click", () => {
    game.stage = "aiMode";
    playAI.classList.add("selected");
    twoPlayers.classList.remove("selected");
    // eslint-disable-next-line no-use-before-define
    render();
  });

  const appendPlayerSelection = () => {
    const iconSelectMessage = document.createElement("p");
    iconSelectMessage.classList.add("iconSelectMessage");
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
      // eslint-disable-next-line no-use-before-define
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

    gamePage.append(iconSelectMessage, xoContainer, startGameBtnContainer);
  };

  const render = () => {
    switch (game.stage) {
      case "initial":
        gamePage.innerHTML = "";
        firstPage.classList.remove("hide");
        break;

      case "aiMode": {
        gamePage.innerHTML = "";

        const human = document.createElement("input");
        human.classList.add("AiInputContainer");
        human.setAttribute("placeholder", "Enter your name");
        human.setAttribute("maxlength", "10");

        human.addEventListener("input", () => {
          const humanName = human.value;
          game.firstPlayer.setName(humanName);
          if (game.firstPlayer.getName()) {
            document.querySelector(
              ".iconSelectMessage"
            ).textContent = `${game.firstPlayer.getName()} pick your side:`;
            document.querySelector(".xoContainer").classList.remove("hide");
          }
        });

        gamePage.appendChild(human);
        game.secondPlayer.setName("Computer");
        game.secondPlayer.setAi(true);
        appendPlayerSelection();
        break;
      }
      case "twoPlayerMode": {
        gamePage.innerHTML = "";
        const playerInputContainer = document.createElement("div");
        playerInputContainer.classList.add("playerInputContainer");
        const playerOne = document.createElement("input");
        playerOne.setAttribute("placeholder", "Player one name");
        playerOne.setAttribute("maxlength", "10");
        playerOne.addEventListener("input", () => {
          const playerOneName = playerOne.value;
          game.firstPlayer.setName(playerOneName);
          if (game.firstPlayer.getName() && game.secondPlayer.getName()) {
            document.querySelector(
              ".iconSelectMessage"
            ).textContent = `${game.firstPlayer.getName()} pick your side:`;
            document.querySelector(".xoContainer").classList.remove("hide");
          }
        });

        const playerTwo = document.createElement("input");
        playerTwo.setAttribute("placeholder", "Player Two name");
        playerTwo.setAttribute("maxlength", "10");
        playerInputContainer.append(playerOne, playerTwo);
        playerTwo.addEventListener("input", () => {
          const playerTwoName = playerTwo.value;
          game.secondPlayer.setName(playerTwoName);
          if (game.firstPlayer.getName() && game.secondPlayer.getName()) {
            document.querySelector(
              ".iconSelectMessage"
            ).textContent = `${game.firstPlayer.getName()} pick your side:`;
            document.querySelector(".xoContainer").classList.remove("hide");
          }
        });

        gamePage.appendChild(playerInputContainer);
        appendPlayerSelection();

        break;
      }

      case "gameMode": {
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
          game.players[1].setAi(false);
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
        playerTurn.classList.add("playerTurn");
        playerTurn.textContent = `It's ${game
          .getActivePlayer()
          .getName()}'s turn`;

        if (game.secondPlayer.getIsAI()) {
          playerTurn.classList.add("hide");
        }

        gameModeBtnContainer.append(replay, mainButton);
        gamePage.append(gameModeBtnContainer, playerTurn, board);

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const cell = document.createElement("div");
            board.appendChild(cell);
            cell.textContent = game.gameboard[i][j];
            cell.addEventListener("click", () => {
              if (cell.textContent === "") {
                game.gameboard[i][j] = game.getActivePlayer().getSelection();
                game.getNextPlayer();
                let winner = game.checkWinner();
                render();

                // if ai mode:
                if (game.players[1].getIsAI() && !winner) {
                  game.playAiMove();
                  winner = game.checkWinner();
                  render();
                }
                if (winner !== undefined) {
                  game.stage = "gameOver";
                  render();
                }
              }
            });
            if (game.getWinningRow().includes(`${i}${j}`)) {
              cell.classList.add("winningRow");
            }
          }
        }
        break;
      }

      case "gameOver": {
        document.querySelector(".playerTurn").classList.remove("hide");
        const existingDialog = document.querySelector(".dialog");
        if (existingDialog) {
          existingDialog.remove();
        }
        const main = document.querySelector(".main");
        const winnerAnnouncement = document.createElement("dialog");
        gamePage.appendChild(winnerAnnouncement);
        winnerAnnouncement.classList.add("dialog");
        main.classList.add("blur");
        winnerAnnouncement.showModal();
        if (game.checkWinner() === game.firstPlayer.getSelection()) {
          winnerAnnouncement.textContent = `The winner is ${game.firstPlayer.getName()}.`;
          document.querySelector(
            ".playerTurn"
          ).textContent = `The winner is ${game.firstPlayer.getName()}.`;
        } else if (game.checkWinner() === game.secondPlayer.getSelection()) {
          winnerAnnouncement.textContent = `The winner is ${game.secondPlayer.getName()}.`;
          document.querySelector(
            ".playerTurn"
          ).textContent = `The winner is ${game.secondPlayer.getName()}.`;
        } else {
          winnerAnnouncement.textContent = "It's a Tie!";
          document.querySelector(".playerTurn").textContent = "It's a Tie!";
        }
        winnerAnnouncement.addEventListener("click", () => {
          main.classList.remove("blur");
          winnerAnnouncement.close();
        });
        break;
      }

      default:
        break;
    }
  };
})();
