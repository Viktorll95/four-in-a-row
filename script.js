const board = document.querySelector("#board");

// 42 cells | 1 - red, 2 - yellow
const pieces = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

for (let i = 0; i < 42; i++) {
  let cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);

  cell.onmouseenter = () => {
    onMouseEnteredColumn(i % 7);
  };

  cell.onClick = () => {
    onColumnClick(i % 7);
  };
}

function onColumnClick(column) {
  pieces.filter((_, index) => index % 7 === column);
}

function onMouseEnteredColumn(column) {
  //remove existing piece
  let unplacedPiece = document.querySelector("[data-placed='false']");
  if (unplacedPiece) {
    unplacedPiece.parentElement.removeChild(unplacedPiece);
  }

  // add piece
  let cell = board.children[column];
  let piece = document.createElement("div");
  piece.className = "piece";
  piece.dataset.placed = false;
  cell.appendChild(piece);
}
