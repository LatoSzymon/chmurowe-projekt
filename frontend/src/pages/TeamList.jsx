import React, { useEffect, useState } from "react";
import { useKeycloak } from '@react-keycloak/web';

const TeamList = () => {
  const { keycloak } = useKeycloak();
  const isAdmin = keycloak?.tokenParsed?.realm_access?.roles?.includes("admin");

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch(`/api/teams`, {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    })
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error("Błąd przy pobieraniu drużyn", err));
  }, [keycloak.token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Na pewno usunąć tę drużynę?")) return;
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${keycloak.token}` }
      });
      if (res.ok) {
        setTeams(teams.filter((t) => t._id !== id));
      } else {
        const err = await res.json();
        alert("Błąd: " + err.message);
      }
    } catch (err) {
      console.error("Błąd przy usuwaniu drużyny", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Lista Drużyn</h2>
      <ul style={{ listStyle: "none", padding: 0 }} className="teamy">
        {teams.map((t) => (
          <li
            key={t._id}
            className="team"
          >
            <img
              src={t.logo || "/logoLol.png"}
              alt={t.short}
              style={{ width: "80px", height: "80px", objectFit: "contain", marginRight: "1rem" }}
            />
            <div style={{ flexGrow: 1 }}>
              <strong>{t.name}</strong> ({t.short}) – {t.region} {t.founded ? `(zał. ${t.founded})` : ""}
            </div>
            {isAdmin && (
              <button
                onClick={() => handleDelete(t._id)}
                style={{ border: "none", cursor: "pointer" }} className="usuwator"
              >
                <img src="/bin.png" alt="Usuń" style={{ width: "30px", height: "30px" }} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamList;
