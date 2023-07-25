const mongoose = require('mongoose')

const gradSchema = mongoose.Schema({
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
    description: String,
    img: {
        type: String,
        default: "https://res.cloudinary.com/dhlxchjon/image/upload/v1658670857/user-icon_t5lgwl.png"
    },

    connections: {
        type: [String],
        default: []
    },
    daysActive: [String],
    reviews: {
        type: [mongoose.Schema({
            user: String,
            username: String,
            stars: Number,
            img: String,
            brief: String,
            description: String,
            datePosted: String
        })],
        default: []
    },
    tiers: [mongoose.Schema({
        price: Number,
        currency: String,
        description: [String]
    })],
    uni: String,
    uni_img: String,
    major: String,
    lastLoggedIn: Date,
    price: {
        type: Object,
        default: {
            meet: 10,
            essayReview: 10,
            interviewPrep: 10,
            chat: 10,
            essaySharing: 10
        }
    },
    nationality: String,
    token: String,
    meetingsCnt: {
        type: Number,
        default: 0
    },
    other: [String]
})

const grads = mongoose.model('grads', gradSchema)
module.exports = grads