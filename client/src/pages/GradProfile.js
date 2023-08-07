import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, FormGroup, FormControlLabel, RadioGroup, Checkbox, Radio, Button, Dialog, DialogTitle, Icon, Avatar, Tooltip } from '@mui/material';
// components
import Iconify from '../components/iconify';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// sections
import {
    AppTasks,
    AppNewsUpdate,
    AppOrderTimeline,
    AppCurrentVisits,
    AppWebsiteVisits,
    AppTrafficBySite,
    AppWidgetSummary,
    AppCurrentSubject,
    AppConversionRates,
} from '../sections/@dashboard/app';
import { LoggedInContext, StatsContext, UserContext } from '../context';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Stack, width } from '@mui/system';
import Pricing from '../sections/@dashboard/grad/pricing';
import Review from '../sections/@dashboard/grad/review';
import Divider from '../sections/general/paletteDivider';
import axios from 'axios';
import axiosLink from '../axiosLink';
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import uniList from '../constants/unis';
// import img from './images/avatar_1.jpg'
// import img from '../../public/assets/images/avatars/avatar_1.jpg'
// import Button from '../theme/overrides/Button';

// ----------------------------------------------------------------------

export default function GradProfilePage() {
    let { id } = useParams()
    const { user, isGrad, updateUser, setUser } = useContext(UserContext)
    const theme = useTheme();
    const [grad, setGrad] = useState({})
    let navigate = useNavigate()
    const [basket, setBasket] = useState({
        meet: false,
        essayReview: false,
        interviewPrep: false,
        // chat: false,
        essaySharing: false,
        strat: false
    })
    const [service, setService] = useState('second')
    const [eventId, setEventId] = useState('')
    const [open, setOpen] = useState(false)
    const [readyToPay, setReadyToPay] = useState(false)
    const [accountName, setAccountNameNew] = useState('ishanrev1212')
    const [description, setDescription] = useState({ state: false, service: '' })
    // const [connection, setConnection] = useState({})
    const { stats, updateStats } = useContext(StatsContext)
    let { loggedIn } = useContext(LoggedInContext)
    const meetingScheduler = (
        <>
            {/* <InlineWidget styles={{
                height: '1000px'
            }} url="https://calendly.com/ishanrev1212/30min" /> */}
            <InlineWidget
                styles={{ width: "60vw", height: "60vh" }}
                url={`https://calendly.com/${accountName}/30min`}
                prefill={{

                    email: user.emailId !== undefined ? user.emailId : '',
                    firstName: 'Jon',
                    lastName: 'Snow',
                    name: user.name !== undefined ? user.name : '',
                    guests: [

                    ],
                    customAnswers: {

                    },
                    date: new Date(Date.now() + 86400000)

                }}
            />
        </>

    )
    const [image, setImage] = useState('ayra-ali')

    useEffect(() => {
        console.log(id)
        let gId = ''
        async function fetchGrad() {
            try {
                let res = await axios.get(axiosLink + "/user/grad/" + id)
                console.log(res.data.user)
                // gId = res.data.user._id.toString()
                let temp
                try {
                    temp = require(`../grads/${res.data.user.img}.png`)

                } catch (reqError) {

                    temp = require(`../grads/alt.jpg`)
                }
                let temp2
                try {
                    temp2 = require(`../unis/${res.data.user.uni}.png`)

                } catch (reqError) {

                    temp2 = require(`../unis/alt.jpg`)
                }
                setImage({ grad: temp, uni: temp2 })
                setAccountNameNew(res.data.user.calendlyUsername)
                setGrad(res.data.user)
                console.log(res.data.user.emailId.substring(0, res.data.user.emailId.indexOf("@")))
            } catch (getGradError) {
                console.log(getGradError)
                navigate("/404")
            }
        }
        if (id !== undefined) {
            fetchGrad()
        } else {
            navigate("/dashboard")
        }
    }, [])
    useEffect(() => {
        checkForConnection()

    }, [grad])

    const checkForConnection = async () => {

        try {
            let res = await axios.post(axiosLink + "/connection/isConnection", { grad: grad._id.toString(), user: user._id.toString() })
            console.log(res)
            if (res.data.success === true) {
                console.log("modifying basket to accomodate w=for whats already there")
                let tempBasket = res.data.connection.basket
                console.log(tempBasket)
                let newBasket = { meet: true }
                if (tempBasket !== undefined) {
                    for (let key of Object.keys(tempBasket)) {
                        if (tempBasket[key] === false) {
                            newBasket[key] = false
                        }
                    }

                    // setBasket(newBasket)
                }
                // setConnection(res.data.setConnection)
            }
        } catch (conError) {
            console.log(conError)
        }
    }
    // useEffect(() => {
    //     checkForConnection()
    // }, [])
    const totalPriceCalcualtor = () => {
        if (grad.price !== undefined && service !== 'second') {

            let sum = grad.price['meet']
            for (let el of Object.keys(basket)) {
                if (basket[el] === true) {

                    sum += grad.price[el]
                }
            }
            return grad.price[service]
        } else {
            return 0
        }
    }
    useCalendlyEventListener({

        onEventScheduled: async (e) => {
            setReadyToPay(true)
            setTimeout(() => { setReadyToPay(false) }, 300000)
            console.log("event has been scheduled")
            console.log(e)
            await meetingBooked(e)


        },
    });
    const meetingBooked = async (e) => {
        let uri = e.data.payload.event.uri
        let evId = uri.substring(uri.lastIndexOf('/') + 1)
        console.log("eventId babbyyy - new", evId)
        setEventId(evId)
        try {
            if (grad._id !== undefined) {

                let res = await axios.post(axiosLink + '/connection/createPayment', {
                    eventId: evId,
                    gradId: grad._id.toString()
                })
            }
        } catch (createPaymentError) {
            console.log(createPaymentError)
        }
    }
    const paymentComplete = async () => {

        try {
            console.log("Just before initiation", eventId)
            let res = await axios.post(axiosLink + "/connection/paymentComplete", {
                eventId,
                basket,
                service,
                gradId: grad._id.toString(),
                userId: user._id.toString(),
                // gradMail: grad.emailId,
                gradMail: "sb-4ovny25366390@personal.example.com",
                amt: totalPriceCalcualtor()
            })
            // let tempUser = { ...user, connections: [...user.connections, res.data.connection._id.toString()] }
            // updateUser({ connections: [...temp, res.data.connection._id.toString()] })
            console.log(basket)
            let temp = stats.serviceFrequency;
            for (let key of Object.keys(basket)) {
                temp[key] = temp[key] !== undefined ? basket[key] === true ? temp[key] + 1 : temp[key] : 0
            }
            updateStats("serviceFrequency", temp)
            if (res.data.repeat === false) {
                setUser(res.data.user)

            }
            console.log("res.sucesssssssss baby")
        } catch (paymentCompleteError) {
            console.log("^^^^^^^^^ we have a payment COmpleteError boys")
            console.log(paymentCompleteError)
        }
    }
    const basketLabels = {

        meet: "Q&A Session",
        essayReview: "Essay Review",
        interviewPrep: "Interview Prep",
        chat: "Chat",
        essaySharing: "Essay Curation",
        strat: "Strategizing Session "

    }
    const descriptionArray = {
        meet: `Want to gain insight into what it's like to be a student at your dream college? Look no further! Gradify's premier Q&A service is your ultimate resource. Get your doubts clarified, ask any questions, and prepare to navigate the application process with confidence!
        `        ,
        essayReview: `Unleash the power of your college essays with Gradify's personalized on-call reviewing service. Receive expert guidance to captivate admission officers and leave a lasting impression on your path to success! 
        `,
        interviewPrep: ` Ready to conquer your upcoming college interview? Fear not! Step into the spotlight with confidence as you engage in a mock interview with Gradify, unlocking invaluable insights on how to ace your interview and tilt that admission decision in your favor!
        `,
        chat: ``,
        essaySharing: "Looking to have your college essays personally modified by a successful applicant from your dream college? Look no further! Try out our essay curation service, designed to give you an unparalleled edge in the highly competitive applicant pool. Simply share your essays (one-time only), and within no time, you'll receive an augmented essay at your fingertips.",
        strat: "Embark on an exhilarating journey as you navigate the intricate college application process. Strategize for the years ahead, crafting a stellar plan that includes dynamic extracurriculars and academic excellence, catapulting you into the realm of the most competitive applicants and paving your way to the doors of your dream university!",
    }
    return (
        <>

            <Helmet>
                <title> Dashboard | Minimal UI </title>
            </Helmet>

            <Container maxWidth="xl" >

                {/* <br /> */}
                <Grid container spacing={3}>


                    <Grid item xs={12} md={6} lg={9}>
                        <Card sx={{ padding: '5%', height: '40vh' }}>
                            <Stack direction="row" spacing={2}>
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{}}>
                                        <img style={{ width: 'auto', height: 'auto', borderRadius: '10px', objectFit: 'cover' }}
                                            // src='https://covenantnebraska.com/wp-content/uploads/2020/03/Colton-290x300.jpg'>
                                            src={image.grad}>

                                        </img>
                                    </Box>
                                </Box>
                                <Stack spacing={1}>
                                    <Box sx={{ fontWeight: 'bold' }}>
                                        {/* John Madone */}
                                        {grad.name}
                                    </Box>
                                    <Box>
                                        {/* "Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                        et dolore magna aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
                                        " */}
                                        {grad.description}
                                    </Box>
                                    {/* <Typography >Major: Computer Science</Typography> */}
                                </Stack>
                            </Stack>

                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3} color="error">
                        <Card sx={{ padding: '10%' }}>

                            <Box>

                                <img style={{ width: 'auto', height: 'auto' }} src={image.uni}></img>
                            </Box>
                            <Box sx={{ paddingTop: '10px', textAlign: "center" }}>

                                <Typography >{uniList[grad.uni]}</Typography>
                            </Box>
                        </Card>

                    </Grid>
                    <Grid item xs={12} md={6} lg={12} color="error">
                        <Card sx={{ padding: '1rem' }} >
                            <Typography sx={{ fontWeight: 'bold' }}>{`Major:\t` + grad.major}</Typography>
                            <br />
                            <Stack direction={'row'} spacing={2} overflow={'auto'} justifyContent={'center'}>
                                {grad.other !== undefined && grad.other.map((uni, index) => {
                                    let img;
                                    try {

                                        img = require(`../unis/${uni}.png`)
                                    } catch (imageError) {
                                        img = require(`../unis/avatar.jpg`)

                                    }
                                    {/* let img = require(`../unis/avatar.jpg`) */ }
                                    return (
                                        <Tooltip title={uniList[uni]}>

                                            <Avatar alt="Remy Sharp" src={img} sx={{ width: 56, height: 56 }} />
                                        </Tooltip>
                                    )
                                })}




                                {/* <Avatar src='..///public/assets/images/avatars/avatar_1.jpg' /> */}
                            </Stack>
                        </Card>
                    </Grid>
                    {isGrad === "" ? <>

                        <Grid item xs={12} md={6} lg={4}>
                            {/* <Pricing tiers={grad.tiers} /> */}
                            <Card sx={{ height: 'auto', p: "1rem" }}>

                                <Dialog onClose={() => {
                                    setDescription({ state: false, service: description.service })
                                }}
                                    open={description.state}
                                >
                                    <Box sx={{ px: "2rem", pb: "2rem" }}>

                                        <DialogTitle>
                                            {basketLabels[description.service]}
                                        </DialogTitle>
                                        <Typography>
                                            {descriptionArray[description.service]}
                                        </Typography>
                                    </Box>
                                </Dialog>

                                <RadioGroup>
                                    {Object.keys(basket).map((el, index) => {
                                        return (
                                            <>
                                                {grad.price !== undefined ? <>

                                                    <Stack justifyContent={'space-between'} direction={'row'}>

                                                        <FormControlLabel value={el} key={index} control={<Radio onChange={(e) => {
                                                            // if (el !== 'meet') {
                                                            // let temp = { ...basket }
                                                            // temp[el] = e.target.value
                                                            console.log(e.target.value)
                                                            setService(e.target.value)


                                                        }} />} label={basketLabels[el]} />
                                                        {/* }} />} label={basketLabels[el] + ' -    ' + grad.price[el] + '$'} /> */}
                                                        <HelpOutlineIcon sx={{ pt: '0.65rem', cursor: "pointer" }} onClick={() => {
                                                            setDescription({ state: true, service: el })
                                                        }} />
                                                    </Stack>

                                                </> : <>

                                                </>}
                                            </>
                                        )
                                    })}
                                </RadioGroup>
                                <Divider />
                                <br />
                                <Stack spacing={2}>
                                    <Typography>    {`Price:       ` + totalPriceCalcualtor() + ''}$ </Typography>
                                    <Button disabled={(() => { return service === 'second' ? true : false })()} onClick={() => { setOpen(true) }} variant={'outlined'}>Book Now</Button>
                                </Stack>
                            </Card>
                        </Grid>
                    </> : undefined}

                    {/* <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentSubject
                            title="Current Subject"
                            chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
                            chartData={[
                                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                            ]}
                            chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
                        />
                    </Grid> */}


                    <Grid item xs={12} md={6} lg={8}>
                        {/* <Review
                            title="Reviews"
                            list={[...Array(5)].map((_, index) => ({
                                id: faker.datatype.uuid(),
                                title: faker.name.jobTitle(),
                                description: faker.name.jobTitle(),
                                img: `/assets/images/covers/cover_${index + 1}.jpg`,
                                postedAt: faker.date.recent(),
                                stars: 2
                            }))}
                        /> */}
                        <Review
                            title="Reviews"
                            list={grad.reviews}
                        />
                        {/* <Review
                            title="Reviews"
                            list={grad.reviews === undefined ? [] : grad.reviews}
                        /> */}

                    </Grid>

                    {/* <Grid item xs={12} md={6} lg={4}>
                        <AppOrderTimeline
                            title="Order Timeline"
                            list={[...Array(5)].map((_, index) => ({
                                id: faker.datatype.uuid(),
                                title: [
                                    '1983, orders, $4220',
                                    '12 Invoices have been paid',
                                    'Order #37745 from September',
                                    'New order placed #XF-2356',
                                    'New order placed #XF-2346',
                                ][index],
                                type: `order${index + 1}`,
                                time: faker.date.past(),
                            }))}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppTrafficBySite
                            title="Traffic by Site"
                            list={[
                                {
                                    name: 'FaceBook',
                                    value: 323234,
                                    icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                                },
                                {
                                    name: 'Google',
                                    value: 341212,
                                    icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                                },
                                {
                                    name: 'Linkedin',
                                    value: 411213,
                                    icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                                },
                                {
                                    name: 'Twitter',
                                    value: 443232,
                                    icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                                },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={12}>
                        <AppTasks
                            title="Tasks"
                            list={[
                                { id: '1', label: 'Create FireStone Logo' },
                                { id: '2', label: 'Add SCSS and JS files if required' },
                                { id: '3', label: 'Stakeholder Meeting' },
                                { id: '4', label: 'Scoping & Estimations' },
                                { id: '5', label: 'Sprint Showcase' },
                            ]}
                        />
                    </Grid> */}
                </Grid>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    sx={{ p: '1rem' }}
                    fullWidth
                    maxWidth={'md'}
                >
                    <DialogTitle>Schedule a meeting now!</DialogTitle>
                    <Stack direction={'row'} justifyContent={'space-around'} spacing={3} sx={{ p: '1rem' }}>

                        {meetingScheduler}
                        <>
                            {loggedIn === true ? <>

                                {readyToPay === true && user._id !== undefined ?
                                    <>
                                        {/* <Stack spacing={2} maxWidth={'20vw'}>

                                            <Typography>The payment transfer must be completed within 20 minutes of making your booking.
                                                Meeting slots may be booked according to personal preference at any time in any required number.</Typography>
                                            <PayPalButtons
                                                merchantId="*"
                                                // data-merchant-id="2KFBYR3CX88BJ,SVG8WX49C5628"
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        "purchase_units": [
                                                            {
                                                                "reference_id": "PU001",
                                                                "amount": {
                                                                    "currency_code": "USD",
                                                                    "value": "5.00",

                                                                },

                                                            }

                                                        ]
                                                        ,
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then((details) => {
                                                        const name = details.payer.name.given_name;
                                                        let amount = totalPriceCalcualtor()
                                                        let temp = stats.basketValues
                                                        // console.log(temp)
                                                        let temp2 = stats.averageBasketValue
                                                        temp2 = ((temp2 * temp.length) + amount) / (temp.length + 1)
                                                        temp.push(amount)
                                                        updateStats('basketValues', temp)
                                                        // console.log(temp2)
                                                        updateStats('averageBasketValue', temp2)


                                                        paymentComplete()
                                                        alert(`Transaction completed by ${name}`);
                                                    });
                                                }}
                                            />
                                        </Stack> */}

                                        <Button sx={{height:'10%'}} variant='outlined' onClick={() => {
                                            paymentComplete()
                                            setTimeout(() => {
                                                navigate('/connection/home')
                                            }, 1000)
                                        }}>
                                            Proceed to create Connection
                                        </Button>

                                    </> : undefined
                                }
                            </> : <>
                                <Stack spacing={2} maxWidth={'20vw'}>

                                    <Typography>Please Sign In or Create an account to proceed with the payment. (The scheduled meeting wil automatically be cancelled in 5 minutes)</Typography>
                                    <Button variant='outlined' sx={{ width: "80%" }} onClick={() => { navigate('/login') }}>Sign In</Button>

                                </Stack>
                            </>}


                        </>
                    </Stack>
                </Dialog>
            </Container >
        </>
    );
}
