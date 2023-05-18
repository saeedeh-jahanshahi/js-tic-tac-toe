const playerMarkList = document.querySelectorAll('.slider-container > li');
const slider = document.querySelector('.slider');

const chooseMarkerAnimationHandler = function () {
  localStorage.setItem('playerOneMarker', this.dataset.marker);
  if (this.dataset.marker === '1') {
    slider.dataset.move = 'right';
    this.querySelector('svg').dataset.color = 'primary';
    this.previousElementSibling.querySelector('svg').dataset.color = 'neutral';
  } else {
    slider.dataset.move = 'left';
    this.querySelector('svg').dataset.color = 'primary';
    this.nextElementSibling.querySelector('svg').dataset.color = 'neutral';
  }
};

const setDefaultPlayerOneMarker = function () {
  localStorage.clear();
  localStorage.setItem('playerOneMarker', '1');
};

setDefaultPlayerOneMarker();

for (const playerMark of playerMarkList) {
  playerMark.addEventListener('click', chooseMarkerAnimationHandler);
}

