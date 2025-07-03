const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const players = Array.from({ length: 10 }, (_, i) => ({
  id: `Player${i + 1}`,
  team: i < 5 ? 'Red' : 'Blue'
}));

function getRandomPlayer(team = null) {
  const filtered = team
    ? players.filter(p => p.team === team)
    : players;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

setInterval(() => {
  const rng = Math.floor(Math.random() * 11);

  if (rng > 5) {
    const killer = getRandomPlayer();
    const assist = getRandomPlayer(killer.team);
    const enemyTeam = killer.team === 'Red' ? 'Blue' : 'Red';
    const victim = getRandomPlayer(enemyTeam);

    const event = {
      killer: killer.id,
      assist: assist.id,
      victim: victim.id
    };

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(event));
      }
    });

    console.log(`[EVENT] ${killer.id} killed ${victim.id} with help of ${assist.id}`);
  }
}, 2000);
