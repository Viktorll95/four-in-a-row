const board = document.querySelector("#board");
const modal = document.querySelector(".modal-play-again");
const modalMessage = document.querySelector("#modal-message");
const windoot = new Audio("windoot.mp3");
const coinDrop = new Audio("coin-drop.mp3");
const waterDrop = new Audio("water-drop.mp3");
const winSoundEffect = windoot;
const dropPieceSoundEffect = waterDrop;

const RED_TURN = 1;
const YELLOW_TURN = 2;

let gameOver = false;

//  | 0 - empty, 1 - red, 2 - yellow
// prettier-ignore
let pieces = [
  0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0,
];

function displayWinningConnection(
  firstIndex,
  secondIndex,
  thirdIndex,
  fourthIndex
) {
  removeUnplacedPiece();
  gameOver = true;
  // Current player has won
  modalMessage.textContent = `${
    playerTurn === RED_TURN ? "Red" : "Yellow"
  } player has won`;

  updateWinCounter(playerTurn);

  setTimeout(() => {
    removeUnplacedPiece();
    winSoundEffect.play();
    board.children[firstIndex].children[0].classList.add("winning-piece");
    setTimeout(() => {
      board.children[secondIndex].children[0].classList.add("winning-piece");
      setTimeout(() => {
        board.children[thirdIndex].children[0].classList.add("winning-piece");
        setTimeout(() => {
          board.children[fourthIndex].children[0].classList.add(
            "winning-piece"
          );
          setTimeout(() => {
            showModal();
            return true;
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }, 400);
}
function hasPlayerWon(playerTurn, pieces) {
  for (let i = 0; i < 42; i++) {
    // check for horisontal win
    if (i % 7 < 4) {
      if (
        pieces[i] === playerTurn &&
        pieces[i + 1] === playerTurn &&
        pieces[i + 2] === playerTurn &&
        pieces[i + 3] === playerTurn
      ) {
        displayWinningConnection(i, i + 1, i + 2, i + 3);
      }
    }
    // check for vertical win
    if (i < 21) {
      if (
        pieces[i] === playerTurn &&
        pieces[i + 7] === playerTurn &&
        pieces[i + 14] === playerTurn &&
        pieces[i + 21] === playerTurn
      ) {
        displayWinningConnection(i, i + 7, i + 14, i + 21);
      }
    }
    // check for diagonal win \
    if (i % 7 < 4 && i < 21) {
      if (
        pieces[i] === playerTurn &&
        pieces[i + 8] === playerTurn &&
        pieces[i + 16] === playerTurn &&
        pieces[i + 24] === playerTurn
      ) {
        displayWinningConnection(i, i + 8, i + 16, i + 24);
      }
    }
    // check for other diagonal win /
    if (i % 7 < 4 && i > 20 && i < 42) {
      if (
        pieces[i] === playerTurn &&
        pieces[i - 6] === playerTurn &&
        pieces[i - 12] === playerTurn &&
        pieces[i - 18] === playerTurn
      ) {
        displayWinningConnection(i, i - 6, i - 12, i - 18);
      }
    }
  }
}

let playerTurn = Math.random() < 0.5 ? RED_TURN : YELLOW_TURN;
// 1 - red, 2 - yellow
let hoverColumn = -1;
let animating = false;

for (let i = 0; i < 42; i++) {
  let cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);

  cell.onmouseenter = () => {
    if (!gameOver) {
      onMouseEnteredColumn(i % 7);
    }
  };

  cell.onclick = () => {
    if (!gameOver) {
      if (!animating) {
        onColumnClicked(i % 7);
      }
    }
  };
}

function onColumnClicked(column) {
  let availableRow = pieces.filter((_, i) => i % 7 === column).lastIndexOf(0);
  if (availableRow === -1) {
    // no space in the column
    return;
  }
  pieces[availableRow * 7 + column] = playerTurn;
  let cell = board.children[availableRow * 7 + column];

  let piece = document.createElement("div");
  piece.className = "piece";
  piece.dataset.placed = true;
  piece.dataset.player = playerTurn;
  cell.appendChild(piece);

  let unplacedPiece = document.querySelector("[data-placed='false']");
  let unplacedY = unplacedPiece.getBoundingClientRect().y;
  let placedY = piece.getBoundingClientRect().y;
  let yDiff = unplacedY - placedY;

  // coinDrop.play();
  dropPieceSoundEffect.play();
  animating = true;
  removeUnplacedPiece();
  let animation = piece.animate(
    [
      { transform: `translateY(${yDiff}px)`, offset: 0 },
      { transform: `translateY(0px)`, offset: 0.8 },
      { transform: `translateY(${yDiff * 0.075}px)`, offset: 0.9 },
      { transform: `translateY(0px)`, offset: 1 },
    ],
    {
      duration: 400,
      easing: "linear",
      iterations: 1,
    }
  );

  animation.addEventListener("finish", checkGameWinOrDraw);
}

function removeAllPieces() {
  // Select all "piece" elements inside "cell" elements
  const pieces = document.querySelectorAll(".cell .piece");
  // Loop through each "piece" and remove it
  pieces.forEach((piece) => piece.remove());
}

function checkGameWinOrDraw() {
  animating = false;

  // check if game is draw
  if (!pieces.includes(0)) {
    // Game is a draw
    modalMessage.textContent = "Game is a draw";

    showModal();
  }

  if (hasPlayerWon(playerTurn, pieces)) {
  }

  playerTurn === RED_TURN
    ? (playerTurn = YELLOW_TURN)
    : (playerTurn = RED_TURN);

  // update hovering piece
  updateHover();
}

function updateHover() {
  removeUnplacedPiece();

  if (pieces[hoverColumn] === 0) {
    // add piece
    let cell = board.children[hoverColumn];
    let piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.placed = false;
    piece.dataset.player = playerTurn;
    cell.appendChild(piece);
  }
}

function removeUnplacedPiece() {
  // remove existing unplaces piece
  let unplacedPiece = document.querySelector("[data-placed='false']");
  if (unplacedPiece) {
    unplacedPiece.parentElement.removeChild(unplacedPiece);
  }
}

function onMouseEnteredColumn(column) {
  hoverColumn = column;
  if (!animating) {
    updateHover();
  }
}

function showModal() {
  gameOver = true;
  removeUnplacedPiece();
  modal.classList.remove("hidden");
}

function hideModal() {
  modal.classList.add("hidden");
}

document.querySelector("#reset").addEventListener("click", () => {
  pieces = pieces.map((piece) => (piece = 0));
  removeAllPieces();
  playerTurn = Math.random() < 0.5 ? RED_TURN : YELLOW_TURN;
  hideModal();
  gameOver = false;
});

////////////////////////////////////////////////
// Player info bar

// Define default player names
let player1Name = "Player 1";
let player2Name = "Player 2";

// Get the input elements for player names
const player1Input = document.getElementById("player1-name");
const player2Input = document.getElementById("player2-name");

// Add event listeners to update the player names when changed
player1Input.addEventListener("input", function () {
  player1Name = player1Input.value || "Player 1"; // Fallback to default if input is empty
  resetWinCounter();
});

player2Input.addEventListener("input", function () {
  player2Name = player2Input.value || "Player 2"; // Fallback to default if input is empty
  resetWinCounter();
});

let player1Wins = 0;
let player2Wins = 0;

function updateWinCounter(player) {
  if (player === 1) {
    player1Wins++;
    document.getElementById("player1-wins").textContent = `${player1Wins}`;
  } else if (player === 2) {
    player2Wins++;
    document.getElementById("player2-wins").textContent = `${player2Wins}`;
  }
}

// Function to reset win counters when player name is updated
function resetWinCounter(player) {
  if (player === 1) {
    player1Wins = 0;
    document.getElementById("player1-wins").textContent = "0";
  } else if (player === 2) {
    player2Wins = 0;
    document.getElementById("player2-wins").textContent = "0";
  }
}

// Event listeners for player name changes
document
  .getElementById("player1-name")
  .addEventListener("input", () => resetWinCounter(1));
document
  .getElementById("player2-name")
  .addEventListener("input", () => resetWinCounter(2));

// Empty event listeners for buttons
document.getElementById("switch-turn").addEventListener("click", () => {
  removeUnplacedPiece();
  playerTurn === YELLOW_TURN
    ? (playerTurn = RED_TURN)
    : (playerTurn = YELLOW_TURN);
});

document.getElementById("restart-game").addEventListener("click", () => {
  modalMessage.textContent = `"Restart Game" was pressed`;
  showModal();
});

const toggleMusicBtn = document.getElementById("toggle-music");
const musicIcon = toggleMusicBtn.querySelector("i");

const toggleSoundBtn = document.getElementById("toggle-sound");
const soundIcon = toggleSoundBtn.querySelector("i");

toggleSoundBtn.addEventListener("click", () => {
  // Toggle sound on/off logic
  if (soundIcon.classList.contains("bi-volume-up")) {
    soundIcon.classList.replace("bi-volume-up", "bi-volume-mute"); // Change icon to muted
    winSoundEffect.muted = true;
    dropPieceSoundEffect.muted = true;
  } else {
    soundIcon.classList.replace("bi-volume-mute", "bi-volume-up"); // Change icon to sound on
    winSoundEffect.muted = false;
    dropPieceSoundEffect.muted = false;
  }
});

document.addEventListener("keydown", (event) => {
  if (!gameOver) {
    if (!animating) {
      if (event.key >= "1" && event.key <= "7") {
        onMouseEnteredColumn(Number(event.key) - 1);
        onColumnClicked(Number(event.key) - 1);
      }
    }
  }
});

toggleMusicBtn.addEventListener("click", () => {
  showMusicModal();
  // if (musicIcon.classList.contains("bi-volume-up")) {
  //   musicIcon.classList.replace("bi-volume-up", "bi-volume-mute"); // Change icon to muted
  // } else {
  //   musicIcon.classList.replace("bi-volume-mute", "bi-volume-up"); // Change icon to sound on
  // }
});

////////////////////////////////////
// Music control

const musicModal = document.querySelector(".music-modal-container");

function showMusicModal() {
  musicModal.classList.remove("hidden");
  event.stopPropagation(); // Prevent click event from propagating to the document-level listener
}

function closeMusicModal() {
  musicModal.classList.add("hidden");
}

// Close button on music modal that closes it
document
  .querySelector(".btn-music-modal-close")
  .addEventListener("click", closeMusicModal);

// Close modal on 'Escape' key press
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMusicModal();
  }
});

// Close modal when clicking outside the modal content
document.addEventListener("click", function (event) {
  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".music-modal-content");
  if (event.target !== modalContent && !modalContent.contains(event.target)) {
    closeMusicModal();
  }
});

const audioPlayer = document.getElementById("audio-player");
let isPlaying = false;

// Function to play the selected song
function playSong(song) {
  audioPlayer.src = "music/" + song; // Set the source of the audio element
  audioPlayer.play(); // Start playing the selected song
  isPlaying = true;
  updateButtonState(); // Update play/pause button states
  musicIcon.classList.replace("bi-volume-mute", "bi-volume-up"); // Change icon to sound on
}

// Function to play the audio if paused
function playAudio() {
  if (!isPlaying) {
    audioPlayer.play();
    isPlaying = true;
    updateButtonState(); // Update button state
    musicIcon.classList.replace("bi-volume-mute", "bi-volume-up"); // Change icon to sound on
  }
}

// Function to pause the audio
function pauseAudio() {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    updateButtonState(); // Update button state
  }
  musicIcon.classList.replace("bi-volume-up", "bi-volume-mute"); // Change icon to muted
}

// Function to stop the audio (pause and reset)
function stopAudio() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0; // Reset audio to the beginning
  isPlaying = false;
  updateButtonState(); // Update button state
  musicIcon.classList.replace("bi-volume-up", "bi-volume-mute"); // Change icon to muted
}

// Function to close the modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Function to update the play and pause button states
function updateButtonState() {
  const playButton = document.getElementById("play-btn");
  const pauseButton = document.getElementById("pause-btn");

  if (isPlaying) {
    playButton.classList.add("disabled"); // Disable the play button when playing
    pauseButton.classList.remove("disabled"); // Enable the pause button
  } else {
    playButton.classList.remove("disabled"); // Enable play button when paused
    pauseButton.classList.add("disabled"); // Disable pause button
  }
}

// Initialize the buttons as disabled when no song is playing
window.onload = () => {
  updateButtonState();
};

////////////////////////////
