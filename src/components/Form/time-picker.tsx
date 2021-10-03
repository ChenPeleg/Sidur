import React from 'react';
import {TextFieldPropertiesModel} from '../../models/text-field-properties.model';
import {TextField} from '@material-ui/core';

export const HourPicker = ({
                               input,
                               label,
                               meta: {
                                   touched,
                                   error
                               },
                               ...custom
                           }: TextFieldPropertiesModel) => {

    return (

        <TextField
            type="time"
            label={label}
            value={input.value}
            onChange={input.onChange}/>


    );
}


