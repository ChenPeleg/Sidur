import {ActionsTypes} from './types.actions';


import {IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {Utilities} from '../services/utilities';
import {VehicleModel} from '../models/Vehicle.model';

export type SketchReducerFunctions =
    | ActionsTypes.NEW_SKETCH


export const SketchReducer: Record<SketchReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.NEW_SKETCH]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        
        const newId = Utilities.getNextId(state.vehicles.map(v => v.id));

        const newVehicle: VehicleModel = action.payload.value;
        newVehicle.id = newId;

        const existingNames = state.vehicles.map(v => v.vehicleName);
        if (existingNames.includes(newVehicle.vehicleName)) {
            newVehicle.vehicleName = newVehicle.vehicleName + ' ' + newVehicle.id.toString()
        }

        // newState.vehicles = [...newState.vehicles, newVehicle]


        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },


}

 
