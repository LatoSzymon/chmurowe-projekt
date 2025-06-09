import React, { useEffect, useState } from "react";

function StatsPage() {
  const [roles, setRoles] = useState({});
  const [orphans, setOrphans] = useState([]);
  const [teamsWithoutPlayers, setTeamsWithoutPlayers] = useState([]);
  const [countries, setCountries] = useState({});
  const [teamCounts, setTeamCounts] = useState({});

  useEffect(() => {
    fetch("/stats/roles").then(res => res.json()).then(setRoles);
    fetch("/stats/orphans/players").then(res => res.json()).then(data => setOrphans(data.players || []));
    fetch("/stats/orphans/teams").then(res => res.json()).then(data => setTeamsWithoutPlayers(data.teams || []));
    fetch("/stats/countries").then(res => res.json()).then(setCountries);
    fetch("/stats/teams/count").then(res => res.json()).then(setTeamCounts);
  }, []);

  return (
    <div className="stats-page">
      <h1>Statystyki</h1>

      <section>
        <h2>Role graczy</h2>
        <ul className="stats-list">
          {Object.entries(roles).map(([role, count]) => (
            <li key={role} className="stats-item">
              <img src={`/role-${role}.png`} alt={role} className="role-icon" />
              <span className="label">{role}</span>: {count}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Gracze bez drużyn</h2>
        <ul className="stats-list">
          {orphans.map(p => (
            <li key={p._id} className="stats-item">
              {p.nickname} ({p.role}, {p.country})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Drużyny bez graczy</h2>
        <ul className="stats-list">
          {teamsWithoutPlayers.map(t => (
            <li key={t._id} className="stats-item">
              <img src={t.logo || "/logoLol.png"} alt={t.short} className="team-icon" />
              {t.name} ({t.short}) – {t.region}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Gracze według kraju</h2>
        <ul className="stats-list">
          {Object.entries(countries).map(([country, count]) => (
            <li key={country} className="stats-item">{country}: {count}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Liczba graczy w drużynach</h2>
        <ul className="stats-list">
          {Object.entries(teamCounts).map(([team, count]) => (
            <li key={team} className="stats-item">{team}: {count} graczy</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default StatsPage;
