import {IAction, SidurStore} from './store.types';
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
import {DefaultSidurFetching} from './store-inital-state';
import {RouteReducer} from './route.reducer';
import {TransportReducer} from './transport.reducer';

const buildInitialState = (): SidurStore => {

    const stateFromLocalStorage: SidurStore | undefined = SaveLoadService.loadFromLocalStorage('chen').data?.savedStore;
    return (stateFromLocalStorage || DefaultSidurFetching) as SidurStore;
}


const initialState = buildInitialState()
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
        case ActionsTypes.DELETE_FOREVER_SIDUR:
        case ActionsTypes.CHANGE_SIDUR_LOCATION_GROUP:

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
        case ActionsTypes.OPEN_IMPORT_SHEETS_MODAL:
        case ActionsTypes.CLOSE_IMPORT_SHEETS_MODAL:

        case ActionsTypes.IMPORT_SHEETS_DATA_PASTE:
        case  ActionsTypes.APPROVE_IMPORT_SHEETS_DATA:


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
        case ActionsTypes.CLONE_SKETCH:
        case ActionsTypes.RENAME_SKETCH:
        case ActionsTypes.DELETE_SKETCH:
            return SketchReducer[action.type](newState, action)

        case ActionsTypes.CLICKED_PENDING_ORDER:
        case ActionsTypes.CLICKED_CLOSE_PENDING_ORDER:
        case ActionsTypes.CLICKED_REMOVE_PENDING_ORDER:
        case ActionsTypes.CLICKED_MERGE_PENDING_ORDER:
        case ActionsTypes.CLICKED_SPLIT_PENDING_ORDER:
        case ActionsTypes.CLICKED_CHANGE_PENDING_ORDER:
        case ActionsTypes.CLICKED_CHANGE_TIME_PENDING_ORDER:
        case ActionsTypes.CLICKED_REPLACE_EXISTING_PENDING_ORDER:
        case ActionsTypes.CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER:
        case ActionsTypes.CLICKED_ADD_TO_PENDING_PENDING_ORDER:
        case ActionsTypes.REMOVE_PENDING_ORDER_STATUS:
        case ActionsTypes.CLICKED_MOVE_TO_TOP_PENDING_ORDER:
        case ActionsTypes.CLICKED_MOVE_TO_BOTTOM_PENDING_ORDER:
        case ActionsTypes.CLICKED_ADD_TO_VEHICLE_PENDING_ORDER:

            return PendingOrdersReducer[action.type](newState, action)
        case ActionsTypes.DELETE_SKETCH_DRIVE:
        case ActionsTypes.UPDATE_SKETCH_DRIVE:
        case ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE:
        case ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER:
        case ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER:
        case ActionsTypes.ADD_SKETCH_DRIVE_FROM_PENDING_ORDER:
            return SketchDriveReducer[action.type](newState, action);

        case ActionsTypes.UPDATE_LOCATION_GROUP:
        case ActionsTypes.DELETE_LOCATION_GROUP:
        case ActionsTypes.NEW_LOCATION_GROUP:
        case ActionsTypes.CLONE_LOCATION_GROUP:
        case ActionsTypes.RENAME_LOCATION_GROUP:
        case ActionsTypes.CHOOSE_LOCATION_GROUP:
        case ActionsTypes.CHOOSE_LOCATION_GROUP_TAB:

            return LocationGroupReducer[action.type](newState, action)
        case ActionsTypes.ADD_NEW_LOCATION:
        case ActionsTypes.START_EDIT_LOCATION:
        case ActionsTypes.STOP_EDIT_LOCATION:
        case ActionsTypes.UPDATE_LOCATION:
        case ActionsTypes.DELETE_LOCATION:

            return LocationReducer[action.type](newState, action)

        case ActionsTypes.ADD_NEW_ROUTE:
        case ActionsTypes.START_EDIT_ROUTE:
        case ActionsTypes.STOP_EDIT_ROUTE:
        case ActionsTypes.UPDATE_ROUTE:
        case ActionsTypes.DELETE_ROUTE:
        case ActionsTypes.ADD_LOCATION_TO_ROUTE:
        case ActionsTypes.CLONE_ROUTE:

            return RouteReducer[action.type](newState, action)

        case ActionsTypes.ADD_NEW_TRANSPORT:
        case ActionsTypes.START_EDIT_TRANSPORT:
        case ActionsTypes.STOP_EDIT_TRANSPORT:
        case ActionsTypes.UPDATE_TRANSPORT:
        case ActionsTypes.DELETE_TRANSPORT:
        case ActionsTypes.ADD_LOCATION_TO_TRANSPORT:
        case ActionsTypes.CLONE_TRANSPORT:

            return TransportReducer[action.type](newState, action)

        default:
            // @ts-ignore
            break;

    }

    return newState
}
export default reducer
