import React from 'react'
import {Box} from '@mui/system';
import {useDispatch} from 'react-redux';
import {Typography} from '@mui/material';
import {locations} from '../../services/locations';
import {LanguageUtilities} from '../../services/language-utilities';
import {OrderModel} from '../../models/Order.model';


interface sketchPendingOrderProps {
    order: OrderModel,
    isInEdit: boolean
}

const getLocationFromId = (locationId: string): string | null => {
    return locations.find(v => v.id === locationId)?.Name || locationId
}
const timeText = (drive: OrderModel) => LanguageUtilities.buildBriefText(drive, locations).timeText;
const driverAndLocation = (drive: OrderModel) => LanguageUtilities.buildBriefText(drive, locations).driverAndLocation;
export const SketchPendingOrderBrief = (props: sketchPendingOrderProps) => {
    const dispatch = useDispatch();
    const order = props.order;


    return ((<Box id={'pending-order'}>


            <Box id={'drive-description'}>
                <Box sx={{
                    width: '5px',
                    height: '10px'
                }}/>
                <Typography
                    variant={'subtitle1'}>{timeText(order) + ' ' + driverAndLocation(order)}  </Typography>

            </Box>

        </Box>)

    )

}
