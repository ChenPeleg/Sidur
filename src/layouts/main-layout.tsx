import React from 'react'
import {Box} from '@mui/material';
import {Orders} from '../components/orders';


export const MainLayout = () => {

    return (

        <main>
            <Box sx={{margin: '20px'}} flexDirection="row" flexWrap="wrap" display="flex" alignItems="start" justifyContent="start">
              
                <Orders/>


            </Box>

        </main>


    )

}
