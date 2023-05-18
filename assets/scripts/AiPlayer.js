import Player from './Player.js'
import GameBoard from './GameBoard.js';

export default class AiPlayer extends Player{
  constructor(id){
    super(id);
  }
  getRandomPositionById(isPositionFree) {
    let randomPosition;
    do {
      randomPosition = Math.floor(Math.random() * GameBoard.totalPositions) + 1;
    } while (!isPositionFree(randomPosition));
    return randomPosition;
  }
}