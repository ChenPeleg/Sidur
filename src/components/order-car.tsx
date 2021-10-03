import React from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Card, CardHeader} from '@material-ui/core';
import {OrderCarForm} from './order-car-form';
import {translations} from '../services/translations';

const TRL = translations;
const useStyles = makeStyles((theme) => ({
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
    const classes = useStyles();
    return (

        <Card className={classes.cardBase}>
            <CardHeader className={classes.cardHeader} title={TRL.Order}/>
            <OrderCarForm handleSubmit={'d'} pristine={'b'} reset={'c'} submitting={'d'}/>
        </Card>


    )

}
