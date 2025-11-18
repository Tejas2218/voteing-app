const express = require('express')
const router = express.Router()
const {jwtAuthMiddleware, generateToken} = require('./../jwt')
// const candidate = require('./../models/candidate')
const User = require('../models/user')
const { json } = require('body-parser')
const candidate = require('./../models/candidate')
const { count } = require('console')
// const {jwtAuthMiddleware} = require('./jwt')
// const { json } = require('body-parser')

const checkAdminRole = async (userId) => {
    try{
        const user = await User.findById(userId)
        if(user.role === "admin")
            return true
        else
            return false
    }catch(err){
        return false
    }
}

router.get('/', jwtAuthMiddleware, async (req,res) => {
    try{
        const candidateData = await candidate.find()
        console.log("data found")
        res.status(200).json(candidateData)
        
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal servar error "candidate-id"'})
    }
})

// post routes to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {

    try {

        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: "user has no admin role"})

        const data = req.body

        const newCandidate = new candidate(data)

        const response = await newCandidate.save()
        console.log("data saved")
        res.status(200).json({response: response})

    } catch (err) {
        console.log("error saving person:", err)
        res.status(500).json({ error: 'Internal seerver error "person-post" ' })
    }
})

router.put('/:candidateID', jwtAuthMiddleware, async (req,res)=>{
    try{
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: "user has no admin role"})

        const candidateID = req.params.candidateID
        const updatedCandidateData = req.body

        const responce = await candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true,
            runValidators: true
        })

        if(!responce) return res.status(404).json({error: 'candidate Not Found'});
        console.log("candidate data updated")
        res.status(200).json(responce)
    }catch(err){
        console.log(`error in updating candidate ${err}`)
        res.status(500).json({error: 'internal servar error "candidate-id"'})
    }
})

router.delete('/:candidateID', jwtAuthMiddleware, async (req,res)=>{
    try{
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: "user has no admin role"})

        const candidateID = req.params.candidateID

        const responce = await candidate.findByIdAndDelete(candidateID)

        if(!responce) return res.status(404).json({error: 'candidate Not Found'});
        console.log("candidate data Deleted")
        res.status(200).json(responce)
    }catch(err){
        console.log(`error in Deleted candidate ${err}`)
        res.status(500).json({error: 'internal servar error "candidate-id"'})
    }
})

module.exports = router