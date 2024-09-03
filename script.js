const board = document.querySelector("#board");

for (let i = 0; i < 42; i++) {
  let cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);

  cell.onmouseenter = () => {
    onMouseEnteredColumn(i % 7);
  };
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
