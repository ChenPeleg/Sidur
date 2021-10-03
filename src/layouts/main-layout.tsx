import React from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Box} from '@material-ui/core';
import {OrderCar} from '../components/order-car';

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
                <OrderCar/>

               
            </Box>

        </main>


    )

}
