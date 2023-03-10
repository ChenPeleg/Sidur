import React from 'react'
import {Box} from '@mui/system';
import {OrderCar} from './order-car';
import {useDispatch, useSelector} from 'react-redux';
import {OrderModel} from '../../models/Order.model';
import {ActionsTypes} from '../../store/types.actions';
import {AddButton} from '../Icons/add-button';
import {SessionModel} from '../../store/store.types';
import {AppButton} from '../buttons/app-button';
import {translations} from '../../services/translations';


export const Orders = () => {
    const dispatch = useDispatch()
    const orders = useSelector((state: { orders: OrderModel[] }) => state.orders);
    const orderIdInEdit = useSelector((state: { sessionState: SessionModel }) => state.sessionState.orderIdInEdit);
    const addClickHandler = (_event: any) => {
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
                gap : '20px',
                minWidth: '30vw',
            }}>
                <AddButton addClickHandler={addClickHandler}/>

                <AppButton iconType={'ImportContacts'} color={'secondary'} text={translations.ImportOrders}  addClickHandler={addClickHandler}/>

            </Box>
            <Box>
                {orders.map((o) => (
                    <OrderCar orderId={o.id} key={o.id} isInEdit={orderIdInEdit === o.id}/>
                ))}

            </Box>
        </Box>


    )

}
