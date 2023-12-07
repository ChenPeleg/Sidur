import * as React from 'react';
import Slider, {SliderThumb} from '@mui/material/Slider';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';


export const AirbnbSlider = styled(Slider)(({theme}) => ({
    // color: '#3a8589',
    // //  height: 3,
    // padding: '13px 0',
    '& .MuiSlider-thumb': {
        borderRadius: '5px',
        width: '80px',
        height: '2em',
        // after: {
        //     content: '',
        //     backgroundColor: '#fff',
        //     width: '80px',
        //     height: '0.5em',
        // }
    },
    '& .MuiSlider-thumb-origin': {
        height: 27,
        width: 27,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        '&:hover': {
            boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
        },
        '& .airbnb-bar': {
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    '& .MuiSlider-valueLabel': {
        fontSize: theme.typography.fontSize + 4,
        fontWeight: 'bold',
        position: 'absolute',
        //bottom: '-10px',
        top: '32px',
        left : '32px',
        backgroundColor: 'unset',
        color: theme.palette.text.primary,
        '&:before': {
            display: 'none',
        },
        '& *': {
            background: 'transparent',
            //  backgroundColor: theme.palette.text.primary,
            color: '#ffffff'
            // color: theme.palette.mode === 'dark' ? '#fff' : '#000',
        },
    },
    '& .MuiSlider-track': {
        height: 3,
        width: 8
    },
    '& .MuiSlider-rail': {
        // color: theme.palette.mode === 'dark' ? '#bfbfbf' : '#d8d8d8',
        //  opacity: theme.palette.mode === 'dark' ? undefined : 1,
        width: 5
        //height: 3,
    },
}));

export interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {
}

export const AirbnbThumbComponent = (props: AirbnbThumbComponentProps, _data: any): any => {
    const {
        children,
        ...other
    } = props;


    return (
        <Box key={Math.random().toString()}> <SliderThumb {...other}    > <Box> fff {children} </Box>

        </SliderThumb>
        </Box>
    );
}
