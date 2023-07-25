
const router = require('express').Router()
const users = require('../models/User')
const bcrypt = require('bcrypt')
const grads = require('../models/Grad')
const connections = require('../models/Connection')
const stats = require('../models/Stats')
const axios = require('axios')
const qs = require('qs');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const uniList = require('../../client/src/constants/unis')
// const fetch = require('node-fetch');

dotenv.config()

//Create a connection
//get a connection
const pendingPayments = {}
router.post('/create', async (req, res) => {
    const { grad, user, tier } = req.body
    const saltRounds = 10
    try {


        let con = await connections.findOne({ grad, user })
        if (con !== null) {
            console.log(user)
            console.log(grad)
            console.log("problem")
            throw new Error("connection user already eists")
        }

        let newConnection = new connections({
            grad,
            user,
            chats: [],
            files: { grad: [], user: [] },
            meetings: [],
            tier
        })

        try {
            let gradDoc = await grads.findById(grad)
            console.log(gradDoc)
            gradDoc.connections.push(newConnection._id.toString())
            gradDoc.save()
            let userDoc = await users.findById(user)
            console.log(userDoc)
            userDoc.connections.push(newConnection._id.toString())
            userDoc.save()
            let connection = await newConnection.save()
            res.status(200).send({ success: true, connection })
        } catch (saveError) {
            console.log(saveError)
            res.status(400).send({ success: false, error: saveError })
        }

    } catch (createError) {
        console.log("reached user repeat error")
        console.log(createError)
        res.status(401).send({ success: false, error: createError, type: "repeat" })
    }
})
router.get('/:id', async (req, res) => {

    const userId = req.params.id
    console.log('hi')
    console.log(userId)
    try {
        let connection = await connections.findById(userId)
        res.status(200).send({ success: true, connection })
    } catch (findError) {
        res.status(401).send({ error: findError, success: false })
    }
})
router.post('/isConnection', async (req, res) => {

    const { grad, user } = req.body
    console.log(req.body)
    console.log('hi')
    // console.log(userId)
    try {
        let connection = await connections.findOne({ grad, user })
        res.status(200).send({ success: true, connection })
    } catch (findError) {
        res.status(401).send({ error: findError, success: false })
    }
})
//update a connection
router.put('/:id', async (req, res) => {
    const userId = req.params.id
    const newDetails = req.body
    let changeKeys = Object.keys(newDetails)
    try {
        // let updated = await users.findByIdAndUpdate(userId, { testProgress: newProgress }, { new: true })
        let connection = await connections.findById(userId)
        for (key of changeKeys) {
            console.log(key)
            console.log(newDetails[key])
            connection[key] = newDetails[key];
        }
        // user.testProgress = newProgress
        connection.save()
        let updated = await users.findById(userId)
        console.log('user')
        res.status(200).send({ success: true, updated: connection })
    } catch (updateError) {
        console.log(updateError)
        res.status(401).send({ error: updateError, success: false })
    }

})
// No deleting a connection as an option allowed atleast at this stage especially

//chat - send message (no deleting a message for now atleast becuae too much functionality doesnt seem right to behonest with you)
router.post('/chat/:id', async (req, res) => {
    const userId = req.params.id
    const newChat = req.body
    console.log('hi')
    console.log(newChat)
    console.log(userId)
    try {
        let connection = await connections.findById(userId)
        connection.chats.push(newChat)
        connection.save()
        res.status(200).send({ success: true, connection })
    } catch (findError) {
        console.log(findError)
        res.status(401).send({ error: findError, success: false })
    }
})

//CRUD for files (honestly can be compiled into one section depending on the file meangement operation)
//whole meeting scheduling needs to be managed if I am beign honest 

// Payment section
async function createOrder(accessToken, gradMail) {
    // gradMail = "lastreserve4@gmail.com"

    return new Promise(async (resolve, reject) => {

        try {
            let accessTokenRes = await axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders',
                {
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            amount: {
                                value: "15.00",
                                currency_code: "USD",
                            },
                            payee: {
                                email_address: gradMail,
                            }
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                        // "PayPal-Partner-Attribution-Id": "BN-Code"
                    }
                }
            );
            resolve({ orderId: accessTokenRes.data.id })

        } catch (payeeError) {
            reject({ success: false })
            console.log(payeeError)
        }
    })

}
async function captureOrder(accessToken, orderId) {
    // gradMail = "lastreserve4@gmail.com"

    return new Promise(async (resolve, reject) => {

        try {
            let res = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
                {

                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,

                    }
                }
            );
            console.log("resolving")
            resolve(res)

        } catch (authError) {
            reject({ success: false })
            // console.log(authError.data.details)
        }
    })

}
router.post('/createPayment', async (req, res) => {
    let { eventId, gradId } = req.body
    pendingPayments[eventId] = true
    console.log('pending payments', pendingPayments)
    const cancel = async (token) => {

        try {

            let res = await axios.post(`https://api.calendly.com/scheduled_events/${eventId}/cancellation`, {
                "reason": "Payment not complete"
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log("3")
            delete pendingPayments[eventId]
            // res.status(200).send({ success: true, message: "Successfully cancelled the meeting" })
        } catch (cancelError) {
            delete pendingPayments[eventId]
            console.log("2")
            console.log(cancelError)
            // res.status(401).send({ success: false, message: "Couldn't successfuly cancel the meeting." })
        }


    }
    try {
        let grad = await grads.findById(gradId)

        let token = grad.token
        if (token === undefined) {
            throw Error('invalid token found')
        }
        setTimeout(() => { if (pendingPayments[eventId] === true) { cancel(token) } }, 600000)
        // setTimeout(cancel,600000)
        res.status(200).send({ success: true })
    } catch (cancelError) {
        console.log("1")
        console.log(cancelError)
        res.status(400).send({ success: false, error: cancelError })
    }
})
const accessToken = async () => {
    let response;
    try {
        response = await axios.post(
            process.env.NODE_ENV === 'production' ? process.env.PAYPAL_ACCESS_TOKEN_URL : process.env.PAYPAL_SANDBOX_ACCESS_TOKEN_URL,
            new URLSearchParams({
                'grant_type': 'client_credentials'
            }),
            {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Language': 'en_US'
                },
                auth: process.env.NODE_ENV === "production" ? {
                    username: process.env.CLIENT_ID,
                    password: process.env.CLIENT_SECRET
                } : {
                    username: process.env.CLIENT_ID_OLD,
                    password: process.env.CLIENT_SECRET_OLD
                }
            }
        );

    } catch (tokenError) {
        console.log("token error my friend")
        console.log(tokenError)
    }
    console.log("finished gettign the access token successfull")

    return response.data.access_token;
};
const transferMoneyNew = async (sourceAccount, destinationAccount, amount) => {

    // create accessToken using your clientID and clientSecret
    // for the full stack example, please see the Standard Integration guide
    // https://developer.paypal.com/docs/checkout/standard/integrate/
    console.log("has entered the transferMoney section")
    const token = await accessToken()
    console.log("((((((" + token + ")))))))")
    let doc = await stats.findById(process.env.STATS_ID)
    let currentTime = new Date()
    let year = currentTime.getFullYear().toString()
    return fetch(process.env.NODE_ENV === 'production' ? process.env.PAYPAL_PAYOUT_URL : process.env.PAYPAL_SANDBOX_PAYOUT_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            "sender_batch_header": {
                "sender_batch_id": "Payouts_" + year + (() => doc.basketValues.length + 1)(),
                "email_subject": "You have a payout!",
                "email_message": "You have received a payout! Thanks for using our service!"
            },
            "items": [
                {
                    "recipient_type": "EMAIL",
                    "amount": {
                        "value": amount,
                        "currency": "USD"
                    },
                    "note": "Thanks for your patronage!",
                    "sender_item_id": "201403140004",
                    "receiver": destinationAccount,
                    // "note": "ERRPYO002",
                    // "recipient_wallet": "RECIPIENT_SELECTED"
                }]
        })

    })
        .then((response) => response.json())
        .then((data) => console.log(data));

}
const transferMoney = async (sourceAccount, destinationAccount, amount) => {
    try {
        const token = await accessToken();
        console.log("(((((((((" + accessToken + ")))))))))")
        const response = await axios.post('https://api.sandbox.paypal.com/v2/payments/payouts', {
            sender_batch_header: {
                sender_batch_id: 'PM1001',
                email_subject: 'Payment from PayPal'
            },
            items: [
                {
                    recipient_type: 'EMAIL',
                    amount: {
                        value: amount,
                        currency: 'USD'
                    },
                    note: 'Payment from PayPal',
                    receiver: destinationAccount,
                    sender_item_id: '10112'
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(response.data);

        // Handle the response and perform necessary actions

    } catch (error) {
        console.error(error);
        // Handle the error appropriately
    }
};
router.post('/paymentComplete', async (req, res) => {
    const {
        eventId,
        basket,
        gradId: grad,
        userId: user,
        gradMail,
        service,
        amt
    } = req.body
    console.log(req.body)
    if (pendingPayments[eventId] !== undefined) {
        pendingPayments[eventId] = false
        try {
            console.log("trying to intiate a new connection now that the payment has been made")
            console.log(process.env.CLIENT_ID)
            console.log(process.env.CLIENT_SECRET)
            console.log()
            console.log()
            console.log()
            console.log()

            // Trying to gert access token for the api payment call

            // const endpoint = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
            try {

                await transferMoneyNew("sb-of437r25366370@business.example.com", gradMail, amt)

            } catch (tokenError) {
                console.log("displaying token error here btw")
                console.log(tokenError)
            }

            let con = await connections.findOne({ grad, user })
            if (con !== null) {
                console.log("connection already exists")
                let tempBasket = con.basket
                // tempBasket.interviewPrep = false
                // tempBasket.essayReview = false
                let tempMeetings = con.meetings
                try {
                    let newDetails = {
                        basket: { ...tempBasket, ...basket },
                        meetings: [...tempMeetings, { eventId, service }]
                    }
                    let changeKeys = Object.keys(newDetails)
                    newDetails.basket.interviewPrep = false;
                    newDetails.basket.essayReview = false;
                    for (key of changeKeys) {
                        console.log(key)
                        console.log(newDetails[key])
                        con[key] = newDetails[key];
                    }
                    // user.testProgress = newProgress
                    con.save()
                    console.log('user')
                    let gradDoc = await grads.findById(grad)
                    // console.log(gradDoc)
                    // gradDoc.connections.push(newConnection._id.toString())
                    gradDoc.meetingsCnt = gradDoc.meetingsCnt === undefined ? 1 : gradDoc.meetingsCnt + 1
                    await gradDoc.save()
                    res.status(200).send({ success: true, connection: con, repeat: true })

                } catch (repeatUpdateError) {
                    console.log(repeatUpdateError)
                    res.status(400).send({ success: false, error: repeatUpdateError, repeat: true })

                }
            } else {

                console.log("connection doesnt exist")

                let newConnection = new connections({

                    grad,
                    user,
                    chats: [],
                    files: { grad: [], user: [] },
                    meetings: [{ eventId, service }],
                    basket,
                    files: {
                        grad: [],
                        user: []
                    }
                })

                try {
                    let gradDoc = await grads.findById(grad)
                    console.log(gradDoc)
                    gradDoc.connections.push(newConnection._id.toString())
                    gradDoc.meetingsCnt += 1
                    await gradDoc.save()
                    let userDoc = await users.findById(user)
                    console.log(userDoc)
                    userDoc.connections.push(newConnection._id.toString())
                    await userDoc.save()
                    newConnection.title = gradDoc.name + ' - ' + uniList[gradDoc.uni]
                    newConnection.altTitle = userDoc.name
                    let connection = await newConnection.save()
                    res.status(200).send({ success: true, connection, user: userDoc, repeat: false })
                } catch (saveError) {
                    console.log(saveError)
                    res.status(400).send({ success: false, error: saveError, repeat: false })
                }
            }

        } catch (createError) {
            console.log("reached user repeat error")
            console.log(createError)
            res.status(401).send({ success: false, error: createError, type: "repeat", repeat: true })
        }


    }

})
module.exports = router