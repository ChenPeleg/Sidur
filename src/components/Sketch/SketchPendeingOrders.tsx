import React from 'react'
import {Box} from '@mui/system';
import {useDispatch} from 'react-redux';
import {Typography} from '@mui/material';
import {locations} from '../../services/locations';
import {LanguageUtilites} from '../../services/language-utilites';
import {OrderModel} from '../../models/Order.model';
import {translations} from '../../services/translations';
import {SketchPendingOrderBrief} from './SketchPendingOrderBrief';


interface sketchPendingOrdersProps {
    pendingOrders: OrderModel[],
}

const getLocationFromId = (locationId: string): string | null => {
    return locations.find(v => v.id === locationId)?.Name || locationId
}
const timeText = (order: OrderModel) => LanguageUtilites.buildBriefText(order, locations).timeText;
const driverAndLocation = (order: OrderModel) => LanguageUtilites.buildBriefText(order, locations).driverAndLocation;
export const SketchPendingOrders = (props: sketchPendingOrdersProps) => {
    const dispatch = useDispatch();
    const drive = props.pendingOrders;
    return (<Box id={'pending-order-container'} sx={{
            m: '0.2em',
            mb: '0.3em',
            minHeight: '10vh',
            minWidth: '30vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'start',
        }}>
            <Typography variant={'h6'}> {translations.PendingOrders} </Typography>

            {(props.pendingOrders || []).map((order: OrderModel) => {
                return <SketchPendingOrderBrief key={order.id} order={order}/>
            })}
        </Box>

    )

}
