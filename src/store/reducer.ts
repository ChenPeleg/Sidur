import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';
import {IAction} from './store.types';
import {ActionTypes} from './actionTypes';

// noinspection SpellCheckingInspection
interface SidurStore {
    orders: OrderModel[];
    orderNumberInEdit: number | null;
    currentOrderInEdit: OrderModel | null;
    defaultOrderValues: OrderModel
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
    orderNumberInEdit: null,
    currentOrderInEdit: null,
    defaultOrderValues: {...defaultOrderValues}
}

const reducer = (state = initialState, action: IAction) => {
    let newState = {
        ...state
    }

    switch (action.type) {
        case ActionTypes.UPDATE_ORDER:
            console.log(newState);

            const orderId = action.payLoad.values.id;

            newState.orders = newState.orders.map(order => {
                if (orderId === order.id) {
                    order.driverName = action.payLoad.values.driverName;
                    // order = {...action.payLoad.values}
                }
                return order

            });
            // newState.orders = [...newState.orders]


            break;

        default:
            break;

    }

    return newState
}

export default reducer
