import {Box, Typography} from '@mui/material';
import {Styles} from '../../hoc/themes';
import {useSelector} from 'react-redux';
import {SidurStore} from '../../store/store.types';
import {SketchDriveOrderEditActionEnum} from '../../models/SketchDriveOrderEditActionEnum';
import {SketchModel} from '../../models/Sketch.model';
import {OrderModel} from '../../models/Order.model';
import {translations} from '../../services/translations';
import {LanguageUtilities} from '../../services/language-utilities';
import {LocationModel} from '../../models/Location.model';

export const SketchesContainerMessage = (props: { sketch: SketchModel | null, clickCancel: () => void }) => {

    const sessionState = useSelector((state: SidurStore) => state.sessionState);
    const locations = useSelector(((state: { Locations: LocationModel[] }) => state.Locations));
    const pendingOrderInEditAction = useSelector((state: SidurStore) => state.sessionState.pendingOrderInEditAction);
    const pendingOrderIdInEdit = useSelector((state: SidurStore) => state.sessionState.pendingOrderIdInEdit);


    let messageText = ''
    if (pendingOrderInEditAction) {


        const pendingORderInEdit: OrderModel | undefined = props.sketch?.unassignedOrders.find(o => o.id === pendingOrderIdInEdit)
        switch (sessionState.pendingOrderInEditAction) {
            case SketchDriveOrderEditActionEnum.Merge:
                messageText += translations.SketchActionMergeInfoMessage
                break;
            case SketchDriveOrderEditActionEnum.ReplaceExisting:
                messageText += translations.SketchActionReplaceInfoMessage
                break;
            case SketchDriveOrderEditActionEnum.AddToVehicle:
                messageText += translations.SketchActionAddToVehicleInfoMessage
                break;

        }

        if (pendingORderInEdit) {
            messageText += ' ' + LanguageUtilities.buildBriefText(pendingORderInEdit, locations).driverAndLocation;
        }
        if (sessionState.pendingOrderInEditAction === SketchDriveOrderEditActionEnum.publicTransport) {
            messageText = ''
        }


    }

    return (<Box sx={{
        ...Styles
            .flexRow
    }}>
        <Box sx={{
            width: '20vw',
            height: '10px'
        }}/>
        <Typography variant={'h5'}>{messageText}  </Typography>
        {messageText ? <>&nbsp; &nbsp;
            <Typography sx={{
                p: '0.2em',
                cursor: 'pointer',
                textDecoration: 'underline'
            }} onClick={props.clickCancel} variant={'subtitle1'}> {translations.cancellation}  </Typography>
        </> : null
        }


    </Box>)
}
