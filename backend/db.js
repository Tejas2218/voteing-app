const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.DB_URL_LOCAL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB server"))
.catch(err => console.error("MongoDB connection error:", err));

const db = mongoose.connection;

db.on("connected", () => console.log("MongoDB event: connected"));
db.on("error", err => console.error("MongoDB event: error", err));
db.on("disconnected", () => console.log("MongoDB event: disconnected"));

module.exports = db;
