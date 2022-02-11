import React from 'react'
import {Box} from '@mui/system';
import {useDispatch} from 'react-redux';
import {Button, Typography} from '@mui/material';
import {LanguageUtilities} from '../../services/language-utilities';
import {OrderModel} from '../../models/Order.model';
import {ActionsTypes} from '../../store/types.actions';
import {PendingOrderMenu} from './pending-order-menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import {OrderActionButton} from '../buttons/order-action-button';
import {translations} from '../../services/translations';
import {SketchEditActionEnum} from '../../models/SketchEditAction.enum';


interface sketchPendingOrderProps {
    order: OrderModel,
    isInEdit: boolean
}

const pendingOrderMenuId = 'sketch-pending-menu-button';

export const SketchPendingOrderFull = (props: sketchPendingOrderProps) => {
    const dispatch = useDispatch();
    const [pendingOrderAnchorEl, setPendingOrderAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const handlePendingOrderMenuClick = (event: React.MouseEvent<HTMLElement>, clickAction: SketchEditActionEnum) => {
        const orderId = props.order.id
        switch (clickAction) {

            // case SketchEditActionEnum.AddToPending:
            //     dispatch({
            //         type: ActionsTypes.CLONE_SIDUR,
            //         payload: {id: orderId}
            //     })
            //     break;
            case SketchEditActionEnum.RemoveFromPending:
                dispatch({
                    type: ActionsTypes.CLICKED_REMOVE_PENDING_ORDER,
                    payload: {id: orderId}
                })
                break;
            case SketchEditActionEnum.Split:
                dispatch({
                    type: ActionsTypes.CLICKED_REMOVE_PENDING_ORDER,
                    payload: {id: orderId}
                })
                break;
            case SketchEditActionEnum.Merge:
                dispatch({
                    type: ActionsTypes.CLICKED_MERGE_PENDING_ORDER,
                    payload: {id: orderId}
                })
                break;


            default:
        }
        handleSidurMenuClose()
    };
    const handleSidurMenuClose = () => {
        setPendingOrderAnchorEl(null);
    };
    const handlePendingOrderMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setPendingOrderAnchorEl(event.currentTarget);
    };
    const actionClickHandler = () => {

    }
    const handlePendingOrderClose = () => {
        dispatch({
            type: ActionsTypes.CLICKED_CLOSE_PENDING_ORDER,
            payload: {
                id: props.order.id
            }
        })
    }
    let pendingOrdersActions: any;
    pendingOrdersActions = [];
    const order = props.order;
    const isSidurMenuOpen = Boolean(pendingOrderAnchorEl);

    return ((<Box id={'pending-order'}>
            <Box id={'pending-order-data'} sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'start',
                justifyContent: 'start',
                p: '0.2em',
                pl: '0.4em',
                pr: '0.4em',
                flexGrow: 4,

            }}>

                <Typography
                    variant={'subtitle1'}>{order.Comments + ', ' + LanguageUtilities.renderPassengerText(order.passengers)}  </Typography>

            </Box>

            <Box id={'pending-order-actions'} sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'start',
                justifyContent: 'start',
                p: '0.2em',
                pl: '0.4em',
                pr: '0.4em',
                flexGrow: 4,

            }}>


                {[...pendingOrdersActions].map((n, i: number) => (
                    <Box key={i} sx={{p: '0.5em'}}> <OrderActionButton key={n.action.toString()} text={n.name} actionType={n.action}
                                                                       actionClickHandler={actionClickHandler}/>
                    </Box>))}
                <Box sx={{p: '0.5em'}}>
                    <Button
                        size="medium"
                        aria-label="show more"
                        aria-controls={pendingOrderMenuId}
                        aria-haspopup="true"
                        onClick={(event) => handlePendingOrderMenuClick(event, SketchEditActionEnum.RemoveFromPending)}
                        variant={'contained'}
                    > {translations.SketchActionRemove}
                    </Button>
                </Box>
                <Box sx={{p: '0.5em'}}>
                    <Button sx={{
                        pl: '5px',
                        pr: '5px'
                    }}
                            size="medium"
                            aria-label="show more"
                            aria-controls={pendingOrderMenuId}
                            aria-haspopup="true"
                            onClick={handlePendingOrderMenuOpen}
                            variant={'contained'}
                    >&nbsp; {translations.moerActions}
                        <MoreIcon sx={{
                            pl: 0,
                            pr: 0,
                            mr: 0,
                            ml: 0
                        }}/>
                    </Button>
                </Box>
                <Box sx={{p: '0.5em'}}>
                    <Button
                        size="medium"
                        aria-label="show more"
                        aria-controls={pendingOrderMenuId}
                        aria-haspopup="true"
                        onClick={handlePendingOrderClose}
                        variant={'contained'}
                    > {translations.close}
                    </Button>
                </Box>


            </Box>
            <PendingOrderMenu PendingOrderMenuAnchor={pendingOrderAnchorEl} PendingOrderMenuId={pendingOrderMenuId}
                              isPendingOrderMenuOpen={isSidurMenuOpen}
                              handlePendingOrderMenuClick={handlePendingOrderMenuClick} handlePendingOrderMenuClose={handleSidurMenuClose}/>
        </Box>)

    )

}
