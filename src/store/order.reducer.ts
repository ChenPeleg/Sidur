import {AppConstants, defaultOrderValues, IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {Utils} from '../services/utils';
import {OrderModel} from '../models/Order.model';
import {ActionsTypes} from './types.actions';

export type OrderReducerFunctions =
    ActionsTypes.DELETE_ORDER
    | ActionsTypes.UPDATE_ORDER
    | ActionsTypes.ADD_NEW_ORDER
    | ActionsTypes.UPDATE_ORDER_IN_EDIT
    | ActionsTypes.CLICKED_ORDER
    | ActionsTypes.CLONE_ORDER


export const OrderReducer: Record<OrderReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.ADD_NEW_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const newId = Utils.getNextId(getAllOrdersIDs(state))
        const newOrder: OrderModel = {
            ...defaultOrderValues,
            id: newId
        }
        newState.orders = [...newState.orders]
        newState.orders.unshift(newOrder);
        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState)
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.CLONE_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state};
        newState = updateOrdersWithEditedOrder(newState)
        const cloneOriginId = action.payload.id
        const cloneOriginOrder = newState.orders.find(order => cloneOriginId === order.id);
        if (cloneOriginOrder) {
            const orderIndex = newState.orders.indexOf(cloneOriginOrder) + 1;
            const newId = Utils.getNextId(getAllOrdersIDs(state))
            const newOrder: OrderModel = {
                ...cloneOriginOrder,
                id: newId
            }
            newState.orders = [...newState.orders]
            newState.orders.splice(orderIndex, 0, newOrder)

            newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState)
            StoreUtils.HandleReducerSaveToLocalStorage(newState);
        }

        return newState
    },
    [ActionsTypes.UPDATE_ORDER_IN_EDIT]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.sessionState.dataHolderForCurrentOrderInEdit = action.payload;
        return newState
    },
    [ActionsTypes.UPDATE_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const orderId = action.payload.id;
        newState.orders = newState.orders.map(order => {
            if ((orderId === order.id) && newState.sessionState.dataHolderForCurrentOrderInEdit) {
                order = newState.sessionState.dataHolderForCurrentOrderInEdit
            }
            return order
        });
        newState.sessionState.dataHolderForCurrentOrderInEdit = null;
        newState.sessionState.orderIdInEdit = null;
        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState)
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.CLICKED_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const clickedOrderId = action.payload.id;
        newState = updateOrdersWithEditedOrder(newState)
        newState.sessionState.dataHolderForCurrentOrderInEdit = null;
        newState.sessionState.orderIdInEdit = clickedOrderId
        return newState
    },
    [ActionsTypes.DELETE_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const deleteOrderId = action.payload.id;
        newState.orders = newState.orders.filter(order => deleteOrderId !== order.id)
        if (newState.sessionState.dataHolderForCurrentOrderInEdit && newState.sessionState.dataHolderForCurrentOrderInEdit.id === deleteOrderId) {
            newState.sessionState.dataHolderForCurrentOrderInEdit = null;
        }
        if (newState.sessionState.orderIdInEdit === deleteOrderId) {
            newState.sessionState.orderIdInEdit = null;
        }
        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState)
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

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


