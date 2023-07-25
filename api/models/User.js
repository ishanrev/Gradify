const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
  
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: "https://res.cloudinary.com/dhlxchjon/image/upload/v1658670857/user-icon_t5lgwl.png"
    },
   
    connections: {
        type: [String],
        default: []
    },
    daysActive: [String],
    lastLoggedIn: Date
})

const users = mongoose.model('users', userSchema)
module.exports = users