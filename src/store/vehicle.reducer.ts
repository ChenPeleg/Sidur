import {ActionTypes} from './actionTypes';
import {IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {Utilites} from '../services/utilites';
import {VehicleModel} from '../models/Vehicle.model';

export type VehicleReducerFunctions =
    ActionTypes.DELETE_VEHICLE
    | ActionTypes.UPDATE_VEHICLE
    | ActionTypes.NEW_VEHICLE


export const VehicleReducer: Record<VehicleReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionTypes.NEW_VEHICLE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const newId = Utilites.getNextId(state.vehicles.map(v => v.id))
        const newVehicle: VehicleModel = action.payload.value;
        newVehicle.id = newId
        //const newVehicleId = get
        newState.vehicles = [...newState.vehicles, newVehicle]


        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

    [ActionTypes.UPDATE_VEHICLE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state};
        const updateVehicle: VehicleModel = action.payload.value;
        if (updateVehicle) {
            const vehicleId = updateVehicle.id;
            newState.vehicles = newState.vehicles.map(vehicle => {
                if ((vehicleId === vehicle.id)) {
                    vehicle = {...updateVehicle};
                }
                return vehicle
            });

        }
        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState)
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

    [ActionTypes.DELETE_VEHICLE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const deleteVehiclerId = action.payload.id;
        newState.vehicles = newState.vehicles.filter(vehicle => deleteVehiclerId !== vehicle.id)


        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState)
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

}

 
