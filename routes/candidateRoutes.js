const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const Candidate = require('../models/candidate');
const {jwtAuthMiddleware,generateToken} = require('./../jwt');

const checkAdminRole = async (userId) =>{
    try{
        const user = await User.findById(userId);
        if(user.role==='admin'){
            return true;
        }
        else{
            return false;
        }
    }
    catch(err){
        return false;
    }
}


// POST route to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) =>{
    try{
        if(!(await checkAdminRole(req.user.id)))
            return res.status(403).json({message: 'user does not have admin role'});

        const data = req.body // Assuming the request body contains the candidate data

        // Create a new User document using the Mongoose model
        const newCandidate = new Candidate(data);

        // Save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');
        res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// Update the candidate
router.put('/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});
        
        const candidateID = req.params.candidateID; // Extract the id from the URL parameter
        console.log(candidateID);
        const updatedCandidateData = req.body; // Updated data for the person
        console.log(updatedCandidateData);


        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        });

        console.log(response);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


// Delete Candidate
router.delete('/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});
        
        const candidateID = req.params.candidateID; // Extract the id from the URL parameter

        console.log(candidateID);

        const response = await Candidate.findByIdAndDelete(candidateID);

        console.log(response);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Vote for an candidate using id and voter will be recognized for the tken which is genereated while login.
router.post('/vote/:candidateID',jwtAuthMiddleware, async (req,res)=>{
    candidateID = req.params.candidateID; // Get the candidate id form the url
    userID = req.user.id; // get the userid form the token.

    try{
        // Try to find the candidate id in the DB
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({message: "Candidate not found!"});
        }

        // Try to find the user(voter) id in the DB
        const user = await User.findById(userID);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        if(user.isVoted==true){
            return res.status(400).json({message: "You have already voted."})
        }
        if(user.role=='admin'){
            return res.status(403).json({message: "Admin cannot vote."})
        }

        // If the voter has reached here then he must be vaild user then add his vote.
        // Update the Candidate document to record the vote.
        candidate.vote.push({user: userID});
        candidate.voteCount++;
        await candidate.save();

        // Update the voter
        user.isVoted = true;
        await user.save();

        res.status(200).json({message: "Thanks for voting, your vote has been collected."})

    }catch(err){
        res.status(500).json({message:"Internal Server Error."})

    }
});

router.get('/vote/count', async(req,res)=>{
    try{
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});
       
        // Map the candidates to only return their name and voteCount.
        const Voterecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(Voterecord);

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error.'})
    }
});

// Menu - GET
router.get("/candidate-list", async (req, res) => {
    try {
        // Fetch only the 'name' and 'party' fields for all candidates
        const data = await Candidate.find({}, 'name party');
        
        console.log("Data Fetched!!");
        res.status(200).json(data); // Send the filtered data as JSON
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;