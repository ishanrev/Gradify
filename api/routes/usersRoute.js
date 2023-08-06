
const router = require('express').Router()
const users = require('../models/User')
const bcrypt = require('bcrypt')
const grads = require('../models/Grad')
const connections = require('../models/Connection')
const uniList = require('../../client/src/constants/unis')

// ------------------------------------------------------Grads---------------------------------------------------------

router.get('/grad/:id', async (req, res) => {

    const userId = req.params.id
    console.log('hi')
    console.log(userId)
    try {
        let user = await grads.findById(userId)
        res.status(200).send({ success: true, user })
    } catch (findError) {
        res.status(401).send({ error: findError, success: false })
    }
})
router.put('/grad/:id', async (req, res) => {
    const userId = req.params.id
    const newDetails = req.body
    let changeKeys = Object.keys(newDetails)
    let newValues    // console.log(newProgress);
    try {
        // let updated = await users.findByIdAndUpdate(userId, { testProgress: newProgress }, { new: true })
        let user = await grads.findById(userId)
        for (key of changeKeys) {
            console.log(key)
            console.log(newDetails[key])
            user[key] = newDetails[key];
        }
        // user.testProgress = newProgress
        user.save()
        let updated = await users.findById(userId)
        console.log(user)
        res.status(200).send({ success: true, updated: user })
    } catch (updateError) {
        console.log(updateError)
        res.status(401).send({ error: updateError, success: false })
    }

})
router.post('/grad/browse', async (req, res) => {
    const tags = req.body.tags

    try {
        let gradsArr = await grads.find({})
        console.log(tags)
        let similarity = []
        let x = 0
        for (let grad of gradsArr) {

            let { reviews, uni, major, nationality, other } = grad
            let overallRating;
            let sum = 0
            for (let rev of reviews) {
                sum += rev.stars
            }
            if (reviews.length === 0) {
                overallRating = 3
            } else {

                overallRating = Math.round(sum / reviews.length)
            }
            let score = 0
            let tempOther = other.map((el) => {
                return el
            })
            let filterArr = [overallRating.toString(), uni, nationality, major, ...tempOther]
            // overallRating.toString() === tags.overallRating ? score += 1 : undefined
            // uni.toString() === tags.uni ? score += 1 : undefined
            // nationality.toString() === tags.nationality ? score += 1 : undefined
            // major.toString() === tags.major ? score += 1 : undefined
            for (let x = 0; x < tags.length; x++) {
                for (let y = 0; y < filterArr.length; y++) {
                    if (filterArr[y].includes(tags[x]) === true) {
                        score += 1
                    }
                }

            }
            console.log(filterArr, score)
            gradsArr[x].score = score
            x += 1
        }
        console.log(gradsArr[1].score)
        gradsArr.sort((g1, g2) => {

            return -1 * (g1.score - g2.score)
        })
        // console.log(gradsArr)
        res.status(200).send({ success: true, grads: gradsArr })
    } catch (findError) {
        console.log(findError)
        res.status(401).send({ error: findError, success: false })
    }

})
router.post('/grad/comment/:id', async (req, res) => {
    const comment = req.body.comment
    const conId = req.body.conId
    const gradId = req.params.id
    console.log(req.body)

    try {
        let grad = await grads.findById(gradId)
        let user = await users.findById(comment.user)
        comment.username = user.name
        grad.reviews.push(comment)
        grad.save()
        let con = await connections.findById(conId)
        con.commentMade = true
        con.save()
        // console.log(gradsArr)
        console.log("everything saved properly")
        res.status(200).send({ success: true })
    } catch (findError) {
        console.log(findError)
        res.status(401).send({ error: findError, success: false })
    }

})

// ------------------------------------------------------Users---------------------------------------------------------
router.get('/user/:id', async (req, res) => {

    const userId = req.params.id
    console.log('hi')
    try {
        let user = await users.findById(userId)
        res.status(200).send({ success: true, user })
    } catch (findError) {
        res.status(401).send({ error: findError, success: false })
    }
})

router.put('/user/:id', async (req, res) => {
    const userId = req.params.id
    const newDetails = req.body
    let changeKeys = Object.keys(newDetails)
    let newValues    // console.log(newProgress);
    try {
        // let updated = await users.findByIdAndUpdate(userId, { testProgress: newProgress }, { new: true })
        let user = await users.findById(userId)
        for (key of changeKeys) {
            console.log(key)
            console.log(newDetails[key])
            user[key] = newDetails[key];
        }
        // user.testProgress = newProgress
        user.save()
        let updated = await users.findById(userId)
        console.log(user)
        res.status(200).send({ success: true, updated: user })
    } catch (updateError) {
        console.log(updateError)
        res.status(401).send({ error: updateError, success: false })
    }

})

router

module.exports = router