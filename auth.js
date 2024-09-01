// sets up Passport with a local authentication strategy, using a Person model for user data. - Auth.js file

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/user'); // Adjust the path as needed

// MIDDLEWARE
passport.use(new LocalStrategy(
    async function(username, password, done) {
      // Check if username or password is missing
      if (!username || !password) {
        return done(null, false, { message: 'Missing credentials' });
      }
  
      try {
        console.log("Received Credentials:", username, password);
  
        // Find user by username
        const user = await Person.findOne({ username: username });
  
        if (!user) {
          return done(null, false, { message: 'Invalid username' });
        }
  
        // Check if the password matches
        // const isPasswordMatch = user.password === password;
        const isPasswordMatch = user.comparePassword(password);
        
        if (isPasswordMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (err) {
        return done(err);
      }
    }
  ));

module.exports = passport; // Export configured passport