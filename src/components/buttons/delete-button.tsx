import {Box, SxProps} from '@mui/system';
import React from 'react';
import {IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {LightTooltip} from '../styled/light-tool-tip';

export interface DeleteButtonProps {
    sx: SxProps,
    deleteClickHandler: any,
    disabled?: boolean,
    toolTip?: string

}

export const DeleteButton = (props: DeleteButtonProps) => {
    return (
        <Box>

            <LightTooltip title={props?.toolTip ? props.toolTip : false}>
                <IconButton aria-haspopup="true" disabled={!!props?.disabled}
                            id={'delete-button'} onClick={props.deleteClickHandler}
                            size={'small'}
                            sx={{...props.sx}}
                            aria-label="delete">

                    <Delete/>

                </IconButton>
            </LightTooltip>

        </Box>


    )

}
