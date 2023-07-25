// @mui
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader, Rating, Modal } from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { blue } from '@mui/material/colors';
import { useState } from 'react';

// ----------------------------------------------------------------------

Review.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    list: PropTypes.array.isRequired,
};

export default function Review({ title, subheader, list = [], ...other }) {
    const [open, setOpen] = useState(false)
    const [readMore, setReadMore] = useState({})
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    return (


        <Card sx={{ height: '40vh', overflowY: 'scroll' }} >
            <Divider />
            <CardHeader title={title} subheader={subheader} />


            {list === [] ? <>
                <Typography> No reviews yet</Typography>
            </> : <>

                <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
                    {list.map((rev) => (
                        <Item key={rev.id} rev={rev} setReadMore={setReadMore} setOpen={setOpen} />
                    ))}
                    
                </Stack>
            </>}




            <Divider />

            {/* <Box sx={style}>
                <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
                    View all
                </Button>
            </Box> */}

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false)
                    setReadMore({})
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {readMore !== {} ? <>
                    <Box sx={style}>
                        <Stack direction={'row'} spacing={2}>

                            <Link color="inherit" variant="subtitle2" underline="hover" sx={{}} noWrap>
                                {readMore.username}
                            </Link>
                            <Rating readOnly  name="size-small" sx={{ pt: '2px' }} defaultValue={readMore.stars} size="small" />
                        </Stack>

                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} noWrap>
                            {readMore.brief}
                        </Typography>
                        <p sx={{ color: 'text.primary' }} noWrap>
                            {readMore.description}
                        </p>
                    </Box>
                </> : undefined}


            </Modal>
        </Card >

    );
}

// ----------------------------------------------------------------------

Item.propTypes = {
    rev: PropTypes.shape({
        description: PropTypes.string,
        image: PropTypes.string,
        postedAt: PropTypes.instanceOf(Date),
        title: PropTypes.string,
    }),
};

function Item({ rev, setReadMore, setOpen }) {

    const { username, brief, description, stars } = rev;

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Box component="img" alt={title} src={img} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} /> */}

            <Box sx={{ minWidth: 240, flexGrow: 1 }}>
                <Stack direction={'row'} spacing={2}>

                    <Link color="inherit" variant="subtitle2" underline="hover" sx={{}} noWrap>
                        {username}
                    </Link>
                    <Rating readOnly name="size-small" sx={{ pt: '2px' }} defaultValue={stars} size="small" />
                </Stack>

                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} noWrap>
                    {brief}


                    <Typography onClick={() => {
                        setReadMore(rev)
                        setOpen(true)
                    }} variant="subtitle2" sx={{ color: blue[400] }}>Read more...</Typography>

                </Typography>
            </Box>

            {/* <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}> */}
            {/* {fToNow(postedAt)} */}
            {/* </Typography> */}
        </Stack>
    );
}
