import React from 'react'

import {OrderCar} from '../components/order-car';
import {Box} from '@mui/material';


export const MainLayout = () => {

    return (

        <main>
            <Box sx={{margin: '20px'}} flexDirection="row" flexWrap="wrap" display="flex" alignItems="start" justifyContent="start">
                <OrderCar/>


            </Box>

        </main>


    )

}
