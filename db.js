const mongoose = require('mongoose');

require('dotenv').config(); // .env file requirements.
const mongoURL = process.env.URL_LOCAL;
// const mongoURL = process.env.URL_ATLAS; // EXTRACTING PORT FROM .env FILE AS IT CANNOT BE SEND ON PUBLIC REPO.(sensative information)


mongoose.connect(mongoURL, {
    // useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection; // This object is used to handle events and interact with the database.

db.on('connected',()=>{
    console.log("Connected with MongoDB server!");
});

db.on("error",(err)=>{
    console.log("Error found: ",err);
});

db.on("disconnected",()=>{
    console.log("MongoDB Disconnected!!");
});

// Export to the server
module.exports = db;