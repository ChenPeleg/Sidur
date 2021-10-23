import React, {useState} from 'react'

import {OrderCarForm} from './order-car-form';
import {translations} from '../services/translations';
import {Box, Card, Collapse} from '@mui/material';
import {OrderCarBrief} from './order-car-brief';
import {SxProps} from '@mui/system';
import {useDispatch} from 'react-redux';
import {ActionTypes} from '../store/actionTypes';
import {DeleteButton} from './delete-button';


type AppProps = {
    orderId: string;
    isInEdit: boolean;
};
const TRL = translations;
const useStyles = (() => ({
    cardBase: {
        padding: '10px',
        width: '50vw',
        borderRadius: '15px',


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
    const [inHover, setInHover] = useState(false);
    const onMouseOver = () => {
        setInHover(!props.isInEdit)
    };
    const onMouseOut = () => {
        setInHover(false)
    };
    const dispatch = useDispatch();
    const cardClickHandler = (event: MouseEvent) => {
        dispatch({
            type: ActionTypes.CLICKED_ORDER,
            payload: {
                id: props.orderId
            }
        })
    }
    const deleteClickHandler = (event: any) => {
        event.stopPropagation();
        dispatch({
            type: ActionTypes.DELETE_ORDER,
            payload: {
                id: props.orderId
            }
        })

    }
    const briefOrderStyle: SxProps = props.isInEdit ? {} : {
        cursor: 'pointer',
        bgcolor: {
            transition: ' ease-in-out 100ms',
        },

        // '&:hover': {
        //     'bgcolor': '#f7f2bb',
        //
        // },

    }
    return (
        <Box>

            <Box sx={{display: 'flex'}}>
                <Card onMouseOver={onMouseOver}
                      onMouseOut={onMouseOut} elevation={inHover ? 7 : 2} sx={{
                    ...classes.cardBase,
                    ...briefOrderStyle
                }} onClick={(event: any) => !props.isInEdit ? cardClickHandler(event) : null}>
                    <div tabIndex={0}>
                        <Box sx={{

                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <OrderCarBrief isInEdit={props.isInEdit} sx={{...classes.cardBase}} orderId={props.orderId}/>
                            <DeleteButton deleteClickHandler={deleteClickHandler} sx={{fontSize: '14px'}}/>
                        </Box>
                    </div>

                    {props.isInEdit ? <>
                        {/*    <CardHeader sx={{*/}
                        {/*    ...classes*/}
                        {/*        .cardHeader*/}
                        {/*}} title={TRL.Order}/>*/}
                    </> : null}

                    <Collapse in={props.isInEdit}>

                        <OrderCarForm isInEdit={props.isInEdit} orderId={props.orderId} handleSubmit={'d'} pristine={'b'} reset={'c'}
                                      submitting={'d'}/>

                    </Collapse>

                </Card>


            </Box>
            <Box sx={{...classes.dividerBox}}/>
        </Box>
    )

}
