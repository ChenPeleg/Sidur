import React from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Box} from '@material-ui/core';
import {TimeToLeave} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    headerText: {
        fontSize: theme.typography.h1.fontSize,
        margin: theme.typography.h1.marginTop,
        padding: '5px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    carIcon: {
        marginTop: '10px',
        fontSize: theme.typography.h1.fontSize,

    }
}));


export const HeaderLayout = () => {
    const classes = useStyles();
    return (

        <header>
            <Box flexDirection="row" flexWrap="wrap" display="flex" alignItems="center" justifyContent="space-around" dir={'rtl'}>
                <h1 className={classes.headerText}><TimeToLeave className={classes.carIcon}/>  &nbsp; סידור </h1>

            </Box>

        </header>


    )

}
