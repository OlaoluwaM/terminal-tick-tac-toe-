const { stdin, stdout } = require('process');
const readline = require('readline');
const MOVES_LIMIT = 9;

const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const numRepresentation = {
  0: 'Player 1',
  1: 'Player 2',
  2: 'Draw',
};

class TickTacToe {
  constructor() {
    this.totalMoveList = Object.seal(new Array(MOVES_LIMIT).fill(' '));
    this.gameLayout = '';
    this.currentPlayer = numRepresentation[0];
    this.dashIndexes = [2, 5];

    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
      prompt: '--> ',
    });
  }

  renderLayout() {
    this.gameLayout = this.totalMoveList
      .map((move, ind, arr) => {
        if (this.dashIndexes.includes(ind)) return `${move}\n${'-'.repeat(9)}\n`;
        if (ind === arr.length - 1) return move;

        return `${move} | `;
      })
      .join('');
  }

  startGame() {
    this.displayLayout();

    console.log(`\n${this.currentPlayer} starts. Input a position [1 - 9]`);
    this.rl.prompt();

    this.rl.on('line', input => {
      let thereIsIssueWithInput = false;

      const inputToInteger = parseInt(input);
      const invalidInput =
        isNaN(inputToInteger) ||
        !Number.isInteger(inputToInteger) ||
        inputToInteger < 1 ||
        inputToInteger > 9;

      if (invalidInput) {
        console.log('Only integers between 1 and 9 are valid!');
        thereIsIssueWithInput = true;
      }

      if (this.positionOccupied(inputToInteger - 1)) {
        console.log('Position Occupied');
        thereIsIssueWithInput = true;
      }

      let message;
      if (!thereIsIssueWithInput) {
        this.totalMoveList[inputToInteger - 1] = this.getPlayerChar();
        this.continueGame();
        message = this.checkForWinner();
      }

      message ? this.endGame(message) : this.rl.prompt();
    });
  }

  continueGame() {
    this.displayLayout();
    this.switchPlayers();
    console.log(`\n${this.currentPlayer} input a position [1 - 9]`);
  }

  checkForWinner() {
    const actualMoves = this.totalMoveList.filter(move => this.positionOccupied(move));

    if (actualMoves.length < 5) return;
    const player2Regex = new RegExp(/X{3}/, 'i');
    const player1Regex = new RegExp(/O{3}/, 'i');

    let winner = undefined;

    for (let i = 0; i <= WIN_COMBINATIONS.length - 1; i++) {
      const moveCombination = WIN_COMBINATIONS[i].map(ind => this.totalMoveList[ind]).join('');

      if (player1Regex.test(moveCombination)) winner = this.getPlayerFromChar('O');
      if (player2Regex.test(moveCombination)) winner = this.getPlayerFromChar('X');

      if (winner) break;
    }

    if (winner) return `${winner} wins`;
    if (actualMoves.length === MOVES_LIMIT) return "It's a Draw! Thanks for playing";
  }

  endGame(message) {
    console.log(message);
    this.rl.close();
  }

  // helpers
  getPlayerFromChar(char) {
    const charToPlayerObj = { O: 'Player 1', X: 'Player 2' };
    return charToPlayerObj[char];
  }

  displayLayout() {
    this.renderLayout();
    console.log(this.gameLayout);
  }

  getPlayerChar() {
    const charObj = { 'Player 1': 'O', 'Player 2': 'X' };
    return charObj[this.currentPlayer];
  }

  switchPlayers() {
    this.currentPlayer =
      this.currentPlayer === numRepresentation[0] ? numRepresentation[1] : numRepresentation[0];
  }

  positionOccupied(pos) {
    switch (typeof pos) {
      case 'number':
        return this.totalMoveList[pos] === 'X' || this.totalMoveList[pos] === 'O';

      case 'string':
        return pos === 'X' || pos === 'O';
    }
  }
}

const game = new TickTacToe();
game.startGame();
