import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
// import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import Divider from '../../general/paletteDivider';
import { Stack } from '@mui/system';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const tiers = [
  {
    title: 'Free',
    price: '25',
    description: [
      '10 users included',
      '2 GB of storage',
      'Help center access',
      'Email support',
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
  },
  {
    title: 'Pro',
    subheader: 'Most popular',
    price: '50',
    description: [
      '20 users included',
      '10 GB of storage',
      'Help center access',
      'Priority email support',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },
  {
    title: 'Enterprise',
    price: '100',
    description: [
      '50 users included',
      '30 GB of storage',
      'Help center access',
      'Phone & email support',
    ],
    buttonText: 'Contact us',
    buttonVariant: 'outlined',
  },
];

const footers = [
  {
    title: 'Company',
    description: ['Team', 'History', 'Contact us', 'Locations'],
  },
  {
    title: 'Features',
    description: [
      'Cool stuff',
      'Random feature',
      'Team feature',
      'Developer stuff',
      'Another one',
    ],
  },
  {
    title: 'Resources',
    description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
  },
  {
    title: 'Legal',
    description: ['Privacy policy', 'Terms of use'],
  },
];

function PricingContent({ tiers }) {
  React.useEffect(() => {
    // console.log(tiers)
    let temp;
    temp = tiers !== undefined ? JSON.parse(JSON.stringify(tiers)) : []
    for (let x = 0; x < temp.length; x++) {
      let tempT = temp[x]
      let newT = {
        title: 'Tier ' + x,
        price: tempT.price.toString(),
        description: tempT.description,
        buttonText: 'Get Started',
        buttonVariant: 'contained',
      }
      temp[x] = newT
    }
    tiers = JSON.parse(JSON.stringify(temp))
    // console.log(tiers)

  }, [])

  return (
    <>
      {tiers !== null ? <React.Fragment>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline />
        <Divider />
        {/* Hero unit */}
        <br />
        {/* End hero unit */}
        <Container maxWidth="md" component="main">
          <Grid container spacing={5} alignItems="flex-end">
            {tiers !== undefined ?
              <>

                {
                  tiers.map((tier, index) => (
                    // Enterprise card is full width at sm breakpoint
                    <Grid
                      item
                      key={index}
                      xs={12}
                      sm={tier.title === 'Enterprise' ? 12 : 6}
                      md={4}
                    >
                      <Card style={{minHeight:'33vw'}}>
                        <CardHeader
                          title={`Tier ${index + 1}`}

                          titleTypographyProps={{ align: 'center' }}
                          action={tier.title === 'Pro' ? null : null}
                          subheaderTypographyProps={{
                            align: 'center',
                          }}
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'light'
                                ? theme.palette.grey[200]
                                : theme.palette.grey[700],
                          }}
                        />
                        <CardContent >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'baseline',
                              mb: 2,
                            }}
                          >
                            <Typography component="h2" variant="h3" color="text.primary">
                              ${tier.price}
                            </Typography>

                          </Box>
                          <ul>
                            {tier.description.map((line) => (
                              <Typography
                                component="li"
                                variant="subtitle1"
                                align="center"
                                key={line}
                              >
                                {line}
                              </Typography>
                            ))}
                          </ul>
                        </CardContent>

                        <Stack sx={{ alignItems: "center", pb: "1rem" }}>

                          <Button sx={{ width: '80%' }} fullWidth variant={"outlined"}>
                            {"Get Started"}
                          </Button>
                        </Stack>
                      </Card>
                    </Grid>
                  ))
                }
              </>
              : <></>}
          </Grid>

          <br />
          <Divider />

        </Container>
        {/* Footer */}

        {/* End footer */}
      </React.Fragment> : <></>
      }
    </>

  );
}

export default function Pricing({ tiers }) {
  return <PricingContent tiers={tiers} />;
}