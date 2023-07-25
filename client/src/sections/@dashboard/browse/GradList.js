import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ShopProductCard from '../products/ProductCard';
import GradCard from './GradCard';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

GradList.propTypes = {
  grads: PropTypes.array.isRequired,
};

export default function GradList({ grads, ...other }) {
  let navigate = useNavigate()
  return (
    <Grid container spacing={4} {...other}>
      < >

        {grads.map((grad, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <GradCard grad={grad} />
          </Grid>
        ))}
      </>
    </Grid>
  );
}
