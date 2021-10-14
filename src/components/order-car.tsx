import React from 'react'

import {OrderCarForm} from './order-car-form';
import {translations} from '../services/translations';
import {Card, CardHeader} from '@mui/material';

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

export const OrderCar = () => {
    const classes = useStyles()
    return (

        <Card sx={{...classes.cardBase}}>
            <CardHeader sx={{
                ...classes
                    .cardHeader
            }} title={TRL.Order}/>
            <OrderCarForm handleSubmit={'d'} pristine={'b'} reset={'c'} submitting={'d'}/>
        </Card>


    )

}
