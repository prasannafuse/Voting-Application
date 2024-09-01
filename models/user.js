const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        enum: ['voter','admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }

});

// Use a regular function to bind `this` to the document
userSchema.pre('save', async function (next) {
    const person = this;

    // Hash the password only if it's new or has been modified
    if (!person.isModified('password')) return next();

    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password
        const hashedPassword = await bcrypt.hash(person.password, salt);

        // Override the plain password with the hashed password
        person.password = hashedPassword;
        next();
    } catch (err) {
        next(err); // Pass error to the next middleware
    }
});

// Method to compare provided password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // Use bcrypt to compare
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};


// Create the Person model
const User = mongoose.model('User', userSchema);

module.exports = User;

