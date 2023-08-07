import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios'

// components
import Iconify from '../../../components/iconify';
import axiosLink from '../../../axiosLink'
import { grey } from '@mui/material/colors';
import { LoggedInContext, SocketContext, UserContext } from '../../../context';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const { user, setUser, isGrad, setIsGrad } = useContext(UserContext)
  const { loggedIn, setLoggedIn } = useContext(LoggedInContext)
  const [showPassword, setShowPassword] = useState(false);
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [remember, setRemember] = useState(localStorage.getItem("remember") === null ? false : (/true/).test(localStorage.getItem("remember")))
  // const [isGrad, setIsGrad] = useState('')
  const socket = useContext(SocketContext)


  const handleClick = async () => {
    // navigate('/dashboard', { replace: true });
    try {
      // console.log('first')
      const res = await axios.post(axiosLink + '/auth/login' + isGrad, { emailId: mail, password })
      // console.log('second')
      if (res.data.loggedIn === true) {
        setUser(res.data.user)
        socket.emit("save userId", { userId: res.data.user._id.toString() })
        localStorage.setItem("remember", remember)
        if (remember) {
          localStorage.setItem("userId", res.data.user._id.toString())
        } else {
          localStorage.removeItem("userId")

        }
        setLoggedIn(true)
        navigate('/dashboard')
      } else {
        // console.log('third')
        setError(true)
      }
    }
    catch (LoginError) {
      // console.log('fourth')
      // console.log(Object.keys(LoginError.response.data))
      // console.log(LoginError.response.data)
      setError(true)

    }
  };
  const handleChange = (event, newVal) => {
    if (newVal !== null) {
      setIsGrad(newVal)
    }
  };
  return (
    <div>
      <Stack spacing={3}>
        <TextField
          error={error}
          name="email" label="Email address" onChange={(e) => {
            setMail(e.target.value);
            // console.log(e.target.value)
          }} />

        <TextField
          error={error}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => {
            setPassword(e.target.value);
            //  console.log("bro password bro") 
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => { setShowPassword(!showPassword) }} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack direction='row' justifyContent='center' sx={{ color: "#3C486B" }}>
          <ToggleButtonGroup

            color="primary"
            value={isGrad}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="">High School Student</ToggleButton>
            <ToggleButton value="grad">University Student</ToggleButton>
          </ToggleButtonGroup>

        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <div>
          <Checkbox name="remember" label="Remember me" checked={remember} onChange={(e) => {
            console.log(e.target.checked)

            setRemember(e.target.checked)
          }} /> <span style={{ color: grey[600] }}>Remember me</span>
        </div>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton sx={{ backgroundColor: "#3C486B", color: "white" }} fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </div>
  );
}
