var mongoose = require('mongoose')

var UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }
})

module.exports = mongoose.model('User', UserSchema)