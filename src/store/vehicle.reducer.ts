import {ActionsTypes} from './types.actions';


import {IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {Utilities} from '../services/utilities';
import {VehicleModel} from '../models/Vehicle.model';

export type VehicleReducerFunctions =
    ActionsTypes.DELETE_VEHICLE
    | ActionsTypes.UPDATE_VEHICLE
    | ActionsTypes.NEW_VEHICLE


export const VehicleReducer: Record<VehicleReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.NEW_VEHICLE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const newId = Utilities.getNextId(state.vehicles.map(v => v.id));

        const newVehicle: VehicleModel = action.payload.value;
        newVehicle.id = newId;

        const existingNames = state.vehicles.map(v => v.vehicleName);
        if (existingNames.includes(newVehicle.vehicleName)) {
            newVehicle.vehicleName = newVehicle.vehicleName + ' ' + newVehicle.id.toString()
        }
        //const newVehicleId = get
        newState.vehicles = [...newState.vehicles, newVehicle]


        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

    [ActionsTypes.UPDATE_VEHICLE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state};
        const updateVehicle: VehicleModel = action.payload.value;
        if (updateVehicle) {
            const vehicleId = updateVehicle.id;
            const existingNames = state.vehicles.filter(v => v.id !== vehicleId).map(v => v.vehicleName);
            if (existingNames.includes(updateVehicle.vehicleName)) {
                updateVehicle.vehicleName = updateVehicle.vehicleName + ' ' + updateVehicle.id.toString()
            }
            const newIdIfNeeded = Utilities.getNextId(state.vehicles.map(v => v.id));

            newState.vehicles = newState.vehicles.map(vehicle => {
                if ((vehicleId === vehicle.id)) {
                    vehicle = {...updateVehicle};
                    if (vehicleId === '0') {
                        vehicle.id = newIdIfNeeded
                    }
                }
                return vehicle
            });

        }
        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState)
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

    [ActionsTypes.DELETE_VEHICLE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const deleteVehiclerId = action.payload.id;
        newState.vehicles = newState.vehicles.filter(vehicle => deleteVehiclerId !== vehicle.id)


        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState)
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

}

 
