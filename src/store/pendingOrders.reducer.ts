import {IAction, SidurStore} from './store.types';
import {ActionsTypes} from './types.actions';

export type PendingOrdersReducerFunctions =
    ActionsTypes.CLICKED_PENDING_ORDER


export const PendingOrdersReducer: Record<PendingOrdersReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.CLICKED_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        if (action.payload.id) {
            newState.pendingOrderIdInEdit = action.payload.id;
        }

        return newState
    },


}



