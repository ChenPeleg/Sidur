import {Select} from '@material-ui/core';
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
export const RenderSelectField = (
    {
        input,
        label,
        meta: {
            touched,
            error
        },
        children,
        ...custom
    }: any,
) => (
    <Select
        label={label}
        // floatingLabelText={label}
        // errorText={touched && error}
        {...input}
        onChange={(event: any, index: any, value: any) => {
            input.onChange(value)
        }}
        value={input.value}
        children={children}
        {...custom}>

    </Select>
);
