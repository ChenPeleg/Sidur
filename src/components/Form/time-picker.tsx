import React, {Fragment, useState} from 'react';
import {KeyboardTimePicker, TimePicker} from '@material-ui/pickers';
import {TextFieldPropertiesModel} from '../../models/text-field-properties.model';

export const timePicker = ({
                               input,
                               label,
                               meta: {
                                   touched,
                                   error
                               },
                               ...custom
                           }: TextFieldPropertiesModel) => {
    const [selectedDate, handleDateChange] = useState('2018-01-01T00:00:00.000Z');
    return (
        <Fragment>
            <TimePicker
                variant="inline"
                label={label}
                value={selectedDate}
                onChange={handleDateChange}
            />

            <KeyboardTimePicker
                ampm={false}
                variant="inline"
                label={label}
                value={selectedDate}
                onChange={handleDateChange}
            />
        </Fragment>
    );
}


