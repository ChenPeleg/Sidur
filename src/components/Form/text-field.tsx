import {TextFieldPropertiesModel} from '../../models/text-field-properties.model';

import React from 'react';
import {Theme} from '@mui/system';
import {TextField} from '@mui/material';


const useStyles = (() => ({
    root: {
        direction: (theme: Theme) => theme.direction,
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
        sx={{
            ...
                useStyles()
                    .root
        }}
        onChange={input.onChange}
        {...input}
        {...custom}
    />
);
