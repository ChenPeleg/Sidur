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

    const handleSliderChange = (event: Event, newValue: any) => {
        setValue(newValue);
    };
    const [value, setValue] = React.useState<number | [number, number]>(
        [40, 60],
    );
    const formatHourLabel = (hourInNumber: number) =>
        hourInNumber.toString() + ':00'

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '250px'
            }}>
                <Typography align={'center'}
                            component="legend"><b>{translations.DriveTimes}</b>{false ? renderFlexibilityText(value) : null}</Typography>


                <Slider
                    orientation="vertical"
                    aria-labelledby="input-slider"
                    valueLabelDisplay="on"
                    valueLabelFormat={formatHourLabel}
                    // variant={'standard'}
                    sx={sliderSx}
                    disableSwap
                    min={-60}
                    max={120}

                    step={10}
                    value={value}
                    onChange={handleSliderChange}

                />
            </Box>   </>
    );
}
