require("dotenv").config()
const express = require("express");
const mongo = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const playersRoutes = require("./routes/playersRoutes");
const teamsRoutes = require("./routes/teamRoutes");

const app = express();
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());

app.get("/status", (req, res) => {
    res.json({status: "Jakoś leci", message: "Wszystko w porządalu"});
});

app.use("/api/players", playersRoutes);
app.use("/api/teams", teamsRoutes);
app.get("/health", (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 3000;
mongo.connect(process.env.MONGO_URI || "mongodb://mongo:27017/esport", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongo Bongo");
    app.listen(PORT, () => {
        console.log(`Los serweros śmigos portos ${PORT}`);
    });
}).catch(err => {
    console.error("Coś tu poszło mocno nie tak, panie", err);
});

