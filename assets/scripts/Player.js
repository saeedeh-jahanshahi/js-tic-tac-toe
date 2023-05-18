import icons from './icons.js';
import GameBoard from './GameBoard.js';

// const { totalPlayers, totalPositions, winningPositions } = gameBoardConst;

export default class Player {
  constructor(id) {
    try {
      if (id >= GameBoard.totalPlayers) {
        throw new Error(
          "the game is for 2 players. the number of players shouldn't be bigger than 2"
        );
      }
    } catch (e) {
      console.error(e);
    }
    this.id = id;
    this.positions = [];
    this.iconShape = icons.shape[id];
    this.iconColor = icons.color[id];
    this.iconImgPath = icons.imgPath[id];
    this.score = 0;
  }

  move(positionContainer, positionId){
    this.positions.push(positionId);
    const iconTemplate = document.getElementById('player-icon-template');
    const iconElement = document
      .importNode(iconTemplate.content, true)
      .querySelector('svg');
    iconElement.dataset.color = this.iconColor;
    iconElement
      .querySelector('use')
      .setAttribute('xlink:href', this.iconImgPath);
    positionContainer.append(iconElement);
  }
  reset() {
    this.positions = [];
  }
  increaseScore(){
    this.score++;
  }
}
