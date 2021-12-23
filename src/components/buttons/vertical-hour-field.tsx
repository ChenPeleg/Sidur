import React from 'react';
import {Box, Theme} from '@mui/material';
import {Utils} from '../../services/utils';
import {AirbnbSlider, AirbnbThumbComponent} from './air-bnb-slider';


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
    Utils.DecimalTimeToHourText(hourInNumber)
export const VerticalHourField = (
    props: VerticalHourFieldProps
) => {

    const InitialInputAsNumbers: [number, number] = props.input.map(i => Utils.hourTextToDecimal(i)) as [number, number]


    const handleSliderChange = (event: Event, newValue: any) => {
        setValue(newValue);
        const positiveNewValue: [number, number] = [(newValue[1] * -1), (newValue[0] * -1)]
        props.onHoursChange(event, positiveNewValue)
    };
    const negativeInitialInput: [number, number] = InitialInputAsNumbers.map(n => n * -1) as [number, number]
    const [value, setValue] = React.useState<number | [number, number]>(
        negativeInitialInput,
    );
    const DriveDuration = InitialInputAsNumbers[1] - InitialInputAsNumbers[0];
    const timeMargins = DriveDuration > 2 ? 2 : 1;
    const maxSlider = -1 * (InitialInputAsNumbers[0] - timeMargins);
    const minSlider = -1 * (InitialInputAsNumbers[1] + timeMargins);

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '250px'
            }}>


                <AirbnbSlider
                    components={{Thumb: AirbnbThumbComponent}}
                    orientation="vertical"
                    aria-labelledby="input-slider"
                    valueLabelDisplay="on"
                    valueLabelFormat={formatHourLabel}
                    // variant={'standard'}
                    sx={sliderSx}
                    disableSwap
                    min={minSlider}
                    max={maxSlider}
                    scale={x => -x}

                    step={0.0833333333333}
                    value={value}
                    onChange={handleSliderChange}

                />
            </Box> </Box>
    );
}
