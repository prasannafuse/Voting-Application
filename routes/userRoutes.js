const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware,generateToken} = require('./../jwt');

// POST route to add a person
router.post('/signup', async (req, res) =>{
    try{
        const data = req.body // Assuming the request body contains the person data

        // Create a new user document using the Mongoose model
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();
        console.log('data saved');
        // res.status(200).json(response);

        const payload = {
            id: response.id,
        }

        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ", token);

        res.status(200).json({response: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {

        // Extract aadharCardNumber and password from request body.
        const { addharCardNumber, password } = req.body;

        
        if (!addharCardNumber || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find the user by aadharCardNumber
        const user = await Person.findOne({ addharCardNumber });

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // generate Token
        const payload = { id: user.id};
        const token = generateToken(payload);

        // resturn token as response
        res.status(200).json({ success: true, token });
    } 
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user; // from jwt file
        const userId = userData.id;

        // Find the user by user id.
        const user = await Person.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Change the password
router.put('/profile/password',jwtAuthMiddleware,async (req,res)=>{
    try{
        const userID = req.user; // Extract the id from the taken
        const {currentPassword,newPassword} = req.body; // Extract current and new passwords from request body

        // Find the user by user ID
        const user = await User.findById(userId);

        // Check if the current password which the user send through body is same as the password.
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid username or password'})
        }

        user.password = newPassword;
        await user.save();

        console.log("Password Updated.")
        res.status(200).json({message: "Password updated."});        

    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
});



module.exports = router;