import React, { useEffect, useState } from "react";
import { useKeycloak } from '@react-keycloak/web';

function StatsPage() {
  const { keycloak } = useKeycloak();
  const [roles, setRoles] = useState({});
  const [orphans, setOrphans] = useState([]);
  const [teamsWithoutPlayers, setTeamsWithoutPlayers] = useState([]);
  const [countries, setCountries] = useState({});
  const [teamCounts, setTeamCounts] = useState({});

  useEffect(() => {
    fetch("/stats/roles", { headers: { Authorization: `Bearer ${keycloak.token}` } })
      .then(res => res.json()).then(setRoles);
    fetch("/stats/countries", { headers: { Authorization: `Bearer ${keycloak.token}` } })
      .then(res => res.json()).then(setCountries);
    fetch("/stats/teams/count", { headers: { Authorization: `Bearer ${keycloak.token}` } })
      .then(res => res.json()).then(setTeamCounts);
  }, [keycloak.token]);

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
