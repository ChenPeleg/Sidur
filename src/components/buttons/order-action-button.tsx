import {SxProps} from '@mui/system';
import React from 'react';
import {Box, Button} from '@mui/material';
import {SketchEditActionEnum} from '../../models/SketchEditAction.enum';


export interface OrdeerActionButtonProps {
    sx?: SxProps,
    actionClickHandler: any,
    actionType: SketchEditActionEnum,
    text: string,
    size?: 'medium' | 'small'

}

export const OrderActionButton = (props: OrdeerActionButtonProps) => {
    const size = props.size ? props.size : 'medium'
    const sx = props.sx || {}
    return (

        <Box>
            <Button sx={sx} id={'action-order-button'} variant="contained" onClick={props.actionClickHandler} aria-label="add" size={size}>
                {props.text}
            </Button>

        </Box>


    )

}
