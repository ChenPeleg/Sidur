import React from 'react'
import {Box} from '@mui/system';
import {useDispatch} from 'react-redux';
import {Typography} from '@mui/material';
import {locations} from '../../services/locations';
import {LanguageUtilites} from '../../services/language-utilites';
import {OrderModel} from '../../models/Order.model';


interface sketchPendingOrderProps {
    order: OrderModel,
    isInEdit: boolean
}

const getLocationFromId = (locationId: string): string | null => {
    return locations.find(v => v.id === locationId)?.Name || locationId
}
const timeText = (drive: OrderModel) => LanguageUtilites.buildBriefText(drive, locations).timeText;
const driverAndLocation = (drive: OrderModel) => LanguageUtilites.buildBriefText(drive, locations).driverAndLocation;
export const SketchPendingOrderFull = (props: sketchPendingOrderProps) => {
    const dispatch = useDispatch();
    const order = props.order;


    return ((<Box id={'pending-order'}>


            <Box id={'drive-description'} sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                justifyContent: 'start',
                p: '0.2em',
                pl: '0.4em',
                pr: '0.4em',
                flexGrow: 4,

            }}>
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
