import GameBoard from "./GameBoard.js"

class StartGame{
  static init(){
    this.GameBoard = new GameBoard();
  }
}

StartGame.init();