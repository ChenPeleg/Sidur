import React from 'react';
import {Box, Slider, Theme} from '@mui/material';
import {Utils} from '../../services/utils';


const sliderSx = {

    direction: (theme: Theme) => theme.direction,

    '& .MuiSlider-thumb': {
        marginRight: -2,
        marginLeft: 0
    }
}

interface VerticalHourFieldProps {
    input: [string, string],
    label: string,
    onHoursChange: (event: Event, newHours: any) => void
}

const formatHourLabel = (hourInNumber: number) =>
    hourInNumber.toString() + ':00'
export const VerticalHourField = (
    props: VerticalHourFieldProps
) => {

    const inputAsNumbers: [number, number] = props.input.map(i => Utils.hourTextToDecimal(i)) as [number, number]


    const handleSliderChange = (event: Event, newValue: any) => {
        setValue(newValue);
    };
    const [value, setValue] = React.useState<number | [number, number]>(
        inputAsNumbers,
    );


    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '250px'
            }}>


                <Slider
                    orientation="vertical"
                    aria-labelledby="input-slider"
                    valueLabelDisplay="on"
                    valueLabelFormat={formatHourLabel}
                    // variant={'standard'}
                    sx={sliderSx}
                    disableSwap
                    min={1}
                    max={24}

                    step={0.25}
                    value={value}
                    onChange={handleSliderChange}

                />
            </Box>   </>
    );
}
