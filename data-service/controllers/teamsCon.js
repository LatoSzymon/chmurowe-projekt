const Team = require("../models/team");

const dodajTeam = async (req, res) => {
    try {
        const { name, short, region, founded, logo } = req.body;

        if (!name || !short || !region) {
            return res.status(400).json({ message: "Brakuje wymaganych pól: name, short, region" });
        }

        const existing = await Team.findOne({ short });
        if (existing) {
            return res.status(409).json({ message: "Zespół z takim skrótem już istnieje" });
        }

        const team = new Team({ name, short, region, founded, logo });
        const saved = await team.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: "Nie udało się dodać zespołu", error: err.message });
    }
};

const pobierzTeamy = async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: "Nie udało się pobrać zespołów", error: err.message });
    }
};

const usunTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Team.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Nie znaleziono zespołu" });
        }

        res.json({ message: "Zespół usunięty", team: deleted });
    } catch (err) {
        res.status(500).json({ message: "Błąd przy usuwaniu zespołu", error: err.message });
    }
};

const pobierzTeamPoId = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: "Nie znaleziono drużyny" });
        res.json(team);
    } catch (err) {
        res.status(500).json({ message: "Błąd serwera", error: err.message });
    }
};


module.exports = { dodajTeam, pobierzTeamy, usunTeam, pobierzTeamPoId };

