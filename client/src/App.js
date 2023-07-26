// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import { UserContext, LoggedInContext, socket, SocketContext, StatsContext } from './context'
import { useState, useEffect, useContext } from 'react';
import { v4 as uuid } from 'uuid'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosLink from './axiosLink';

// ----------------------------------------------------------------------

export default function App() {

  const [user, setUser] = useState({ _id: uuid() })
  const [loggedIn, setLoggedIn] = useState(undefined)
  const [stats, setStats] = useState({})
  const [isGrad, setIsGrad] = useState('')
  async function updateUser(change) {
    console.log("--------change da---------")
    console.log(change)
    try {
      let tempId = user._id.toString();
      let { updated } = (await (axios.put(axiosLink + `/user/${tempId}`, change))).data;
      setUser(updated)

      console.log("successfully updated the user")
    } catch (userUpdateError) {
      console.log("update ueser error")
      console.log(userUpdateError)
    }
  }
  const getUser = async (userId) => {
    try {
      console.log('first')
      const res = await axios.get(axiosLink + '/user/user/' + userId)
      setIsGrad('')
      console.log(res)
      console.log('second')

      setUser(res.data.user)
      setLoggedIn(true)
      socket.emit("save userId", { userId: res.data.user._id.toString() })


    }
    catch (LoginError) {
      try {
        const gradRes = await axios.get(axiosLink + '/user/grad/' + userId)
        setUser(gradRes.data.user)
        console.log("grad success")
        setLoggedIn(true)
        setIsGrad('grad')
        socket.emit("save userId", { userId: gradRes.data.user._id.toString() })

      } catch (error) {
        console.log("grad failure")

        setLoggedIn(false)
      }


    }
  }

  const updateStats = (key, value) => {
    console.log("+++++++++++++++++++++++++++=")
    console.log(key, value)
    let temp = stats
    temp[key] = value
    setStats(temp)
    console.log(temp)
    updateStatsInDatabase()
  }

  useEffect(() => {
    let userId = localStorage.getItem("userId")
    console.log("/*/*/*/*/*/*/*", userId)
    if (userId === null) {
      setLoggedIn(false)
    } else {

      getUser(userId)
    }
    // return (updateStatsInDatabase)
    return (appClosed)
  }, [])

  function appClosed() {
    console.log("app has successfully closed")
  }

  async function updateStatsInDatabase() {

    try {
      console.log("----------" + stats)
      let res = await axios.post(axiosLink + "/stats/update", stats)

    } catch (statsError) {
      console.log("couldn't successfuly update the analytics storage")
    }

  }

  useEffect(() => {
    async function getStats() {

      try {
        console.log("initating the stats connection")
        let res = await axios.get(axiosLink + "/stats/")
        console.log(res.data.stats)
        setStats(res.data.stats)

      } catch (error) {
        console.log("couldnt get the analytics")
      }
    }
    getStats()
  }, [])


  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <StatsContext.Provider value={{ stats, setStats, updateStats }}>

        <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
          <SocketContext.Provider value={socket}>

            <UserContext.Provider value={{ user, setUser, updateUser, isGrad, setIsGrad }}>
              <PayPalScriptProvider options={{
                // "client-id": "AbI8bUPJDA9Rjl9sTH8rfLpTDezWFbUfoe_Wy3EgTLovHw_JEl-UULlYLg8dm_5OBadaA2MUUFsGnxkP",
                // "client-id": "AVChjJjchJ5G64YkhXUb0i2Gis8bbZnYZajdjzxG7Mnv6mHGHeaoJL_pLree3jqZPQ2MLQpxG6pG6Zl1",
                "client-id": "test",
                // "merchant-id": "*"
                // "data-merchant-id": "2KFBYR3CX88BJ,SVG8WX49C5628"
              }}>
                {/* <PayPalButtons style={{ layout: "horizontal" }} /> */}
                <Redirect loggedIn={loggedIn} />
                <Router />
              </PayPalScriptProvider>
            </UserContext.Provider>
          </SocketContext.Provider>
        </LoggedInContext.Provider>
      </StatsContext.Provider>

    </ThemeProvider>
  );
}

function Redirect({ loggedIn }) {
  let navigate = useNavigate()
  useEffect(() => {


    if (loggedIn === false) {
      // navigate('/login')
    }

  }, [loggedIn])
  return (
    <></>
  )
}
