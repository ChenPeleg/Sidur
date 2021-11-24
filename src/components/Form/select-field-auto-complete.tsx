import React, {ChangeEvent} from 'react';
import {SxProps, Theme} from '@mui/system';
import {Autocomplete, TextField} from '@mui/material';
import {LocationModel} from '../../models/Location.model';

const useStyles = () => ({
    root: {
        direction: (theme: Theme) => theme.direction,
        '& .MuiButtonBase-root': {
            position: 'absolute',
            left: '2px'
            //  display: 'inline'
            //alignSelf: 'flex-end'

        },
        '& .MuiAutocomplete-endAdornment': {
            position: 'absolute',
            left: '2px',
        },
        '& .MuiFormLabel-root': {
            left: 'inherit'
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
    const options: Array<{ label: string, id: string }> = (custom.selectoptions || []).map((location: LocationModel) => ({
        label: location.Name.replaceAll('  ', ' '),
        id: location.id
    }));
    const inputAsText = options.find(o => o.id === input.value)?.label || input.value
    const inputWithTextValue = {...input};
    inputWithTextValue.value = inputAsText;

    const onTextFieldChange = (event: any, params: any) => {
    }

    return (
        <>


            {/*<InputLabel sx={{...labelSx}} id="select-liable">{label}</InputLabel>*/}
            <Autocomplete
                fullWidth
                isOptionEqualToValue={(option: { label: string, id: string }, value: string) => {
                    const thisLabel: string = option.label;
                    return thisLabel?.replaceAll('  ', ' ') === value
                }}
                sx={{
                    direction: (theme: Theme) => theme.direction,
                    '& .MuiInputBase-input': {
                        //  paddingLeft: '10px'
                    },
                    width: '150px'
                }}
                disableClearable
                openOnFocus
                autoSelect
                autoComplete


                {...inputWithTextValue}

                onChange={(event: ChangeEvent, newValue: any) => {
                    const clonedEvent: any = {
                        ...event,
                        target: {...event.target}
                    };
                    clonedEvent.target.value = newValue.id
                    console.log(clonedEvent);
                    input.onChange(clonedEvent)

                }}


                options={options}

                renderInput={(params) => <TextField onChange={(event: ChangeEvent) => onTextFieldChange(event, params)} sx={{
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
