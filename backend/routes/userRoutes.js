const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const path = require("path");
const candidate = require('../models/candidate')
const {jwtAuthMiddleware, generateToken} = require('./../jwt')
// const { json } = require('body-parser')

router.use(express.static(path.join(__dirname, '../../frontend')));
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/html/index.html"));
});

router.post('/signup', async (req, res) => {

    try {

        const { role } = req.body

        if(role === "admin"){
            const adminExist = await User.findOne({role: "admin"})
            if(adminExist){
                return res.status(400).json({message: "admin is exist"})
            }
        }

        const newUser = new User(req.body)
        
        const response = await newUser.save()
        console.log("data saved")
        // res.status(200).json(response)

        const paylod = {
            id: response.id,
        }
        // console.log(JSON.stringify(paylod))

        const token = generateToken(paylod)
        console.log("Token is: ", token)
        res.status(200).json({response: response, token: token})

    } catch (err) {
        console.log("error saving person:", err)
        res.status(500).json({ error: 'Internal seerver error "person-post" ' })
    }
})

router.post('/login', async (req,res) => {
    try{
        //extract user aadharCardNumber,pass from db
        const {aadharCardNumber, password} = req.body

        //find user by aadharCardNumber
        const user = await User.findOne({aadharCardNumber: aadharCardNumber})

        //if not match user or pass return err
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'invalid username or password'})
        }

        //generate token
        const paylod = {
            id: user.id,
        }

        const token = generateToken(paylod)

        //return token as response
        res.json({token})

    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal server error'})
    }
})


// router.get("/homepage", (req, res) => {
//     console.log(__dirname)
//     res.sendFile(path.join(__dirname, "../../frontend/html/homepage.html"));
// });

router.get('/profile', jwtAuthMiddleware, async (req,res) => {
    try{
        const userData = req.user
        const userId = userData.id
        const user = await User.findById(userId)
        res.status(200).json({user})
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal server error'})
    }
})

router.put('/profile/password', jwtAuthMiddleware, async (req,res)=>{
    try{
        const userId = req.user.id
        const {currentPassword,newPassword} = req.body

        //find user by userId
        const user = await User.findById(userId)
        
        //if not match user or pass return err
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is wrong" });
        }


        user.password = newPassword
        await user.save()

        console.log("password updated")
        res.status(200).json({message: "password updated"})

    }catch(err){
        console.log(`error in updating person ${err}`)
        res.status(500).json({error: 'internal servar error "person-id"'})
    }
})

// let's start voting
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req,res) => {
    //no admin can vote
    //user can only vote once

    const candidateID = req.params.candidateID
    const userId = req.user.id

    try{
        const candidatee = await candidate.findById(candidateID)
        if(!candidatee){
            return res.status(404).json({message: "candidate not found"})
        }

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        if(user.isVoted){
            return res.status(400).json({message: "you have already voted"})
        }

        if(user.role === "admin"){
            return res.status(403).json({message: "admin not allowed"})
        }

        candidatee.votes.push({user: userId})
        candidatee.voteCount++
        await candidatee.save()

        //update the user document
        user.isVoted = true
        await user.save()

        res.status(200).json({message: "vote recorded successfully"})


    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal servar error "candidate-id"'})
    }

})

//vote count
router.get('/vote/count', async (req,res) => {
    try{
        // Find all candidate and sort them by votecount in descending order
        const candidatee = await candidate.find().sort({voteCount: 'desc'});

        // map the candidate to only  return their name and voteCount
        const voteRecord = candidatee.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        })
        return res.status(200).json(voteRecord)
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal servar error "candidate-id"'})
    }
})

module.exports = router