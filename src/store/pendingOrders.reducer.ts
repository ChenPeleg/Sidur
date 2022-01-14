import {IAction, SidurStore} from './store.types';
import {ActionsTypes} from './types.actions';
import {SketchModel} from '../models/Sketch.model';
import {OrderModel} from '../models/Order.model';
import {StoreUtils} from './store-utils';

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
            newState.sessionState.pendingOrderIdInEdit = action.payload.id;
        }

        return newState
    },
    [ActionsTypes.CLICKED_CLOSE_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}

        newState.sessionState.pendingOrderIdInEdit = null;


        return newState
    },

    [ActionsTypes.CLICKED_REMOVE_PENDING_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const orderToRemoveId = action.payload.id
        const SketchIdInEdit = state.sessionState.SketchIdInEdit

        const sketchObj: SketchModel | undefined = state.sketches.find((record: SketchModel) => record.id === SketchIdInEdit);
        if (sketchObj) {
            const orderToRemove: OrderModel | undefined = sketchObj.unassignedOrders.find(o => o.id === orderToRemoveId);
            if (orderToRemove) {
                sketchObj.assignedOrders = [...sketchObj.assignedOrders]
                sketchObj.assignedOrders.push(orderToRemove);
                sketchObj.unassignedOrders = [...sketchObj.unassignedOrders];
                sketchObj.unassignedOrders = sketchObj.unassignedOrders.filter(o => o.id !== orderToRemoveId);
                newState.sketches = newState.sketches.map((sketch: SketchModel) => {
                    if (sketch.id === SketchIdInEdit) {
                        return {...sketchObj}
                    } else {
                        return sketch
                    }
                });
            }
            newState.sessionState.pendingOrderIdInEdit = null;
        }
        StoreUtils.updateSidurRecordWithSketchChanges(newState)
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



