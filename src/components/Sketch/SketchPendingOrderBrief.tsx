import React from 'react'
import {Box} from '@mui/system';
import {useSelector} from 'react-redux';
import {Typography} from '@mui/material';
import {LanguageUtilities} from '../../services/language-utilities';
import {OrderModel} from '../../models/Order.model';
import {LocationModel} from '../../models/Location.model';


interface sketchPendingOrderProps {
    order: OrderModel,
    isInEdit: boolean
}


const timeText = (drive: OrderModel, locations: LocationModel[]) => LanguageUtilities.buildBriefText(drive, locations).timeText;
const driverAndLocation = (drive: OrderModel, locations: LocationModel[]) => LanguageUtilities.buildBriefText(drive, locations).driverAndLocation;
export const SketchPendingOrderBrief = (props: sketchPendingOrderProps) => {

    const order = props.order;
    const locations = useSelector(((state: { Locations: LocationModel[] }) => state.Locations));


    return ((<Box id={'pending-order'}>


            <Box id={'drive-description'}>
                <Box sx={{
                    width: '5px',
                    height: '10px'
                }}/>
                <Typography
                    variant={'subtitle1'}>{timeText(order, locations) + ' ' + driverAndLocation(order, locations)}  </Typography>

            </Box>

        </Box>)

    )

}
