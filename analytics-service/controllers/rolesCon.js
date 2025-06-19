const axios = require("axios");

const getRolesStats = async (req, res) => {
    try {
        const response = await axios.get("http://data-service:3000/api/players?page=1&limit=1000");
        const players = response.data.players;

        const rolesCount = {};
        for (const player of players) {
            const role = player.role || "unknown";
            rolesCount[role] = (rolesCount[role] || 0) + 1;
        }

        res.json(rolesCount);
    } catch (err) {
        console.error("Błąd przy pobieraniu danych z data-service", err.message);
        res.status(500).json({message: "Nie udało się przetworzyć statystyk ról"});
    }
};

const getOrphanPlayers = async (req, res) => {
  try {
    const response = await axios.get("http://data-service:3000/api/players?page=1&limit=1000");
    const players = response.data.players;

    const orphans = players.filter(p => !p.team);

    res.json({ count: orphans.length, players: orphans });
  } catch (err) {
    console.error("Błąd przy wyszukiwaniu graczy bez drużyn:", err.message);
    res.status(500).json({ message: "Nie udało się pobrać graczy bez drużyn" });
  }
};

module.exports = {
  getRolesStats,
  getOrphanPlayers
};


