import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
// @mui
import { Button, Card, Container, Stack, Typography } from '@mui/material';
// components
import GradFilter from '../sections/@dashboard/browse/GradFilter';
// mock
import PRODUCTS from '../_mock/products';
import GradList from '../sections/@dashboard/browse/GradList';
import axios from "axios"
import axiosLink from "../axiosLink"
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import { StatsContext } from '../context';
// import TagFacesIcon from '@mui/icons-material/TagFaces';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function ChipsArray({ tags }) {
  const { chipData, setChipData } = tags;

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
        color:'white'
      }}
      component="ul"
    >
      {chipData.map((data) => {
        let icon;


        return (
          <ListItem key={data.key}>
            <Chip
              icon={icon}
              label={data.label}
              onDelete={handleDelete(data)}
              color='default'
              sx={{ backgroundColor: "#F9D949" , color:"black"}}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}
// ----------------------------------------------------------------------

export default function BrowsePage() {
  const [openFilter, setOpenFilter] = useState(false);
  const { stats, updateStats } = useContext(StatsContext)

  const GRADS = [
    {
      "_id": "63ebe5755af61ed68dcb42c2",
      "name": "Jon Malone",
      "emailId": "jon@gmail.com",
      "password": "$2b$10$1Lm3C3fjgm6.qpjupx2L7Ozpii/d7q3gVbfCYdVhKDZumywGuuqUi",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "img": "https://covenantnebraska.com/wp-content/uploads/2020/03/Colton-290x300.jpg",
      "connections": [],
      "daysActive": [],
      "tiers": [
        {
          "price": 30,
          "currency": "dollars",
          "description": [
            "Provides direct access to admitted student for one hour",
            "Clear program-specific queries, and general doubts ",
            ""
          ],
          "_id": {
            "$oid": "63ebe5755af61ed68dcb42c3"
          }
        },
        {
          "price": 80,
          "currency": "dollars",
          "description": [
            "Includes everything from Tier 1",
            "In-depth review of college essays (personal statements)",
            "Direct access to successful college essays"
          ],
          "_id": {
            "$oid": "63ebe5755af61ed68dcb42c4"
          }
        },
        {
          "price": 150,
          "currency": "dollars",
          "description": [
            "Includes everything from Tier 1 and 2",
            "Comprehensive interview preparation",
            "Ideal for high school students who want comprehensive support"
          ],
          "_id": {
            "$oid": "63ebe5755af61ed68dcb42c5"
          }
        }
      ],
      "uni": "Harvard University",
      "reviews": [],
      "__v": 0,
      "major": "Computer Science",
      "nationality": "USA"
    }, {
      "_id": "63ebe5755af61ed68dcb42c2",
      "name": "Jon Malone",
      "emailId": "jon@gmail.com",
      "password": "$2b$10$1Lm3C3fjgm6.qpjupx2L7Ozpii/d7q3gVbfCYdVhKDZumywGuuqUi",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "img": "https://covenantnebraska.com/wp-content/uploads/2020/03/Colton-290x300.jpg",
      "connections": [],
      "daysActive": [],
      "tiers": [
        {
          "price": 30,
          "currency": "dollars",
          "description": [
            "Provides direct access to admitted student for one hour",
            "Clear program-specific queries, and general doubts ",
            ""
          ],
          "_id": {
            "$oid": "63ebe5755af61ed68dcb42c3"
          }
        },
        {
          "price": 80,
          "currency": "dollars",
          "description": [
            "Includes everything from Tier 1",
            "In-depth review of college essays (personal statements)",
            "Direct access to successful college essays"
          ],
          "_id": {
            "$oid": "63ebe5755af61ed68dcb42c4"
          }
        },
        {
          "price": 150,
          "currency": "dollars",
          "description": [
            "Includes everything from Tier 1 and 2",
            "Comprehensive interview preparation",
            "Ideal for high school students who want comprehensive support"
          ],
          "_id": {
            "$oid": "63ebe5755af61ed68dcb42c5"
          }
        }
      ],
      "uni": "Harvard University",
      "reviews": [],
      "__v": 0,
      "major": "Computer Science",
      "nationality": "India"
    },
  ]
  const [gradList, setGradList] = useState(GRADS)
  useEffect(() => {
    console.log(GRADS)
  }, [])
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const [chipData, setChipData] = React.useState([
    { key: 0, label: 'Sample' },

  ]);

  function addChip(tag) {
    console.log(chipData)
    console.log(stats.keywords)
    let temp = stats.keywords
    temp[tag] = temp[tag] === undefined ? 1 : temp[tag] + 1
    updateStats("keywords", temp)

    for (let x = 0; x < chipData.length; x++) {
      let dat = chipData[x].label
      if (dat === tag) {
        return
      }
    }
    if (chipData.length <= 10) {

      let tempChipData = [...chipData, {
        key: chipData.length,
        label: tag
      }]
      console.log(tempChipData)
      setChipData(tempChipData)
    }

  }
  const search = async () => {
    console.log("trying to search man")
    try {
      let tags = []
      for (let { label } of chipData) {
        tags.push(label)
      }
      let body = {
        tags
      }
      let res = await axios.post(axiosLink + "/user/grad/browse", body)
      console.log(res.data)
      setGradList(res.data.grads)
    } catch (searchError) {
      console.log(searchError)
    }
  }
  useEffect(() => {
    search()
  }, [])
  return (
    <>
      <Helmet>
        <title> Browse College Students </title>
      </Helmet>

      <Container sx={{ pt: "1rem" }}>
        <Stack direction={'row'} justifyContent="space-between">

          <Typography variant="h4" sx={{ mb: 5 }}>
            College Students
          </Typography>
          {/* <Button onClick={() => addChip('yo')}>Add Tester</Button> */}

          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <GradFilter
                openFilter={openFilter}
                onOpenFilter={handleOpenFilter}
                onCloseFilter={handleCloseFilter}
                addChip={addChip}
              />
              {/* <ProductSort /> */}
            </Stack>
          </Stack>
        </Stack>
        <Card sx={{ mb: '1.5rem', p: "0.5rem" }}>
          <Stack direction={'row'} justifyContent={'space-between'}>

            <ChipsArray tags={{ chipData, setChipData }} />
            <Button  onClick={() => { search() }} sx={{ height: "7.5vh",backgroundColor:"#3C486B", color:'white' }} variant="outlined" endIcon={<SearchIcon />}>
              Go !
            </Button>
          </Stack>
        </Card>
        <GradList grads={gradList} />
        {/* <ProductCartWidget /> */}
      </Container>
    </>
  );
}
