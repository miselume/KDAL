const players = [];

for (let i = 1; i <= 10; i++) {
  players.push({
    id: `Player${i}`,
    team: i <= 5 ? 'Red' : 'Blue',
    kills: 0,
    deaths: 0,
    assists: 0
  });
}

const playerMap = {};
players.forEach(p => playerMap[p.id] = p);

function renderTable() {
  const redBody = document.querySelector('#red-team tbody');
  const blueBody = document.querySelector('#blue-team tbody');
  redBody.innerHTML = '';
  blueBody.innerHTML = '';

  players.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${p.id}</td><td>${p.kills}</td><td>${p.deaths}</td><td>${p.assists}</td>`;
    if (p.team === 'Red') redBody.appendChild(row);
    else blueBody.appendChild(row);
  });
}

const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (msg) => {
  const event = JSON.parse(msg.data);
  const killer = playerMap[event.killer];
  const assist = playerMap[event.assist];
  const victim = playerMap[event.victim];

  killer.kills++;
  assist.assists++;
  victim.deaths++;

  renderTable();
};

renderTable();
