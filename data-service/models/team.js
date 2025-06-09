const { default: mongoose } = require("mongoose");
const mongo = require("mongoose");

const teamSchema = new mongo.Schema({
    name: {
        type: String, required: true
    },
    short: {
        type: String, reqired: true, unique: true
    },
    region: {
        type: String, required: true
    },
    founded: {
        type: Number
    },
    logo: {
        type: String
    }
});

module.exports = mongoose.model("Team", teamSchema);