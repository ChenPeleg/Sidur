import {ActionTypes} from './actionTypes';
import {defaultOrderValues, IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {Utilites} from '../services/utilites';
import {OrderModel} from '../models/Order.model';

export type OrderReducerFunctions =
    ActionTypes.DELETE_ORDER
    | ActionTypes.UPDATE_ORDER
    | ActionTypes.ADD_NEW_ORDER
    | ActionTypes.UPDATE_ORDER_IN_EDIT
    | ActionTypes.CLICKED_ORDER


export const OrderReducer: Record<OrderReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionTypes.ADD_NEW_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const newId = Utilites.getNextId(newState.orders.map(o => o.id))
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
    [ActionTypes.UPDATE_ORDER_IN_EDIT]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.dataHolderForCurrentOrderInEdit = action.payLoad;
        return newState
    },
    [ActionTypes.UPDATE_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const orderId = action.payLoad.id;
        newState.orders = newState.orders.map(order => {
            if ((orderId === order.id) && newState.dataHolderForCurrentOrderInEdit) {
                order = newState.dataHolderForCurrentOrderInEdit
            }
            return order
        });
        newState.dataHolderForCurrentOrderInEdit = null;
        newState.orderIdInEdit = null;
        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState)
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionTypes.CLICKED_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const clickedOrderId = action.payLoad.id;
        if (newState.dataHolderForCurrentOrderInEdit) {
            const currentOrderId = newState.dataHolderForCurrentOrderInEdit.id
            newState.orders = newState.orders.map(order => {
                if ((currentOrderId === order.id) && newState.dataHolderForCurrentOrderInEdit) {
                    order = newState.dataHolderForCurrentOrderInEdit
                }
                return order
            });
        }
        newState.dataHolderForCurrentOrderInEdit = null;
        newState.orderIdInEdit = clickedOrderId
        return newState
    },
    [ActionTypes.DELETE_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const deleteOrderId = action.payLoad.id;
        newState.orders = newState.orders.filter(order => deleteOrderId !== order.id)
        if (newState.dataHolderForCurrentOrderInEdit && newState.dataHolderForCurrentOrderInEdit.id === deleteOrderId) {
            newState.dataHolderForCurrentOrderInEdit = null;
        }
        if (newState.orderIdInEdit === deleteOrderId) {
            newState.orderIdInEdit = null;
        }
        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState)
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

}

