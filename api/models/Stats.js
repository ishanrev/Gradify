const mongoose = require("mongoose")

const statsSchema = mongoose.Schema({
    keywords: Object,
    basketValues: Array,
    averageBasketValue: Number,
    serviceFrequency: Object,
    sessionDurations: Array,
    averageSessionDuration: Number,
    loginRate: Number,
    bounceRate: Object
})
const stats = mongoose.model('stats', statsSchema)
module.exports = stats