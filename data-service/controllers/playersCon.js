const Player = require("../models/player");
const Team = require("../models/team");



const pokazujGraczy = async (req, res) => {
    try {
        const {page = 1, limit = 10, role, team} = req.query;
        const filter = {};
        if (role) {
            filter.role = role;
        }
        if (team) {
            filter.team = team;
        }

        const players = await Player.find(filter)
            .populate("team", "name short region")
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const count = await Player.countDocuments(filter);

        res.json({total: count, page: parseInt(page), pages: Math.ceil(count/limit), players});
    } catch (er) {
        res.status(500).json({message: "Coś tu poszło nie po naszej myśli", error: er.message});
    }
};

const dodajGracza = async (req, res) => {
    try {
        let { name, nickname, role, age, country, team, avatar } = req.body;

        if (!name || !nickname || !role) {
            return res.status(400).json({ message: "Brakuje wymaganych pól: name, nickname, role" });
        }

        const VALID_ROLES = ["top", "jungle", "mid", "bot", "support"];
        if (!VALID_ROLES.includes(role)) {
            return res.status(400).json({ message: "Niepoprawna rola. Dozwolone: top, jungle, mid, bot, support" });
        }

        if (team?.trim()) {
            const existingTeam = await Team.findOne({ short: team.trim() });
            if (!existingTeam) {
                return res.status(400).json({ message: "Podany zespół nie istnieje" });
            }
            team = existingTeam._id;
        } else {
            team = null;
        }


        const newPlayer = new Player({ name, nickname, role, age, country, team, avatar });
        const saved = await newPlayer.save();

        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: "Nie udało się dodać gracza", error: err.message });
    }
};

const usunGracza = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Player.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Nie znaleziono gracza" });
        }

        res.json({ message: "Gracz usunięty", player: deleted });
    } catch (err) {
        res.status(500).json({ message: "Błąd przy usuwaniu gracza", error: err.message });
    }
};

const edytujGracza = async (req, res) => {
  try {
    let { name, nickname, role, age, country, team, avatar } = req.body;

    const VALID_ROLES = ["top", "jungle", "mid", "bot", "support"];
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: "Niepoprawna rola" });
    }

    if (team?.trim()) {
        const existingTeam = await Team.findOne({ short: team.trim() });
        if (!existingTeam) {
            return res.status(400).json({ message: "Podany zespół nie istnieje" });
        }
        team = existingTeam._id;
    } else {
        team = null;
    }


    const updated = await Player.findByIdAndUpdate(
      req.params.id,
      { name, nickname, role, age, country, team, avatar },
      { new: true }
    ).populate("team", "name short region");

    if (!updated) {
      return res.status(404).json({ message: "Gracz nie znaleziony" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Błąd przy edycji", error: err.message });
  }
};



module.exports = { pokazujGraczy, dodajGracza, usunGracza, edytujGracza };