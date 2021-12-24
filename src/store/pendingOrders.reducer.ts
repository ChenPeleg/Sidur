import {IAction, SidurStore} from './store.types';
import {ActionsTypes} from './types.actions';

export type PendingOrdersReducerFunctions =
    ActionsTypes.CLICKED_PENDING_ORDER
    | ActionsTypes.CLICKED_CLOSE_PENDING_ORDER
    | ActionsTypes.CLICKED_REMOVE_PENDING_ORDER
    | ActionsTypes.CLICKED_MERGE_PENDING_ORDER
    | ActionsTypes.CLICKED_SPLIT_PENDING_ORDER
    | ActionsTypes.CLICKED_CHANGE_PENDING_ORDER
    | ActionsTypes.CLICKED_CHANGE_TIME_PENDING_ORDER
    | ActionsTypes.CLICKED_REPLACE_EXISTING_PENDING_ORDER
    | ActionsTypes.CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER
    | ActionsTypes.CLICKED_ADD_TO_PENDING_PENDING_ORDER


export const PendingOrdersReducer: Record<PendingOrdersReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.CLICKED_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        if (action.payload.id) {
            newState.pendingOrderIdInEdit = action.payload.id;
        }

        return newState
    },
    [ActionsTypes.CLICKED_CLOSE_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}

        newState.pendingOrderIdInEdit = null;


        return newState
    },
    [ActionsTypes.CLICKED_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        return newState
    },
    [ActionsTypes.CLICKED_REMOVE_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        return newState
    },
    [ActionsTypes.CLICKED_MERGE_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        return newState
    },
    [ActionsTypes.CLICKED_SPLIT_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        return newState
    },
    [ActionsTypes.CLICKED_CHANGE_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        return newState
    },
    [ActionsTypes.CLICKED_CHANGE_TIME_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        return newState
    },
    [ActionsTypes.CLICKED_REPLACE_EXISTING_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        return newState
    },
    [ActionsTypes.CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        return newState
    },
    [ActionsTypes.CLICKED_ADD_TO_PENDING_PENDING_ORDER]:
        (state: SidurStore, action: IAction): SidurStore => {
            let newState = {...state}
            return newState
        },


}



