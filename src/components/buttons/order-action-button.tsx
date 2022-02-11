import {SxProps} from '@mui/system';
import React from 'react';
import {Box, Button} from '@mui/material';
import {SketchOrderEditActionEnum} from '../../models/SketchOrderEditActionEnum';


export interface OrderActionButtonProps {
    sx?: SxProps,
    actionClickHandler: any,
    actionType: SketchOrderEditActionEnum,
    text: string,
    size?: 'medium' | 'small'

}

export const OrderActionButton = (props: OrderActionButtonProps) => {
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
