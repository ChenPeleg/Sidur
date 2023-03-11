import React, {useState} from 'react'
import {Box, SxProps} from '@mui/system';
import {useSelector} from 'react-redux';
import {Typography} from '@mui/material';
import {OrderModel} from '../../models/Order.model';
import {translations} from '../../services/translations';
import {SketchPendingOrder} from './SketchPendingOrder';
import {SidurStore} from '../../store/store.types';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {ArrowBack, CarRentalTwoTone, Keyboard, KeyboardArrowLeft, KeyboardArrowRight} from '@mui/icons-material';


interface sketchPendingOrdersProps {
    pendingOrders: OrderModel[],
}

const foldingButtonSX : SxProps = {
    backgroundColor : 'rgba(240,240,240,0.7)',
    borderRadius: '50%',
    boxShadow: `rgb(9 30 66 / 16%) 0px 0px 0px 1px, rgb(9 30 66 / 16%) 0px 2px 4px 1`
};
export const SketchPendingOrders = (props: sketchPendingOrdersProps) => {

    const [isPendingOrdersFolded, setIsPendingOrdersFolded] = useState(false);
    const handleOpenClosePendingOrders =() => {
        setIsPendingOrdersFolded(!isPendingOrdersFolded)
    }
    const pendingOrderInEdit = useSelector((state: SidurStore) => state.sessionState.pendingOrderIdInEdit);

    return (<Box id={'pending-order-hide-container'} sx={{    display: 'flex',
            flexDirection: 'row',}}>


        <Box id={'pending-order-container'} sx={{
            backgroundColor : 'rgba(255,255,255,0.1)',
            m: '0.2em',
            mb: '0.3em',
            minHeight: '80vh',
            minWidth: '30vw',
            height : '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'start',
        }}>
            <Typography variant={'h6'}> &nbsp;  {translations.PendingOrders} </Typography>

            {(props.pendingOrders || []).map((order: OrderModel) => {
                return <SketchPendingOrder isInEdit={pendingOrderInEdit === order.id} key={order.id} order={order}/>
            })}
        </Box>
            <Box id={'close-button-container'} sx={{height: '30px', mr : '-12px'}}>


            <IconButton
                size="medium"
                edge="end"
                aria-label="account of current user"
                onClick={handleOpenClosePendingOrders}
                color="inherit"
            >
                {isPendingOrdersFolded ?   <KeyboardArrowLeft   fontSize={'medium'}
                                                                sx={foldingButtonSX} /> :
                    <KeyboardArrowRight   fontSize={'medium'}
                                          sx={foldingButtonSX} /> }

            </IconButton>
            </Box>
        </Box>
    )

}
