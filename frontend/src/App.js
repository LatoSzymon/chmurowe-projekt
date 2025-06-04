import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/players?page=1&limit=20")
      .then(res => res.json())
      .then(data => setPlayers(data.players))
      .catch(err => console.error("Problem z aportowaniam ~woof~", err));
  }, []);

  return (
    <div className="App" style={{ padding: "2rem" }}>
      <h1>Lista Graczy</h1>

      <ul>
        {players.map((p) => (
          <li key={p._id} style={{ marginBottom: "1rem", listStyle: "none" }}>
            <img
              src={p.avatar || "/placeholder.png"}
              alt={p.nickname}
              style={{ width: "100px", objectFit: "cover", borderRadius: "8px" }}
            />
            <strong style={{ marginLeft: "0.5rem" }}>{p.nickname}</strong> –{" "}
            {p.role} w {p.team?.short || p.team}
          </li>
        ))}
      </ul>
    </div>
  );
}

//seks

export default App;
