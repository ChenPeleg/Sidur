import React from 'react';
import {useSelector} from 'react-redux';
import {OrderFields, OrderModel} from '../models/Order.model';
import {Box, SxProps, Theme} from '@mui/system';
import {Typography} from '@mui/material';


//const TRL = translations;

type AppProps = {
    orderId: string;
    sx: SxProps,
    isInEdit: boolean
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
        return state.orders.find(order => order.id === id) as OrderModel;
    });
    const startHour = orderValues.startHour;


    return (

        <Box sx={{padding: '5px'}}>
            <Typography fontWeight={props.isInEdit ? 'bold' : 'initial'} fontSize={'large'} padding={'initial'}>
                {
                    orderValues.startHour} {orderValues.driverName}
            </Typography>

        </Box>


    )
}


