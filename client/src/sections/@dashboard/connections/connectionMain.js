import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, Input, TextField, Button, Dialog, DialogTitle, InputAdornment, Rating, Collapse, IconButton, CircularProgress } from '@mui/material';
// components
// import ScrollableFeed from 'react-scrollable-feed'

import { useContext, useEffect, useState, useRef, createRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Stack, width } from '@mui/system';
import { ListItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import axios from 'axios';
import axiosLink from '../../../axiosLink';
import { SocketContext, UserContext } from '../../../context';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { blue, green, grey, red } from '@mui/material/colors';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIconOutlined from '@mui/icons-material/DeleteOutlined';
import { v4 as uuid } from "uuid"
// import { decode as base64_decode, encode as base64_encode } from 'base-64';
// import FileSaver from 'file-saver'
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";


function ConnectionChat({ chats = [] }) {
    const { user } = useContext(UserContext)

    useEffect(() => {
        console.log('typing chat from where I want to type my friend')
    }, [])
    const sideRender = (sender) => {
        if (sender === user._id.toString()) {
            return 'end'
        } else {
            return 'start'
        }

        // if (sender === 'bob') {
        //     return 'end'
        // } else {
        //     return 'start'
        // }
    }
    const colourRender = (sender) => {
        if (sender === user._id.toString()) {
            return '#3C486B'
        } else {
            return '#F9D949'
        }

        // if (sender === 'bob') {
        //     return '#3f51b5'
        // } else {
        //     return '#f5f5f5'
        // }
    }
    const textColourRender = (sender) => {
        if (sender === user._id.toString()) {
            return 'white'
        } else {
            return 'black'
        }

        // if (sender === 'bob') {
        //     return 'white'
        // } else {
        //     return 'black'
        // }
    }
    const scrollRef = useRef(null);
    // const chatParent = useRef < HTMLDivElement > (null);
    useEffect(() => {

    }, [])
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behaviour: "smooth" });
        }
        window.scrollTo(0, 0)

    }, [chats]);
    // useEffect(() => {
    //     const domNode = chatParent.current;
    //     if (domNode) {
    //         domNode.scrollTop = domNode.scrollHeight;
    //     }
    // })
    return (
        <>


            <Box >




                {chats.map((ch, index) => {
                    const { sender, message } = ch
                    return (
                        <>
                            <Stack
                                direction="row"
                                // justifyContent={"flex-" + sideRender(sender)'}
                                justifyContent={"flex-" + sideRender(sender)}
                                // justifyContent={"flex-end"}
                                alignItems="center"
                                spacing={2}
                            >


                                <Box component='div' sx={{
                                    px: "1rem",
                                    py: "0.5rem", my: "0.1rem", wordWrap: 'break-word', overflow: "hidden"
                                    , maxWidth: "40%", color: textColourRender(sender),
                                    backgroundColor: colourRender(sender),
                                    borderRadius: "10px"
                                }}>
                                    <Typography noWrap sx={{ whiteSpace: "break-spaces" }}>{message}</Typography>
                                </Box>

                            </Stack>
                            <>
                            </>
                        </>
                    )
                })}
                <div ref={scrollRef}   >
                </div>
            </Box>



        </>
    )
}
export default function ConnectionMain({ conId }) {
    // const { } = connection
    const socket = useContext(SocketContext)
    const { user, isGrad } = useContext(UserContext)
    const [currentMeeting, setCurrentMeeting] = useState('')
    const [open, setOpen] = useState(false)
    const [connection, setConnection] = useState({})
    const [meetings, setMeetings] = useState(undefined)
    // const [files, setFiles] = useState({})
    const [timePassedVar, setTimePassedVar] = useState(0)
    const [comment, setComment] = useState({})
    const [meetingsArr, setMeetingsArr] = useState([])
    const [gradId, setGradId] = useState('')
    const [collapseOpen, setCollapseOpen] = useState([])
    const [showCommentSection, setshowCommentSection] = useState(false)

    let navigate = useNavigate()


    useEffect(() => {
        console.log(connection)
        socket.on("update connection", ({ }) => {
            getConnection()
        })

        // document.addEventListener("keydown", preventScreenshot)

    }, [])
    useEffect(() => {
        getConnection()
        console.log('yo')
        console.log('yo')
        console.log('yo')
    }, [])
    useEffect(() => {
        console.log("recognizing change")
        getConnection()
        console.log()
    }, [conId])
    const getMeetings = async (gradId, meetings) => {
        console.log("new list of updated meetings", meetings, gradId)
        let tempOpen = []
        try {
            let res = await axios.get(axiosLink + '/user/grad/' + gradId)
            let token = res.data.user.token
            let tempMeetData = []
            let x = 0
            for (let meet of meetings) {
                let { eventId, service } = meet
                // let eventId = meet
                console.log(eventId)
                let meetRes = await axios.get("https://api.calendly.com/scheduled_events/" + eventId,
                    {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    })
                console.log("resource", meetRes)
                const { name, start_time, location } = meetRes.data.resource
                // console.log("resource", meetRes.data.resource)
                // let d = new Date()
                // tempMeetData.push({
                //     name: "lol",
                //     start_time: d.toString()
                // })
                tempMeetData.push({
                    name,
                    start_time,
                    join_url: location.join_url,
                    service
                })

                x = x + 1
            }

            // setCollapseOpen(tempOpen)
            console.log('final broski tempMeetData', tempMeetData)
            setMeetings(tempMeetData)
        } catch (error) {
            console.log(error)
        }
    }


    const getConnection = async () => {
        console.log('going to get a new connection yaay')
        try {
            let res = await axios.get(axiosLink + '/connection/' + conId)
            if (res.data.connection !== undefined & res.data.connection !== null) {
                console.log(res.data.connection)
                let temp = res.data.connection
                console.log("going to get meetings now")
                // setFiles(temp.files)
                setGradId(res.data.connection.grad)
                setMeetingsArr(res.data.connection.meetings)
                setshowCommentSection(!temp.commentMade)
                setConnection(temp)


                // getFiles(res.data.connection.files)
            }
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        console.log("updating the static variables", [gradId, meetingsArr])
        getMeetings(gradId, meetingsArr)
    }, [meetingsArr])
    // useCalendlyEventListener({

    //     onEventScheduled: (e) => {
    //         console.log("event has been scheduled")
    //         console.log(Object.keys(e.data))
    //         setTimeout(() => {
    //             meetingBooked()
    //         }, 3000)
    //     },
    // });

    const meetingBooked = async () => {
        try {
            let temp = connection.meetings.map((el, index) => {
                if (index === currentMeeting) {
                    return true
                } else {
                    return el
                }
            })
            if (temp !== undefined) {

                let res = await axios.put(axiosLink + '/connection/' + connection._id.toString(), { meetings: temp })
                if (res.data.success === true) {
                    setConnection(res.data.updated)
                    setCurrentMeeting(null)
                    setOpen(false)
                }
            }

        } catch (messageError) {
            console.log(messageError)
        }
    }
    const [message, setMessage] = useState('')
    const chats = [
        {
            sender: 'bob',
            message: 'hi brother'
        },
        {
            sender: 'bob',
            message: 'hi brother'
        },
        {
            sender: 'no',
            message: 'hi brotherhi brotherhi brotherhi brotherhi brotherhi brotherhi brotherhi brotherhi brotherhi brotherhi brotherhi brotherhi brotherhi brother'
        },
        {
            sender: 'bob',
            message: 'hi brother'
        },
        {
            sender: 'no',
            message: 'hi brother'
        },
        {
            sender: 'no',
            message: 'hi bob'
        }
    ]
    const send = async () => {
        let newMessage = {
            sender: user._id.toString(),
            message
        }
        try {
            let res = await axios.post(axiosLink + '/connection/chat/' + connection._id.toString(), newMessage)
            if (res.data.success === true) {
                console.log('updating connection')
                setConnection(res.data.connection)
                let toId
                if (user._id.toString() === connection.user) {
                    toId = connection.grad
                } else {
                    toId = connection.user
                }
                socket.emit("message sent", { toId })
            }
        } catch (messageError) {
            console.log(messageError)
        }
        setMessage('')
        setValid(true);
    }
    const [valid, setValid] = useState(true)

    const validMessage = (m) => {
        let b = false
        let temp = m.trim()
        temp = temp.replace(' ', '')
        temp = temp.replace('\n', '')
        if (temp.length === 0) {
            setValid(true)
        } else {
            setValid(false)
        }
    }

    const meetingScheduler = (
        <>
            {/* <InlineWidget styles={{
                height: '2000px'
            }} url="https://calendly.com/ishanrev1212/30min" /> */}
            <InlineWidget url="https://calendly.com/ishanrev1212/30min" />
        </>

    )

    const convertDate = (str) => {
        let s = ''
        // const myDate = new Date();
        // let diff = myDate.getTimezoneOffset();
        // console.log(typeof(diff))
        let strDate = new Date(str)
        // var newDate = strDate.toLocaleString("en-US", { timeZone: "" })
        let arr = strDate.toString().split(' ')
        let d = [arr[0], arr[1], arr[2], arr[3], arr[4]].join(' ')
        return '' + d
    }
    const timePassed = (str) => {
        try {
            let strDate = new Date(str)
            var current = new Date()
            console.log(strDate, current)
            var Difference_In_Time = strDate.getTime() - current.getTime();

            // To calculate the no. of days between two dates
            var days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
            // if (current > strDate) {
            //     let temp = timePassedVar
            //     setTimePassedVar(temp + 1)
            // }
            console.log([current > strDate, days])
            return [current > strDate, Math.abs(days)]
        } catch (dateError) {
            console.log(dateError)
            return [null, 0]
        }

    }
    // useEffect(() => {
    //     setFiles(connection.files)
    // })

    // useEffect(() => {
    //     console.log("use Effect meeting log", meetings)
    //     console.log(connection)
    // }, [connection])

    const uploadFile = async (file) => {
        try {
            let formData = new FormData();
            console.log(Object.keys(file))
            formData.append('caption', file.name);
            formData.append('file', file);

            let res = await axios.post(axiosLink + "/fileUpload/", formData)
            console.log('timberrrrrrrrrrr')
            console.log(res.data)


            if (res.data.success === true) {
                try {
                    let tempCon = connection
                    isGrad === '' ? tempCon.files.user.push({ filename: res.data.image.filename, caption: res.data.image.caption }) : tempCon.files.grad.push({ filename: res.data.image.filename, caption: res.data.image.caption })
                    let updateRes = await axios.put(axiosLink + "/connection/" + conId, { files: tempCon.files })
                    if (updateRes.data.success === true) {
                        setConnection(updateRes.data.updated)
                        // alert("File Uploaded")
                    }
                } catch (updateError) {

                }
            } else {
                alert(res.data.message)
            }
        } catch (addFileError) {
            console.log(addFileError)
        }
    }

    // useEffect(() => {
    //     console.log("atleast its registering a change in the files")
    // }, [files])

    const downloadFile = async (filename, caption) => {

        try {
            axios({
                method: "GET",
                url: axiosLink + "/fileUpload/image/" + filename,
                responseType: "blob"
            })
                .then(response => {

                    console.log("trying");
                    // FileSaver.saveAs(response.data, caption);

                })
                .then(() => {

                    console.log("Completed");
                });

            // console.log(res)
            // // const encodedString = Buffer.from(res.data).toString('base64');
            // // let encoded = base64_encode(res.data);

            // var binaryString = window.atob(res.data);
            // var binaryLen = binaryString.length;
            // var bytes = new Uint8Array(binaryLen);
            // for (var i = 0; i < binaryLen; i++) {
            //     var ascii = binaryString.charCodeAt(i);
            //     bytes[i] = ascii;
            // }
            // bytes = new Uint8Array(resultByte); // pass your byte response to this constructor

            // var blob = new Blob([bytes], { type: "application/pdf" });
            // var link = document.createElement('a');
            // link.href = window.URL.createObjectURL(blob);
            // var fileName = uuid();
            // link.download = fileName;
            // link.click();

            // navigate("http://localhost:3001/api/fileUpload/image" + filename)
        } catch (displayDocumentError) {
            console.log(displayDocumentError)
        }
    }
    const deleteFile = async (filename) => {
        try {
            await axios.delete(axiosLink + "/fileUpload/file/del/" + filename)
                .then(async response => {

                    console.log("trying");
                    try {
                        let tempCon = connection

                        tempCon.files.user = tempCon.files.user.filter((obj) => {
                            // console.log(filename !== fName)
                            return obj.filename !== filename
                        })
                        tempCon.files.grad = tempCon.files.grad.filter((obj) => {
                            // console.log(filename !== fName)
                            return obj.filename !== filename
                        })
                        console.log(tempCon)
                        let updateRes = await axios.put(axiosLink + "/connection/" + conId, { files: tempCon.files })

                        setConnection(updateRes.data.updated)

                    } catch (updateError) {
                        console.log(updateError)
                    }
                })



        } catch (deleteFileError) {
            console.log(deleteFileError)
        }
    }
    const sendReview = async () => {
        try {
            let d = new Date()
            let tempComment = {
                ...comment, ...{
                    user: connection.user.toString(),
                    username: 'Anonymous',
                    datePosted: d.toString()
                }
            }
            let body = { comment: tempComment, conId: connection._id.toString() }
            console.log(body)
            let res = await axios.post(axiosLink + "/user/grad/comment/" + connection.grad, body)
            setshowCommentSection(false)
        } catch (sendReviewError) {
            console.log(sendReviewError)
        }
    }
    // useEffect(() => {
    //     console.log("------------------------------Meetings has changed")


    // }, [collapseOpen])
    const basketLabels = {

        meet: "Q&A Session",
        essayReview: "Essay Review",
        interviewPrep: "Interview Prep",
        chat: "Chat",
        essaySharing: "Essay Curation",
        strat: "Strategizing Session "

    }
    return (
        <>
            {connection !== undefined && connection.basket !== undefined ? <>

                <Grid container spacing={3} >


                    {true ? <>

                        <Grid item xs={12} md={10} lg={12}>
                            <Card sx={{ padding: '0%', height: '70vh', border: "1px solid lightgray" }}>
                                <Stack >
                                    {/* <Box sx={{ width: '200%', overflow: "auto", height: "50vh", p: "2rem", border: '2px solid #ddeaf7 ', borderRadius: "10px" }}> */}
                                    <Box flexDirection={'column-reverse'} sx={{ width: '100%', overflow: "auto", height: "55vh", p: "2rem", pb: "2rem", backgroundColor: "#fafafa", borderRadius: "0px" }}>
                                        <ConnectionChat chats={connection.chats} />

                                    </Box>
                                    <div style={{ height: "0.2rem", backgroundColor: 'lightgray', borderRadius: "10px" }}></div>
                                    <Box sx={{ width: '100%', height: "20vh", px: "1rem", pt: "1rem", backgroundColor: "#fafafa", borderRadius: "0px" }}>
                                        {/* <ConnectionChat chat={chat} /> */}
                                        <Stack direction={'row'} spacing={1} justifyContent={'space-between'} >

                                            <Input multiline sx={{ ':after': { borderBottomColor: '#3C486B' } }}
                                                rows={2} fullWidth value={message} onChange={(e) => { setMessage(e.target.value); validMessage(e.target.value) }} />


                                            <Button sx={{ maxHeight: '40px', backgroundColor: "#3C486B" }} disabled={valid} variant="contained"
                                                onClick={send} endIcon={<SendIcon />}>
                                                Send
                                            </Button>

                                        </Stack>

                                    </Box>

                                    {/* <Typography >Major: Computer Science</Typography> */}
                                </Stack>


                            </Card>
                        </Grid>
                    </> : undefined}

                    {/* <Grid item xs={12} md={6} lg={3} color="error">
                        <Card spacing={2} sx={{ p: "0.5rem", overflowY: "auto", height: "auto" }}>


                            <Box sx={{ borderRadius: "10px", alignItems: "center", p: "1rem", width: "full", mb: "0.5rem", backgroundColor: connection.basket.essayReview === true ? green[200] : red[200] }}>Essay Review</Box>
                            <Box sx={{ borderRadius: "10px", alignItems: "center", p: "1rem", width: "full", backgroundColor: connection.basket.interviewPrep === true ? green[200] : red[200] }}>Interview Prep</Box>



                        </Card>

                    </Grid> */}
                    <Grid item xs={12} md={6} lg={12} color="error">
                        <Card sx={{ padding: '1rem' }}>
                            Meetings
                            {meetings !== undefined ? <>


                                <Stack sx={{ pt: "1rem" }} spacing={2}>

                                    {meetings.map(({ name, start_time, join_url, service }, index) => {
                                        console.log(join_url)
                                        return (
                                            <>

                                                {

                                                    timePassed(start_time)[0] ? <>
                                                        <Box sx={{ border: "2px solid " + '#3C486B', p: "0.5rem", borderRadius: '5px' }}>
                                                            <Stack direction={'row'} flex justifyContent={'space-between'}>

                                                                {/* <IconButton
                                                                    aria-label="expand row"
                                                                    size="small"
                                                                    onClick={() => {
                                                                        let tempOpen = [...collapseOpen]
                                                                        // tempOpen[index] = tempOpen[index] !== undefined ? !tempOpen[index] : false
                                                                        if (tempOpen.includes(index) === false) {

                                                                            let num = tempOpen.push(index)
                                                                        } else {
                                                                            tempOpen = tempOpen.filter((val) => {
                                                                                return val !== index
                                                                            })
                                                                        }
                                                                        console.log(tempOpen)
                                                                        setCollapseOpen(tempOpen)
                                                                    }}
                                                                >
                                                                    {collapseOpen.includes(index) ? (
                                                                        <KeyboardArrowUpIcon />
                                                                    ) : (
                                                                        <KeyboardArrowDownIcon />
                                                                    )}

                                                                </IconButton> */}
                                                                <> {name} : {convertDate(start_time)} </>
                                                                <CheckCircleOutlineIcon />
                                                            </Stack>
                                                            <Collapse in={collapseOpen.includes(index)
                                                            }
                                                                timeout="auto" unmountOnExit
                                                            >
                                                                <Card sx={{ p: "1rem" }}>

                                                                    <Stack direction={'row'} spacing={1}>

                                                                        {/* <Box sx={{ borderRadius: "10px", alignItems: "center", p: "0.3rem", backgroundColor: essayReview === true ? green[200] : red[200] }}>Essay Review</Box> */}
                                                                        {/* <Box sx={{ borderRadius: "10px", alignItems: "center", p: "0.3rem", backgroundColor: interviewPrep === true ? green[200] : red[200] }}>Interview Prep</Box> */}
                                                                        {/*  */}
                                                                    </Stack>
                                                                </Card>
                                                            </Collapse>
                                                        </Box>
                                                    </>
                                                        : <>
                                                            {/*  */}
                                                            <Box sx={{ border: "2px solid " + '#F9D949', p: "0.5rem", borderRadius: '5px' }}>
                                                                <Stack direction={'row'} flex justifyContent={'space-between'}>
                                                                    {/* <IconButton
                                                                        aria-label="expand row"
                                                                        size="small"
                                                                        onClick={() => {
                                                                            let tempOpen = [...collapseOpen]
                                                                            // tempOpen[index] = tempOpen[index] !== undefined ? !tempOpen[index] : false
                                                                            if (tempOpen.includes(index) === false) {

                                                                                let num = tempOpen.push(index)
                                                                            } else {
                                                                                tempOpen = tempOpen.filter((val) => {
                                                                                    return val !== index
                                                                                })
                                                                            }
                                                                            console.log(tempOpen)
                                                                            setCollapseOpen(tempOpen)
                                                                        }}
                                                                    >
                                                                        {collapseOpen.includes(index) ? (
                                                                            <KeyboardArrowUpIcon />
                                                                        ) : (
                                                                            <KeyboardArrowDownIcon />
                                                                        )}

                                                                    </IconButton> */}
                                                                    <> {basketLabels[service]} : {convertDate(start_time)} <Typography sx={{ color: grey[600] }}>{'(' + timePassed(start_time)[1] + ' days left)'}</Typography> </>
                                                                    {/* <Typography>Sample meeting name</Typography> */}
                                                                    <Button sx={{ height: "1.5rem", color: 'black' }} variant='outlined'>

                                                                        <a
                                                                            href={join_url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            Join
                                                                        </a>
                                                                    </Button>
                                                                    <AccessTimeIcon />
                                                                </Stack>
                                                                <Collapse in={collapseOpen.includes(index)
                                                                }
                                                                    timeout="auto" unmountOnExit
                                                                >
                                                                    <Card sx={{ p: "1rem" }}>

                                                                        <Stack direction={'row'} spacing={1}>

                                                                            {/* <Box sx={{ borderRadius: "10px", alignItems: "center", p: "0.3rem", backgroundColor: essayReview === true ? green[200] : red[200] }}>Essay Review</Box> */}
                                                                            {/* <Box sx={{ borderRadius: "10px", alignItems: "center", p: "0.3rem", backgroundColor: interviewPrep === true ? green[200] : red[200] }}>Interview Prep</Box> */}

                                                                        </Stack>
                                                                    </Card>
                                                                </Collapse>

                                                            </Box>
                                                        </>}
                                            </>

                                        )
                                    })}
                                </Stack>
                            </> : <>
                                <Stack paddingTop={'2rem'} direction={'row'} justifyContent={'center'}>

                                    <CircularProgress sx={{ color: "#F9D949" }} />
                                </Stack>
                            </>}
                        </Card>
                    </Grid>
                    {/* {connection.basket.essaySharing === true ? */}
                    {true ?
                        <Grid item xs={12} md={6} lg={12} color="error">
                            <Card sx={{ padding: '1rem' }}>
                                <Stack sx={{ width: "full" }} direction={'row'} spacing={2}>
                                    <Box sx={{ width: "50vw", maxHeight: "40vh", overflowY: "scroll" }}>My Files <br />
                                        <Stack sx={{ pt: "0.5rem" }} spacing={2}>
                                            {isGrad === '' ? <>{connection.files.user.map((file) => {


                                                return (
                                                    <>
                                                        <>
                                                            <Box sx={{ border: "2px solid " + '#3C486B', p: "0.5rem", borderRadius: '5px' }}>
                                                                <Stack direction={'row'} flex justifyContent={'space-between'}>
                                                                    <Typography sx={{ cursor: "pointer" }} onClick={() => { downloadFile(file.filename, file.caption) }}>{file.caption} </Typography>
                                                                    <DeleteIconOutlined sx={{ cursor: "pointer" }} onClick={() => { deleteFile(file.filename) }} />
                                                                </Stack>

                                                            </Box>


                                                        </>
                                                    </>
                                                )
                                            })}</> : <>{connection.files.grad.map((file) => {


                                                return (
                                                    <>
                                                        <>
                                                            <Box sx={{ border: "2px solid " + '#3C486B', p: "0.5rem", borderRadius: '5px' }}>
                                                                <Stack direction={'row'} flex justifyContent={'space-between'}>
                                                                    <Typography sx={{ cursor: "pointer" }} onClick={() => { downloadFile(file.filename, file.caption) }}>{file.caption} </Typography>
                                                                    <DeleteIconOutlined sx={{ cursor: "pointer" }} onClick={() => { deleteFile(file.filename) }} />
                                                                </Stack>

                                                            </Box>


                                                        </>
                                                    </>
                                                )
                                            })}</>}

                                        </Stack>
                                    </Box>
                                    <Box sx={{ width: "50vw", maxHeight: "40vh", overflowY: "scroll" }}>{isGrad === 'grad' ? "Student's" : "Graduate's"} Files <br />
                                        <Stack sx={{ pt: "0.5rem" }} spacing={2}>

                                            {isGrad === '' ? <>{connection.files.grad.map((file) => {


                                                return (
                                                    <>
                                                        <>
                                                            <Box sx={{ border: "2px solid " + '#3C486B', p: "0.5rem", borderRadius: '5px' }}>
                                                                <Stack direction={'row'} flex justifyContent={'space-between'}>
                                                                    <Typography sx={{ cursor: "pointer" }} onClick={() => { downloadFile(file.filename, file.caption) }}>{file.caption} </Typography>
                                                                    {/* <DeleteIconOutlined sx={{ cursor: "pointer" }} onClick={() => { deleteFile(file.filename) }} /> */}
                                                                </Stack>

                                                            </Box>


                                                        </>
                                                    </>
                                                )
                                            })}</> : <>{connection.files.user.map((file) => {


                                                return (
                                                    <>
                                                        <>
                                                            <Box sx={{ border: "2px solid " + '#3C486B', p: "0.5rem", borderRadius: '5px' }}>
                                                                <Stack direction={'row'} flex justifyContent={'space-between'}>
                                                                    <Typography sx={{ cursor: "pointer" }} onClick={() => { downloadFile(file.filename, file.caption) }}>{file.caption} </Typography>
                                                                    {/* <DeleteIconOutlined sx={{ cursor: "pointer" }} onClick={() => { deleteFile(file.filename) }} /> */}
                                                                </Stack>

                                                            </Box>


                                                        </>
                                                    </>
                                                )
                                            })}</>}
                                        </Stack>
                                    </Box>
                                </Stack>
                                {/* <Button onClick={() => {
                                    navigator.clipboard.writeText("Hi bro")
                                }}> Test system</Button> */}
                                <br />
                                <Button
                                    variant="outlined"
                                    component="label"
                                >
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
                                        accept="application/pdf, .docx, .doc"
                                        onChange={(e) => { uploadFile(e.target.files[0]) }}
                                    />
                                </Button>
                                {/* <Button onClick={() => {
                                    console.log(files)
                                    let temp = files
                                    temp.user.push({
                                        caption: "random",
                                        filename: "bruh"
                                    })
                                    console.log(temp)
                                    setFiles(temp)
                                }}>
                                    Add random
                                </Button> */}
                            </Card>
                        </Grid> : undefined}

                    {/* {isGrad === '' && meetings !== [] && timePassedVar === meetings.length && connection.commentMade === false ? <>                        <Grid item xs={12} md={6} lg={12} color="error"> */}
                    {isGrad === '' && meetings !== [] && timePassedVar >= 0 && showCommentSection === true ? <>                        <Grid item xs={12} md={6} lg={12} color="error">
                        {/* {isGrad === '' && meetings !== [] && connection.commentMade === false ? <>                        <Grid item xs={12} md={6} lg={12} color="error"> */}
                        {/* Comment Section */}
                        <Card spacing={2} sx={{ p: "1rem", overflowY: "auto", height: "auto" }}>
                            <Typography>Review</Typography>
                            <p>Kindly provide a comment on your connection with this graduate. (NOTE - one per user)</p>
                            <Stack spacing={3}>

                                <TextField
                                    value={comment.brief !== undefined ? comment.brief : ''}
                                    name="Brief" label="Brief" onChange={(e) => { if (e.target.value.length < 81) { setComment({ ...comment, brief: e.target.value }) } }} />
                                <TextField

                                    multiline name="Description" label="Description" onChange={(e) => { setComment({ ...comment, description: e.target.value }) }} />
                                <Rating
                                    name="simple-controlled"
                                    value={comment.stars}
                                    onChange={(event, newValue) => {
                                        setComment({ ...comment, stars: newValue });
                                    }}
                                />
                                <Button sx={{ maxHeight: '40px', backgroundColor: '#3C486B', color: 'white' }} variant="contained"
                                    onClick={sendReview} endIcon={<SendIcon />}>
                                    Send
                                </Button>
                                {/* <TextField

                                        name="email" label="Email address" onChange={(e) => { setComment({ ...comment, description: e.target.value }) }} /> */}


                                {/* <h5 className='text-red-400' style={{ color: red[200] }}> {errorMessage}</h5> */}
                            </Stack>


                        </Card>

                    </Grid>
                    </> : undefined}






                </Grid>

            </> : undefined
            }
        </>
    )
}


