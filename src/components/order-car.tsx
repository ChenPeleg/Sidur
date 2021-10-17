import React from 'react'

import {OrderCarForm} from './order-car-form';
import {translations} from '../services/translations';
import {Box, Card, CardHeader, Collapse} from '@mui/material';
import {OrderCarBrief} from './order-car-brief';
import {SxProps} from '@mui/system';
import {useDispatch} from 'react-redux';
import {ActionTypes} from '../store/actionTypes';


type AppProps = {
    orderId: string;
    isInEdit: boolean;
};
const TRL = translations;
const useStyles = (() => ({
    cardBase: {
        padding: '10px',
        cursor: 'pointer',
        // maxHeight: '40vh',
        // h: '30vh',
        width: '50vw',
        // display: 'flex',
        // flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        borderRadius: '15px',
        // height: {transition: ' ease-in-out 300ms'},


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
    const classes = useStyles();
    const dispatch = useDispatch();
    const clickHandler = (event: MouseEvent) => {

        dispatch({
            type: ActionTypes.CLICKED_ORDER,
            payLoad: {
                id: props.orderId
            }
        })
    }
    const briefOrderStyle: SxProps = props.isInEdit ? {} : {

        bgcolor: {
            transition: ' ease-in-out 100ms',
        },

        '&:hover': {
            'bgcolor': '#f7f2bb',

        },

    }
    return (<>

            <Card sx={{
                ...classes.cardBase,
                ...briefOrderStyle
            }} onClick={(event: any) => !props.isInEdit ? clickHandler(event) : null}>
                <OrderCarBrief sx={{...classes.cardBase}} orderId={props.orderId}/>
                {props.isInEdit ? <> <CardHeader sx={{
                    ...classes
                        .cardHeader
                }} title={TRL.Order}/> </> : null}

                <Collapse in={props.isInEdit}>

                    <OrderCarForm isInEdit={props.isInEdit} orderId={props.orderId} handleSubmit={'d'} pristine={'b'} reset={'c'}
                                  submitting={'d'}/>

                </Collapse>

            </Card>


            <Box sx={{...classes.dividerBox}}/>

        </>
    )

}
