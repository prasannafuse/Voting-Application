const mongoose = require('mongoose');
// const bcrypt = require('bcrypt') not now;

// Schema: Structure of the DB.
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    age: {
        type: Number,
        required: true

    },
    mobile: {
        type: Number
    },
    address: {
        type: String,
        required: true
    },
    addharCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required:true
    },
    role:{
        type: String,
        enum: ['voter,admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }

});




// Create the Person model
const User = mongoose.model('User', userSchema);

module.exports = User;

