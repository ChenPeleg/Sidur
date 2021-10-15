import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {OrderFields, OrderModel} from '../models/Order.model';
import {Box, SxProps, Theme} from '@mui/system';
import {Card} from '@mui/material';
import {ActionTypes} from '../store/actionTypes';


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
    const dispatch = useDispatch();
    const id = props.orderId;
    const clickHandler = (event: MouseEvent) => {

        dispatch({
            type: ActionTypes.CLICKED_ORDER,
            payLoad: {
                id: id
            }
        })
    }

    // const initialValues = useSelector((state: { defaultOrderValues: OrderModel }) => state.defaultOrderValues);
    const orderValues = useSelector((state: { orders: OrderModel[] }) => {
        const order = state.orders.find(order => order.id === id) as OrderModel;

        return order;

    });
    const startHour = orderValues.startHour;
    const style: SxProps = {
        ...props.sx,
        bgcolor: {
            transition: ' ease-in-out 100ms',
        },

        '&:hover': {
            'bgcolor': '#f7f2bb',

        },

    }

    //  console.log('after use selector called', order);
    // const orderValues: OrderModel =
    return (
        <Card sx={style} onClick={(event: any) => clickHandler(event)}>
            <Box> {
                orderValues.startHour} {orderValues.driverName}
            </Box>
        </Card>

    )
}


