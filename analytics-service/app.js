const exp = require("express");
const morgan = require("morgan");
const cors = require("cors");
const {getRolesStats, getOrphanPlayers} = require("./controllers/rolesCon");
const {getOrphanTeams, getPlayerCountriesStats, getTeamPlayerCountStats} = require("./controllers/statsCon");
const app = exp();
const PORT = process.env.ANALYTIC_PORT || 4000;

app.use(cors());
app.use(morgan("dev"));

app.get("/stats/statusus", (req, res) => {
    res.json({message: "Poggers"});
});
app.get("/stats/roles", getRolesStats);
app.get("/stats/orphans/players", getOrphanPlayers);
app.get("/stats/orphans/teams", getOrphanTeams);
app.get("/stats/countries", getPlayerCountriesStats);
app.get("/stats/teams/count", getTeamPlayerCountStats);

app.listen(4000, () => console.log("ANAL NA PORCIE", PORT));
app.get("/health", (req, res) => res.sendStatus(200));