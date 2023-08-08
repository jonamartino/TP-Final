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
let score1 = 12;
let score2 = 12;
let lastGameState = {};
let gameCounter = parseInt(localStorage.getItem('gameCounter')) || 1;
let selectedCell = null; // Celda seleccionada actualmente
let totalPieces = 0; // Cantidad de fichas en el tablero
let blackPieces = 0; // Cantidad de fichas negras
let whitePieces = 0; // Cantidad de fichas blancas
let blackQueenPieces = 0; //Cantidad de reinas negras
let whiteQueenPieces = 0; //Cantidad de reinas blancas

// Evento que se ejecuta antes de salir de la página
window.addEventListener('beforeunload', () => {
  if(player1 != ''){ //valido para que no se carguen registros vacios al salir del inicio
    saveLastgame();
  }  
});

// Evento para abrir registro de partidas como un popup
document.addEventListener('DOMContentLoaded', () => {
  const openPopupLink = document.getElementById('openPopupLink');
  openPopupLink.addEventListener('click', (event) => {
    event.preventDefault();
    openPopup('lastgames.html', 800, 600);
  });
  function openPopup(url, width, height) {
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(url, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
  }
});

// Evento para pagina de formulario de contacto
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const sendButton = document.getElementById("sendButton");
  sendButton.addEventListener("click", (event) => {
    event.preventDefault();
    // Validación del formulario
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const commentInput = document.getElementById("comment");
    if (!nameInput.checkValidity()) {
      alert("El nombre debe contener solo letras, números y espacios.");
      return;
    }
    if (!emailInput.checkValidity()) {
      alert("Por favor, ingrese un email válido.");
      return;
    }
    if (commentInput.value.length < 5) {
      alert("El mensaje debe tener al menos 5 caracteres.");
      return;
    }
    // Preparar los datos para enviar en el cuerpo del correo
    const name = nameInput.value;
    const email = emailInput.value;
    const comment = commentInput.value;
    // Crear el enlace mailto con los datos del formulario
    const mailtoLink = `mailto:jonamartino@gmail.com?subject=Formulario de contacto&body=Nombre: ${name}%0AEmail: ${email}%0AComentario: ${comment}`;
    // Abrir el cliente de correo predeterminado
    window.location.href = mailtoLink;
    // Preparar los datos para enviar en el cuerpo de la solicitud
    const formData = new FormData(contactForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Realizar la consulta HTTP utilizando Fetch a una API (puede ser JSONPlaceholder o cualquier otra)
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Mostrar la respuesta del Fetch en la consola
        console.log("Respuesta del Fetch:", responseData);

        // Aquí puedes manejar la respuesta de la API o mostrar un mensaje de éxito al usuario
        alert("Formulario enviado correctamente");
        // O redirigir a una página de agradecimiento
        // window.location.href = "pagina_de_agradecimiento.html";
      })
      .catch((error) => {
        // Manejar errores en caso de que la consulta falle
        console.error("Error:", error);
        alert("Hubo un error al enviar el formulario");
      });
  });
});

// Evento para que el juego comience automáticamente al cargar la página
window.addEventListener('load', () => {
  console.log(gameCounter);
  board.classList.add('closed');
  document.getElementById('player1').style.display = 'flex';
  document.getElementById('player2').style.display = 'flex';
  document.getElementById('player1').textContent = '\u00A0'; // Espacio en blanco
  document.getElementById('player2').textContent = '\u00A0'; // Espacio en blanco
  message.style.display = 'none';
  saveButton.style.display = 'none';
  restart.style.display = 'none';
  loadButton.style.display = 'flex';
});

// Evento para iniciar juego con boton "Nuevo Juego"
startButton.addEventListener('click', () => {
  message.style.display = 'none';
  document.getElementById('player1').style.display = 'flex';
  document.getElementById('player2').style.display = 'flex';
  player1 = prompt('Ingrese el nombre del Jugador 1 (fichas negras):');
  player2 = prompt('Ingrese el nombre del Jugador 2 (fichas blancas):');
  game();
  if (player1 && player2) {
    document.getElementById('player1').textContent = `${player1}: ${score1}`;
    document.getElementById('player2').textContent = `${player2}: ${score2}`;
  }
  board.classList.remove('closed');
  loadButton.style.display = 'none';
  saveButton.style.display = 'flex';
  restart.style.display = 'flex';
  startButton.style.display = 'none';
});

// Evento para guardar partida con boton "Guardar Partida"
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveGame);

// Evento para iniciar partida guardar con boton "Cargar Juego"
loadButton.addEventListener('click', () => {
  game();
  loadGame();
  if(currentPlayer == 'black'){
    container.style.color = 'white';
    container.style.backgroundColor = 'black';
  }else{
    container.style.color = 'black';
    container.style.backgroundColor = 'white';
  }
  if (player1 && player2) {
    document.getElementById('player1').textContent = `${player1}: ${score1}`;
    document.getElementById('player2').textContent = `${player2}: ${score2}`;
  }
  loadButton.style.display = 'none';
  saveButton.style.display = 'flex';
  restart.style.display = 'flex';
  startButton.style.display = 'none';
});

// Evento para reiniciar partida con boton "Reiniciar Juego"
restart.addEventListener('click', () => {
  resetGame();
});

// Función para cargar datos de partida guardada
function loadGame() {
  const savedState = localStorage.getItem('gameState');
  if (savedState) {
    const gameState = JSON.parse(savedState);
    currentPlayer = gameState.currentPlayer;
    blackPieces = gameState.blackPieces;
    whitePieces = gameState.whitePieces; 
    player1 = gameState.player1;
    player2 = gameState.player2;
    score1 = gameState.score1;
    score2 = gameState.score2;
    const boardState = gameState.boardState;
    restoreBoardState(boardState);
    updatePieceCount();
  } else {
    alert('No hay partida guardada.');
    const newGame = window.confirm("¿Iniciar nuevo juego?");
    if (newGame) {
      message.style.display = 'none';
      document.getElementById('player1').style.display = 'flex';
      document.getElementById('player2').style.display = 'flex';
      player1 = prompt('Ingrese el nombre del Jugador 1 (fichas negras):');
      player2 = prompt('Ingrese el nombre del Jugador 2 (fichas blancas):');
    } else {
      window.location.reload();
    } 
  }
}

// Funcion para cargar datos del tablero vacio 
function game(){
let initialPiecePositions = [
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
          const pieceColor = cell.classList.contains('black') ? 'black' : 'white';
          if(cell.classList.contains(`${currentPlayer}-queen`)){
            const queenColor = cell.classList.contains('black-queen') ? 'black-queen' : 'white-queen';
            const queenMoves = determinePossibleQueenMoves(col, row, queenColor);
            const queenEatable = determineQueenEatable(col, row, queenColor);
            highlightAllowedMoves(queenMoves);
            highlightEatableMoves(queenEatable);
          }else {
            const possibleMoves = determinePossibleMoves(col, row, pieceColor);
            const eatableMoves = determineEatableMoves(col, row, pieceColor);
            highlightAllowedMoves(possibleMoves);
            highlightEatableMoves(eatableMoves);
          }
        } else if (selectedCell === cell) {
          selectedCell.classList.remove('clicked');
          clearHighlightMoves();
          selectedCell = null;
        } else {
          selectedCell = cell;
          selectedCell.classList.add('clicked');
          const pieceColor = cell.classList.contains('black') ? 'black' : 'white';
          if(cell.classList.contains(`${currentPlayer}-queen`)){
            const queenColor = cell.classList.contains('black-queen') ? 'black-queen' : 'white-queen';
            const queenMoves = determinePossibleQueenMoves(col, row, queenColor);
            const queenEatable = determineQueenEatable(col, row, queenColor);
            highlightAllowedMoves(queenMoves);
            highlightEatableMoves(queenEatable);
          }else {
          const possibleMoves = determinePossibleMoves(col, row, pieceColor);
          const eatableMoves = determineEatableMoves(col, row, pieceColor);
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
        const newQueen = determineQueenEatable(col,row,selectedQueenColor);
        clearHighlightMoves();
        if(newQueen.length==0){
        updatePieceCount(); // Actualizar la información de la cantidad de fichas
        changeTurn(); // Cambiar el turno después de mover la pieza
        }
      } else {
        const selectedPieceColor = selectedCell.classList.contains('black') ? 'black' : 'white';
        movePiece(selectedCell, cell, selectedPieceColor); 
        const newEatable = determineEatableMoves(col, row, selectedPieceColor);
        clearHighlightMoves();
        if(newEatable.length==0){
        updatePieceCount(); // Actualizar la información de la cantidad de fichas
        changeTurn(); // Cambiar el turno después de mover la pieza
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

// Funcion para volver tablero al inicio conservando nombres
function resetGame() {
  let board = document.getElementById("board");
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  // Eliminar el resaltado de movimientos
  clearHighlightMoves();
  // Mostrar el botón de carga y ocultar el botón de guardar y reiniciar
  message.style.display = 'none'
  loadButton.style.display = 'none';
  saveButton.style.display = 'flex';
  restart.style.display = 'flex';
  startButton.style.display = 'none';
  score1 = 12;
  score2 = 12;
  document.getElementById('player1').style.display = 'flex';
  document.getElementById('player2').style.display = 'flex';
  currentPlayer = 'white';
  game();
  if(currentPlayer == 'black'){
    container.style.color = 'white';
    container.style.backgroundColor = 'black';
  }else{
    container.style.color = 'black';
    container.style.backgroundColor = 'white';
  }
  if (player1 && player2) {
    document.getElementById('player1').textContent = `${player1}: ${score1}`;
    document.getElementById('player2').textContent = `${player2}: ${score2}`;
  }
  updatePieceCount();
}

// Calcular las posiciones de movimiento posibles fichas peones
function determinePossibleMoves(selectedPieceX, selectedPieceY, pieceColor) {
  let possibleMoves = [];
  let moveOffsets = [-1, 1];
  if (pieceColor === 'black') {
    // Movimiento para fichas negras (hacia abajo)
    for (let yOffset of moveOffsets) {
      let possibleX = selectedPieceX + yOffset;
      let possibleY = selectedPieceY + 1;
      if (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
        let possibleMove = { x: possibleX, y: possibleY };
        const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
        if (!possibleCell.classList.contains('black') && !possibleCell.classList.contains('white') &&
            !possibleCell.classList.contains('white-queen') && !possibleCell.classList.contains('black-queen')) {
          possibleMoves.push(possibleMove);
        }
      }
    }
  } else if (pieceColor === 'white') {
    // Movimiento para fichas blancas (hacia arriba)
    for (let yOffset of moveOffsets) {
      let possibleX = selectedPieceX + yOffset;
      let possibleY = selectedPieceY - 1;
      if (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
        let possibleMove = { x: possibleX, y: possibleY };
        const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
        if (!possibleCell.classList.contains('white') && !possibleCell.classList.contains('black') &&
            !possibleCell.classList.contains('black-queen') && !possibleCell.classList.contains('white-queen')) {
          possibleMoves.push(possibleMove);
        }
      }
    }
  } else if(pieceColor === 'black-queen' || pieceColor === 'white-queen') {
  }
  return possibleMoves;
}

// Calcular las posiciones de movimiento posibles fichas reinas
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
        if (!possibleCell.classList.contains('black') && !possibleCell.classList.contains('white') && !possibleCell.classList.contains('white-queen') && !possibleCell.classList.contains('black-queen')){
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

// Calcular las posiciones de movimiento de captura de las fichas peones
function determineEatableMoves(selectedPieceX, selectedPieceY, pieceColor) {
  let eatableMoves = [];
  let moveOffsets = [-1, 1];
  if (pieceColor === 'black') {
    // Movimiento para fichas negras (hacia abajo)
    for (let yOffset of moveOffsets) {
      let possibleX = selectedPieceX + yOffset;
      let possibleY = selectedPieceY + 1;
      if (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
        const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
        if (!possibleCell.classList.contains('black') && possibleCell.classList.contains('white') ||
            !possibleCell.classList.contains('black') && possibleCell.classList.contains('white-queen')
        ){
          let eatableX = possibleX + yOffset;
          let eatableY = possibleY + 1;
          let eatableMove = { x: eatableX, y: eatableY };
          const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
          if(eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize){
            if(!eatableCell.classList.contains('black') && !eatableCell.classList.contains('white') &&
               !eatableCell.classList.contains('black-queen') && !eatableCell.classList.contains('white-queen')
            ){
              eatableMoves.push(eatableMove);              
              const killCell = possibleCell;
              killCell.classList.add('kill');
            } 
          }

        }
      } 
    }
  } else if (pieceColor === 'white') {
  // Movimiento para fichas blancas (hacia arriba)
  for (let yOffset of moveOffsets) {
    let possibleX = selectedPieceX + yOffset;
    let possibleY = selectedPieceY - 1;
    if (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
      let possibleMove = { x: possibleX, y: possibleY };
      const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
      if (!possibleCell.classList.contains('white') && possibleCell.classList.contains('black') ||
      !possibleCell.classList.contains('white') && possibleCell.classList.contains('black-queen')
      ){
        let eatableX = possibleX + yOffset;
        let eatableY = possibleY - 1;
        let eatableMove = { x: eatableX, y: eatableY };
        const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
        if(eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize){
        if(!eatableCell.classList.contains('black') && !eatableCell.classList.contains('white') &&
           !eatableCell.classList.contains('black-queen') && !eatableCell.classList.contains('white-queen')
          ){
          eatableMoves.push(eatableMove);
          const killCell = possibleCell;
          killCell.classList.add('kill');
        }
      }}
    }
  }
  } 
  return eatableMoves;
}

// Calcular las posiciones de movimiento de captura de las fichas reinas
function determineQueenEatable(selectedPieceX, selectedPieceY, queenColor) {
  const eatableMoves = [];
  const moveOffsets = [-1, 1];
  const selectedCell = document.querySelector(`.cell[data-x="${selectedPieceX}"][data-y="${selectedPieceY}"]`);
  // Movimiento para arriba y abajo
  for (const xOffset of moveOffsets) {
    for (const yOffset of moveOffsets) {
      if (xOffset === 0 && yOffset === 0) continue; // Saltar si el offset es (0, 0)
      let possibleX = selectedPieceX + xOffset;
      let possibleY = selectedPieceY + yOffset;
      while (possibleX >= 0 && possibleX < boardSize && possibleY >= 0 && possibleY < boardSize) {
        const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
        if (possibleCell.classList.contains('black')&&selectedCell.classList.contains('black-queen')){
          break;//cortar recorrido si hay una ficha de mismo color contigua 
        } else if ((selectedCell.classList.contains('black-queen') && (( 
            !possibleCell.classList.contains('black-queen') &&
            !possibleCell.classList.contains('black') && possibleCell.classList.contains('white')) || 
            !possibleCell.classList.contains('black-queen') &&
          ((!possibleCell.classList.contains('black') && possibleCell.classList.contains('white-queen'))))) ){
          // Si es una celda comestible
          let eatableX = possibleX + xOffset;
          let eatableY = possibleY + yOffset;
          let eatableMove = { x: eatableX, y: eatableY };
          const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
          if (eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize) {
            if (!eatableCell.classList.contains(queenColor) && !eatableCell.classList.contains('black') && !eatableCell.classList.contains('white') && !eatableCell.classList.contains('white-queen') && !eatableCell.classList.contains('black-queen')) {
              eatableMoves.push(eatableMove);
              const killCell = possibleCell;
              killCell.classList.add('kill');
            }
          }
          break; // Detener el ciclo while al encontrar una celda comestible
        } else if (possibleCell.classList.contains('white')&&selectedCell.classList.contains('white-queen')){
          break; //cortar recorrido si hay una ficha de mismo color contigua 
        } else if ((selectedCell.classList.contains('white-queen') && (( 
                   !possibleCell.classList.contains('white-queen') &&
                   !possibleCell.classList.contains('white') && possibleCell.classList.contains('black')) ||
                   !possibleCell.classList.contains('white-queen') &&
                 ((!possibleCell.classList.contains('white') && possibleCell.classList.contains('black-queen'))))) ){
          let eatableX = possibleX + xOffset;
          let eatableY = possibleY + yOffset;
          let eatableMove = { x: eatableX, y: eatableY };
          const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
          if (eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize) {
            if (!eatableCell.classList.contains(queenColor) && !eatableCell.classList.contains('black') && !eatableCell.classList.contains('white') && !eatableCell.classList.contains('white-queen') && !eatableCell.classList.contains('black-queen')) {
              eatableMoves.push(eatableMove);
              const killCell = possibleCell;
              killCell.classList.add('kill');
            }
          }
          break; // Detener el ciclo while al encontrar una celda comestible
        } else {
          possibleX += xOffset;
          possibleY += yOffset;
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
  killCell.classList.remove('black','white','black-queen','white-queen');
  sourceCell.classList.remove(pieceColor)
  const isQueen = shouldBecomeQueen(targetCell, pieceColor);
  if (isQueen) {
    pieceColor += '-queen';
  }
  targetCell.classList.add(pieceColor);
  targetCell.classList.remove('allowed');
  targetCell.classList.remove('eatable');
  sourceCell.classList.remove('clicked');
  clearHighlightMoves();
  selectedCell = null;
  } else if (sourceCell.classList.contains('white-queen')||sourceCell.classList.contains('black-queen')){
    targetCell.classList.add(pieceColor);
    targetCell.classList.remove('allowed');
    sourceCell.classList.remove(pieceColor);
    sourceCell.classList.remove('clicked');
    clearHighlightMoves();
    selectedCell = null;
    updatePieceCount(); // Actualizar la información de la cantidad de fichas
    changeTurn(); // Cambiar el turno después de mover la pieza
  } else {
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
  updatePieceCount(); // Actualizar la información de la cantidad de fichas
  changeTurn(); // Cambiar el turno después de mover la pieza
  }
}

// Agrega funcionalidad de reina a una ficha peon
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
  if(score1 == 0 || score2 == 0 ){
  } else{
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';  
    // Agregar/clasificar el color del turno actual al cuerpo del documento
    document.body.classList.remove('white-turn', 'black-turn');
    document.body.classList.add(`${currentPlayer}-turn`);
  }
}

// Actualizar la información de la cantidad de fichas y valida condiciones de victoria
function updatePieceCount() {
  const piecesOnBoard = document.querySelectorAll('.cell.black, .cell.white, .cell.black-queen, .cell.white-queen');
  totalPieces = piecesOnBoard.length;
  blackQueenPieces = 0;
  whiteQueenPieces = 0;
  blackPieces = 0;
  whitePieces = 0;
  piecesOnBoard.forEach(cell => {
    if (cell.classList.contains('black')) {
      blackPieces++;
    } else if (cell.classList.contains('white')) {
      whitePieces++;
    } else if (cell.classList.contains('black-queen')) {
      blackQueenPieces++;
    } else if (cell.classList.contains('white-queen')) {
      whiteQueenPieces++;
    }
  });
  score1 = blackPieces + blackQueenPieces*2;
  score2 = whitePieces + whiteQueenPieces*2;
  document.getElementById('player1').textContent = `${player1}: ${score1}`;
  document.getElementById('player2').textContent = `${player2}: ${score2}`;
  if(score1==0){
    alert('ha ganado ' +player2);
    document.getElementById('player2').textContent = `Ha ganado:${player2} con ${score2}pts`;
  } else if(score2==0){
    alert('ha ganado ' + player1);
    document.getElementById('player1').textContent = `Ha ganado:${player1} con ${score1}pts`;
  }
  console.log('Cantidad de fichas en el tablero:', totalPieces);
  console.log(`Puntaje de: ${player1}= `,score1);
  console.log(`Puntaje de: ${player2}= `,score2);
  //codigo para dar victoria cuando un jugador queda sin movimientos
  const cells = document.querySelectorAll('.cell');
  const moveListWhite = [];
  const moveListBlack = [];
  cells.forEach(cell => {
    const pieceColor = cell.classList.contains('black') ? 'black' : cell.classList.contains('white') ? 'white' : cell.classList.contains('white-queen') ? 'white-queen' : cell.classList.contains('black-queen') ? 'black-queen':null;
    const position = {
      x: parseInt(cell.getAttribute('data-x')),
      y: parseInt(cell.getAttribute('data-y')),
      color: pieceColor,
    };
    const {x,y,color} = position;
    if(color == 'white'){
      moveListWhite.push(determinePossibleMoves(x,y,color).length);
    } else if(color == 'white-queen'){
      moveListWhite.push(determinePossibleQueenMoves(x,y,color).length);
    } else if(color == 'black') {
      moveListBlack.push(determinePossibleMoves(x,y,color).length);
    } else if(color == 'black-queen'){
      moveListBlack.push(determinePossibleQueenMoves(x,y,color).length);
    }
  })
  let blackList = movePos(moveListBlack);
  let whiteList = movePos(moveListWhite);
  function movePos(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== 0) {
        return false; // Si encontramos un elemento distinto de cero, retornamos false
      }
    }
    return true; // Si todos los elementos son cero, retornamos true
  }
  if(score1!==0 && score2!==0){//valido para que no se muestre dos veces el alert
    if(blackList){
      alert('ha ganado ' +player2)
      document.getElementById('player2').textContent = `Ha ganado:${player2} con ${score2}pts`;
    }else if(whiteList){
      alert('ha ganado ' +player1)
      document.getElementById('player1').textContent = `Ha ganado:${player1} con ${score1}pts`;
    }
  }
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

// Guarda estado actual del tablero para boton "Guardar Partida"
function saveGameState() {
  const gameState = {
    currentPlayer,
    blackPieces,
    whitePieces,
    player1,
    player2,
    score1,
    score2,
    boardState: getBoardState(),
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Guarda estado actual de tablero para ser almacenado en pagina "Partidas Anteriores"
function saveLastgame() {
  const currentDate = new Date(); // Obtener la fecha y hora actual
  // Formatear la fecha y hora en un formato deseado
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear().toString().slice(-2)} 
                         ${currentDate.getHours()}:${currentDate.getMinutes()}`;
  lastGameState = {
    player1,
    player2,
    score1,
    score2,
    // Agregar la fecha y hora al objeto lastGameState
    dateTime: formattedDate
  };
  // Generar un identificador único para el registro actual usando el contador actual
  const key = `lastGameState_${gameCounter}`;
  // Guardar el registro en el almacenamiento local
  localStorage.setItem(key, JSON.stringify(lastGameState));
  // Incrementar el contador para el próximo registro
  gameCounter++;
  // Guardar el nuevo valor del contador en el almacenamiento local
  localStorage.setItem('gameCounter', gameCounter.toString());
}

// Obtiene estado actual del tablero para ser guardado
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

// Restaura estado anterior guardado del tablero 
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