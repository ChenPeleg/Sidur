import {Select} from '@material-ui/core';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        direction: theme.direction,
        '& .MuiInputBase-input': {
            paddingLeft: '10px'
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
) => {
    const classes = useStyles()
    return (
        <Select
            className={classes.root}
            label={label}
            // floatingLabelText={label}
            // errorText={touched && error}
            {...input}
            onChange={(event: any, child: any) => {
                console.log(child)
                input.onChange(event)
            }}
            //  value={input.value}
            children={children}
            {...custom}>

        </Select>
    )
};
