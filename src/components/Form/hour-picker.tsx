import React from 'react';
import {TextFieldPropertiesModel} from '../../models/text-field-properties.model';


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


