const exp = require("express");
const app = exp();
app.get("/stats", (req, res) => {
    res.json({message: "Poggers"});
});
app.listen(4000, () => console.log("ANAL NA PORCIE"))
app.get("/health", (req, res) => res.sendStatus(200));