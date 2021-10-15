import React from 'react'

import {OrderCarForm} from './order-car-form';
import {translations} from '../services/translations';
import {Box, Card, CardHeader} from '@mui/material';
import {OrderCarBrief} from './order-car-brief';


type AppProps = {
    orderId: string;
};
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
    },
    dividerBox: {
        width: '20px',
        height: '20px'
    }

}))

export const OrderCar = (props: AppProps) => {
    const classes = useStyles()
    return (
        <>
            <Card sx={{...classes.cardBase}}>
                <CardHeader sx={{
                    ...classes
                        .cardHeader
                }} title={TRL.Order}/>
                <OrderCarForm orderId={props.orderId} handleSubmit={'d'} pristine={'b'} reset={'c'} submitting={'d'}/>
            </Card>
            <Box sx={{...classes.dividerBox}}/>
            <Card sx={{...classes.cardBase}}>

                <OrderCarBrief orderId={props.orderId}/>
            </Card>
            <Box sx={{...classes.dividerBox}}/>
 
        </>


    )

}
