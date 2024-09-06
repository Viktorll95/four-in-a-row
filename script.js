const board = document.querySelector("#board");

const red_turn = 1;
const yellow_turn = 2;

// 42 cells | 1 - red, 2 - yellow
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
  for (let i = 0; i < pieces.length; i++) {
    // check horizontal win starting at index
    if (i % 7 < 4) {
      if((pieces(i)===playerTurn) &&
      (pieces(i+1)===playerTurn) &&
      (pieces(i+2)===playerTurn) &&
      (pieces(i+3)===playerTurn))
    }
    // Check vertical win starting at index
    // Check diagonal win starting at index
    // Check diagonal win (other direction) starting at index
  }
}

let playerTurn = red_turn; // 1: red, 2: yellow
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
      onColumnClick(i % 7);
    }
  };
}

function onColumnClick(column) {
  let availableRow = pieces
    .filter((_, index) => index % 7 === column)
    .lastIndexOf(0);
  if (availableRow === -1) {
    //No space in the column
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
  let animation = piece.animate(
    [
      { transform: `translateY(${yDiff}px)`, offset: 0 },
      { transform: `translateY(0px)`, offset: 0.6 },
      { transform: `translateY(${yDiff / 20}px)`, offset: 0.8 },
      { transform: `translateY(0px)`, offset: 0.95 },
    ],
    {
      duration: 400,
      easing: "linear",
      iteration: 1,
    }
  );

  animation.addEventListener("finish", checkGameWinOrDraw);

  // Update color of hovering piece
  updateHover();
}

function checkGameWinOrDraw() {
  animating = false;

  // Check if game is a drawn
  if (!pieces.includes(0)) {
    // Game is a draw
    confirm("Game is a draw");
    location.reload();
  }

  // Check if current player has won
  if (hasPlayerWon(playerTurn, pieces)) {
    // Current player has won
    confirm(`${playerTurn === red_turn ? "Red" : "Yellow"} player has won`);
    location.reload();
  }

  if (playerTurn === red_turn) {
    playerTurn = yellow_turn;
  } else {
    playerTurn = red_turn;
  }
}

function updateHover() {
  removeUnplacedPiece();

  // add piece
  if (pieces[hoverColumn] === 0) {
    let cell = board.children[hoverColumn];
    let piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.placed = false;
    piece.dataset.player = playerTurn;
    cell.appendChild(piece);
  }
}

function removeUnplacedPiece() {
  let unplacedPiece = document.querySelector("[data-placed='false']");
  if (unplacedPiece) {
    unplacedPiece.parentElement.removeChild(unplacedPiece);
  }
}

function onMouseEnteredColumn(column) {
  hoverColumn = column;
  updateHover();
}
