const mongoose = require('mongoose')

const connectionSchema = mongoose.Schema({
    grad: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    tier: Number,
    chats: Array,
    files: Object,
    meetings: [mongoose.Schema({
        eventId: String,
        service: String,
        interviewPrep: {
            type: Boolean,
            default: true
        },
        essayReview: {
            type: Boolean,
            default: true
        }
    })],
    basket: {
        meet: Boolean,
        essayReview: Boolean,
        interviewPrep: Boolean,
        chat: Boolean,
        essaySharing: Boolean,
    },
    title: String,
    files: Object,
    commentMade: {
        type: Boolean,
        default: false
    }
})
const connections = mongoose.model("connection", connectionSchema)
module.exports = connections