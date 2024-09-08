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

let playerTurn = RED_TURN; // 1 - red, 2 - yellow
let hoverColumn = -1;

for (let i = 0; i < 42; i++) {
  let cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);

  cell.onmouseenter = () => {
    onMouseEnteredColumn(i % 7);
  };

  cell.onclick = () => {
    onColumnClicked(i % 7);
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

  playerTurn === RED_TURN
    ? (playerTurn = YELLOW_TURN)
    : (playerTurn = RED_TURN);

  // update hovering piece
  updateHover();
}

function updateHover() {
  // remove existing unplaces piece
  let unplacedPiece = document.querySelector("[data-placed='false']");
  if (unplacedPiece) {
    unplacedPiece.parentElement.removeChild(unplacedPiece);
  }

  // add piece
  let cell = board.children[hoverColumn];
  let piece = document.createElement("div");
  piece.className = "piece";
  piece.dataset.placed = false;
  piece.dataset.player = playerTurn;
  cell.appendChild(piece);
}

function onMouseEnteredColumn(column) {
  hoverColumn = column;
  updateHover();
}
