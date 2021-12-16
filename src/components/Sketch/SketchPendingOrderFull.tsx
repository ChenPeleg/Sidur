import React from 'react'
import {Box, SxProps} from '@mui/system';
import {useDispatch} from 'react-redux';
import {Button, Typography} from '@mui/material';
import {locations} from '../../services/locations';
import {LanguageUtilities} from '../../services/language-utilities';
import {OrderModel} from '../../models/Order.model';
import {SidurActionType} from '../../models/SidurMenuClickActionType.enum';
import {ActionsTypes} from '../../store/types.actions';
import {PendingOrderMenu} from './pending-order-menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import {translations} from '../../services/translations';
import {OrderActionButton} from '../buttons/order-action-button';


interface sketchPendingOrderProps {
    order: OrderModel,
    isInEdit: boolean
}


const pendingOrderMenuId = 'sketch-pending-menu-button';
const timeText = (drive: OrderModel) => LanguageUtilities.buildBriefText(drive, locations).timeText;
const driverAndLocation = (drive: OrderModel) => LanguageUtilities.buildBriefText(drive, locations).driverAndLocation;
export const SketchPendingOrderFull = (props: sketchPendingOrderProps) => {
    const dispatch = useDispatch();
    const [pendingOrderAnchorEl, setPendingOrderAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const handleSidurMenuClick = (event: React.MouseEvent<HTMLElement>, clickAction: SidurActionType) => {
        const sidurId = '1'
        switch (clickAction) {

            case SidurActionType.CreateCopy:
                dispatch({
                    type: ActionsTypes.CLONE_SIDUR,
                    payload: {id: sidurId}
                })
                break;
            case SidurActionType.Archive:
                dispatch({
                    type: ActionsTypes.ARCHIVE_SIDUR,
                    payload: {id: sidurId}
                })
                break;
            case SidurActionType.Delete:
                dispatch({
                    type: ActionsTypes.DELETE_SIDUR,
                    payload: {id: '1'}
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
    const pendingOrdersActions = LanguageUtilities.buildSketchEditActionsArray();
    const order = props.order;
    const actionButtonSx: SxProps = {}
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


                {[...pendingOrdersActions].map(n => (
                    <Box sx={{p: '0.5em'}}> <OrderActionButton key={n.action.toString()} text={n.name} actionType={n.action}
                                                               actionClickHandler={actionClickHandler}/>
                    </Box>))}
                <Box sx={{p: '0.5em'}}>
                    <Button
                        size="medium"
                        aria-label="show more"
                        aria-controls={pendingOrderMenuId}
                        aria-haspopup="true"
                        onClick={handlePendingOrderMenuOpen}
                        variant={'contained'}
                    > {translations.moerActions}
                        <MoreIcon/>
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
                        <MoreIcon/>
                    </Button>
                </Box>


            </Box>
            <PendingOrderMenu PendingOrderMenuAnchor={pendingOrderAnchorEl} PendingOrderMenuId={pendingOrderMenuId}
                              isPendingOrderMenuOpen={isSidurMenuOpen}
                              handlePendingOrderMenuClick={handleSidurMenuClick} handlePendingOrderMenuClose={handleSidurMenuClose}/>
        </Box>)

    )

}
