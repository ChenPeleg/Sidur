import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';
import {Reducer} from 'redux';

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

const reducer: Reducer = (state = initialState, action: any) => {
    let newState = {
        ...state
    }
    console.log(initialState)
    switch (action.type) {


        case 'STOP_SOUND':

            break;


        default:
            break;

    }

    return newState
}

export default reducer
