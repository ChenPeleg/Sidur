import React from 'react'
import {TimeToLeave} from '@mui/icons-material';
import {Box} from '@mui/material';


const useStyles: any = (() => ({
    root: {
        flexGrow: 1
    },
    headerText: {
        fontSize: (theme: any) => theme?.typography?.h1.fontSize,
        margin: (theme: any) => theme?.typography?.h1.marginTop,
        padding: '5px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    carIcon: {
        marginTop: '10px',
        fontSize: (theme: any) => theme.typography.h1.fontSize,

    }
}));


export const HeaderLayout = () => {
    const classes = useStyles();
    return (

        <header>
            <Box flexDirection="row" flexWrap="wrap" display="flex" alignItems="center" justifyContent="space-around" dir={'rtl'}>
                <Box sx={{
                    ...
                        classes
                            .headerText
                }}>
                    <TimeToLeave sx={{
                        ...classes.carIcon
                    }}/>  &nbsp; סידור </Box>

            </Box>

        </header>


    )

}
