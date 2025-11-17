const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const {jwtAuthMiddleware, generateToken} = require('./../jwt')
const { json } = require('body-parser')
// const { json } = require('body-parser')
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

router.get('/profile', jwtAuthMiddleware, async (req,res) => {
    try{
        const userData = req.user
        const userId = userData.id
        const user = await Person.findById(userId)
        res.status(200).json({user})
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal server error'})
    }
})

router.put('/profile/password', jwtAuthMiddleware, async (req,res)=>{
    try{
        const userId = req.id
        const {currentPassword,newPassword} = req.body

        //find user by userId
        const user = await User.findById(userId)

        //if not match user or pass return err
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'invalid username or password'})
        }

        user.password = newPassword
        await user.save()

        console.log("password updated")
        res.status(200).json({message: "password updated"})


        const responce = await Person.findByIdAndUpdate(_id, updatedPersonData, {
            new: true,
            runValidators: true
        })

        if(!responce) return res.status(404).json({error: 'Person Not Found'});
        console.log("updated-Person")
        res.status(200).json(responce)
    }catch(err){
        console.log(`error in updating person ${err}`)
        res.status(500).json({error: 'internal servar error "person-id"'})
    }
})

module.exports = router