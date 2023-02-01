const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Eroor ${e.message}`);
  }
};

initializeDbAndServer();
module.exports = app;

///GET playsrs

app.get("/players/", async (request, response) => {
  const getPlayers = `select * from cricket_team;`;
  const playerArray = await db.all(getPlayers);
  response.send(playerArray);
});

///POST Players

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const addBookQuery = `
    insert into 
    cricket_team(player_id,player_name,jersey_number,role)
    values(${player_id},${player_name},${jersey_number},${role});`;
  const dbResponse = await db.run(addBookQuery);
  response.send("Player Added to Team");
});

///GET Single Player

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  console.log(playerId);
  const getPlayerQuery = `select * from cricket_team 
    where player_id=${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});
///PUT player(Update)

app.put("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuary = `update cricket_team 
    set
     playerName:${playerName},
     jerseyNumber:${jerseyNumber},
     role:${role}
     where 
     playerId=${playerId};
    `;
  await db.run(updatePlayerQuary);
  response.send("Player Details Updated");
});

///Delete Player

app.delete("/player/:playerId", async (request, response) => {
  const playerId = request.params;
  const deleteQuary = `delete from cricket_team where playerId=${playerId};`;
  await db.run(deleteQuary);
  response.send("Player Remove");
});

module.exports = app;
