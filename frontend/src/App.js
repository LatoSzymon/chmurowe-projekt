import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import AddPlayer from './pages/AddPlayer';

function PlayerList() {
  const [players, setPlayers] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:3000/api/players?page=1&limit=20")
      .then(res => res.json())
      .then(data => setPlayers(data.players))
      .catch(err => console.error("Problem z aportowaniem ~woof~", err));
  }, []);

  return (
    <div>
      <h1>Lista Graczy</h1>
      <ul>
        {players.map((p) => (
          <li key={p._id} style={{ marginBottom: "1rem", listStyle: "none" }}>
            <img
              src={p.avatar || "/placeholder.png"}
              alt={p.nickname}
              style={{ width: "100px", objectFit: "cover", borderRadius: "8px" }}
            />
            <strong style={{ marginLeft: "0.5rem" }}>{p.nickname}</strong> – {p.role} w {p.team?.short || p.team}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App" style={{ padding: "2rem" }}>
        <nav style={{ marginBottom: "2rem" }}>
          <Link to="/"> Strona główna</Link> | <Link to="/add-player">Dodaj gracza</Link>
        </nav>
        <Routes>
          <Route path="/" element={<PlayerList />} />
          <Route path="/add-player" element={<AddPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
