// EXPRESS
const express = require("express");
const app = express();

// require('dotenv').config();
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT not set

// PARSER - To get the body data
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.bodyz

// Import router files
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

// Authentication file
const passport = require('./auth');

// JWT file
const jwt = require('./jwt');

// DATABASE
const db = require("./db");


// Use the routes
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

// Server is up
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});