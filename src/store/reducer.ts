import {OrderModel} from '../models/Order.model';

interface SidurStore {
    orders: OrderModel[];
    orderNumberInEdit: number | null;
    currentOrderInEdite: OrderModel | null;
}

const initialState: SidurStore = {
    orders: [],
    orderNumberInEdit: null,
    currentOrderInEdite: null,

}

const reducer = (state = initialState, action: any) => {
    let newState = {
        ...state
    }
    console.log(action)
    switch (action.type) {


        case 'STOP_SOUND':

            break;


        default:
            break;

    }

    return newState
}

export default reducer
