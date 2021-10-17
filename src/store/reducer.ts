import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';
import {IAction} from './store.types';
import {ActionTypes} from './actionTypes';

// noinspection SpellCheckingInspection
interface SidurStore {
    orders: OrderModel[];
    orderIdInEdit: null | string;

    dataHolderForCurrentOrderInEdit: OrderModel | null;
    defaultOrderValues: OrderModel,

}

const defaultOrderValues: OrderModel = {
    id: '1',
    driverName: '',
    startHour: '08:00',
    finishHour: '09:00',
    TypeOfDrive: DriveType.OneWayTo,
    Comments: ''
}

const startOrders: OrderModel[] = ['Chen', 'Avi', 'Roni'].map((name: string, index: number): OrderModel => ({
    ...defaultOrderValues,
    id: (index + 1).toString(),
    driverName: name
}))

const initialState: SidurStore = {
    orders: startOrders,
    orderIdInEdit: '1',
    dataHolderForCurrentOrderInEdit: null,
    defaultOrderValues: {...defaultOrderValues}
}

const reducer = (state = initialState, action: IAction) => {
    let newState = {
        ...state
    }
    switch (action.type) {
        case ActionTypes.CLICKED_ORDER:
            const clickeOrderId = action.payLoad.id;
            if (newState.dataHolderForCurrentOrderInEdit) {
                const currentOrderId = newState.dataHolderForCurrentOrderInEdit.id
                newState.orders = newState.orders.map(order => {
                    if ((currentOrderId === order.id) && newState.dataHolderForCurrentOrderInEdit) {
                        order = newState.dataHolderForCurrentOrderInEdit
                    }
                    return order
                });
            }
            ;
            newState.dataHolderForCurrentOrderInEdit = null;
            newState.orderIdInEdit = clickeOrderId

            break;
        case ActionTypes.UPDATE_ORDER:
            const orderId = action.payLoad.id;
            newState.orders = newState.orders.map(order => {
                if ((orderId === order.id) && newState.dataHolderForCurrentOrderInEdit) {
                    order = newState.dataHolderForCurrentOrderInEdit
                }
                return order
            });
            newState.dataHolderForCurrentOrderInEdit = null;
            newState.orderIdInEdit = null

            break;
        case ActionTypes.UPDATE_ORDER_IN_EDIT:
            newState.dataHolderForCurrentOrderInEdit = action.payLoad;
            break;

        default:
            break;

    }

    return newState
}

export default reducer
