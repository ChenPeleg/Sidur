import * as React from 'react';
import Slider, {SliderThumb} from '@mui/material/Slider';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';


export const AirbnbSlider = styled(Slider)(({theme}) => ({
    // color: '#3a8589',
    // //  height: 3,
    // padding: '13px 0',
    '& .MuiSlider-thumb': {
        borderRadius: '1px',
        width: '80px',
        height: '2em',
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

export const AirbnbThumbComponent = (props: AirbnbThumbComponentProps, data: any): any => {
    const {
        children,
        ...other
    } = props;
    console.log(props, data);
    //@ts-ignore
    const index = props['data-index'] as number;
    const textValue = data?.value[index] ? data?.value[index].replace('0-', '') : '';
    return (
        <Box key={Math.random().toString()}>

            <SliderThumb {...other}    >
                <Box sx={{color: 'white'}}>
                    {textValue}
                </Box>

                {children}

            </SliderThumb>
        </Box>
    );
}
