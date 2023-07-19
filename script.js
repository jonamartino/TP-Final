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
          clearHighlightMoves();
          selectedCell = cell;
          selectedCell.classList.add('clicked');
          console.log('Ficha seleccionada en la posición:', { x: col, y: row });
          const pieceColor = cell.classList.contains('black') ? 'black' : 'white';
          const possibleMoves = determinePossibleMoves(col, row, pieceColor);
          const eatableMoves = determineEatableMoves(col, row, pieceColor);
          console.log('Posibles Ataques:', eatableMoves);
          console.log('Posibles movimientos:', possibleMoves);
          highlightAllowedMoves(possibleMoves);
          highlightEatableMoves(eatableMoves);
        } else if (selectedCell === cell) {
          selectedCell.classList.remove('clicked');
          clearHighlightMoves();
          selectedCell = null;
          console.log('Ficha deseleccionada');
        } else {
          selectedCell = cell;
          selectedCell.classList.add('clicked');
          console.log('Ficha seleccionada en la posición:', { x: col, y: row });
          const pieceColor = cell.classList.contains('black') ? 'black' : 'white';
          const possibleMoves = determinePossibleMoves(col, row, pieceColor);
          const eatableMoves = determineEatableMoves(col, row, pieceColor);
          console.log('Posibles Ataques:', eatableMoves);
          console.log('Posibles movimientos:', possibleMoves);
          highlightAllowedMoves(possibleMoves);
          highlightEatableMoves(eatableMoves);
        }
      } else if (cell.classList.contains('allowed')) {
        const selectedPieceColor = selectedCell.classList.contains('black') ? 'black' : 'white';
        movePiece(selectedCell, cell, selectedPieceColor);
      } else if (cell.classList.contains('eatable')) {
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
        const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
        if (!possibleCell.classList.contains('black') && !possibleCell.classList.contains('white')) {
          possibleMoves.push(possibleMove);
        }
      }
    }
  } else if (pieceColor === 'white') {
    // Movimiento para fichas blancas (hacia arriba)
    for (var yOffset of moveOffsets) {
      var possibleX = selectedPieceX + yOffset;
      var possibleY = selectedPieceY - 1;
      if (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
        var possibleMove = { x: possibleX, y: possibleY };
        const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
        if (!possibleCell.classList.contains('black') && !possibleCell.classList.contains('white')) {
          possibleMoves.push(possibleMove);
        }
      }
    }
  }
  return possibleMoves;
}
// Calcular las posiciones de movimiento de ataque de las fichas. Devuelve la posicion donde se movera la ficha.
function determineEatableMoves(selectedPieceX, selectedPieceY, pieceColor) {
  var eatableMoves = [];
  var moveOffsets = [-1, 1];
  if (pieceColor === 'black') {
    // Movimiento para fichas negras (hacia abajo)
    for (var yOffset of moveOffsets) {
      var possibleX = selectedPieceX + yOffset;
      var possibleY = selectedPieceY + 1;
      if (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
        var possibleMove = { x: possibleX, y: possibleY };
        const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
        if (!possibleCell.classList.contains('black') && possibleCell.classList.contains('white')){
          console.log("se puede comer la blanca en: ", possibleMove)
          const killcell = possibleCell;
          killcell.classList.add('kill');
          var eatableX = possibleX + yOffset;
          var eatableY = possibleY + 1;
          var eatableMove = { x: eatableX, y: eatableY };
          const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
          console.log(eatableMove);
          if(eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize){
            if(!eatableCell.classList.contains('black') && !eatableCell.classList.contains('white')){
              console.log("POSICION DE COMER EN: ", eatableMove)
              eatableMoves.push(eatableMove);
            } 
          }

        }
      } 
    }
  } else if (pieceColor === 'white') {
  // Movimiento para fichas blancas (hacia arriba)
  for (var yOffset of moveOffsets) {
    var possibleX = selectedPieceX + yOffset;
    var possibleY = selectedPieceY - 1;
    if (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
      var possibleMove = { x: possibleX, y: possibleY };
      const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
      if (!possibleCell.classList.contains('white') && possibleCell.classList.contains('black')){
        console.log("se puede comer la negra en: ", possibleMove)
        const killcell = possibleCell;
        killcell.classList.add('kill');
        var eatableX = possibleX + yOffset;
        var eatableY = possibleY - 1;
        var eatableMove = { x: eatableX, y: eatableY };
        const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
        console.log(eatableMove);
        if(!eatableCell.classList.contains('black') && !eatableCell.classList.contains('white')){
          console.log("POSICION DE COMER EN: ", eatableMove)
          eatableMoves.push(eatableMove);
        }
      }
    }
  }
  }

  return eatableMoves;
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

// Resaltar los movimientos permitidos agregando la clase .allowed a las celdas correspondientes
function highlightEatableMoves(eatableMoves) {
  eatableMoves.forEach(move => {
    const { x, y } = move;
    const allowedCell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (!allowedCell.classList.contains('black') && !allowedCell.classList.contains('white')) {
      allowedCell.classList.add('eatable');
    }
  });
}

// Mover la pieza a la posición seleccionada
function movePiece(sourceCell, targetCell, pieceColor) {
  if(targetCell.classList.contains('eatable')){
  const killCell = document.querySelector('.cell.kill');
  killCell.classList.remove('black','white');
  targetCell.classList.add(pieceColor);
  targetCell.classList.remove('allowed');
  targetCell.classList.remove('eatable');
  sourceCell.classList.remove(pieceColor);
  sourceCell.classList.remove('clicked');
  clearHighlightMoves();
  selectedCell = null;
  console.log('Pieza comida');
  changeTurn(); // Cambiar el turno después de mover la pieza
  updatePieceCount(); // Actualizar la información de la cantidad de fichas

  }else {
  targetCell.classList.add(pieceColor);
  targetCell.classList.remove('allowed');

  sourceCell.classList.remove(pieceColor);
  sourceCell.classList.remove('clicked');
  clearHighlightMoves();
  selectedCell = null;
  console.log('Pieza movida');
  changeTurn(); // Cambiar el turno después de mover la pieza
  updatePieceCount(); // Actualizar la información de la cantidad de fichas
  }
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
function clearHighlightMoves() {
  const allowedCells = document.querySelectorAll('.cell.allowed');
  const eatableCells = document.querySelectorAll('.cell.eatable');
  const killCells = document.querySelectorAll('.cell.kill');
  

  allowedCells.forEach(cell => {
    cell.classList.remove('allowed');
  });
  eatableCells.forEach(cell => {
    cell.classList.remove('eatable');
  });
  killCells.forEach(cell => {
    cell.classList.remove('kill');
  });
}

console.log('Tablero creado');