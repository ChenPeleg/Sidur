import React from 'react'
import {translations} from '../services/translations';
import {Box} from '@mui/system';
import {OrderCar} from './order-car';
import {useDispatch, useSelector} from 'react-redux';
import {OrderModel} from '../models/Order.model';

import {ActionsTypes} from '../store/types.actions';
import {AddButton} from './buttons/add-button';

const TRL = translations;
const useStyles = (() => ({
    cardBase: {
        padding: '10px',
        cursor: 'pointer',
        width: '50vw',

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
    const dispatch = useDispatch()
    const orders = useSelector((state: { orders: OrderModel[] }) => state.orders);
    const orderIdInEdit = useSelector((state: { orderIdInEdit: string | null }) => state.orderIdInEdit);
    const classes = useStyles();
    const addClickHandler = (event: any) => {
        dispatch({
            type: ActionsTypes.ADD_NEW_ORDER,
            payload: {}
        })
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mb: '10px',
                justifyContent: 'center',
                minWidth: '30vw',
            }}>
                <AddButton addClickHandler={addClickHandler}/>
            </Box>
            <Box>
                {orders.map((o) => (
                    <OrderCar orderId={o.id} key={o.id} isInEdit={orderIdInEdit === o.id}/>
                ))}

            </Box>
        </Box>


    )

}
