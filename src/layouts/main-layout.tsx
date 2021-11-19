import React from 'react'
import {Box} from '@mui/material';
import {Orders} from '../components/Orders/orders';
import {Vehicles} from '../components/vehicles';


export const MainLayout = () => {

    return (

        <main>
            <Box sx={{margin: '20px'}} flexDirection="row" display="flex" alignItems="start" justifyContent="start">
                <Box flexDirection="column" flexWrap="wrap" display="flex" alignItems="start" justifyContent="start">

                    {/*<Sketches/>*/}

                </Box>
                <Box flexDirection="column" flexWrap="wrap" display="flex" alignItems="start" justifyContent="start">

                    <Vehicles/>
                    <Orders/>

                </Box>

            </Box>

        </main>


    )

}
