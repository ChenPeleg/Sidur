import React from 'react';
import {TextFieldPropertiesModel} from '../../models/text-field-properties.model';
import {Theme} from '@mui/system';
import {TextField} from '@mui/material';


const useStyles = () => ({
    root: {
        direction: (theme: Theme) => theme.direction,
        '& .MuiFormLabel-root': {
            left: 'inherit'
        },
        '& .MuiInputBase-input': {
            // padding: '10px'
        }
    },


})

export const HourPicker = ({
                               input,
                               label,
                               meta: {
                                   touched,
                                   error
                               },
                               ...custom
                           }: TextFieldPropertiesModel) => {
    const classes = useStyles();


    return (

        <TextField variant={'standard'}
                   sx={{
                       ...classes
                           .root
                   }}
                   type="time"
                   label={label}
                   value={input.value}
                   onChange={input.onChange}/>
    );
}


