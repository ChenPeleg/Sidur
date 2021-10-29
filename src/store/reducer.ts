import {OrderModel} from '../models/Order.model';
import {defaultOrderValues, defaultVehicleValues, IAction, SidurStore} from './store.types';
import {ActionTypes} from './actionTypes';
import {SaveLoadService} from '../services/save-load.service';
import {SidurReducer} from './sidur.reducer';
import {OrderReducer} from './order.reducer';
import {ImportExportReducer} from './import-export.reducer';
import {VehicleModel} from '../models/Vehicle.model';
import {VehicleReducer} from './vehicle.reducer';


const startOrders: OrderModel[] = ['חן', 'אבי', 'רוני'].map((name: string, index: number): OrderModel => ({
    ...defaultOrderValues,
    id: (index + 1).toString(),
    driverName: name
}));
const startVehicles: VehicleModel[] = ['סנאו', 'שלגיה', 'שכור', 'מאזדה'].map((name: string, index: number): VehicleModel => ({
    ...defaultVehicleValues,
    id: (index + 1).toString(),
    vehicleName: name,

}))

const defaultInitialState: SidurStore = {
    sidurArchive: [],
    sidurCollection: [{
        id: '1',
        Name: 'סידור יום שני',
        orders: [],
        deletedOrders: [],
        vehicles: [defaultVehicleValues]
    }, {
        id: '2',
        Name: 'סידור גנים',
        orders: [],
        deletedOrders: [],
        vehicles: [defaultVehicleValues]
    }

    ],
    sidurId: '1',
    orders: startOrders,
    vehicles: startVehicles,
    orderIdInEdit: '1',
    dataHolderForCurrentOrderInEdit: startOrders[0] || null,
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
        case ActionTypes.CLONE_SIDUR:
        case ActionTypes.ARCHIVE_SIDUR:
        case ActionTypes.MOVE_TO_ACTIVE_SIDUR:
        case  ActionTypes.DELETE_FOREVER_SIDUR:

            return SidurReducer[action.type](newState, action)

        case ActionTypes.CLICKED_ORDER:
        case ActionTypes.UPDATE_ORDER:
        case ActionTypes.UPDATE_ORDER_IN_EDIT:
        case ActionTypes.DELETE_ORDER:
        case ActionTypes.ADD_NEW_ORDER:
        case ActionTypes.CLONE_ORDER:

            return OrderReducer[action.type](newState, action)

        case ActionTypes.EXPORT_ALL:
        case ActionTypes.IMPORT_FILE_UPLOADED:

            return ImportExportReducer[action.type](newState, action);

        case ActionTypes.NEW_VEHICLE:
        case ActionTypes.UPDATE_VEHICLE:
        case ActionTypes.DELETE_VEHICLE:

            return VehicleReducer[action.type](newState, action)

        default:
            break;

    }

    return newState
}
export default reducer
