import {TextFieldPropertiesModel} from '../../models/text-field-properties.model';

import React from 'react';
import {Box, Theme} from '@mui/system';
import {Slider, Typography} from '@mui/material';
import {translations} from '../../services/translations';


const rootSx = {
    direction: (theme: Theme) => theme.direction,
    '& .MuiFormLabel-root': {
        left: 'inherit'
    },
    '& .MuiInputBase-input': {
        // paddingTop: '10px',
        // paddingBottom: '10px'
    }
}
// <Typography component="legend">Controlled</Typography>
// <Rating
//     name="simple-controlled"
//     value={value}
//     onChange={(event, newValue) => {
//         setValue(newValue);
//     }}


// />

const renderFlexibilityText = (num: string): string => {
    if (num === '1') {
        return translations.onePassenger
    }
    return num.toString() + ' ' + translations.passengers
}
export const RenderFlexibilityField = (
    {
        input,
        label,
        meta: {
            touched,
            error
        },
        ...custom
    }: TextFieldPropertiesModel,
) => {


    return (
        <>
            <Typography component="legend">{renderFlexibilityText(input.value)}</Typography>

            <Box sx={{width: '400px'}}>

                <Slider variant={'standard'}

                        disableSwap
                        valueLabelDisplay="auto"
                        label={label}
                        min={-60}
                        max={120}
                        onChange={input.onChange}

                        {...input}
                        {...custom}
                />
            </Box>

        </>
    );
}
