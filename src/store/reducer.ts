import {OrderModel} from '../models/Order.model';
import {defaultOrderValues, defaultVehicleValues, IAction, SidurStore} from './store.types';
import {SaveLoadService} from '../services/save-load.service';
import {SidurReducer} from './sidur.reducer';
import {OrderReducer} from './order.reducer';
import {ImportExportReducer} from './import-export.reducer';
import {VehicleModel} from '../models/Vehicle.model';
import {VehicleReducer} from './vehicle.reducer';
import {ActionsTypes} from './types.actions';
import {DisplayReducer} from './display.reducer';
import {SketchReducer} from './sketch.reducer';


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
        vehicles: [defaultVehicleValues],
        sketches: [],
    }, {
        id: '2',
        Name: 'סידור גנים',
        orders: [],
        deletedOrders: [],
        vehicles: [defaultVehicleValues],
        sketches: [],
    }

    ],
    sidurId: '1',
    orders: startOrders,
    vehicles: startVehicles,
    orderIdInEdit: '1',
    dataHolderForCurrentOrderInEdit: startOrders[0] || null,
    deletedOrders: [],
    defaultOrderValues: {...defaultOrderValues},
    sketches: [],
    displaySetting: {view: 'both'}
}

const stateFromLocalStorage: SidurStore | undefined = SaveLoadService.loadFromLocalStorage('chen').data?.savedStore
const initialState = stateFromLocalStorage || defaultInitialState;

const reducer = (state: SidurStore = initialState, action: IAction) => {
    let newState = {
        ...state
    }

    switch (action.type) {
        case ActionsTypes.CHOOSE_SIDUR:
        case ActionsTypes.RENAME_SIDUR:
        case ActionsTypes.ADD_NEW_SIDUR:
        case ActionsTypes.DELETE_SIDUR:
        case ActionsTypes.CLONE_SIDUR:
        case ActionsTypes.ARCHIVE_SIDUR:
        case ActionsTypes.MOVE_TO_ACTIVE_SIDUR:
        case  ActionsTypes.DELETE_FOREVER_SIDUR:

            return SidurReducer[action.type](newState, action)

        case ActionsTypes.CLICKED_ORDER:
        case ActionsTypes.UPDATE_ORDER:
        case ActionsTypes.UPDATE_ORDER_IN_EDIT:
        case ActionsTypes.DELETE_ORDER:
        case ActionsTypes.ADD_NEW_ORDER:
        case ActionsTypes.CLONE_ORDER:

            return OrderReducer[action.type](newState, action)

        case ActionsTypes.EXPORT_ALL:
        case ActionsTypes.IMPORT_FILE_UPLOADED:
        case ActionsTypes.IMPORT_ORDERS_AS_TEXT:

            return ImportExportReducer[action.type](newState, action);

        case ActionsTypes.NEW_VEHICLE:
        case ActionsTypes.UPDATE_VEHICLE:
        case ActionsTypes.DELETE_VEHICLE:

            return VehicleReducer[action.type](newState, action)
        case ActionsTypes.CHANGE_VIEW:
            return DisplayReducer[action.type](newState, action)


        case ActionsTypes.NEW_SKETCH:
            return SketchReducer [action.type](newState, action)

        default:
            break;

    }

    return newState
}
export default reducer
