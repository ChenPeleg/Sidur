import React from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Box} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    mainBox: {
        margin: '20px'
    }

}));


export const MainLayout = () => {
    const classes = useStyles();
    return (

        <main>
            <Box className={classes.mainBox} flexDirection="row" flexWrap="wrap" display="flex" alignItems="start" justifyContent="start">
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                </ul>
            </Box>

        </main>


    )

}
