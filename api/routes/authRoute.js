
const router = require('express').Router()
const users = require('../models/User')
const bcrypt = require('bcrypt')
const grads = require('../models/Grad')

//create and ign in a user
router.post('/signUp', async (req, res) => {
    const { name, emailId, password } = req.body
    console.log(req.body)
    const saltRounds = 10
    try {

        let grad = await grads.findOne({ emailId })
        let user = await users.findOne({ emailId })
        if (user !== null || grad !== null) {
            console.log(user)
            console.log(grad)
            console.log("problem")
            throw new Error("user user already eists")
        }
        let hashedPassword = ''
        try {
            hashedPassword = await bcrypt.hash(password, saltRounds)
            console.log(hashedPassword)
        } catch (hashError) {
            console.log(hashError)
        }
        let newUser = new users({
            name,
            emailId,
            password: hashedPassword,
            connections: []
        })

        try {
            let user = await newUser.save()
            res.status(200).send({ success: true, userId: user._id, user })
        } catch (saveError) {
            res.status(400).send({ success: false, error: saveError })
        }

    } catch (createError) {
        console.log("reached user repeat error")
        res.status(401).send({ success: false, error: createError, type: "repeat" })
    }
})
router.post('/signUpGrad', async (req, res) => {
    console.log('reached where I wanted to reach')
    console.log(req.body)
    let defRat = [
        {
            price: 0,
            currency: '',
            description: ''
        },
        {
            price: 0,
            currency: '',
            description: ''
        },
        {
            price: 0,
            currency: '',
            description: ''
        }
    ]

    const { name, emailId, password, description, img, tiers, uni, uni_img, major, nationality, price } = req.body
    const saltRounds = 10
    try {

        let grad = await grads.findOne({ emailId })
        let user = await users.findOne({ emailId })
        if (user !== null || grad !== null) {
            console.log(user)
            console.log(grad)
            console.log("problem")
            throw new Error("user user already eists")
        }
        let hashedPassword = ''
        try {
            hashedPassword = await bcrypt.hash(password, saltRounds)
            console.log(hashedPassword)
        } catch (hashError) {
            console.log(hashError)
        }
        let newUser = new grads({
            name,
            emailId,
            password: hashedPassword,
            description,
            img,
            // tiers,
            uni,
            uni_img,
            major,
            nationality,
            price
            //meetingsCnt
            //token

            //reviews

            
        })

        try {
            let user = await newUser.save()
            res.status(200).send({ success: true, userId: user._id, user })
        } catch (saveError) {
            res.status(400).send({ success: false, error: saveError })
        }

    } catch (createError) {
        console.log("reached user repeat error")
        console.log(createError)
        res.status(401).send({ success: false, error: createError, type: "repeat" })
    }
})
router.post('/login', async (req, res) => {
    const { emailId, password } = req.body
    console.log(req.body)
    try {
        let user = await users.findOne({ emailId })
        console.log(user)
        let reqPassword = user.password
        try {
            let result = await bcrypt.compare(password, reqPassword)
            console.log(result)
            if (result === true) {
                res.status(200).send({ success: true, loggedIn: true, user })
            } else if (result === false) {
                res.status(200).send({ success: true, loggedIn: false })
            }
        } catch (compareError) {
            res.status(402).send({ success: false, error: compareError })
        }

    } catch (findError) {
        console.log(findError)
        res.status(400).send({ success: false, error: findError })
    }
})

router.post('/loginGrad', async (req, res) => {
    const { emailId, password } = req.body
    console.log(req.body)
    try {
        let user = await grads.findOne({ emailId })
        console.log(user)
        let reqPassword = user.password
        try {
            let result = await bcrypt.compare(password, reqPassword)
            console.log(result)
            if (result === true) {
                res.status(200).send({ success: true, loggedIn: true, user })
            } else if (result === false) {
                res.status(200).send({ success: true, loggedIn: false })
            }
        } catch (compareError) {
            res.status(402).send({ success: false, error: compareError })
        }

    } catch (findError) {
        console.log(findError)
        res.status(400).send({ success: false, error: findError })
    }
})


//delete a user
//edit user details
//logIn
// update password thingy - for later
module.exports = router