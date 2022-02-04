import {Box, Typography} from '@mui/material';
import {Styles} from '../../hoc/themes';
import {useSelector} from 'react-redux';
import {SidurStore} from '../../store/store.types';
import {SketchEditActionEnum} from '../../models/SketchEditAction.enum';
import {SketchModel} from '../../models/Sketch.model';
import {OrderModel} from '../../models/Order.model';
import {translations} from '../../services/translations';
import {LanguageUtilities} from '../../services/language-utilities';
import {LocationModel} from '../../models/Location.model';

export const SketchesContainerMessage = (props: { sketch: SketchModel | null }) => {

    const sessionState = useSelector((state: SidurStore) => state.sessionState);
    const locations = useSelector(((state: { Locations: LocationModel[] }) => state.Locations));

    let messageText = ''
    if (sessionState.pendingOrderInEditAction) {

        const pendingOrderIdInEdit = sessionState.pendingOrderIdInEdit;
        const pendingORderInEdit: OrderModel | undefined = props.sketch?.unassignedOrders.find(o => o.id === pendingOrderIdInEdit)
        switch (sessionState.pendingOrderInEditAction) {
            case SketchEditActionEnum.Merge:

                messageText += translations.SketchActionMergeInfoMessage
                break;
            case SketchEditActionEnum.ReplaceExisting:
                messageText += translations.SketchActionReplaceInfoMessage
                break;
        }
        if (pendingORderInEdit) {
            messageText += ' ' + LanguageUtilities.buildBriefText(pendingORderInEdit, locations).driverAndLocation;
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
        <Typography variant={'h5'}>{messageText}</Typography>

    </Box>)
}
