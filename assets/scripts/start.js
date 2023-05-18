const FIRSTICON = 'cross';
const SECONDICON = 'circle';
const playerPositions = { [FIRSTICON]: [], [SECONDICON]: [] };
const markImgPath = {
  [FIRSTICON]: 'assets/img/icons.svg#cross_icon',
  [SECONDICON]: 'assets/img/icons.svg#circle_icon',
};
const markColor = { [FIRSTICON]: 'accentb', [SECONDICON]: 'accenty' };
const TOTALPOSITIONS = 9;
const turns = [FIRSTICON, SECONDICON];

const winPositions = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];
const DEFUALTTURN = 1;
let currentTurn = 0;
let gameMode = 1;
let playerMarker = SECONDICON;
let totalResult = { [FIRSTICON]: 0, [SECONDICON]: 0, ties: 0 };

const gameBoard = document.getElementById('game-board');
const reloadBtn = document.getElementById('reload-btn');
const resultContainer = document.getElementById('result-icon');
const resultMoodelHeader = document.getElementById('result-moodel__header');
const nextRoundBtn = document.getElementById('next-round-btn');
const cancelResetBtn = document.getElementById('cancel-reset-btn');
const confirmResetBtn = document.getElementById('confirm-reset-btn');

//autoMove in player class
const machinePlay = function () {
  let randPos = chooseRandomPosition();
  const element = gameBoard.querySelector(`li[data-id="${randPos}"]`);
  setPlayerPosition(element, randPos);
  checkPosition();
};

//move in Player class
const setPlayerPosition = function (element, position) {
  playerPositions[turns[currentTurn]].push(position);
  const iconTemplate = document.getElementById('player-icon-template');
  const iconElement = document
    .importNode(iconTemplate.content, true)
    .querySelector('svg');
  iconElement.dataset.color = markColor[turns[currentTurn]];
  iconElement
    .querySelector('use')
    .setAttribute('xlink:href', markImgPath[turns[currentTurn]]);
  element.append(iconElement);
};

//getRandomPositionById in player class
const chooseRandomPosition = function () {
  let randomPosition;
  do {
    randomPosition = Math.floor(Math.random() * TOTALPOSITIONS) + 1;
    randomPosition = randomPosition;
  } while (
    playerPositions[FIRSTICON].includes(randomPosition) ||
    playerPositions[SECONDICON].includes(randomPosition)
  );
  return randomPosition;
};

//isWin in Player class
const checkWinning = () =>
  winPositions.some((winPos) =>
    winPos.every((pos) =>
      playerPositions[turns[currentTurn]].includes(pos)
    )
  );

//isEqual in GameBoard class
const checkEquality = function () {
  let total = 0;
  for (const player in playerPositions) {
    total += playerPositions[player].length;
  }
  return total === TOTALPOSITIONS;
};

//isGameover in GameBoard class
const checkPosition = function () {
  if (checkWinning()) {
    renderWinnerResult();
  } else if (checkEquality()) {
    renderEqualityResult();
  } else {
    changeTurn(currentTurn);
  }
};

//cpuMove in GameBoard class
const canMachinePlay = function (condition) {
  if (gameMode === 1 && condition !== playerMarker) {
    machinePlay();
  }
};

//in GameRander class
const moodelToggle = function (moodelId) {
  const moodel = document.getElementById(moodelId);
  const backdrop = document.querySelector('.backdrop');
  moodel.classList.toggle('hidden');
  backdrop.classList.toggle('hidden');
};

//reset in player, in GameRender and in GameBoard classes
const restartGame = function () {
  const gameBoardItems = gameBoard.children;
  for (const item of gameBoardItems) {
    if (item.hasChildNodes()) {
      item.removeChild(item.querySelector('svg'));
    }
  }
  changeTurn(DEFUALTTURN);
  moodelToggle('result-moodel');
  for (const pos in playerPositions) {
    playerPositions[pos] = [];
  }
};

//in GameBoard
const changeTurn = function (turnVal) {
  currentTurn = (turnVal + 1) % 2;
  const turnIcon = document.getElementById('turn-icon');
  const icon = turnIcon.querySelector('use');
  icon.setAttribute('xlink:href', markImgPath[turns[currentTurn]]);
};

//nextRoundHandler in GameRender
const nextRound = function () {
  restartGame();
  renderResult();
  canMachinePlay(FIRSTICON);
};

//in GameRender class
const renderWinnerResult = function () {
  resultContainer.innerHTML = '';
  resultMoodelHeader.textContent = 'WINNER';
  const winnerTemplate = document.getElementById('winner-template');
  moodelToggle('result-moodel');
  const resultIcon = document.importNode(winnerTemplate.content, true);
  resultIcon.querySelector('svg').dataset.color =
    markColor[turns[currentTurn]];
  resultIcon
    .querySelector('use')
    .setAttribute('xlink:href', markImgPath[turns[currentTurn]]);
  resultContainer.append(resultIcon);
  renderUpdatedResult(currentTurn);
};

//in GameRender class
const renderEqualityResult = function () {
  resultContainer.innerHTML = '';
  resultMoodelHeader.textContent = 'DRAW';
  resultContainer.textContent = 'nobody';
  moodelToggle('result-moodel');
  renderUpdatedResult(-1);
};

//updateResult in GameRender and GameBoard
const renderUpdatedResult = function (result) {
  let updatedNumber = 'ties';
  if (result !== -1) {
    updatedNumber = turns[result];
  }
  totalResult[updatedNumber]++;
  document.getElementById(updatedNumber).textContent =
    totalResult[updatedNumber];
  localStorage.setItem('totalResult', JSON.stringify(totalResult));
};

//this function is merged with nextRount in GameRender
const renderResult = function () {
  totalResult = JSON.parse(localStorage.getItem('totalResult'));
  for (const item in totalResult) {
    document.getElementById(item).textContent = totalResult[item];
  }
};

//init in GameRender
gameBoard.addEventListener('click', (event) => {
  const currentElement = event.target;
  if (currentElement.tagName === 'LI' && !currentElement.hasChildNodes()) {
    setPlayerPosition(
      currentElement,
      parseInt(currentElement.dataset.id)
    );
    checkPosition();
    canMachinePlay(turns[currentTurn]);
  }
});

//in GameRender
reloadBtn.addEventListener('click', () => {
  moodelToggle('reset-moodel');
});

//in GameRender
nextRoundBtn.addEventListener('click', nextRound);

//in GameRender
cancelResetBtn.addEventListener('click', (event) => {
  moodelToggle('reset-moodel');
  canMachinePlay(FIRSTICON);
});

//in GameRender
confirmResetBtn.addEventListener('click', () => {
  location.reload();
});

//init in GameBoard
document.addEventListener('DOMContentLoaded', () => {
  gameMode = parseInt(location.search.substring(1));
  playerMarker = localStorage.getItem('playerOneMarker');
  canMachinePlay(FIRSTICON);
});
