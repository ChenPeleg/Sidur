import React from 'react';
import {SxProps, Theme} from '@mui/system';
import {Autocomplete, InputLabel, TextField} from '@mui/material';
import {LocationModel} from '../../models/Location.model';

const useStyles = () => ({
    root: {
        direction: (theme: Theme) => theme.direction,
        '& .MuiInputBase-input': {
            paddingLeft: '10px'
        },

    }
})
const labelSx: SxProps = {
    fontSize: (theme) => '0.7em'

}

export const RenderSelectFieldAutoComplete = (
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
    const options: Array<{ label: string, id: string }> = (custom.selectOptions || []).map((location: LocationModel) => ({
        label: location.Name,
        id: location.id
    }));

    return (
        <>


            <InputLabel sx={{...labelSx}} id="select-liable">{label}</InputLabel>
            <Autocomplete variant={'standard'}

                          sx={{
                              ...
                                  classes
                                      .root
                          }}

                // labelId="select-liable"
                          {...input}
                          onChange={(event: any, child: any) => {

                              input.onChange(event)
                          }}
                          options={options}
                          renderInput={(params) => <TextField {...params} />}
                          disableClearable
                          {...custom}

            >

            </Autocomplete>
        </>

    )
};
