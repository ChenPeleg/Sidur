import {Box, SxProps} from '@mui/system';
import React from 'react';
import {IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';

interface DeleteButtonProps {
    sx: SxProps,
    deleteClickHandler: any

}

export const DeleteButton = (props: DeleteButtonProps) => {


    return (

        <Box>
            <IconButton onClick={props.deleteClickHandler} size={'small'} sx={{...props.sx}} aria-label="delete">
                <Delete/>
            </IconButton>
        </Box>


    )

}
