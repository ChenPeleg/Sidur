import React from 'react';
import {Theme} from '@mui/system';
import {Select} from '@mui/material';

const useStyles = () => ({
    root: {
        direction: (theme: Theme) => theme.direction,
        '& .MuiInputBase-input': {
            paddingLeft: '10px'
        }
    }
})

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
            sx={{
                ...
                    classes
                        .root
            }}
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
