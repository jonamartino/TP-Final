// lastgames.js

function loadAndDisplayData() {
    const dataContainer = document.getElementById('data-container');
    
    // Limpiar el contenedor de datos antes de mostrar los registros
    dataContainer.innerHTML = '';
  
    // Obtener todas las claves de localStorage y ordenarlas por número
    const keys = Object.keys(localStorage).filter(key => key.startsWith('lastGameState_'));
    keys.sort((a, b) => {
    const numA = Number(a.split('_')[1]);
    const numB = Number(b.split('_')[1]);
    return numA - numB;
    });
  
    // Iterar a través de las claves ordenadas
    for (const key of keys) {
      // Verificar si la clave comienza con 'lastGameState_'
      if (key.startsWith('lastGameState_')) {
        // Si es un registro de juego guardado, obtener los datos de localStorage
        const gameStateString = localStorage.getItem(key);
        const lastGameState = JSON.parse(gameStateString);
  
        // Crear un contenedor para cada registro
        const gameDataContainer = document.createElement('div');
        gameDataContainer.className = 'game-data';
  
        // Crear elementos DOM para mostrar los datos dentro del contenedor
        gameDataContainer.innerHTML = `
          <p>Registro ${key.split('_')[1]}:</p>
          <p>Player 1: ${lastGameState.player1}</p>
          <p>Player 2: ${lastGameState.player2}</p>
          <p>Puntaje 1: ${lastGameState.puntaje1}</p>
          <p>Puntaje 2: ${lastGameState.puntaje2}</p>
          <!-- Mostrar otros datos según sea necesario -->
        `;
  
        dataContainer.appendChild(gameDataContainer);
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayData();
  });
    window.addEventListener('load', () => {
        // Llama a la función para cargar y mostrar los datos solo cuando estamos en la página lastgames.html
        loadAndDisplayData();
        console.log('asdad');
      });