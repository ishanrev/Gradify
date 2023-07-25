
const router = require('express').Router()
const users = require('../models/User')
const bcrypt = require('bcrypt')
const grads = require('../models/Grad')
const stats = require('../models/Stats')

router.post("/update", async (req, res) => {
    console.log("going to update the database with these new analytics baby")
    let updated = req.body
    console.log(process.env.STATS_ID)
    try {
        let doc = await stats.findByIdAndUpdate(process.env.STATS_ID, updated)
        // console.log(doc)
        // for(let key of Object.keys(updated)){
        //     doc[key] = updated[key]
        // }
        // await doc.save()
        
        res.status(200)


    } catch (updateError) {
        console.log("reaching the update error for some reason")
        console.log(updateError)
        res.status(400)
    }

})
router.get("/", async (req, res) => {
    console.log("reached the connection")
    try {
        let doc = await stats.findById(process.env.STATS_ID)
        console.log(doc)
        res.status(200).send({stats:doc})
    } catch (updateError) {
        console.log(updateError)
        res.status(400)
    }
})

module.exports = router