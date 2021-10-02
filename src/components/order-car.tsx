import React from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Card} from '@material-ui/core';
import {OrderCarForm} from './order-car-form';

const useStyles = makeStyles((theme) => ({
    cardBase: {
        padding: '10px',
        cursor: 'pointer',
        width: '50vw',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'

    },
    additionalText: {
        fontSize: '14px'
    }
}))

export const OrderCar = () => {
    const classes = useStyles();
    return (

        <Card className={classes.cardBase}>
            <OrderCarForm handleSubmit={'d'} pristine={'b'} reset={'c'} submitting={'d'}/>
        </Card>


    )

}
