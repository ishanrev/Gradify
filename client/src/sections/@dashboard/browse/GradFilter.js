import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { ColorMultiPicker } from '../../../components/color-utils';
import uniList from '../../../constants/unis';

// ----------------------------------------------------------------------

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import countryIcons from '../../general/countryList';
import UNIVERSITIES from '../../general/uniList'
// import MAJORS from '../../general/majorList'
import { useState, useEffect } from 'react';

function SelectSmall({ list, onSelect, heading }) {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">{heading}</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        label={heading}
      >
        {/* <MenuItem value="">
          <em>None</em>
        </MenuItem> */}
        {
          list.map((value, index) => {
            return (
              <MenuItem key={index} onClick={() => {
                onSelect(value)
              }} value={value}>{value}</MenuItem>
            )
          })
        }


      </Select>
    </FormControl>
  );
}

export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];
export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];
export const FILTER_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

// ----------------------------------------------------------------------

GradFilter.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};

export default function GradFilter({ openFilter, onOpenFilter, onCloseFilter, addChip }) {
  const [unis, setUnis] = useState([])
  const [acceptances, setAcceptances] = useState([])
  const [majors, setMajors] = useState([])
  const majorsJSON = require("../../../majors.json")
  const unisJSON = require("../../../unisMain.json")
  useEffect(() => {
    let temp = []
    for (let key of Object.keys(uniList)) {
      temp.push(uniList[key])
    }
    setAcceptances(temp)
    let temp2 = []
    for (let obj of majorsJSON) {
      temp2.push(obj.major)
    }
    setMajors(temp2)
    let temp3 = []
    for (let obj of unisJSON) {
      temp3.push(uniList[obj.uni])
    }
    setUnis(temp3)

  }, [])
  return (
    <>
      <Button sx={{ backgroundColor: '#3C486B', color: 'white' }} variant='outlined' disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filter&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Box sx={{ overflow: "auto" }}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Nationality
              </Typography>
              {/* <FormGroup>
                {FILTER_GENDER_OPTIONS.map((item) => (
                  <FormControlLabel key={item} control={<Checkbox />} label={item} />
                ))}
              </FormGroup> */}
              <SelectSmall list={Object.keys(countryIcons)} onSelect={addChip} heading="Nationality" />
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                University
              </Typography>
              {/* <RadioGroup>
                {FILTER_CATEGORY_OPTIONS.map((item) => (
                  <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                ))}
              </RadioGroup> */}
              <SelectSmall list={unis} onSelect={addChip} heading="University" />

            </div>
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Acceptances
              </Typography>
              {/* <RadioGroup>
                {FILTER_CATEGORY_OPTIONS.map((item) => (
                  <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                ))}
              </RadioGroup> */}
              <SelectSmall list={acceptances} onSelect={addChip} heading="Acceptance" />

            </div>



            <div>
              <Typography variant="subtitle1" gutterBottom>
                Major
              </Typography>
              {/* <RadioGroup>
                {FILTER_PRICE_OPTIONS.map((item) => (
                  <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.label} />
                ))}
              </RadioGroup> */}
              <SelectSmall list={majors} onSelect={addChip} heading="Major" />
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Rating
              </Typography>
              <RadioGroup>
                {FILTER_RATING_OPTIONS.map((item, index) => {
                  let stars = 5 - index
                  return (
                    <>

                      <FormControlLabel
                        onClick={() => { addChip(stars.toString() + " stars") }}
                        key={item}
                        value={item}
                        control={
                          <Radio
                            disableRipple
                            color="default"
                            icon={<Rating readOnly value={stars} />}
                            checkedIcon={<Rating readOnly value={stars} />}
                            sx={{
                              '&:hover': { bgcolor: 'transparent' },
                            }}
                          />
                        }
                        label={stars + " stars"}
                        sx={{
                          my: 0.5,
                          borderRadius: 1,
                          '&:hover': { opacity: 0.48 },
                        }}
                      />
                    </>
                  )

                })}
              </RadioGroup>
            </div>
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
