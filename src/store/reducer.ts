import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';

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
const initialState: SidurStore = {
    orders: [],
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
