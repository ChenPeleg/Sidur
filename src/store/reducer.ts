import {defaultOrderValues, defaultVehicleValues, IAction, SessionModel, SidurStore} from './store.types';
import {SaveLoadService} from '../services/save-load.service';
import {SidurReducer} from './sidur.reducer';
import {OrderReducer} from './order.reducer';
import {ImportExportReducer} from './import-export.reducer';
import {VehicleReducer} from './vehicle.reducer';
import {ActionsTypes} from './types.actions';
import {DisplayReducer} from './display.reducer';
import {SketchReducer} from './sketch.reducer';
import {PendingOrdersReducer} from './pendingOrders.reducer';
import {SketchDriveReducer} from './sketch-drive.reducer';
import {LocationGroupReducer} from './locationGroup.reducer';
import {LocationReducer} from './location.reducer';
import {defaultSidurEshbal} from './store-inital-state';
import {StoreUtils} from './store-utils';
import {RouteReducer} from './route.reducer';

const buildInintialState = (): SidurStore => {
    const defaultInitialState: SidurStore = {
        sidurArchive: [],
        sidurCollection: [{
            id: '1',
            Name: 'סידור לדוגמה',
            orders: [],
            deletedOrders: [],
            vehicles: [defaultVehicleValues],
            sketches: [],
            chosenSketch: '',
            locationGroup: null
        }

        ],
        sidurId: '1',
        orders: [],
        vehicles: [],
        deletedOrders: [],
        defaultOrderValues: {...defaultOrderValues},
        sketches: [],
        displaySetting: {view: 'locationsView'},
        sessionState: sessionState,
        LocationGroups: []

    }
    const stateFromLocalStorage: SidurStore | undefined = SaveLoadService.loadFromLocalStorage('chen').data?.savedStore;
    //defaultInitialState.sidurCollection.push(defaultSidurEshbal.sidurCollection[0])
    const initialState: SidurStore = (stateFromLocalStorage || defaultSidurEshbal) as SidurStore;
    const eshabalLocationGroup = initialState.LocationGroups?.find(l => l.id === 'ESHBAL');
    if (!eshabalLocationGroup) {
        initialState.LocationGroups = initialState.LocationGroups || [];
        initialState.LocationGroups.push(StoreUtils.defaultEshbalLocationGroup());
    }
    //defaultInitialState;
    console.log(initialState);
    return initialState;
}

const sessionState: SessionModel = {
    LocationGroupTabOpen: null,
    SketchIdInEdit: null,
    locationGroupInEdit: null,
    orderIdInEdit: null,
    pendingOrderIdInEdit: null,
    dataHolderForCurrentOrderInEdit: null,
    isAnimationRunning: true,
    locationMainInEdit: null,


}


const initialState = buildInintialState()
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
        case ActionsTypes.START_LOADING_ANIMATION:
        case ActionsTypes.STOP_LOADING_ANIMATION:
            return DisplayReducer[action.type](newState, action)


        case ActionsTypes.NEW_SKETCH:
        case ActionsTypes.CHOOSE_SKETCH:
        case  ActionsTypes.CLONE_SKETCH:
        case ActionsTypes.RENAME_SKETCH:
        case ActionsTypes.DELETE_SKETCH:
            return SketchReducer [action.type](newState, action)

        case ActionsTypes.CLICKED_PENDING_ORDER:
        case ActionsTypes.CLICKED_CLOSE_PENDING_ORDER:
        case ActionsTypes.CLICKED_REMOVE_PENDING_ORDER :
        case ActionsTypes.CLICKED_MERGE_PENDING_ORDER :
        case ActionsTypes.CLICKED_SPLIT_PENDING_ORDER :
        case ActionsTypes.CLICKED_CHANGE_PENDING_ORDER  :
        case ActionsTypes.CLICKED_CHANGE_TIME_PENDING_ORDER  :
        case ActionsTypes.CLICKED_REPLACE_EXISTING_PENDING_ORDER  :
        case ActionsTypes.CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER  :
        case ActionsTypes.CLICKED_ADD_TO_PENDING_PENDING_ORDER:

            return PendingOrdersReducer [action.type](newState, action)
        case ActionsTypes.DELETE_SKETCH_DRIVE:
        case ActionsTypes.UPDATE_SKETCH_DRIVE:
        case ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE:
            return SketchDriveReducer [action.type](newState, action);

        case   ActionsTypes.UPDATE_LOCATION_GROUP :
        case  ActionsTypes.DELETE_LOCATION_GROUP :
        case ActionsTypes.NEW_LOCATION_GROUP :
        case ActionsTypes.CLONE_LOCATION_GROUP :
        case ActionsTypes.RENAME_LOCATION_GROUP:
        case ActionsTypes.CHOOSE_LOCATION_GROUP:
        case ActionsTypes.CHOOSE_LOCATION_GROUP_TAB:

            return LocationGroupReducer [action.type](newState, action)
        case ActionsTypes.ADD_NEW_LOCATION:
        case ActionsTypes.START_EDIT_LOCATION:
        case ActionsTypes.STOP_EDIT_LOCATION:
        case ActionsTypes.UPDATE_LOCATION:
        case ActionsTypes.DELETE_LOCATION :

            return LocationReducer [action.type](newState, action)

        case ActionsTypes.ADD_NEW_ROUTE:
        case ActionsTypes.START_EDIT_ROUTE:
        case ActionsTypes.STOP_EDIT_ROUTE:
        case ActionsTypes.UPDATE_ROUTE:
        case ActionsTypes.DELETE_ROUTE :

            return RouteReducer [action.type](newState, action)

        default:
            // @ts-ignore
            break;

    }

    return newState
}
export default reducer
