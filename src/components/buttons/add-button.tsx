import {SxProps} from '@mui/system';
import React from 'react';
import {Add} from '@mui/icons-material';
import {Box, Button} from '@mui/material';
import {translations} from '../../services/translations';


interface AddButtonProps {
    sx?: SxProps,
    addClickHandler: any

}

export const AddButton = (props: AddButtonProps) => {


    return (

        <Box>
            <Button variant="contained" onClick={props.addClickHandler} aria-label="add" size="large">
                <Add/> {translations.AddOrder}
            </Button>

        </Box>


    )

}
