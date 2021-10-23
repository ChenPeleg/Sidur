import {OrderModel} from '../models/Order.model';
import {defaultOrderValues, IAction, SidurStore} from './store.types';
import {ActionTypes} from './actionTypes';
import {SaveLoadService} from '../services/save-load.service';
import {SidurReducer} from './sidur.reducer';
import {OrderReducer} from './order.reducer';
import {ImportExportReducer} from './import-export.reducer';


const startOrders: OrderModel[] = ['Chen', 'Avi', 'Roni'].map((name: string, index: number): OrderModel => ({
    ...defaultOrderValues,
    id: (index + 1).toString(),
    driverName: name
}))

const defaultInitialState: SidurStore = {
    sidurArchive: [],
    sidurCollection: [{
        id: '1',
        Name: 'סידור יום שני',
        orders: [],
        deletedOrders: []
    }, {
        id: '2',
        Name: 'סידור גנים',
        orders: [],
        deletedOrders: []
    }

    ],
    sidurId: '1',
    orders: startOrders,
    orderIdInEdit: '1',
    dataHolderForCurrentOrderInEdit: null,
    deletedOrders: [],
    defaultOrderValues: {...defaultOrderValues}
}

const stateFromLocalStorage: SidurStore | undefined = SaveLoadService.loadFromLocalStorage('chen').data?.savedStore
const initialState = stateFromLocalStorage || defaultInitialState;

const reducer = (state: SidurStore = initialState, action: IAction) => {
    let newState = {
        ...state
    }

    switch (action.type) {
        case ActionTypes.CHOOSE_SIDUR:
        case ActionTypes.RENAME_SIDUR:
        case ActionTypes.ADD_NEW_SIDUR:
        case ActionTypes.DELETE_SIDUR:

            return SidurReducer[action.type](newState, action)

        case ActionTypes.CLICKED_ORDER:
        case ActionTypes.UPDATE_ORDER:
        case ActionTypes.UPDATE_ORDER_IN_EDIT:
        case ActionTypes.DELETE_ORDER:
        case ActionTypes.ADD_NEW_ORDER:

            return OrderReducer[action.type](newState, action)

        case ActionTypes.EXPORT_ALL:
        case ActionTypes.IMPORT_FILE_UPLOADED:
            
            return ImportExportReducer[action.type](newState, action)

        default:
            break;

    }

    return newState
}
export default reducer
