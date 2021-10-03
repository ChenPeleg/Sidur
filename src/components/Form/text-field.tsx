import {TextFieldPropertiesModel} from '../../models/text-field-properties.model';
import {TextField} from '@material-ui/core';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        direction: theme.direction,
        '& .MuiFormLabel-root': {
            left: 'inherit'
        }
    }
}))
export const RenderTextField = (
    {
        input,
        label,
        meta: {
            touched,
            error
        },
        ...custom
    }: TextFieldPropertiesModel,
) => (
    <TextField
        dir={'rtl'}
        style={{direction: 'rtl'}}
        label={label}
        className={useStyles().root}
        onChange={input.onChange}
        {...input}
        {...custom}
    />
);
