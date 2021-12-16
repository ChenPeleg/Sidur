import {SxProps} from '@mui/system';
import React from 'react';
import {Box, Button} from '@mui/material';
import {SketchEditActionEnum} from '../../models/SketchEditAction.enum';


export interface OrdeerActionButtonProps {
    sx?: SxProps,
    actionClickHandler: any,
    actionType: SketchEditActionEnum,
    text: string

}

export const OrderActionButton = (props: OrdeerActionButtonProps) => {


    return (

        <Box>
            <Button id={'action-order-button'} variant="contained" onClick={props.actionClickHandler} aria-label="add" size="medium">
                {props.text}
            </Button>

        </Box>


    )

}
