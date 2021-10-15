import React from 'react'
import {translations} from '../services/translations';
import {Box} from '@mui/system';
import {OrderCar} from './order-car';
import {useSelector} from 'react-redux';
import {OrderModel} from '../models/Order.model';

const TRL = translations;
const useStyles = (() => ({
    cardBase: {
        padding: '10px',
        cursor: 'pointer',
        width: '50vw',
        // display: 'flex',
        // flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        borderRadius: '15px'

    },
    cardHeader: {
        paddingBottom: 0,
        paddingTop: '10px'
    },
    additionalText: {
        fontSize: '14px'
    }
}))

export const Orders = () => {

    const orders = useSelector((state: { orders: OrderModel[] }) => state.orders);
    const orderIdInEdit = useSelector((state: { orderIdInEdit: string | null }) => state.orderIdInEdit);
    const classes = useStyles();

    return (

        <Box>
            {orders.map((o) => (
                <OrderCar orderId={o.id} key={o.id} isInEdit={orderIdInEdit === o.id}/>
            ))}

        </Box>


    )

}
