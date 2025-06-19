const axios = require("axios");

const getOrphanTeams = async (req, res) => {
  try {
    const [playersRes, teamsRes] = await Promise.all([
      axios.get("http://data-service:3000/api/players?page=1&limit=1000"),
      axios.get("http://data-service:3000/api/teams")
    ]);

    const players = playersRes.data.players;
    const teams = teamsRes.data;

    const teamIdsWithPlayers = new Set(players.map(p => p.team?._id).filter(Boolean));
    const orphans = teams.filter(team => !teamIdsWithPlayers.has(team._id));

    res.json({ count: orphans.length, teams: orphans });
  } catch (err) {
    console.error("Błąd przy pobieraniu drużyn bez graczy:", err.message);
    res.status(500).json({ message: "Nie udało się pobrać drużyn bez graczy" });
  }
};

//kinderki <3

const getPlayerCountriesStats = async (req, res) => {
  try {
    const response = await axios.get("http://data-service:3000/api/players?page=1&limit=1000");
    const players = response.data.players;

    const stats = {};
    for (const p of players) {
      const country = p.country || "Nieznany";
      stats[country] = (stats[country] || 0) + 1;
    }

    res.json(stats);
  } catch (err) {
    console.error("Błąd przy statystyce krajów:", err.message);
    res.status(500).json({ message: "Nie udało się pobrać statystyki krajów" });
  }
};

const getTeamPlayerCountStats = async (req, res) => {
  try {
    const [playersRes, teamsRes] = await Promise.all([
      axios.get("http://data-service:3000/api/players?page=1&limit=1000"),
      axios.get("http://data-service:3000/api/teams")
    ]);

    const players = playersRes.data.players;
    const teams = teamsRes.data;

    const teamCounts = {};
    for (const team of teams) {
      teamCounts[team.short] = 0;
    }

    for (const player of players) {
      if (player.team?.short) {
        teamCounts[player.team.short]++;
      }
    }

    res.json(teamCounts);
  } catch (err) {
    console.error("Błąd przy zliczaniu graczy w drużynach:", err.message);
    res.status(500).json({ message: "Nie udało się wygenerować statystyki drużyn" });
  }
};

module.exports = {getOrphanTeams, getPlayerCountriesStats, getTeamPlayerCountStats};