import {TextFieldPropertiesModel} from '../../models/text-field-properties.model';

import React from 'react';
import {styled, Theme} from '@mui/system';
import {Rating, Typography} from '@mui/material';
import {Person} from '@mui/icons-material';
import {Utils} from '../../services/utils';
import {LanguageUtilities} from '../../services/language-utilities';


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
 

// />
const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#000000',
    },
    '& .MuiRating-iconHover': {
        color: '#3b0c0f',
    },
});

export const RenderPassengerField = (
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
    const convertedInput = {...input};
    convertedInput.value = Utils.convertStrToNum(convertedInput.value)

    return (
        <>
            <Typography component="legend">{LanguageUtilities.renderPassengerText(input.value)}</Typography>
            <StyledRating variant={'standard'}
                          dir={'rtl'}
                          style={{
                              direction: 'rtl',

                          }}
                          type="radio"
                // size="large"
                          label={label}
                          sx={rootSx}
                          max={7}
                          onChange={(...args) => {
                              console.log(args);

                              input.onChange(...args);

                          }}
                          icon={<Person fontSize="inherit"/>}
                          emptyIcon={<Person fontSize="inherit"/>}
                          {...convertedInput}
                          {...custom}
            />

        </>
    );
}
