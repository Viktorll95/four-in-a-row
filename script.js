const board = document.querySelector("#board");

const RED_TURN = 1;
const YELLOW_TURN = 2;

//  | 0 - empty, 1 - red, 2 - yellow
// prettier-ignore
const pieces = [
  0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0,
];

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
        // Later, this will be used to style the winnning pieces (pieces that makes four in a row):
        // board.children[i].children[0].style.backgroundColor = "white";
        // board.children[i + 1].children[0].style.backgroundColor = "white";
        // board.children[i + 2].children[0].style.backgroundColor = "white";
        // board.children[i + 3].children[0].style.backgroundColor = "white";
        return true;
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
        return true;
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
        return true;
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
        return true;
      }
    }
  }
}

let playerTurn = RED_TURN; // 1 - red, 2 - yellow
let hoverColumn = -1;
let animating = false;

for (let i = 0; i < 42; i++) {
  let cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);

  cell.onmouseenter = () => {
    onMouseEnteredColumn(i % 7);
  };

  cell.onclick = () => {
    if (!animating) {
      onColumnClicked(i % 7);
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
      duration: 300,
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
    confirm("Game is a draw");

    removeAllPieces();
  }

  if (hasPlayerWon(playerTurn, pieces)) {
    // Current player has won
    confirm(`${playerTurn === RED_TURN ? "Red" : "Yellow"} player has won`);

    removeAllPieces();
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

document.querySelector("#reset").addEventListener("click", () => {
  removeAllPieces();
});
