import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";

const AdminPanel = () => {
  const { keycloak } = useKeycloak();
  const [stats, setStats] = useState({
    players: [],
    teams: [],
    orphanPlayers: [],
    orphanTeams: [],
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [players, teams, orphanPlayers, orphanTeams] = await Promise.all([
          fetch("/api/players?page=1&limit=1000", {
            headers: { Authorization: `Bearer ${keycloak.token}` }
          }).then(res => res.json()).then(data => data.players || []),

          fetch("/api/teams", {
            headers: { Authorization: `Bearer ${keycloak.token}` }
          }).then(res => res.json()),

          fetch("/stats/orphans/players", {
            headers: { Authorization: `Bearer ${keycloak.token}` }
          }).then(res => res.json()).then(data => data.players || []),

          fetch("/stats/orphans/teams", {
            headers: { Authorization: `Bearer ${keycloak.token}` }
          }).then(res => res.json()).then(data => data.teams || [])
        ]);

        setStats({ players, teams, orphanPlayers, orphanTeams });
      } catch (err) {
        console.error("Błąd pobierania danych admina", err);
      }
    };

    fetchAll();
  }, [keycloak.token]);

  return (
    <div className="admin-panel">
      <h1>Panel Administratora</h1>

      <p><strong>Liczba graczy:</strong> {stats.players.length}</p>
      <p><strong>Liczba drużyn:</strong> {stats.teams.length}</p>

      <h2>Gracze bez drużyny</h2>
      <ul>
        {stats.orphanPlayers.map(p => (
          <li key={p._id}>{p.nickname} ({p.role})</li>
        ))}
      </ul>

      <h2>Drużyny bez graczy</h2>
      <ul>
        {stats.orphanTeams.map(t => (
          <li key={t._id}>{t.name} ({t.short})</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;

