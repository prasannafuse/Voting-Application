const mongoose = require('mongoose');
// const bcrypt = require('bcrypt') not now;

// Schema: Structure of the DB.
const candidateSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    party: {
        type:String,
        required: true
    },
    age: {
        type:String,
        required: true
    },
    vote: [
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            votedAt: {
                type: Date,
                default: Data.now() 
                // Time Stamp
            }
        }   
    ],
    voteCount: {
        type: Number,
        default: 0
    }
    
});


// Create the Person model
const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;

