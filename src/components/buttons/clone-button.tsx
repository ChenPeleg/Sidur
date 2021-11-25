import {SxProps} from '@mui/system';
import React from 'react';
import {Box, IconButton} from '@mui/material';
import {ContentCopy} from '@mui/icons-material';

export interface CloneButtonProps {
    sx: SxProps,
    cloneClickHandler: any

}

export const CloneButton = (props: CloneButtonProps) => {
    return (
        <Box>

            <IconButton id={'clone-button'} onClick={props.cloneClickHandler} size={'small'} sx={{...props.sx}} aria-label="delete">
                <ContentCopy/>
            </IconButton>
        </Box>


    )

}
