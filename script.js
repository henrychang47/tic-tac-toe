const gameBoard = (function () {
  const boardSize = 3;
  const gameboardElement = document.querySelector('#gameBoard');
  const cellElements = gameboardElement.querySelectorAll('.board-cell');
  const winningSituation = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const initBoard = function () {
    const emptyBoard = [];

    for (let i = 0; i < boardSize ** 2; i++) {
      emptyBoard.push('');
    }

    return emptyBoard;
  }

  const updateBoard = function (currentBoard) {
    for (let i = 0; i < cellElements.length; i++) {
      cellElements[i].firstElementChild.innerText = currentBoard[i];
    }
  }

  const judgeBoard = function (currentBoard, targetSymbol) {

    for (let i = 0; i < winningSituation.length; i++) {
      const [a, b, c] = winningSituation[i];
      if (currentBoard[a] === targetSymbol &&
        currentBoard[b] === targetSymbol &&
        currentBoard[c] === targetSymbol) return true;
    }

    return false
  }
  return { cellElements, initBoard, updateBoard, judgeBoard };
})();

const Player = function (name) {
  return { name }
}

const Game = function (player1, player2) {
  let currentBoard = gameBoard.initBoard();
  let currentPlayer = player1;
  let currentSymbol = 'X';
  let currentStep = 0;

  const nextPlayer = function () {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    currentSymbol = currentSymbol === 'X' ? 'O' : 'X';
    currentStep++;
  }

  const endGame = function (even) {
    for (let i = 0; i < gameBoard.cellElements.length; i++) {
      gameBoard.cellElements[i].removeEventListener('click', handelCellClick);
    }

    if (even) {
      setMessage('No Winner');
    } else {
      message = (currentSymbol === 'X' ? player1.name : player2.name) + ' win!!';
      setMessage(message);
    }

  }

  const handelCellClick = function (e) {
    const index = e.target.firstElementChild.dataset.index;
    currentBoard[index] = currentSymbol;
    gameBoard.updateBoard(currentBoard);
    e.target.removeEventListener('click', handelCellClick);

    if (gameBoard.judgeBoard(currentBoard, currentSymbol)) {
      endGame(false);
    } else {
      nextPlayer();
      if (currentStep == 9) endGame(true);
    }

  }

  const play = function () {
    for (let i = 0; i < gameBoard.cellElements.length; i++) {
      gameBoard.cellElements[i].addEventListener('click', handelCellClick);
    }
    gameBoard.updateBoard(currentBoard);
    setMessage(player1.name + ' VS ' + player2.name);
  }

  return { play };
}

const setMessage = function (message) {
  document.querySelector('#messageBox').innerHTML = message;
}

var nameOfPlayer1 = 'Player1';
var nameOfPlayer2 = 'Player2';

document.querySelector('#startButton').addEventListener('click', () => {

  nameOfPlayer1 = document.querySelector('#inputPlayer1')?.value || nameOfPlayer1;
  nameOfPlayer2 = document.querySelector('#inputPlayer2')?.value || nameOfPlayer2;

  const player1 = new Player(nameOfPlayer1);
  const player2 = new Player(nameOfPlayer2);

  const currentGame = new Game(player1, player2);

  currentGame.play();
});

document.querySelector('#resetName').addEventListener('click', () => {
  document.querySelector('#messageBox').innerHTML = `
    <span id="player1">
      <input type="text" id="inputPlayer1" placeholder=${nameOfPlayer1}>
    </span>
    Vs
    <span id="player2">
      <input type="text" id="inputPlayer2" placeholder=${nameOfPlayer2}>
    </span>`;

});

