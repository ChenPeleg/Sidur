import React from 'react';
import {useSelector} from 'react-redux';
import {OrderFields, OrderModel} from '../models/Order.model';
import {Box, SxProps, Theme} from '@mui/system';


//const TRL = translations;

type AppProps = {
    orderId: string;
    sx: SxProps
};

const useStyles: any = (() => ({
    root: {
        direction: (theme: Theme) => theme.direction,
        '& .MuiFormLabel-root': {
            left: 'inherit'
        }
    },
    fieldWrapper: {
        display: 'inline-flex',
        padding: '10px'
    },
    fieldWrapperText: {
        display: 'inline-flex',
        padding: '10px',
        maxWidth: '150px'
    },
    cardBase: {
        direction: (theme: Theme) => theme.direction,
        padding: '10px',
        cursor: 'pointer',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'

    },
    additionalText: {
        fontSize: '14px'
    }
}))
const orderFields: OrderModel = new OrderFields();


export const OrderCarBrief = (props: AppProps) => {
    const id = props.orderId;
    const orderValues = useSelector((state: { orders: OrderModel[] }) => {
        const order = state.orders.find(order => order.id === id) as OrderModel;

        return order;

    });
    const startHour = orderValues.startHour;


    return (

        <Box> {
            orderValues.startHour} {orderValues.driverName}
        </Box>


    )
}


