import {AppConstants, IAction, SidurStore} from './store.types';
import {ActionsTypes} from './types.actions';

export type DisplayReducerFunctions =
    ActionsTypes.CHANGE_VIEW | ActionsTypes.STOP_LOADING_ANIMATION |
    ActionsTypes.START_LOADING_ANIMATION


export const DisplayReducer: Record<DisplayReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.CHANGE_VIEW]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.displaySetting = {...newState.displaySetting}
        newState.displaySetting.view = action.payload.value
        return newState
    },
    [ActionsTypes.STOP_LOADING_ANIMATION]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.sessionState = {...newState.sessionState};
        newState.sessionState.isAnimationRunning = false;
        console.log('stop')
        return newState
    },
    [ActionsTypes.START_LOADING_ANIMATION]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.sessionState = {...newState.sessionState};
        newState.sessionState.isAnimationRunning = true
        return newState
    }


}
const getAllOrdersIDs = (state: SidurStore): string[] => {
    const ordersIds = state.orders.map(o => o.id);
    const deletedIdsWithWords = state.deletedOrders.map(o => o.id);
    const replaceIdsNames: RegExp = new RegExp(AppConstants.ArchiveIdPrefix + '|' + AppConstants.deleteIdPrefix, 'g');
    ;
    const deletedIds = deletedIdsWithWords.map(o => o.replace(replaceIdsNames, ''))
    return [...deletedIds, ...ordersIds]
}
const updateOrdersWithEditedOrder = (state: SidurStore): SidurStore => {
    const currentOrderId = state?.sessionState?.dataHolderForCurrentOrderInEdit?.id
    if (currentOrderId) {
        state.orders = state.orders.map(order => {
            if ((currentOrderId === order.id) && state.sessionState.dataHolderForCurrentOrderInEdit) {
                order = state.sessionState.dataHolderForCurrentOrderInEdit
            }
            return order
        });
    }

    return state
}


