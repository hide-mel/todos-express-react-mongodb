const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('Todo', todoSchema)