const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, 'Email already taken'],
        required: [true, 'Please provide Email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
    },
    name: {
        type: String,
        required: [true, 'Must provide name'],
        minlength: [5, 'Name too short'],
        maxlength: [20, 'Name too long']
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        unique: true,
        minlength: [5, 'Password too short']
    },
    power: {
        type: String,
        default: 'basic'
    }
},
    { collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model