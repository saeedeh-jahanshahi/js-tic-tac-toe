import Player from './Player.js';
import AiPlayer from './AiPlayer.js';
import GameRender from './GameRender.js';

// export const totalPlayers = GameBoard.totalPlayers;
// export const totalPositions = GameBoard.totalPositions;
// export const winningPositions = GameBoard.winningPositions;

export default class GameBoard {
  constructor() {
    this.currentTurn = GameBoard.firstDefaultTurn;
    this.players = [];
    this.ties = 0;
    this.init();
    this.aiMoveSetup();
  }
  static get winningPositions() {
    return [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];
  }
  static get totalPositions() {
    return 9;
  }
  static get firstDefaultTurn() {
    return 0;
  }
  static get totalPlayers() {
    return 2;
  }
  init() {
    this.gameMode = parseInt(location.search.substring(1));
    this.humanPlayer = parseInt(localStorage.getItem('playerOneMarker'));

    this.gameRender = new GameRender(
      {
        updateResult: this.updateResult.bind(this),
        aiMoveSetup: this.aiMoveSetup.bind(this),
      },
      {
        gameReset: this.reset.bind(this),
        humanMoveSetup: this.humanMoveSetup.bind(this),
      }
    );
    for (let id = 0; id < GameBoard.totalPlayers; id++) {
      if (this.gameMode === 1 && this.humanPlayer !== id) {
        this.players.push(new AiPlayer(id));
      } else {
        this.players.push(new Player(id));
      }
    }
  }
  aiMoveSetup() {
    if (this.gameMode === 1 && this.humanPlayer !== this.currentTurn) {
      let randomPositionId = this.players[
        this.currentTurn
      ].getRandomPositionById(this.isPositionFree.bind(this));
      const positionContainer = this.gameRender.gameBoard.querySelector(
        `li[data-id="${randomPositionId}"]`
      );
      this.players[this.currentTurn].move(positionContainer, randomPositionId);
      this.isGameover();
    }
  }
  humanMoveSetup(positionContainer, positionId) {
    this.players[this.currentTurn].move(positionContainer, positionId);
    this.isGameover();
  }
  isPositionFree(positionId) {
    return !this.players.some((player) =>
      player.positions.includes(positionId)
    );
  }
  isWin(playerPositions) {
    return GameBoard.winningPositions.some((winPos) =>
      winPos.every((pos) => playerPositions.includes(pos))
    );
  }
  isEqual() {
    const total = this.players.reduce(
      (total, currentPlayer) => (total += currentPlayer.positions.length),
      0
    );
    return total === GameBoard.totalPositions;
  }
  changeTurn() {
    this.currentTurn = (this.currentTurn + 1) % GameBoard.totalPlayers;
    this.gameRender.turn(this.players[this.currentTurn].iconImgPath);
  }
  isGameover() {
    if (this.isWin(this.players[this.currentTurn].positions)) {
      this.gameRender.renderWinnerResult(this.currentTurn, {
        color: this.players[this.currentTurn].iconColor,
        imgPath: this.players[this.currentTurn].iconImgPath,
      });
    } else if (this.isEqual()) {
      this.gameRender.renderEqualityResult();
    } else {
      this.changeTurn();
    }
  }
  reset() {
    this.currentTurn = GameBoard.firstDefaultTurn;
    this.players.forEach((player) => {
      player.reset();
    });
    this.gameRender.reset(this.players[this.currentTurn].iconImgPath);
  }
  updateResult(resultId) {
    let updatedResult;
    if (resultId === 2) {
      this.ties++;
      updatedResult = this.ties;
    } else {
      this.players[this.currentTurn].increaseScore();
      updatedResult = this.players[this.currentTurn].score;
    }
    // const totalResult = JSON.parse(localStorage.getItem('totalResult'));
    // totalResult[resultId] = updatedResult;
    // localStorage.setItem('totalResult', JSON.stringify(totalResult));
    this.gameRender.renderUpdatedResult(resultId, updatedResult);
  }
}
