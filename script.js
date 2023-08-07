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
let puntaje1 = 12;
let puntaje2 = 12;
let lastGameState = {};
let gameCounter = parseInt(localStorage.getItem('gameCounter')) || 1;
// Variables globales para los nombres de los jugadores
let selectedCell = null; // Celda seleccionada actualmente
let totalPieces = 0; // Cantidad de fichas en el tablero
let blackPieces = 0; // Cantidad de fichas negras
let whitePieces = 0; // Cantidad de fichas blancas
let blackQueenPieces = 0; //Cantidad de reinas negras
let whiteQueenPieces = 0; //Cantidad de reinas blancas

//Logica del formulario de contacto
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



// Agrega un listener para que el juego comience automáticamente al cargar la página
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

startButton.addEventListener('click', () => {
  message.style.display = 'none';
  document.getElementById('player1').style.display = 'flex';
  document.getElementById('player2').style.display = 'flex';
  player1 = prompt('Ingrese el nombre del Jugador 1 (fichas negras):');
  player2 = prompt('Ingrese el nombre del Jugador 2 (fichas blancas):');
  juego();
  if (player1 && player2) {
    document.getElementById('player1').textContent = `${player1}: ${puntaje1}`;
    document.getElementById('player2').textContent = `${player2}: ${puntaje2}`;
  }
  board.classList.remove('closed');
  //startButton.style.display = 'none'; // Ocultar botón de inicio
  loadButton.style.display = 'none';
  saveButton.style.display = 'flex';
  restart.style.display = 'flex';
  startButton.style.display = 'none';
});

// Agregamos el evento click al botón "Guardar Partida"
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveGame);

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
    document.getElementById('player1').textContent = `${player1}: ${puntaje1}`;
    document.getElementById('player2').textContent = `${player2}: ${puntaje2}`;
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
            const queenEatable = determineQueenEatable(col, row, queenColor);
            console.log('Posibles Ataques de reina:', queenEatable);
            console.log('Posibles movimientos de reina:', queenMoves);
            highlightAllowedMoves(queenMoves);
            highlightEatableMoves(queenEatable);
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
            const queenEatable = determineQueenEatable(col, row, queenColor);
            console.log('Posibles Ataques de reina:', queenEatable);
            console.log('Posibles movimientos de reina:', queenMoves);
            highlightAllowedMoves(queenMoves);
            highlightEatableMoves(queenEatable);
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
        const nuevoqueen = determineQueenEatable(col,row,selectedQueenColor);
        clearHighlightMoves();
        if(nuevoqueen.length==0){
        updatePieceCount(); // Actualizar la información de la cantidad de fichas
        changeTurn(); // Cambiar el turno después de mover la pieza
        }
      } else {
        const selectedPieceColor = selectedCell.classList.contains('black') ? 'black' : 'white';
        movePiece(selectedCell, cell, selectedPieceColor); 
        const nuevoeatable = determineEatableMoves(col, row, selectedPieceColor);

        clearHighlightMoves();
        if(nuevoeatable.length==0){
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


function resetGame() {
  var board = document.getElementById("board");
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
  puntaje1 = 12;
  puntaje2 = 12;
  document.getElementById('player1').style.display = 'flex';
  document.getElementById('player2').style.display = 'flex';
  currentPlayer = 'white';
  juego();
  if(currentPlayer == 'black'){
    container.style.color = 'white';
    container.style.backgroundColor = 'black';
  }else{
    container.style.color = 'black';
    container.style.backgroundColor = 'white';
  }
  if (player1 && player2) {
    document.getElementById('player1').textContent = `${player1}: ${puntaje1}`;
    document.getElementById('player2').textContent = `${player2}: ${puntaje2}`;
  }
  updatePieceCount();
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
        if (!possibleCell.classList.contains('black') && !possibleCell.classList.contains('white') &&
            !possibleCell.classList.contains('white-queen') && !possibleCell.classList.contains('black-queen')) {
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
        if (!possibleCell.classList.contains('white') && !possibleCell.classList.contains('black') &&
            !possibleCell.classList.contains('black-queen') && !possibleCell.classList.contains('white-queen')) {
          possibleMoves.push(possibleMove);
        }
      }
    }
  } else if(pieceColor === 'black-queen' || pieceColor === 'white-queen') {
    console.log('test');
    console.log('piececolor: ',pieceColor);
    //return determinePossibleQueenMoves(selectedPieceX, selectedPieceY, pieceColor);
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
        if (!possibleCell.classList.contains('black') && !possibleCell.classList.contains('white') && !possibleCell.classList.contains('white-queen') && !possibleCell.classList.contains('black-queen')){
          possibleMoves.push({ x: possibleX, y: possibleY });
        } else {
          break; // No podemos saltar sobre otras fichas
        }
        console.log('test1');
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
        const possibleCell = document.querySelector(`.cell[data-x="${possibleX}"][data-y="${possibleY}"]`);
        if (!possibleCell.classList.contains('black') && possibleCell.classList.contains('white') ||
            !possibleCell.classList.contains('black') && possibleCell.classList.contains('white-queen')
        ){
          var eatableX = possibleX + yOffset;
          var eatableY = possibleY + 1;
          var eatableMove = { x: eatableX, y: eatableY };
          const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
          if(eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize){
            if(!eatableCell.classList.contains('black') && !eatableCell.classList.contains('white') &&
               !eatableCell.classList.contains('black-queen') && !eatableCell.classList.contains('white-queen')
            ){
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
      if (!possibleCell.classList.contains('white') && possibleCell.classList.contains('black') ||
      !possibleCell.classList.contains('white') && possibleCell.classList.contains('black-queen')
      ){
        var eatableX = possibleX + yOffset;
        var eatableY = possibleY - 1;
        var eatableMove = { x: eatableX, y: eatableY };
        const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
        if(eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize){
        if(!eatableCell.classList.contains('black') && !eatableCell.classList.contains('white') &&
           !eatableCell.classList.contains('black-queen') && !eatableCell.classList.contains('white-queen')
          ){
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
          console.log(selectedCell.classList.contains('black-queen'));  
          // Si es una celda comestible
          var eatableX = possibleX + xOffset;
          var eatableY = possibleY + yOffset;
          var eatableMove = { x: eatableX, y: eatableY };
          const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);

          if (eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize) {
            if (!eatableCell.classList.contains(queenColor) && !eatableCell.classList.contains('black') && !eatableCell.classList.contains('white') && !eatableCell.classList.contains('white-queen') && !eatableCell.classList.contains('black-queen')) {
              console.log("POSICION DE COMER EN: ", eatableMove)
              eatableMoves.push(eatableMove);
              const killcell = possibleCell;
              killcell.classList.add('kill');
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
          var eatableX = possibleX + xOffset;
          var eatableY = possibleY + yOffset;
          var eatableMove = { x: eatableX, y: eatableY };
          const eatableCell = document.querySelector(`.cell[data-x="${eatableX}"][data-y="${eatableY}"]`);
          if (eatableX >= 0 && eatableX < boardSize && eatableY >= 0 && eatableY < boardSize) {
            console.log(!eatableCell.classList.contains(queenColor), !eatableCell.classList.contains('black'), !eatableCell.classList.contains('white') , !eatableCell.classList.contains('white-queen'), !eatableCell.classList.contains('black-queen'));
            if (!eatableCell.classList.contains(queenColor) && !eatableCell.classList.contains('black') && !eatableCell.classList.contains('white') && !eatableCell.classList.contains('white-queen') && !eatableCell.classList.contains('black-queen')) {
              console.log("POSICION DE COMER EN: ", eatableMove)
              eatableMoves.push(eatableMove);
              const killcell = possibleCell;
              killcell.classList.add('kill');
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
  console.log('Pieza comida');
  } else if (sourceCell.classList.contains('white-queen')||sourceCell.classList.contains('black-queen')){
    console.log('mov reina')
    targetCell.classList.add(pieceColor);
    targetCell.classList.remove('allowed');
    sourceCell.classList.remove(pieceColor);
    sourceCell.classList.remove('clicked');
    clearHighlightMoves();
    selectedCell = null;
    console.log('Pieza movida');
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
  console.log('Pieza movida');
  updatePieceCount(); // Actualizar la información de la cantidad de fichas
  changeTurn(); // Cambiar el turno después de mover la pieza

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
  if(puntaje1 == 0 || puntaje2 == 0 ){
    console.log('no hago nada')
  } else{
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';  
    // Agregar/clasificar el color del turno actual al cuerpo del documento
    document.body.classList.remove('white-turn', 'black-turn');
    document.body.classList.add(`${currentPlayer}-turn`);
  }
}

// Actualizar la información de la cantidad de fichas
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

  puntaje1 = blackPieces + blackQueenPieces*2;
  puntaje2 = whitePieces + whiteQueenPieces*2;
  document.getElementById('player1').textContent = `${player1}: ${puntaje1}`;
  document.getElementById('player2').textContent = `${player2}: ${puntaje2}`;

  if(puntaje1==0){
    console.log('ha ganado jugador 2');
    //victoria(player2, puntaje2);
    alert('ha ganado ' +player2);
    document.getElementById('player2').textContent = `Ha ganado:${player2} con ${puntaje2}pts`;
  } else if(puntaje2==0){
    console.log('ha ganado jugador 1');
    //victoria(player1, puntaje1);
    alert('ha ganado ' + player1);
    document.getElementById('player1').textContent = `Ha ganado:${player1} con ${puntaje1}pts`;
  }

  console.log('Cantidad de fichas en el tablero:', totalPieces);
  console.log(`Puntaje de: ${player1}= `,puntaje1);
  console.log(`Puntaje de: ${player2}= `,puntaje2);

  //codigo para dar victoria cuando un jugador queda sin movimientos
  const cells = document.querySelectorAll('.cell');
  const movdispBlancas = [];
  const movdispNegras = [];
  cells.forEach(cell => {
    const pieceColor = cell.classList.contains('black') ? 'black' : cell.classList.contains('white') ? 'white' : cell.classList.contains('white-queen') ? 'white-queen' : cell.classList.contains('black-queen') ? 'black-queen':null;
    const position = {
      x: parseInt(cell.getAttribute('data-x')),
      y: parseInt(cell.getAttribute('data-y')),
      color: pieceColor,
    };
    const {x,y,color} = position;
    if(color == 'white'){
      movdispBlancas.push(determinePossibleMoves(x,y,color).length);
    } else if(color == 'white-queen'){
      movdispBlancas.push(determinePossibleQueenMoves(x,y,color).length);
    } else if(color == 'black') {
      movdispNegras.push(determinePossibleMoves(x,y,color).length);
    } else if(color == 'black-queen'){
      movdispNegras.push(determinePossibleQueenMoves(x,y,color).length);
    }
  })
  let negras = movdisp(movdispNegras);
  let blancas = movdisp(movdispBlancas);
  function movdisp(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== 0) {
        return false; // Si encontramos un elemento distinto de cero, retornamos false
      }
    }
    return true; // Si todos los elementos son cero, retornamos true
  }
  if(negras){
    //victoria(player2,puntaje2);
    alert('ha ganado ' +player2)
    document.getElementById('player2').textContent = `Ha ganado:${player2} con ${puntaje2}pts`;
  }else if(blancas){
    //victoria(player1,puntaje1);
    alert('ha ganado ' +player1)
    document.getElementById('player1').textContent = `Ha ganado:${player1} con ${puntaje1}pts`;
  }
  console.log(negras);
  console.log(blancas);

}

 function victoria(player,puntaje){
  var board = document.getElementById("board");
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  document.getElementById('player1').style.display = 'flex';
  document.getElementById('player2').style.display = 'flex';
  document.getElementById('player1').textContent = '\u00A0'; // Espacio en blanco
  document.getElementById('player2').textContent = '\u00A0'; // Espacio en blanco
  console.log('victoria');
  board.classList.add('closed');
  saveButton.style.display = 'none';
  restart.style.display = 'flex';
  startButton.style.display = 'flex';
  message.style.display = 'flex';
  message.style.position = 'absolute';
  document.getElementById('message').textContent = `Ha ganado: ${player} con ${puntaje}pts`;
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
    puntaje1,
    puntaje2,
    boardState: getBoardState(),
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
}


function saveLastgame() {
  lastGameState = {
    currentPlayer,
    blackPieces,
    whitePieces,
    player1,
    player2,
    puntaje1,
    puntaje2,
    boardState: getBoardState(),
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

// Evento que se ejecuta antes de salir de la página
window.addEventListener('beforeunload', saveLastgame);



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
    puntaje1 = gameState.puntaje1;
    puntaje2 = gameState.puntaje2;
    const boardState = gameState.boardState;
    restoreBoardState(boardState);
    updatePieceCount();
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

console.log('Tablero creado');

