const boardSize = 8; // Tamaño del tablero (8x8 en este caso)
const board = document.getElementById('board');
const message = document.getElementById('message');
let currentPlayer = 'black'; // Turno del jugador actual
let selectedCell = null; // Celda seleccionada actualmente
let totalPieces = 0; // Cantidad de fichas en el tablero
let blackPieces = 0; // Cantidad de fichas negras
let whitePieces = 0; // Cantidad de fichas blancas


// Configurar piezas iniciales
var initialPiecePositions = [
  { x: 1, y: 0 },
  { x: 3, y: 0 },
  { x: 5, y: 0 },
  { x: 7, y: 0 },
  { x: 0, y: 1 },
  { x: 2, y: 1 },
  { x: 4, y: 1 },
  { x: 6, y: 1 },
  { x: 1, y: 2 },
  { x: 3, y: 2 },
  { x: 5, y: 2 },
  { x: 7, y: 2 },
  { x: 0, y: 5 },
  { x: 2, y: 5 },
  { x: 4, y: 5 },
  { x: 6, y: 5 },
  { x: 1, y: 6 },
  { x: 3, y: 6 },
  { x: 5, y: 6 },
  { x: 7, y: 6 },
  { x: 0, y: 7 },
  { x: 2, y: 7 },
  { x: 4, y: 7 },
  { x: 6, y: 7 }
];

// Generar el tablero
for (let row = 0; row < boardSize; row++) {
  for (let col = 0; col < boardSize; col++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-x', col);
    cell.setAttribute('data-y', row);

    if ((row + col) % 2 === 0) {
      cell.classList.add('light');
    } else {
      cell.classList.add('dark');
    }

    cell.addEventListener('click', () => {
      if (cell.classList.contains(currentPlayer)) {
        if (selectedCell && selectedCell !== cell) {
          selectedCell.classList.remove('clicked');
          clearAllowedMoves();
          selectedCell = cell;
          selectedCell.classList.add('clicked');
          console.log('Ficha seleccionada en la posición:', { x: col, y: row });
          const pieceColor = cell.classList.contains('black') ? 'black' : 'white';
          const possibleMoves = determinePossibleMoves(col, row, pieceColor);
          console.log('Posibles movimientos:', possibleMoves);
          highlightAllowedMoves(possibleMoves);
        } else if (selectedCell === cell) {
          selectedCell.classList.remove('clicked');
          clearAllowedMoves();
          selectedCell = null;
          console.log('Ficha deseleccionada');
        } else {
          selectedCell = cell;
          selectedCell.classList.add('clicked');
          console.log('Ficha seleccionada en la posición:', { x: col, y: row });
          const pieceColor = cell.classList.contains('black') ? 'black' : 'white';
          const possibleMoves = determinePossibleMoves(col, row, pieceColor);
          console.log('Posibles movimientos:', possibleMoves);
          highlightAllowedMoves(possibleMoves);
        }
      } else if (cell.classList.contains('allowed')) {
        const selectedPieceColor = selectedCell.classList.contains('black') ? 'black' : 'white';
        movePiece(selectedCell, cell, selectedPieceColor);
      }
    });

    const isInitialPiece = initialPiecePositions.some(position => position.x === col && position.y === row);

    if (isInitialPiece) {
      const pieceColor = (row < 3) ? 'black' : 'white';
      cell.classList.add(pieceColor);
    }

    board.appendChild(cell);
  }
}

// Calcular las posiciones de movimiento posibles
function determinePossibleMoves(selectedPieceX, selectedPieceY, pieceColor) {
  var possibleMoves = [];
  var moveOffsets = [-1, 1];

  if (pieceColor === 'black') {
    // Movimiento para fichas negras (hacia abajo)
    for (var yOffset of moveOffsets) {
      var possibleX = selectedPieceX + yOffset;
      var possibleY = selectedPieceY + 1;
      if (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
        var possibleMove = { x: possibleX, y: possibleY };
        possibleMoves.push(possibleMove);
      }
    }
  } else if (pieceColor === 'white') {
    // Movimiento para fichas blancas (hacia arriba)
    for (var yOffset of moveOffsets) {
      var possibleX = selectedPieceX + yOffset;
      var possibleY = selectedPieceY - 1;
      if (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
        var possibleMove = { x: possibleX, y: possibleY };
        possibleMoves.push(possibleMove);
      }
    }
  }

  return possibleMoves;
}

// Resaltar los movimientos permitidos agregando la clase .allowed a las celdas correspondientes
function highlightAllowedMoves(possibleMoves) {
  possibleMoves.forEach(move => {
    const { x, y } = move;
    const allowedCell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (!allowedCell.classList.contains('black') && !allowedCell.classList.contains('white')) {
      allowedCell.classList.add('allowed');
    }
  });
}

// Mover la pieza a la posición seleccionada
function movePiece(sourceCell, targetCell, pieceColor) {
  targetCell.classList.add(pieceColor);
  targetCell.classList.remove('allowed');
  sourceCell.classList.remove(pieceColor);
  sourceCell.classList.remove('clicked');
  clearAllowedMoves();
  selectedCell = null;
  console.log('Pieza movida');
  changeTurn(); // Cambiar el turno después de mover la pieza
  updatePieceCount(); // Actualizar la información de la cantidad de fichas
}

// Cambiar el turno
function changeTurn() {
  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
  message.textContent = `Turno actual: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;
}

// Actualizar la información de la cantidad de fichas
function updatePieceCount() {
  const piecesOnBoard = document.querySelectorAll('.cell.black, .cell.white');
  totalPieces = piecesOnBoard.length;
  blackPieces = 0;
  whitePieces = 0;

  piecesOnBoard.forEach(cell => {
    if (cell.classList.contains('black')) {
      blackPieces++;
    } else if (cell.classList.contains('white')) {
      whitePieces++;
    }
  });

  console.log('Cantidad de fichas en el tablero:', totalPieces);
  console.log('Cantidad de fichas negras:', blackPieces);
  console.log('Cantidad de fichas blancas:', whitePieces);
}

// Limpiar el resaltado de los movimientos permitidos eliminando la clase .allowed de todas las celdas
function clearAllowedMoves() {
  const allowedCells = document.querySelectorAll('.cell.allowed');
  allowedCells.forEach(cell => {
    cell.classList.remove('allowed');
  });
}

console.log('Tablero creado');
