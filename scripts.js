function createGameboard() {
  const boardArr = new Array(9);
  boardArr.fill("");

  function getBoard() {
    return boardArr;
  }

  function markBox(spot, marker) {
    if (boardArr[spot] === "") {
      boardArr[spot] = marker;
      return true;
    } else {
      return false;
    }
  }

  return { getBoard, markBox };
}

function createPlayer(playerName, playerMarker) {
  const name = playerName;
  const marker = playerMarker;

  function getPlayer() {
    return { name, marker };
  }

  return { getPlayer };
}

const gameController = (function () {
  const gameBoard = createGameboard();

  const players = [];
  let activePlayerIndex = 0;
  let winner = "none";

  function initGame(player1Name, player2Name) {
    players.push(
      createPlayer(player1Name, "X"),
      createPlayer(player2Name, "O")
    );
  }

  function switchActivePlayer() {
    activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;
  }

  function getActivePlayer() {
    return players[activePlayerIndex].getPlayer();
  }

  function getBoard() {
    return gameBoard.getBoard();
  }

  function checkWinner() {
    const winCombos = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [3, 4, 5],
      [6, 7, 8],
    ];
    const board = gameBoard.getBoard();

    for (let i = 0; i < winCombos.length; i++) {
      let combo = winCombos[i];
      if (
        board[combo[0]] === board[combo[1]] &&
        board[combo[1]] === board[combo[2]] &&
        board[combo[0]] !== ""
      ) {
        winner = board[combo[0]];
        break;
      }
    }

    if (winner !== "none") {
      winner =
        winner === "X"
          ? players[0].getPlayer().name
          : players[1].getPlayer().name;
      return;
    }

    if (!board.includes("")) {
      winner = "tie";
    }
  }

  function playerTurn(spot) {
    const markResult = gameBoard.markBox(spot, getActivePlayer().marker);
    displayController.renderBoard();
    checkWinner();
    if (winner !== "none") {
      if (winner === "tie") {
        displayController.renderMessage("Game ends in a tie!");
      } else {
        displayController.renderMessage(`${winner} won the game!`);
      }
    } else {
      switchActivePlayer();
      displayController.renderMessage(
        `${getActivePlayer().name} (${getActivePlayer().marker}) turn!`
      );
    }
  }

  return {
    getActivePlayer,
    getBoard,
    playerTurn,
    initGame,
  };
})();

const displayController = (function () {
  const nameSectionEl = document.querySelector(".name-form-section");
  const nameFormEl = document.querySelector("#player-name-form");
  const boardBtnEls = document.querySelectorAll(".board-btn");
  const messageEl = document.querySelector(".message");

  function handleSpotClick(e) {
    const spot = parseInt(e.target.dataset.id);
    gameController.playerTurn(spot);
    e.target.removeEventListener("click", handleSpotClick);
  }

  function handleNameClick(e) {
    e.preventDefault();
    const p1Name = document.querySelector("#p1-name").value;
    const p2Name = document.querySelector("#p2-name").value;
    gameController.initGame(p1Name, p2Name);
    nameSectionEl.classList.add("hidden");
    document.querySelector(".game-section").classList.remove("hidden");
    renderMessage(
      `${gameController.getActivePlayer().name} (${
        gameController.getActivePlayer().marker
      }) it's your turn`
    );
  }

  function renderBoard() {
    const currBoard = gameController.getBoard();
    for (let i = 0; i < currBoard.length; i++) {
      if (currBoard[i] !== "") {
        const markBtnEl = document.querySelector(`[data-id="${i}"]`);
        markBtnEl.textContent = currBoard[i];
      }
    }
  }

  function renderMessage(message) {
    messageEl.textContent = message;
  }

  nameFormEl.addEventListener("submit", handleNameClick);

  boardBtnEls.forEach((btnEl) => {
    btnEl.addEventListener("click", handleSpotClick);
  });

  return { renderBoard, renderMessage };
})();
