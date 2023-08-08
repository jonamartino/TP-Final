function loadAndDisplayData() {
  const dataContainer = document.getElementById('data-container');
  // Crear una tabla para mostrar los datos
  const table = document.getElementById('data-table');
  const tbody = document.getElementById('table-body');
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

    const score1Cell = document.createElement('td');
    score1Cell.textContent = lastGameState.score1;
    row.appendChild(score1Cell);

    const score2Cell = document.createElement('td');
    score2Cell.textContent = lastGameState.score2;
    row.appendChild(score2Cell);

    const dateTimeCell = document.createElement('td');
    dateTimeCell.textContent = lastGameState.dateTime;
    row.appendChild(dateTimeCell);

    tbody.appendChild(row);
  }
  // Añadir la tabla al contenedor
  table.appendChild(tbody);
  dataContainer.appendChild(table);
}

document.addEventListener('DOMContentLoaded', () => {
  loadAndDisplayData();
  const p1 = document.getElementById("s1");
  p1.addEventListener('click', () => {
      sortTableByPuntaje1();
      console.log('click')
  });
  const p2 = document.getElementById("s2");
  p2.addEventListener('click', () => {
      sortTableByPuntaje2();
      console.log('click')
  });
  const d = document.getElementById("date");
  date.addEventListener('click', () => {
      sortTableByDate();
      console.log('click')
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
    return puntajeB - puntajeA;
  });
  rows.forEach(row => {
    tbody.appendChild(row);
  });
}

function sortTableByPuntaje2() {
  const table = document.querySelector('.game-table');
  console.log(table); // Verifica si table está seleccionando el elemento correcto
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  rows.sort((rowA, rowB) => {
    const puntajeA = parseInt(rowA.querySelector('td:nth-child(5)').textContent);
    const puntajeB = parseInt(rowB.querySelector('td:nth-child(5)').textContent);
    return puntajeB - puntajeA;
  });
  rows.forEach(row => {
    tbody.appendChild(row);
  });
}

function sortTableByDate() {
  const table = document.querySelector('.game-table');
  console.log(table); // Verifica si table está seleccionando el elemento correcto
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  rows.sort((rowA, rowB) => {
    const puntajeA = parseInt(rowA.querySelector('td:nth-child(6)').textContent);
    const puntajeB = parseInt(rowB.querySelector('td:nth-child(6)').textContent);
    return puntajeB - puntajeA;
  });
  rows.forEach(row => {
    tbody.appendChild(row);
  });
}