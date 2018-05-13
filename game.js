const gameObjects = document.querySelectorAll('.game-object');
const doNote = new Audio('./sounds/do.wav');
const reNote = new Audio('./sounds/re.wav');
const miNote = new Audio('./sounds/mi.wav');
const faNote = new Audio('./sounds/fa.wav');
const errorNote = new Audio('./sounds/error.mp3');

const notesMap = {
  1: doNote,
  2: reNote,
  3: miNote,
  4: faNote,
  error: errorNote
};

let gameSoundArray = [];
let turnsCounter = 0;

let scoreEl = document.getElementById('score');
let startBtn = document.getElementById('start-btn');

let player = {
  canPlay: false,
  notesCounter: 0,
  score: 0,
  myTurn: () => (player.canPlay = true),
  resetCounter: () => (player.notesCounter = 0),
  simonsTurn: simonsTurn,
  resetGame: resetGame
};

function simonsTurn() {
  this.canPlay = false;
  setTimeout(() => {
    autoPlay();
  }, 1500);
}

const startGame = () =>{
  autoPlay();
  startBtn.style.display = 'none';
}
function resetGame() {
  gameSoundArray = [];
  this.notesCounter = 0;
  this.canPlay = false;
  this.score = 0;
  scoreEl.innerText = 0;
  startBtn.style.display = 'block';
}

for (let i = 0; i < gameObjects.length; i++) {
  const element = gameObjects[i];
  element.addEventListener('click', e => {
    handleUserClick(e.target);
  });
}

const handleUserClick = item => {
  if (!player.canPlay) return;
  const keyNote = item.id;
  if (parseInt(keyNote) === gameSoundArray[player.notesCounter]) {
    player.notesCounter++;
    play(item, keyNote);
  } else {
    playItem(notesMap, 'error');
    player.resetGame();
    return;
  }
  if (player.notesCounter === gameSoundArray.length) {
    player.simonsTurn();
    player.resetCounter();
    scoreEl.innerText = ++player.score;
  }
};

const autoPlay = () => {
  let targetArray = gameSoundArray;
  var note = generateRandomNote(1, 4);
  targetArray.push(note);
  playNotesArray(targetArray).then(() => {
    console.log('Simon is done |||| counter is at:', ++turnsCounter);
    player.myTurn();
  });
};

const playNotesArray = array => {
  return load(array, 750);
};

const timer = (ms) => {
  return new Promise(r => setTimeout(r, ms));
}

async const load = (range, ms = 750) => {
  range.forEach(item => {
    hadnlePlayedItems(notesMap, item);
    await timer(ms);
  });
  return Promise.resolve();
}

const hadnlePlayedItems = (obj, key) => {
  let el = document.getElementById(key);
  play(el, key);
};

const play = (item, key) => {
  playItem(notesMap, key);
  item.classList.add('opacity');
  setTimeout(function() {
    item.classList.remove('opacity');
  }, 500);
};

const playItem = (target, key) => {
  target[key].play();
};

const generateRandomNote = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
