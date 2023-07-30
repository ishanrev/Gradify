import PropTypes from 'prop-types';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, Card, CircularProgress, List, ListItemText, Stack, Typography } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import { useContext, useEffect, useState } from 'react';
import { LoggedInContext } from '../../../context';
// import PersonIcon from '@mui/icons-material/Person';
// ----------------------------------------------------------------------

ConnectionNav.propTypes = {
  data: PropTypes.array,
};

export default function ConnectionNav({ data = [], setConId, conId, ...other }) {
  let navigate = useNavigate()
  let { loggedIn } = useContext(LoggedInContext)
  useEffect(() => {
    console.log('displaying the con section)')
  }, [])
  return (
    <Card lg={4} sx={{ height: "70vh", overflowY: "scroll" }}>
      {data === null ? <>
        <Stack paddingTop={'2rem'} direction={'row'} justifyContent={'center'}>

          <CircularProgress sx={{ color: "#F9D949" }} />
        </Stack>
      </> : <>

        {loggedIn === true ? <>


          {data.length > 0 ?
            <>
              <Stack spacing={2} {...other}>
                <List sx={{ p: 1 }}>
                  {data.map((item) => (<>

                    <NavItem key={item.title} item={item} setConId={setConId} currentConId={conId} />


                  </>
                  ))}

                </List>
              </Stack>
            </>
            : <>
              <Stack sx={{ p: "1rem", alignItems: "center" }}>
                <Typography> You have no connections. </Typography>
                <br />
                <Button variant='outlined' onClick={() => { navigate('/dashboard/browse') }}>Make Connection</Button>
              </Stack>
            </>}
        </> : <>
          <Stack sx={{ p: "1rem", alignItems: "center" }}>
            <Typography> Please Sign In to view you rconnection</Typography>
            <br />
            <Button variant='outlined' sx={{ width: "auto" }} onClick={() => { navigate('/login') }}>Login</Button>

          </Stack>
        </>}
      </>}

    </Card>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item, setConId, currentConId }) {
  const { title, conId } = item;
  const [isHover, setIsHover] = useState(false)
  let navigate = useNavigate()
  return (
    <Box sx={{ mb: "0.7rem" }} onClick={() => { console.log("changing to" + conId); setConId(conId) }} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>

      <StyledNavItem
        component={RouterLink}

        sx={{
          '&.active': {
            color: 'text.primary',
            bgcolor: 'action.selected',
            fontWeight: conId === currentConId ? 'fontWeightBold' : "",
          },
          '&:hover': {
            color: 'text.primary',
            bgcolor: 'action.selected',
            // fontWeight: 'fontWeightBold'
          }
        }}
      >
        {/* <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon> */}
        {/* <PersonIcon  /> */}

        <ListItemText sx={{ px: "1rem" }} disableTypography primary={title} />

        {/* {info && info} */}
      </StyledNavItem>
    </Box>
  );
}
