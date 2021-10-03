import React from 'react';
import {TextFieldPropertiesModel} from '../../models/text-field-properties.model';
import {TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        direction: theme.direction,
        '& .MuiFormLabel-root': {
            left: 'inherit'
        }
    },


}))
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

        <TextField
            className={classes.root}
            type="time"
            label={label}
            value={input.value}
            onChange={input.onChange}/>
    );
}


