import {SxProps} from '@mui/system';
import React from 'react';
import {Box, IconButton} from '@mui/material';
import {ContentCopy} from '@mui/icons-material';

interface CloneButtonProps {
    sx: SxProps,
    cloneClickHandler: any

}

export const CloneButton = (props: CloneButtonProps) => {
    return (
        <Box>

            <IconButton onClick={props.cloneClickHandler} size={'small'} sx={{...props.sx}} aria-label="delete">
                <ContentCopy/>
            </IconButton>
        </Box>


    )

}
