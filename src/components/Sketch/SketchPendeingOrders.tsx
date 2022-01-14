import React from 'react'
import {Box} from '@mui/system';
import {useSelector} from 'react-redux';
import {Typography} from '@mui/material';
import {OrderModel} from '../../models/Order.model';
import {translations} from '../../services/translations';
import {SketchPendingOrder} from './SketchPendingOrder';
import {SidurStore} from '../../store/store.types';


interface sketchPendingOrdersProps {
    pendingOrders: OrderModel[],
}


export const SketchPendingOrders = (props: sketchPendingOrdersProps) => {

    const pendingOrderInEdit = useSelector((state: SidurStore) => state.sessionState.pendingOrderIdInEdit);

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
                return <SketchPendingOrder isInEdit={pendingOrderInEdit === order.id} key={order.id} order={order}/>
            })}
        </Box>

    )

}
