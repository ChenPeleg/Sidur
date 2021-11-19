import React from 'react';
import {SxProps, Theme} from '@mui/system';
import {Autocomplete, TextField} from '@mui/material';
import {LocationModel} from '../../models/Location.model';

const useStyles = () => ({
    root: {
        direction: (theme: Theme) => theme.direction,
        '& .MuiInputBase-input': {
            //  paddingLeft: '10px'

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
    const inputAsText = options.find(o => o.id === input.value)?.label || input.value
    const inputWithTextValue = {...input};
    inputWithTextValue.value = inputAsText;

    return (
        <>


            {/*<InputLabel sx={{...labelSx}} id="select-liable">{label}</InputLabel>*/}
            <Autocomplete
                fullWidth

                sx={{
                    direction: (theme: Theme) => theme.direction,
                    '& .MuiInputBase-input': {
                        //  paddingLeft: '10px'
                    },
                    width: '150px'
                }}
                disableClearable

                // labelId="select-liable"
                {...inputWithTextValue}
                onChange={(event: any, child: any) => {

                    //  input.onChange(event)
                }}
                onSelect={(event: any, child: any) => {

                    input.onChange(event)
                }}
                options={options}

                renderInput={(params) => <TextField sx={{
                    ...
                        classes
                            .root
                }} {...params} variant="standard" label={label}> </TextField>}

                {...custom}

            >

            </Autocomplete>
        </>

    )
};
