import React from 'react'
import {Box} from '@mui/material';
import {useSelector} from 'react-redux';
import {DisplaySettings} from '../store/store.types';
import {SketchesContainer} from '../components/Sketch/SketchesContainer';
import {LocationGroupEditWrapper} from '../components/LocationsEdit/location-group-edit-wrapper';
import {OrdersLayout} from './orders-layout';
import {Route, Routes} from 'react-router-dom';


export const MainLayout = () => {
    const displaySetting: DisplaySettings = useSelector((state: { displaySetting: DisplaySettings }) => state.displaySetting);
    let displaySketches: boolean = false;
    let displayOrders: boolean = true;
    let displayLocations: boolean = false

    switch (displaySetting?.view) {
        case 'orders':
            displayOrders = true;
            displaySketches = false;
            break;
        case 'sketch':
            displayOrders = false;
            displaySketches = true;
            break;
        case 'locationsView':
            displayOrders = false;
            displaySketches = false;
            displayLocations = true
            break;
        default:
            break;

    }

    return (

        <main>
            <Box sx={{margin: '20px'}} flexDirection="row" display="flex" alignItems="start" justifyContent="start">
                <Box flexDirection="column" flexWrap="wrap" display="flex" alignItems="start" justifyContent="start">
                    <Routes>
                        <Route path="/sketch" element={<SketchesContainer/>}/>
                        <Route path="/orders" element={<OrdersLayout/>}/>
                        <Route path="/locations" element={<LocationGroupEditWrapper/>}/>
 
                    </Routes>

                </Box>


            </Box>

        </main>


    )

}
