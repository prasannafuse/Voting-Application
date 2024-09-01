// EXPRESS
const express = require("express");
const app = express();

// require('dotenv').config();
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT not set

// PARSER - To get the body data
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body

// Server is up
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});