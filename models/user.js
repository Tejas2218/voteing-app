const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    email: {
        type: String,
    },
    mobile: {
        type: String,
    },
    address:{
        type: String,
        require: true
    },
    aadharCardNumber: {
        type: Number,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
    },
    isVoted: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function(next){
    const person = this

    // hash the password only if it has been modified (or it new)
    if(!person.isModified('password')) return next()
    try{
        //hash password generation
        const salt = await bcrypt.genSalt(10)
        
        // hash password
        const hashPassword = await bcrypt.hash(person.password, salt)
        person.password = hashPassword       
        next()
    }catch(err){
        return next(err)
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch
    }catch(err){

    }
}

const user = mongoose.model('User',userSchema);
module.exports = user