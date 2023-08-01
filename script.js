const boardSize = 8; // Tamaño del tablero (8x8 en este caso)
const board = document.getElementById('board');
const boardClosed = document.querySelector('.board-closed');
const message = document.getElementById('message');
const restart = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const loadButton = document.getElementById('loadButton');
const container = document.getElementById('container');
let currentPlayer = 'white'; // Turno del jugador actual
let player1 = '';
let player2 = '';
// Variables globales para los nombres de los jugadores

let selectedCell = null; // Celda seleccionada actualmente
let totalPieces = 0; // Cantidad de fichas en el tablero
let blackPieces = 0; // Cantidad de fichas negras
let whitePieces = 0; // Cantidad de fichas blancas

// Agrega un listener para que el juego comience automáticamente al cargar la página
window.addEventListener('load', () => {
  board.classList.add('closed');
  message.style.display = 'none';
  saveButton.style.display = 'none';
  restart.style.display = 'none';
  loadButton.style.display = 'flex';
  
});

startButton.addEventListener('click', () => {
  player1 = prompt('Ingrese el nombre del Jugador 1 (fichas negras):');
  player2 = prompt('Ingrese el nombre del Jugador 2 (fichas blancas):');
  juego();
  if (player1 && player2) {
    document.getElementById('player1').textContent = `Turno de: ${player1}`;
    document.getElementById('player2').textContent = `Turno de: ${player2}`;
  }
  board.classList.remove('closed');
  //startButton.style.display = 'none'; // Ocultar botón de inicio
  loadButton.style.display = 'none';
  saveButton.style.display = 'flex';
  restart.style.display = 'flex';
  startButton.style.display = 'none';

});

loadButton.addEventListener('click', () => {
  juego();
  loadGame();
  if(currentPlayer == 'black'){
    container.style.color = 'white';
    container.style.backgroundColor = 'black';

  }else{
    container.style.color = 'black';
    container.style.backgroundColor = 'white';
  }
  if (player1 && player2) {
    document.getElementById('player1').textContent = `Turno de: ${player1}`;
    document.getElementById('player2').textContent = `Turno de: ${player2}`;
  }
  loadButton.style.display = 'none';
  saveButton.style.display = 'flex';
  restart.style.display = 'flex';
  startButton.style.display = 'none';


  });

restart.addEventListener('click', () => {
  resetGame();

});


function juego(){
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

    if(currentPlayer == 'black'){
      container.style.color = 'white';
      container.style.backgroundColor = 'black';
    }else{
      container.style.color = 'black';
      container.style.backgroundColor = 'white';
    }
    cell.addEventListener('click', () => {
      if (cell.classList.contains(currentPlayer)|| cell.classList.contains(`${currentPlayer}-queen`)) {
        if (selectedCell && selectedCell !== cell) {
          selectedCell.classList.remove('clicked');
          clearHighlightMoves();
          selectedCell = cell;
          selectedCell.classList.add('clicked');
          console.log('Ficha seleccionada en la posición:', { x: col, y: row });
          console.log(cell.classList.contains(`${currentPlayer}-queen`));
          const pieceColor = cell.classList.contains('black') ? 'black' : 'white';
          if(cell.classList.contains(`${currentPlayer}-queen`)){
            const queenColor = cell.classList.contains('black-queen') ? 'black-queen' : 'white-queen';
            const queenMoves = determinePossibleQueenMoves(col, row, queenColor);
            console.log('Posibles Ataques de reina:');
            console.log('Posibles movimientos de reina:', queenMoves);
            highlightAllowedMoves(queenMoves);
          }else {
            const possibleMoves = determinePossibleMoves(col, row, pieceColor);
            const eatableMoves = determineEatableMoves(col, row, pieceColor);
            console.log('Posibles Ataques:', eatableMoves);
            console.log('Posibles movimientos:', possibleMoves);
            highlightAllowedMoves(possibleMoves);
            highlightEatableMoves(eatableMoves);
          }

        } else if (selectedCell === cell) {
          selectedCell.classList.remove('clicked');
          clearHighlightMoves();
          selectedCell = null;
          console.log('Ficha deseleccionada');
        } else {
          selectedCell = cell;
          selectedCell.classList.add('clicked');
          console.log('Ficha seleccionada en la posición:', { x: col, y: row });
          console.log(cell.classList.contains(`${currentPlayer}-queen`));
          const pieceColor = cell.classList.contains('black') ? 'black' : 'white';
          if(cell.classList.contains(`${currentPlayer}-queen`)){
            const queenColor = cell.classList.contains('black-queen') ? 'black-queen' : 'white-queen';
            const queenMoves = determinePossibleQueenMoves(col, row, queenColor);
            console.log('Posibles Ataques de reina:');
            console.log('Posibles movimientos de reina:', queenMoves);
            highlightAllowedMoves(queenMoves);
          }else {
          const possibleMoves = determinePossibleMoves(col, row, pieceColor);
          const eatableMoves = determineEatableMoves(col, row, pieceColor);
          console.log('Posibles Ataques:', eatableMoves);
          console.log('Posibles movimientos:', possibleMoves);
          highlightAllowedMoves(possibleMoves);
          highlightEatableMoves(eatableMoves);
          }
        }
      } else if (cell.classList.contains('allowed')) {
        if(selectedCell.classList.contains('black-queen')||selectedCell.classList.contains('white-queen')){
          const selectedQueenColor = selectedCell.classList.contains('black-queen') ? 'black-queen' : 'white-queen';
          movePiece(selectedCell, cell, selectedQueenColor);
        } else{
        const selectedPieceColor = selectedCell.classList.contains('black') ? 'black' : 'white';
        movePiece(selectedCell, cell, selectedPieceColor);
      }
     } else if (cell.classList.contains('eatable')) {
      if(selectedCell.classList.contains('black-queen')||selectedCell.classList.contains('white-queen')){
        const selectedQueenColor = selectedCell.classList.contains('black-queen') ? 'black-queen' : 'white-queen';
        movePiece(selectedCell, cell, selectedQueenColor);
      } else {
        const selectedPieceColor = selectedCell.classList.contains('black') ? 'black' : 'white';
        movePiece(selectedCell, cell, selectedPieceColor); 
        const nuevoeatable = determineEatableMoves(col, row, selectedPieceColor)
        clearHighlightMoves();

        if(nuevoeatable.length==0){
        changeTurn(); // Cambiar el turno después de mover la pieza
        updatePieceCount(); // Actualizar la información de la cantidad de fichas
        }
      } 
    }
      if(currentPlayer == 'black'){
        container.style.color = 'white';
        container.style.backgroundColor = 'black';
      }else{
        container.style.color = 'black';
        container.style.backgroundColor = 'white';
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
}

function resetGame() {
  // Eliminar todas las fichas del tablero
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('black', 'white', 'white-queen', 'black-queen');
  });

  // Restaurar las fichas iniciales en sus posiciones iniciales
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

    // Reiniciar el turno y contar las fichas nuevamente
    currentPlayer = 'white';
    updatePieceCount();
  if(currentPlayer == 'black'){
    container.style.color = 'white';
    container.style.backgroundColor = 'black';
  }else{
    container.style.color = 'black';
    container.style.backgroundColor = 'white';
  }

  initialPiecePositions.forEach(position => {
    const { x, y } = position;
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    const pieceColor = (y < 3) ? 'black' : 'white';
    cell.classList.add(pieceColor);
  });





  // Eliminar el resaltado de movimientos
  clearHighlightMoves();

  // Mostrar el botón de carga y ocultar el botón de guardar y reiniciar
  loadButton.style.display = 'none';
  saveButton.style.display = 'flex';
  restart.style.display = 'flex';

  
  // Cerrar el tablero
  board.classList.add('closed');
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
  } else if(pieceColor === 'black-queen' || pieceColor === 'white-queen') {
    return determinePossibleQueenMoves(selectedPieceX, selectedPieceY, pieceColor);
  }
  return possibleMoves;
}

function determinePossibleQueenMoves(selectedPieceX, selectedPieceY, pieceColor) {
  const possibleMoves = [];
  const moveOffsets = [-1, 1];

  // Movimiento para arriba y abajo
  for (const xOffset of moveOffsets) {
    for (const yOffset of moveOffsets) {
      let possibleX = selectedPieceX + xOffset;
      let possibleY = selectedPieceY + yOffset;

      while (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
        const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
        if (!possibleCell.classList.contains('black') && !possibleCell.classList.contains('white')) {
          possibleMoves.push({ x: possibleX, y: possibleY });
        } else {
          break; // No podemos saltar sobre otras fichas
        }

        possibleX += xOffset;
        possibleY += yOffset;
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
          var eatableX = possibleX + yOffset;
          var eatableY = possibleY + 1;
          var eatableMove = { x: eatableX, y: eatableY };
          const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
          if(eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize){
            if(!eatableCell.classList.contains('black') && !eatableCell.classList.contains('white')){
              console.log("POSICION DE COMER EN: ", eatableMove)
              eatableMoves.push(eatableMove);              
              const killcell = possibleCell;
              killcell.classList.add('kill');
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
        var eatableX = possibleX + yOffset;
        var eatableY = possibleY - 1;
        var eatableMove = { x: eatableX, y: eatableY };
        const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
        if(eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize){
        if(!eatableCell.classList.contains('black') && !eatableCell.classList.contains('white')){
          console.log("POSICION DE COMER EN: ", eatableMove)
          eatableMoves.push(eatableMove);
          const killcell = possibleCell;
          killcell.classList.add('kill');
        }
      }}
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

// Resaltar los movimientos permitidos agregando la clase .eatable a las celdas correspondientes
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
  sourceCell.classList.remove(pieceColor)
  const isQueen = shouldBecomeQueen(targetCell, pieceColor);
  if (isQueen) {
    pieceColor += '-queen';
  }
  targetCell.classList.add(pieceColor);
  targetCell.classList.remove('allowed');
  targetCell.classList.remove('eatable');
;
  sourceCell.classList.remove('clicked');
  clearHighlightMoves();
  selectedCell = null;
  console.log('Pieza comida');
  }else if (sourceCell.classList.contains('white-queen')||sourceCell.classList.contains('black-queen')){
    console.log('mov reina')
    targetCell.classList.add(pieceColor);
    targetCell.classList.remove('allowed');
  
    sourceCell.classList.remove(pieceColor);
    sourceCell.classList.remove('clicked');
    clearHighlightMoves();
    selectedCell = null;
    console.log('Pieza movida');
    changeTurn(); // Cambiar el turno después de mover la pieza
    updatePieceCount(); // Actualizar la información de la cantidad de fichas

  }else {
    sourceCell.classList.remove(pieceColor);
    const isQueen = shouldBecomeQueen(targetCell, pieceColor);
    if (isQueen) {
      pieceColor += '-queen';
    }
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

function shouldBecomeQueen(cell, pieceColor) {
  if (pieceColor === 'white' && cell.getAttribute('data-y') === '0') {
    return true; // Ficha blanca llegó a la última fila, convertirse en reina
  } else if (pieceColor === 'black' && cell.getAttribute('data-y') === '7') {
    return true; // Ficha negra llegó a la primera fila, convertirse en reina
  }
  return false;
}

// Cambiar el turno
function changeTurn() {
  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';  
  message.textContent = `Turno actual: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;

  // Agregar/clasificar el color del turno actual al cuerpo del documento
  document.body.classList.remove('white-turn', 'black-turn');
  document.body.classList.add(`${currentPlayer}-turn`);
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
function saveGameState() {
  const gameState = {
    currentPlayer,
    blackPieces,
    whitePieces,
    player1,
    player2,
    boardState: getBoardState(),
  };

  localStorage.setItem('gameState', JSON.stringify(gameState));
}

function getBoardState() {
  const boardState = [];
  const cells = document.querySelectorAll('.cell');

  cells.forEach(cell => {
    const pieceColor = cell.classList.contains('black') ? 'black' : cell.classList.contains('white') ? 'white' : cell.classList.contains('white-queen') ? 'white-queen' : cell.classList.contains('black-queen') ? 'black-queen':null;
    const position = {
      x: parseInt(cell.getAttribute('data-x')),
      y: parseInt(cell.getAttribute('data-y')),
      color: pieceColor,
    };
    boardState.push(position);
  });

  return boardState;
}

// Función para cargar la partida al hacer clic en el botón "Cargar Partida"
function loadGame() {
  const savedState = localStorage.getItem('gameState');
  if (savedState) {
    const gameState = JSON.parse(savedState);
    currentPlayer = gameState.currentPlayer;
    blackPieces = gameState.blackPieces;
    whitePieces = gameState.whitePieces; 
    player1 = gameState.player1;
    player2 = gameState.player2;

    const boardState = gameState.boardState;
    restoreBoardState(boardState);
  } else {
    alert('No hay partida guardada.');
  }
}

function restoreBoardState(boardState) {
  boardState.forEach(position => {
    const { x, y, color } = position;
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    cell.classList.remove('black', 'white');
    if (color) {
      cell.classList.add(color);
    }
  });
}

// Función para guardar la partida al hacer clic en el botón "Guardar Partida"
function saveGame() {
  saveGameState();
  alert('Partida guardada exitosamente.');

}

// Agregamos el evento click al botón "Guardar Partida"
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveGame);


console.log('Tablero creado');