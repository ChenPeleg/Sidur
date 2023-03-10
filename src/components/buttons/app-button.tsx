import {SxProps} from '@mui/system';
import React from 'react';
import {Add} from '@mui/icons-material';
import {Box, Button} from '@mui/material';
import {translations} from '../../services/translations';
import {Icons} from '../Icons/icons';


export interface AddButtonProps {
    sx?: SxProps,
    addClickHandler: any,
    iconType? : string,
    color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined
    text : string

}

export const AppButton = (props: AddButtonProps) => {


    return (
        <Box>
            <Button id={'app-button'} color={props.color ? props.color : undefined} variant="contained" onClick={props.addClickHandler} aria-label="add" size="large">
                {props.iconType ? Icons[props.iconType] as React.ReactElement : null}
                {props.text}
            </Button>

        </Box>


    )

}
