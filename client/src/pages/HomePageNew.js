import { Button, Stack, Box, Typography, Card, Grid } from '@mui/material'
import HomeLogo from '../images/home-logo-long.png'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import HomeImage from '../images/HomePhoto.jpg'
function HomePageNew() {
    let navigate = useNavigate()
    return (
        <Box sx={{ width: "100vw" }}>
            <Stack direction={'row'} justifyContent={'space-between'} sx={{ position: "sticky", width: "full", p: "1rem" }}>
                <Logo />
                <Stack direction={'row'} spacing={2}>
                    {/* <Button sx={{ backgroundColor: "#3C486B", color: "white" }}>Login</Button> */}
                    <Button sx={{ backgroundColor: "#3C486B25", color: "#3C486B" }} onClick={() => { navigate('/signup') }}>Get Started</Button>
                    <Button sx={{ backgroundColor: "#3C486B", color: "white" }} onClick={() => { navigate('/login') }}>Login</Button>
                </Stack>
            </Stack>
            <br />

            <Stack justifyContent={'space-around'} spacing={2} sx={{ flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: "row" }, width: "full", p: "1rem" }}>
                {/* <Logo /> */}
                <Stack spacing={2} width={'40%'}>

                    <Typography fontSize={30} color={"#3C486B"}>connect with students from your <Typography fontSize={"inherit"} color={'#F9D949'}>dream universitiy</Typography> </Typography>
                    <Button sx={{ backgroundColor: "#3C486B", color: "white", width: "50%" }}>Connect Now</Button>
                    <br />

                    <Stack direction={'row'} sx={{ backgroundColor: "#3C486B15", p: "1rem", borderRadius: "10px" }} spacing={2} >
                        <Stack direction={'row'} spacing={2}>
                            <img style={{ backgroundColor: "white", padding: "0.25rem", borderRadius: "10px", width: "2.75rem", height: "2.75rem" }} src={require('../images/user-icon.png')} />
                            <Stack>
                                <Typography fontSize={20}>100+</Typography>
                                <Typography fontSize={10}>TOTAL MENTORS</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction={'row'} spacing={2}>
                            <img style={{ backgroundColor: "white", padding: "0.25rem", borderRadius: "10px", width: "2.75rem", height: "2.75rem" }} src={require('../images/uni-icon.png')} />
                            <Stack>
                                <Typography fontSize={20}>100+</Typography>
                                <Typography fontSize={10}>TOTAL UNIVERSITIES</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction={'row'} spacing={2}>
                            <img style={{ backgroundColor: "white", padding: "0.25rem", borderRadius: "10px", width: "2.75rem", height: "2.75rem" }} src={require('../images/student-icon.png')} />
                            <Stack>
                                <Typography fontSize={20}>500+</Typography>
                                <Typography fontSize={10}>STUDENTS BENEFITTED</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
                <img src={HomeImage} style={{ borderRadius: "10px", width: "40%", height: "40%" }} />
            </Stack>
            <br />
            <br />


            <Typography paddingX={"5rem"} fontSize={20} color={"#3C486B"}>Enjoy these services through <Typography fontSize={"inherit"} color={'#F9D949'}>dream universitiy</Typography> </Typography>
            <br />
            <Grid container spacing={2} sx={{ width: "full", px: "5rem" }}>
                {/* <Logo /> */}
                <Grid item lg={6} >

                    <Card sx={{ p: "1.5rem", backgroundColor: "#F4505015" }} >
                        <Stack direction={'row'} spacing={2} sx={{ height: "13.5rem" }} >
                            <img style={{ backgroundColor: "#3C486B10", padding: "0.25rem", borderRadius: "10px", width: "2.75rem", height: "2.75rem" }} src={require('../images/interview.png')} />
                            <Stack>
                                <Typography mb={2} fontSize={20}>{`Interview Preparation \n & Guidance`}</Typography>

                                <Typography fontSize={17}>Ready to conquer your upcoming college interview?
                                    Fear not! Step into the spotlight with confidence as you engage in a mock
                                    interview with Gradify, unlocking invaluable insights on how to ace your
                                    interview and tilt that admission decision in your favor!
                                </Typography>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>
                <Grid item lg={6} >

                    <Card sx={{ p: "1.5rem", backgroundColor: "#F4505015" }} >
                        <Stack direction={'row'} spacing={2} sx={{ height: "13.5rem" }} >
                            <img style={{ backgroundColor: "#3C486B17", padding: "0.25rem", borderRadius: "10px", width: "2.75rem", height: "2.75rem" }} src={require('../images/question.png')} />
                            <Stack>
                                <Typography mb={2} fontSize={20}>{`Q&A Session`}</Typography>

                                <Typography fontSize={17}>Want to gain insight into what it's like to be
                                    a student at your dream college? Look no further! Gradify's premier
                                    Q&A service is your ultimate resource. Get your doubts clarified,
                                    ask any questions, and prepare to navigate the application process
                                    with confidence!

                                </Typography>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>
                <Grid item lg={6} >

                    <Card sx={{ p: "1.5rem", backgroundColor: "#F4505015" }} >
                        <Stack direction={'row'} spacing={2} sx={{ height: "13.5rem" }} >
                            <img style={{ backgroundColor: "#3C486B10", padding: "0.25rem", borderRadius: "10px", width: "2.75rem", height: "2.75rem" }} src={require('../images/writing.png')} />
                            <Stack>
                                <Typography mb={2} fontSize={20}>{`Live Essay Review`}</Typography>

                                <Typography fontSize={17}>Unleash the power of your college essays with
                                    Gradify's personalized on-call reviewing service. Receive expert guidance
                                    to captivate admission officers and leave a lasting impression on your
                                    path to success!

                                </Typography>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>
                <Grid item lg={6} >

                    <Card sx={{ p: "1.5rem", backgroundColor: "#F4505015" }} >
                        <Stack direction={'row'} spacing={2} sx={{ height: "13.5rem" }} >
                            <img style={{ backgroundColor: "#3C486B17", padding: "0.25rem", borderRadius: "10px", width: "2.75rem", height: "2.75rem" }} src={require('../images/graph.png')} />
                            <Stack>
                                <Typography mb={2} fontSize={20}>{`Strategy and Planning`}</Typography>

                                <Typography fontSize={17}>Embark on an exhilarating journey as you navigate
                                    the intricate college application process. Strategize for the years
                                    ahead, crafting a stellar plan that includes dynamic extracurriculars
                                    and academic excellence, catapulting you into the realm of the most
                                    competitive applicants and paving your way to the doors of your dream university!
                                </Typography>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>


                {/* <img src={HomeImage} style={{ borderRadius: "10px", width: "40%", height: "40%" }} /> */}
            </Grid>

            {/*  */}

        </Box>
    )
}

function Logo() {
    return (
        <>
            <img style={{width:"10rem", height:"3rem", objectFit:"contain", borderRadius:"10px"}} src={HomeLogo} />
        </>
    )
}

export default HomePageNew