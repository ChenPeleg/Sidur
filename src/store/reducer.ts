import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';

// noinspection SpellCheckingInspection
interface SidurStore {
    orders: OrderModel[];
    orderNumberInEdit: number | null;
    currentOrderInEdit: OrderModel | null;
    defaultOrderValues: OrderModel
}

const defaultOrderValues: OrderModel = {
    driverName: '',
    startHour: '08:00',
    finishHour: '09:00',
    TypeOfDrive: DriveType.OneWayTo,
    Comments: ''
}

const startOrders = ['Chen', 'Avi', 'Roni'].map((name: string): OrderModel => ({
    ...defaultOrderValues,
    driverName: name
}))

const initialState: SidurStore = {
    orders: startOrders,
    orderNumberInEdit: null,
    currentOrderInEdit: null,
    defaultOrderValues: {...defaultOrderValues}
}

const reducer = (state = initialState, action: any) => {
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
