import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

const AddPlayer = () => {
    const { keycloak } = useKeycloak();
    console.log("Token:", keycloak.token);


    const [form, setForm] = useState({
        name: '',
        nickname: '',
        role: '',
        age: '',
        country: '',
        avatar: '',
        team: ''
    });

    const roles = ["top", "jungle", "mid", "bot", "support"];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/players`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${keycloak.token}`
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            alert("Dodano gracza!");
            setForm({ name: '', nickname: '', role: '', age: '', country: '', avatar: '', team: '' });
        } catch (err) {
            console.error(err);
            alert("Błąd przy dodawaniu gracza");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Dodaj Gracza</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
                <input type="text" name="name" placeholder="Imię i nazwisko" value={form.name} onChange={handleChange} required />
                <input type="text" name="nickname" placeholder="Ksywka" value={form.nickname} onChange={handleChange} required />
                <select name="role" value={form.role} onChange={handleChange} required>
                    <option value="">Wybierz rolę</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input type="number" name="age" placeholder="Wiek" value={form.age} onChange={handleChange} />
                <input type="text" name="country" placeholder="Kraj" value={form.country} onChange={handleChange} />
                <input type="text" name="team" placeholder="Drużyna (skrót)" value={form.team} onChange={handleChange} />
                <input type="text" name="avatar" placeholder="URL zdjęcia" value={form.avatar} onChange={handleChange} />
                <button type="submit">Dodaj</button>
            </form>
        </div>
    );
}

export default AddPlayer;
