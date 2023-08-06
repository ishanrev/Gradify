import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { grey, red } from '@mui/material/colors';
// components
import Iconify from '../../../components/iconify';
import axiosLink from '../../../axiosLink'
import { UserContext } from '../../../context';
// ----------------------------------------------------------------------

export default function SignUpForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const [error, setError] = useState(false)

  const [details, setDetails] = useState({})
  const { user, setUser } = useContext(UserContext)
  const handleClick = async () => {
    // navigate('/dashboard', { replace: true });
    console.log(details)
    try {
      let { chk, message } = checkPassword()
      if (chk === true) {
        setErrorMessage(message)
      } else {
        setErrorMessage('')
        const res = await axios.post(axiosLink + '/auth/signUp', details)
        if (res.data.success === true) {
          setUser(res.data.user)
          navigate('/dashboard')
        } else {
          setError(error)
        }
      }

    }
    catch (LoginError) {
      console.log(LoginError)
      if (LoginError.response.data.type === 'repeat') {
        setError(true)
        setErrorMessage("User already exists")
      }

    }
  };
  function checkPassword() {
    let message = ''
    let chk = false
    const password = details.password
    if (password.length < 6) {
      chk = true

      message = 'Minimum password length is 6'
    }
    else if (password.includes(' ')) {
      chk = true

      message = ('No spaces allowed')
    }

    return { chk, message }
  }
  return (
    <div>
      <Stack spacing={3}>
        <TextField
          error={error}

          name="name" label="Name" onChange={(e) => { setDetails({ ...details, name: e.target.value }) }} />
        <TextField
          error={error}

          name="email" label="Email address" onChange={(e) => { setDetails({ ...details, emailId: e.target.value }) }} />

        <TextField
          error={error}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => { setDetails({ ...details, password: e.target.value }) }}
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
        <h5 className='text-red-400' style={{ color: red[200] }}> {errorMessage}</h5>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <div>
          <Checkbox name="remember" label="Remember me" /> <span style={{ color: grey[600] }}>Remember me</span>
        </div>

        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Sign Up
      </LoadingButton>
    </div>
  );
}
