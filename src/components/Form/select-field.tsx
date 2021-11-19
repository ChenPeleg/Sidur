import React from 'react';
import {SxProps, Theme} from '@mui/system';
import {InputLabel, Select} from '@mui/material';

const useStyles = () => ({
    root: {
        direction: (theme: Theme) => theme.direction,
        '& .MuiInputBase-input': {
            paddingLeft: '10px'
        },

    }
})
const lableSx: SxProps = {
    fontSize: (theme) => '0.7em'

}

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
        <>


            <InputLabel sx={{...lableSx}} id="select-liable">{label}</InputLabel>
            <Select variant={'standard'}
                    sx={{
                        ...
                            classes
                                .root
                    }}
                    labelId="select-liable"
                    label={label}

                    {...input}
                    onChange={(event: any, child: any) => {

                        input.onChange(event)
                    }}

                    children={children}
                    {...custom}>

            </Select>
        </>

    )
};
