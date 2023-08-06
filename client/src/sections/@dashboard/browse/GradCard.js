import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
import { IN, US } from 'country-flag-icons/react/3x2'
import FlagIcon from '../../general/countryIcon';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import uniList from '../../../constants/unis';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

GradCard.propTypes = {
  product: PropTypes.object,
};

export default function GradCard({ grad }) {
  const { img, name, uni, nationality, _id, major } = grad;
  const [image, setImage] = useState('ayra-ali')
  let navigate = useNavigate()
  const fetchImage = () => {

    let temp
    try {
      temp = require(`../../../grads/${img}.png`)

    } catch (reqError) {

      temp = require(`../../../grads/alt.jpg`)
    }
    setImage(temp)
  }
  useEffect(() => {
    fetchImage()
  }, [])
  useEffect(() => {
    fetchImage()
  }, [grad])


  return (
    <Card onClick={() => { navigate('/dashboard/grad/' + _id.toString()) }} sx={{ cursor: "pointer" }}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {true && (
          <Label
            variant="filled"
            color={(true === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {true}
          </Label>
        )}
        <StyledProductImg alt={name} src={image} />
      </Box>

      <Stack spacing={0} sx={{ p: 3 }}>
        <Stack direction={'row'} justifyContent='space-between'>

          <Link color="inherit" underline="hover" >
            <Typography variant="h5" noWrap>
              {name}
            </Typography>
          </Link>
          <FlagIcon cnt={nationality} />
          {/* <US title="United States" style={{ width: '30px', borderRadius: '30%', objectFit: 'contain' }} className="" /> */}
        </Stack>
        <Typography variant="subtitle2" noWrap>
          {major + ' - ' + uniList[uni]}
        </Typography>
        {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ColorPreview colors={colors} />
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {priceSale && fCurrency(priceSale)}
            </Typography>
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack> */}

      </Stack>
    </Card>
  );
}
