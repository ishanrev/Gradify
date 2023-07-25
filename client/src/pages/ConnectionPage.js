import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card } from '@mui/material';
// components
import Iconify from '../components/iconify';
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
import { LoggedInContext, UserContext } from '../context';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Stack, width } from '@mui/system';
import Pricing from '../sections/@dashboard/grad/pricing';
import Review from '../sections/@dashboard/grad/review';
import Divider from '../sections/general/paletteDivider';
import axios from 'axios';
import axiosLink from '../axiosLink';
import ConnectionNav from '../sections/@dashboard/connections/connectionNav';
import navConfig from '../layouts/dashboard/nav/config';
import ConnectionMain from '../sections/@dashboard/connections/connectionMain';

// ----------------------------------------------------------------------

export default function ConnectionPage() {
    let { id } = useParams()
    const { user, isGrad } = useContext(UserContext)
    const { loggedIn } = useContext(LoggedInContext)
    const theme = useTheme();
    const [grad, setGrad] = useState({})
    let navigate = useNavigate()

    const [conId, setConId] = useState('home')
    const [conList, setConList] = useState([
        // {
        //     title: 'John Malone - Harvard University',
        //     path: '/connection/64033c03d44571ffa8d10ba6',
        // }
    ])
    // 
    const checkForConnection = async () => {
        console.log(user.connections)
        try {
            let cons = []
            for (let cId of user.connections) {
                try {

                    let res = await axios.get(axiosLink + "/connection/" + cId)
                    if (res.data.success === true) {
                        cons.push({
                            title: res.data.connection.title !== undefined || res.data.connection.altTitle ? isGrad === 'grad' ? res.data.connection.altTitle : res.data.connection.title : '',
                            title: res.data.connection.title !== undefined || res.data.connection.altTitle ? isGrad === 'grad' ? res.data.connection.altTitle : res.data.connection.title : '',
                            // title: cId,
                            conId: cId
                        })
                        // setConnection(res.data.setConnection)
                    }
                } catch (err) {

                }

            }
            setConList(cons)
        } catch (conError) {
            console.log(conError)
        }
    }
    useEffect(() => {


        console.log(user.connections)
        if (user.connections !== undefined) {

            checkForConnection()
        }
    }, [])

    useEffect(() => {
        checkForConnection()
    }, [loggedIn])
    // useEffect(() => {
    //     console.log(id)
    //     async function fetchGrad() {
    //         try {
    //             let res = await axios.get(axiosLink + "/user/grad/" + id)
    //             console.log(res.data)
    //             setGrad(res.data.user)
    //         } catch (getGradError) {
    //             console.log(getGradError)
    //             navigate("/404")
    //         }
    //     }
    //     if (id !== undefined) {
    //         fetchGrad()
    //     } else {
    //         navigate("/dashboard")
    //     }
    // }, [])
    // {
    //     title: 'dashboard',
    //     path: '/dashboard/app',
    //     icon: icon('ic_analytics'),
    //   }


    useEffect(() => {
        // if (id == 'home') {
        //     id = '63f08a86675ebf005bc88b8a'
        // }
        // let temp = []
        // if (user.connections !== undefined) {

        //     for (let con of user.connections) {
        //         temp.push({
        //             title: con.title,
        //             path: "/connection" + con.id
        //         })
        //     }    
        // }
        if (id !== 'home') {

        }
        // setConList(temp)
    }, [])
    return (
        <>

            <Helmet>
                <title> Connection </title>
            </Helmet>
            <Grid sx={{ px: "3rem", py: "6rem" }} container direction={'row'} spacing={3}>
                <Grid item lg={3}><ConnectionNav data={conList} conId={conId} setConId={setConId} /></Grid>
                {conId === 'home' ?
                    <Grid item lg={9}>
                        <Stack direction={'row'} justifyContent='center'>
                            <Typography sx={{ color: 'gray' }}>Please select a connection</Typography>
                        </Stack>
                    </Grid>

                    :
                    <>



                        <Grid item lg={9}>
                            <ConnectionMain conId={conId} />
                            {/* efeuiffeusifh uiehf he */}
                        </Grid>

                    </>
                }
            </Grid>
        </>
    );
}
