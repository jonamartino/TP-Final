function loadAndDisplayData() {
  const dataContainer = document.getElementById('data-container');
  // Limpiar el contenedor de datos antes de mostrar los registros
  dataContainer.innerHTML = '';

  // Crear una tabla para mostrar los datos
  const table = document.createElement('table');
  table.className = 'game-table';

  // Crear la fila de cabecera
  const headerRow = document.createElement('tr');

  // Agregar celdas de cabecera
  const headers = ["Id", "Jugador 1", "Jugador 2", "Puntaje 1", "Puntaje 2", "Fecha"];
  for (const headerText of headers) {
      const headerCell = document.createElement('th');
      headerCell.textContent = headerText;
      headerRow.appendChild(headerCell);
  }

  // Agregar la fila de cabecera a la tabla
  table.appendChild(headerRow);

  // Obtener todas las claves que empiezan con 'lastGameState_'
  const gameStateKeys = Object.keys(localStorage).filter(key => key.startsWith('lastGameState_'));

  // Ordenar las claves de manera numérica
  gameStateKeys.sort((a, b) => {
    const numA = parseInt(a.split('_')[1]);
    const numB = parseInt(b.split('_')[1]);
    return numA - numB;
  });

  // Iterar sobre las claves ordenadas y mostrar los datos
  for (const key of gameStateKeys) {
    const gameStateString = localStorage.getItem(key);
    const lastGameState = JSON.parse(gameStateString);

    const row = document.createElement('tr');
    const indexCell = document.createElement('td');
    indexCell.textContent = key.split('_')[1]; // Obtener el número de registro
    row.appendChild(indexCell);

    const player1Cell = document.createElement('td');
    player1Cell.textContent = lastGameState.player1;
    row.appendChild(player1Cell);

    const player2Cell = document.createElement('td');
    player2Cell.textContent = lastGameState.player2;
    row.appendChild(player2Cell);

    const puntaje1Cell = document.createElement('td');
    puntaje1Cell.textContent = lastGameState.puntaje1;
    row.appendChild(puntaje1Cell);

    const puntaje2Cell = document.createElement('td');
    puntaje2Cell.textContent = lastGameState.puntaje2;
    row.appendChild(puntaje2Cell);

    const dateTimeCell = document.createElement('td');
    dateTimeCell.textContent = lastGameState.dateTime;
    row.appendChild(dateTimeCell);

    table.appendChild(row);
  }

  // Añadir la tabla al contenedor
  dataContainer.appendChild(table);
}
document.addEventListener('DOMContentLoaded', () => {
  loadAndDisplayData();

  const p1Header = document.querySelector('.game-table th:nth-child(4)');
  p1Header.addEventListener('click', () => {
      sortTableByPuntaje1();
  });
});

function sortTableByPuntaje1() {
  const table = document.querySelector('.game-table');
  console.log(table); // Verifica si table está seleccionando el elemento correcto
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((rowA, rowB) => {
    const puntajeA = parseInt(rowA.querySelector('td:nth-child(4)').textContent);
    const puntajeB = parseInt(rowB.querySelector('td:nth-child(4)').textContent);
    return puntajeA - puntajeB;
  });

  console.log(rows); // Verifica si rows contiene las filas correctas

  rows.forEach(row => {
    tbody.appendChild(row);
  });
}