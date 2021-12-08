import {ActionsTypes} from './types.actions';


import {AppConstants, IAction, SidurRecord, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {Utilities} from '../services/utilities';
import {SidurBuilder} from '../sidurBuilder/sidurBuilder.main';
import {SketchModel} from '../models/Sketch.model';

export type SketchReducerFunctions =
    | ActionsTypes.NEW_SKETCH | ActionsTypes.CHOOSE_SKETCH | ActionsTypes.RENAME_SKETCH | ActionsTypes.DELETE_SKETCH;


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
            newSketch.id = newId;
            if (!newState.sketches) {
                newState.sketches = [];
            }
            newState.sketches.push(newSketch);
        } else {

        }


        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.CHOOSE_SKETCH]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const chosenSketchId = action.payload.id;
        const previousSketchId = newState.SketchIdInEdit;
        if (chosenSketchId === previousSketchId) {
            return newState
        }
        newState.SketchIdInEdit = chosenSketchId;
        const chosenSketchObj: SketchModel | undefined = newState.sketches.find((record: SketchModel) => record.id === chosenSketchId);
        if (chosenSketchObj !== undefined) {
            const previousSketchObj: SketchModel | undefined = newState.sketches.find((record: SketchModel) => record.id === previousSketchId);
            if (previousSketchObj !== undefined) {
                const NewPreviousSketchObj = {...previousSketchObj};

            }


        }
        return newState

    },
    [ActionsTypes.RENAME_SKETCH]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sketchId = action.payload.id// newState.sidurId;
        const newName = action.payload.value;
        if (!newName) {
            return newState
        }
        newState.sketches = newState.sketches.map((sketch: SketchModel) => {
            if (sketch.id === sketchId) {
                const updatedSketch = {...sketch};
                updatedSketch.name = newName;
                return updatedSketch
            } else {
                return sketch
            }
        });
        return newState
    },
    [ActionsTypes.DELETE_SKETCH]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sidurIdToDelete = action.payload.id// newState.sidurId;
        if (sidurIdToDelete.includes(AppConstants.ArchiveIdPrefix)) {
            newState.sidurArchive = newState.sidurArchive.map(sidur => {
                if (sidurIdToDelete === sidur.id) {
                    const updatedSidur = {...sidur};
                    updatedSidur.id = updatedSidur.id.replace(AppConstants.ArchiveIdPrefix, AppConstants.deleteIdPrefix);
                    return updatedSidur
                }
                return sidur
            })
        } else {
            let deletedSidur: SidurRecord | undefined = newState.sidurCollection.find(s => s.id === sidurIdToDelete);
            if (deletedSidur) {
                deletedSidur = {...deletedSidur};
                deletedSidur.id = 'Del' + deletedSidur.id;
                newState.sidurArchive.push(deletedSidur);
            }
            newState.sidurCollection = newState.sidurCollection.filter(s => s.id !== sidurIdToDelete);
        }

        if (!newState.sidurCollection.length) {
            // newState.sidurCollection.push(getDefaultSidur(newState));
        }
        if (newState.sidurId === sidurIdToDelete) {
            const chosenSidurAfterDelete: SidurRecord = newState.sidurCollection[0];
            newState.sidurId = chosenSidurAfterDelete.id
            newState = setChosenSidur(newState, chosenSidurAfterDelete);
        }


        return newState
    },


}
const setChosenSidur = (state: SidurStore, chosenSidur: SidurRecord): SidurStore => {
    const newState = {...state};

    newState.orders = chosenSidur?.orders.map(o => ({...o})) || []
    newState.vehicles = chosenSidur?.vehicles.map(o => ({...o})) || []
    newState.deletedOrders = chosenSidur?.deletedOrders?.map(o => ({...o})) || [];
    newState.sketches = chosenSidur?.sketches?.map(o => ({...o})) || [];
    newState.orderIdInEdit = null;
    newState.dataHolderForCurrentOrderInEdit = null;
    return newState

}

const getDefaultSidur = (state: SidurStore): null => {
    // const newSidur: SidurRecord = {...DefaultSidur};
    // newSidur.id = Utilities.getNextId(getAllSidurIDs(state));
    // const allNames = [...state.sidurCollection.map(o => o.Name), ...state.sidurArchive.map(o => o.Name)];
    // if (allNames.some(name => name === newSidur.Name)) {
    //     newSidur.Name = newSidur.Name + ' ' + newSidur.id
    // }
    return null

}

