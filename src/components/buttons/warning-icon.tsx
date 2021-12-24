import React from 'react';
import {Warning} from '@mui/icons-material';
import {Box} from '@mui/material';
import {SxProps} from '@mui/system';
import {Colors} from '../../hoc/themes';


export const WarningIcon = (props: { custom?: any, sx?: SxProps }) => {


    return (

        <Box>
            <Warning sx={{
                filter: 'drop-shadow(0 0 .12rem black)',
                color: Colors.warningYellow, ...props.sx
            }}/>
        </Box>


    )

}
