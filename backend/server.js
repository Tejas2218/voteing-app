const express = require('express');
const app = express();
const path = require("path");
const db = require('./db')
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../frontend')));

// Express Router imports (no other router package!)
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

// Serve frontend static files

// API routes
app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);




// app.use((req, res, next) => {

//   // IF API route → skip
//   if (req.path.startsWith('/user') || req.path.startsWith('/candidate')) {
//     res.sendFile(path.join(__dirname, '../frontend/html/index.html'));
//   }
//   return next();
// });


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
