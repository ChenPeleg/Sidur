import React, {useState} from 'react'
import {useDispatch} from 'react-redux';
import {OrderModel} from '../../models/Order.model';
import {SketchPendingOrderBrief} from './SketchPendingOrderBrief';
import {ActionsTypes} from '../../store/types.actions';
import {SxProps} from '@mui/system';
import {Box, Card, Collapse} from '@mui/material';
import {SketchPendingOrderFull} from './SketchPendingOrderFull';


interface sketchPendingOrderProps {
    order: OrderModel,
    isInEdit: boolean
}

export const SketchPendingOrder = (props: sketchPendingOrderProps) => {

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
            type: ActionsTypes.CLICKED_PENDING_ORDER,
            payload: {
                id: props.order.id
            }
        })
    }


    const briefOrderStyle: SxProps = props.isInEdit ? {} : {
        cursor: 'pointer',
        bgcolor: {
            transition: ' ease-in-out 100ms',
        },


    }
    const order = props.order;
    return (<>
            <Box sx={{display: 'flex'}}>
                <Card onMouseOver={onMouseOver}
                      onMouseOut={onMouseOut} elevation={inHover ? 7 : 2} sx={{
                    m: '0.2em',
                    mb: '0.3em',
                    minHeight: '10vh',
                    minWidth: '30vw',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    justifyContent: 'start',
                }}
                      onClick={(event: any) => !props.isInEdit ? cardClickHandler(event) : null}>
                    <div tabIndex={0}>

                        <Box sx={{

                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <SketchPendingOrderBrief isInEdit={props.isInEdit} order={props.order}/>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row'
                            }}>

                            </Box>

                        </Box>
                    </div>


                    <Collapse in={props.isInEdit} unmountOnExit>

                        <SketchPendingOrderFull isInEdit={props.isInEdit} order={order}/>

                    </Collapse>

                </Card>


            </Box>
            <Box sx={{}}/>  </>


    )

}
