import React, { useState } from "react";
import { useKeycloak } from '@react-keycloak/web';

const AddTeam = () => {
  const { keycloak } = useKeycloak();
  console.log(keycloak.tokenParsed?.realm_access?.roles)
  console.log("Token:", keycloak.token);



  const [form, setForm] = useState({
    name: "",
    short: "",
    region: "",
    founded: "",
    logo: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Dodano drużynę!");
        setForm({ name: "", short: "", region: "", founded: "", logo: "" });
      } else {
        alert("Błąd: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Nie udało się połączyć z backendem");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dodaj Drużynę</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
        <input type="text" name="name" placeholder="Pełna nazwa" value={form.name} onChange={handleChange} required />
        <input type="text" name="short" placeholder="Skrót" value={form.short} onChange={handleChange} required />
        <input type="text" name="region" placeholder="Region" value={form.region} onChange={handleChange} required />
        <input type="number" name="founded" placeholder="Rok założenia" value={form.founded} onChange={handleChange} />
        <input type="text" name="logo" placeholder="URL logo" value={form.logo} onChange={handleChange} />
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default AddTeam;
