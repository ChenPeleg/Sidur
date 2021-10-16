import React from 'react'

import {OrderCarForm} from './order-car-form';
import {translations} from '../services/translations';
import {Box, Card, CardHeader, Grow} from '@mui/material';
import {OrderCarBrief} from './order-car-brief';


type AppProps = {
    orderId: string;
    isInEdit: boolean;
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
    growStyle: {
        // transformOrigin: '0 0 0'
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
            {props.isInEdit ? <>
                    <Grow in={props.isInEdit} style={classes.growStyle}
                    >
                        <Card sx={{...classes.cardBase}}>
                            <CardHeader sx={{
                                ...classes
                                    .cardHeader
                            }} title={TRL.Order}/>
                            <OrderCarForm orderId={props.orderId} handleSubmit={'d'} pristine={'b'} reset={'c'} submitting={'d'}/>
                        </Card>
                    </Grow>

                    <Box sx={{...classes.dividerBox}}/>  </> :
                <>

                    <OrderCarBrief sx={{...classes.cardBase}} orderId={props.orderId}/>

                    <Box sx={{...classes.dividerBox}}/>

                </>}


        </>


    )

}
