const board = document.querySelector("#board");

const red_turn = 1;
const yellow_turn = 2;

// 42 cells | 1 - red, 2 - yellow
const pieces = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

let playerTurn = red_turn; // 1: red, 2: yellow
let hoverColumn = -1;

for (let i = 0; i < 42; i++) {
  let cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);

  cell.onmouseenter = () => {
    onMouseEnteredColumn(i % 7);
  };

  cell.onclick = () => {
    onColumnClick(i % 7);
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

  piece.animate(
    [
      { transform: `translateY(${yDiff}px)`, offset: 0 },
      { transform: `translateY(0px)`, offset: 1 },
    ],
    {
      duration: 400,
      easing: "linear",
      iteration: 1,
    }
  );

  if (playerTurn === red_turn) playerTurn = yellow_turn;
  else {
    playerTurn = red_turn;
  }

  // Update color of hovering piece
  updateHover();
}

function updateHover() {
  //remove existing piece
  let unplacedPiece = document.querySelector("[data-placed='false']");
  if (unplacedPiece) {
    unplacedPiece.parentElement.removeChild(unplacedPiece);
  }

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

function onMouseEnteredColumn(column) {
  hoverColumn = column;
  updateHover();
}
