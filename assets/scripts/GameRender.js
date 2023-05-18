export default class GameRander {
  constructor(propertieMethods, paremeterMethods) {
    this.gameBoard = document.getElementById('game-board');
    this.reloadBtn = document.getElementById('reload-btn');
    this.resultContainer = document.getElementById('result-icon');
    this.resultMoodelHeader = document.getElementById('result-moodel__header');
    this.nextRoundBtn = document.getElementById('next-round-btn');
    this.cancelResetBtn = document.getElementById('cancel-reset-btn');
    this.confirmResetBtn = document.getElementById('confirm-reset-btn');
    this.turnIcon = document.getElementById('turn-icon').querySelector('use');
    this.resultElements = document.querySelectorAll(
      '.footer-list p[data-result-id]'
    );
    this.updateResult = propertieMethods.updateResult;
    this.aiMoveSetup = propertieMethods.aiMoveSetup;
    this.init(paremeterMethods.gameReset, paremeterMethods.humanMoveSetup);
  }

  nextRoundHandler(gameReset) {
    gameReset();
    this.aiMoveSetup();
  }

  init(gameReset, humanMoveSetup) {
    this.gameBoard.addEventListener('click', (event) => {
      const currentElement = event.target;
      if (currentElement.tagName === 'LI' && !currentElement.hasChildNodes()) {
        humanMoveSetup(currentElement, parseInt(currentElement.dataset.id));
        this.aiMoveSetup();
      }
    });
    this.reloadBtn.addEventListener('click', () => {
      this.moodelToggle('reset-moodel');
    });
    this.nextRoundBtn.addEventListener('click', this.nextRoundHandler.bind(this, gameReset));
    this.cancelResetBtn.addEventListener('click', (event) => {
      this.moodelToggle('reset-moodel');
      this.aiMoveSetup();
    });
    this.confirmResetBtn.addEventListener('click', () => {
      location.reload();
    });
  }

  moodelToggle(moodelId) {
    const moodel = document.getElementById(moodelId);
    const backdrop = document.querySelector('.backdrop');
    moodel.classList.toggle('hidden');
    backdrop.classList.toggle('hidden');
  }
  turn(iconImgPath) {
    this.turnIcon.setAttribute('xlink:href', iconImgPath);
  }
  reset(iconImgPath) {
    const gameBoardItems = this.gameBoard.children;
    for (const item of gameBoardItems) {
      if (item.hasChildNodes()) {
        item.removeChild(item.querySelector('svg'));
      }
    }
    this.moodelToggle('result-moodel');
    this.turn(iconImgPath);
  }
  renderUpdatedResult(resultId, updatedResult) {
    this.resultElements[resultId].textContent = updatedResult;
  }
  renderWinnerResult(currentTurn, icon) {
    this.resultContainer.innerHTML = '';
    this.resultMoodelHeader.textContent = 'WINNER';
    const winnerTemplate = document.getElementById('winner-template');
    this.moodelToggle('result-moodel');
    const resultIcon = document.importNode(winnerTemplate.content, true);
    resultIcon.querySelector('svg').dataset.color = icon.color;
    resultIcon.querySelector('use').setAttribute('xlink:href', icon.imgPath);
    this.resultContainer.append(resultIcon);
    this.updateResult(currentTurn);
  }
  renderEqualityResult() {
    this.resultContainer.innerHTML = '';
    this.resultMoodelHeader.textContent = 'DRAW';
    this.resultContainer.textContent = 'nobody';
    this.moodelToggle('result-moodel');
    this.updateResult(2);
  }
}
