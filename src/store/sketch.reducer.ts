import {ActionsTypes} from './types.actions';


import {IAction, SidurRecord, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {Utilities} from '../services/utilities';
import {SidurBuilder} from '../sidurBuilder/sidurBuilder.main';

export type SketchReducerFunctions =
    | ActionsTypes.NEW_SKETCH


export const SketchReducer: Record<SketchReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.NEW_SKETCH]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        if (!newState.sketches) {
            newState.sketches = [];
        }
        const newId = Utilities.getNextId(newState.sketches.map(v => v.id));
        const chosenSidurObj: SidurRecord | undefined = newState.sidurCollection.find((record: SidurRecord) => record.id === newState.sidurId);
        if (chosenSidurObj !== undefined) {
            const deconstructedSidur = {...chosenSidurObj};
            deconstructedSidur.orders = newState.orders;
            deconstructedSidur.sketches = newState.sketches;
            deconstructedSidur.vehicles = newState.vehicles;
            const newSketch = SidurBuilder(deconstructedSidur);
            //   deconstructedSidur.sketches =
            newState.sketches = [newSketch];
        } else {

        }

        //
        // const newVehicle: VehicleModel = action.payload.value;
        // newVehicle.id = newId;

        // const existingNames = state.vehicles.map(v => v.vehicleName);
        // if (existingNames.includes(newVehicle.vehicleName)) {
        //     newVehicle.vehicleName = newVehicle.vehicleName + ' ' + newVehicle.id.toString()
        // }

        // newState.vehicles = [...newState.vehicles, newVehicle]


        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },


}

 
