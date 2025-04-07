function createGameboard() {
  const boardArr = new Array(9);
  boardArr.fill("*");

  function getBoard() {
    return boardArr;
  }

  function markBox(spot, marker) {
    if (boardArr[spot] === "*") {
      boardArr[spot] = marker;
      return true;
    } else {
      console.log("Spot taken");
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

const gameController = (function (player1Name, player2Name) {
  const gameBoard = createGameboard();

  const players = [
    createPlayer(player1Name, "X"),
    createPlayer(player2Name, "O"),
  ];
  let activePlayerIndex = 0;
  let winner = "none";

  function switchActivePlayer() {
    activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;
  }

  function getActivePlayer() {
    return players[activePlayerIndex].getPlayer();
  }

  function printBoard() {
    const board = gameBoard.getBoard();
    const seperator = "---------";
    console.log(
      `${board[0]} | ${board[1]} | ${board[2]} \n ${seperator} \n${board[3]} | ${board[4]} | ${board[5]} \n ${seperator} \n${board[6]} | ${board[7]} | ${board[8]}`
    );
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
        board[combo[1]] === board[combo[2]]
      ) {
        winner = board[combo[0]];
        break;
      }
    }

    console.log("Winner: " + winner);
    if (winner !== "none") return;

    if (!board.includes("*")) {
      winner = "tie";
    }
    console.log("Winner: " + winner);
  }

  function playerTurn(spot) {
    const markResult = gameBoard.markBox(spot, getActivePlayer().marker);
  }

  return {
    switchActivePlayer,
    getActivePlayer,
    printBoard,
    playerTurn,
    checkWinner,
  };
})("P1", "P2");

gameController.playerTurn(0);
gameController.playerTurn(2);
gameController.playerTurn(3);
gameController.playerTurn(5);
gameController.playerTurn(7);
gameController.switchActivePlayer();
gameController.playerTurn(1);
gameController.playerTurn(4);
gameController.playerTurn(6);
gameController.playerTurn(8);
gameController.printBoard();
gameController.checkWinner();
