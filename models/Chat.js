var mongoose = require('mongoose')

var ChatSchema = mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    msg: { type: String },
    date: { type: Date }
})

module.exports = mongoose.model('Chat', ChatSchema)