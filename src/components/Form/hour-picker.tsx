import React from 'react';
import {TextFieldPropertiesModel} from '../../models/text-field-properties.model';
import {SxProps, Theme} from '@mui/system';
import {TextField} from '@mui/material';


const sxRoot = {
    direction: (theme: Theme) => theme.direction,
    '& .MuiFormLabel-root': {
        left: 'inherit'
    },
    '& .MuiInputBase-input': {
        // padding: '10px'
    }
}
export const HourPicker = ({
                               input,
                               label,
                               meta: {},
                               ...custom
                           }: TextFieldPropertiesModel) => {

    const inActive: boolean = custom?.custom?.inActive || false;
    const sxExtra: SxProps = {
        visibility: inActive ? 'hidden' : 'visible',
        //display: inActive ? 'none' : 'initial'
        //visibility: 'hidden'
    };
    return (

        <TextField variant={'standard'}
                   sx={{...sxRoot, ...sxExtra}}
                   disabled={inActive}
                   type="time"
                   label={label}
                   value={input.value}
                   onChange={input.onChange}/>
    );
}


