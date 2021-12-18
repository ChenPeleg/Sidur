import React from 'react';
import {Box, Slider, Theme, Typography} from '@mui/material';
import {translations} from '../../services/translations';


const sliderSx = {

    direction: (theme: Theme) => theme.direction,

    '& .MuiSlider-thumb': {
        marginRight: -2,
        marginLeft: 0
    }
}

interface VerticalHourFieldProps {
    input: any,
    label: string,
    onHoursChange: (event: Event, newHours: any) => void
}

const renderFlexibilityText = (flexValuesOrg: number | [number, number]): string => {
    const absValue = (n: number): string => Math.abs(n).toString();

    if (typeof flexValuesOrg === 'number') {
        flexValuesOrg = [flexValuesOrg as number, 50]
    }
    let flexValues = flexValuesOrg;

    let text = translations.flexEarly + ' ' + absValue(flexValues[0]) + ' ' + translations.min + ', ' +
        translations.flexLate + ' ' + absValue(flexValues[1]) + ' ' + translations.min;
    return text
}


export const VerticalHourField = (
    props: VerticalHourFieldProps
) => {
    // const handleSliderChange = (event: Event) => {
    //     const newValue = event.target.value
    //     setValue(newValue);
    //     props.onHoursChange(event, event.target)
    // };
    const handleSliderChange = (event: Event, newValue: any) => {
        setValue(newValue);
    };
    const [value, setValue] = React.useState<number | [number, number]>(
        [40, 60],
    );

    return (
        <>
            <Typography component="legend"><b>{translations.flexibility}: </b>{renderFlexibilityText(value)}</Typography>

            <Box sx={{width: '250px'}}>


                <Slider

                    aria-labelledby="input-slider"
                    // variant={'standard'}
                    //sx={sliderSx}
                    disableSwap
                    valueLabelDisplay="auto"
                    min={-60}
                    max={120}
                    step={10}
                    value={value}
                    onChange={handleSliderChange}

                />
            </Box>   </>
    );
}
