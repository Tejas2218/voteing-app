const mongoose = require('mongoose');
const { type } = require('os');
const { boolean } = require('webidl-conversions');
const bcrypt = require('bcrypt')

const candidateSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    party: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: true
            },
            voteAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    },
})

const candidate = mongoose.model('candidate',candidateSchema);
module.exports = candidate