import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

import AddPlayer from './pages/AddPlayer';
import AddTeam from './pages/AddTeam';
import TeamList from './pages/TeamList';
import StatsPage from './pages/StatsPage';

const RequireRole = ({ role, children }) => {
  const { keycloak } = useKeycloak();
  const hasRole = keycloak?.tokenParsed?.realm_access?.roles?.includes(role);
  return hasRole ? children : <p>Brak dostępu – wymagana rola: {role}</p>;
};

function PlayerList() {
  const { keycloak } = useKeycloak();
  const [players, setPlayers] = React.useState([]);
  const [expanded, setExpanded] = React.useState(null);
  const [editingId, setEditingId] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});

  React.useEffect(() => {
    fetch(`/api/players?page=1&limit=20`, {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    })
      .then(res => res.json())
      .then(data => setPlayers(data.players))
      .catch(err => console.error("Problem z aportowaniem ~woof~", err));
  }, [keycloak.token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Na pewno chcesz usunąć tego gracza?")) return;
    try {
      const res = await fetch(`/api/players/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${keycloak.token}` }
      });
      if (res.ok) setPlayers(players.filter(p => p._id !== id));
      else alert("Błąd: " + (await res.json()).message);
    } catch (err) {
      console.error("Błąd przy usuwaniu gracza", err);
    }
  };

  const startEdit = (player) => {
    setEditingId(player._id);
    setEditForm({
      name: player.name || "",
      nickname: player.nickname || "",
      role: player.role || "",
      age: player.age || "",
      country: player.country || "",
      team: player.team?.short || "",
      avatar: player.avatar || ""
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (id) => {
    try {
      const res = await fetch(`/api/players/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`
        },
        body: JSON.stringify(editForm)
      });
      const updated = await res.json();
      if (res.ok) {
        setPlayers(players.map(p => p._id === id ? updated : p));
        setEditingId(null);
        setExpanded(null);
      } else {
        alert("Błąd: " + updated.message);
      }
    } catch (err) {
      console.error("Błąd przy edycji gracza", err);
    }
  };

  const roles = ["top", "jungle", "mid", "bot", "support"];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Lista Graczy</h1>
      <div className="players-grid">
        {players.map((p) => (
          <div className="player-card" key={p._id}>
            <img src={p.avatar || "/nerd.png"} alt={p.nickname} className="avatar" />
            <h3>{p.nickname}</h3>
            <button onClick={() => setExpanded(expanded === p._id ? null : p._id)}>
              {expanded === p._id ? "▲" : "▼"}
            </button>
            {expanded === p._id && (
              editingId === p._id ? (
                <div className="player-details">
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} placeholder="Imię" />
                  <input type="text" name="nickname" value={editForm.nickname} onChange={handleEditChange} placeholder="Ksywka" />
                  <select name="role" value={editForm.role} onChange={handleEditChange}>
                    <option value="">Rola</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <input type="number" name="age" value={editForm.age} onChange={handleEditChange} placeholder="Wiek" />
                  <input type="text" name="country" value={editForm.country} onChange={handleEditChange} placeholder="Kraj" />
                  <input type="text" name="team" value={editForm.team} onChange={handleEditChange} placeholder="Skrót drużyny" />
                  <input type="text" name="avatar" value={editForm.avatar} onChange={handleEditChange} placeholder="URL avataru" />
                  <button onClick={() => submitEdit(p._id)}>Zapisz</button>
                  <button onClick={() => setEditingId(null)}>Anuluj</button>
                </div>
              ) : (
                <div className="player-details">
                  <p><strong>Imię i nazwisko:</strong> {p.name}</p>
                  <p><strong>Rola:</strong> {p.role}</p>
                  <p><strong>Wiek:</strong> {p.age}</p>
                  <p><strong>Kraj:</strong> {p.country}</p>
                  <p><strong>Drużyna:</strong> {p.team?.name || p.team?.short || "[brak]"}</p>
                  <button className='usuwator' onClick={() => handleDelete(p._id)}>🗑</button>
                  <button onClick={() => startEdit(p)} className='edycja'>Edytuj</button>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const { keycloak } = useKeycloak();

  if (!keycloak?.authenticated) {
    return <p>Logowanie...</p>;
  }

  return (
    <Router>
      <div className="App">
        <nav style={{ marginBottom: "2rem" }}>
          <Link to="/" className='nav-link'> Strona główna</Link> |
          <Link to="/add-player" className='nav-link'> Dodaj gracza</Link> |
          <Link to="/add-team" className='nav-link'> Dodaj team do bazy</Link> |
          <Link to="/teams" className='nav-link'> Lista drużyn</Link> |
          <Link to="/stats" className='nav-link'> Statystyki</Link> |
          <button onClick={() => keycloak.logout()} className='nav-link'>Wyloguj</button>
        </nav>
        <Routes>
          <Route path="/" element={<PlayerList />} />
          <Route path="/add-player" element={<RequireRole role="admin"><AddPlayer /></RequireRole>} />
          <Route path="/add-team" element={<RequireRole role="admin"><AddTeam /></RequireRole>} />
          <Route path="/teams" element={<TeamList />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
