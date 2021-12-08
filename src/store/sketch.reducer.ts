import {ActionsTypes} from './types.actions';


import {AppConstants, IAction, SidurRecord, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {Utilities} from '../services/utilities';
import {SidurBuilder} from '../sidurBuilder/sidurBuilder.main';
import {OrderModel} from '../models/Order.model';

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
        const previousSidurId = newState.sidurId;
        if (chosenSketchId === previousSidurId) {
            return newState
        }
        newState.sidurId = chosenSketchId;
        const chosenSidurObj: SidurRecord | undefined = newState.sidurCollection.find((record: SidurRecord) => record.id === chosenSketchId);
        if (chosenSidurObj !== undefined) {
            const previousSidurObj: SidurRecord | undefined = newState.sidurCollection.find((record: SidurRecord) => record.id === previousSidurId);
            if (previousSidurObj !== undefined) {
                const NewPreviousSidurObj = {...previousSidurObj};
                NewPreviousSidurObj.orders = newState.orders.map(o => ({
                    ...o
                }));
                NewPreviousSidurObj.deletedOrders = newState.deletedOrders.map(o => ({
                    ...o
                }));
                NewPreviousSidurObj.sketches = newState.sketches.map(o => ({
                    ...o
                }));
                NewPreviousSidurObj.vehicles = newState.vehicles.map(o => ({
                    ...o
                }));

                NewPreviousSidurObj.defaultOrderValues = {
                    ...
                        NewPreviousSidurObj
                            .defaultOrderValues
                } as OrderModel;
                newState.sidurCollection = newState.sidurCollection.map((sidur: SidurRecord) => {
                    if (sidur.id === previousSidurId) {
                        return NewPreviousSidurObj
                    } else {
                        return sidur
                    }
                })
            }

            newState = setChosenSidur(newState, chosenSidurObj);


        }
        return newState

    },
    [ActionsTypes.RENAME_SKETCH]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sidurId = action.payload.id// newState.sidurId;
        const newName = action.payload.value;
        if (!newName) {
            return newState
        }
        newState.sidurCollection = newState.sidurCollection.map((sidur: SidurRecord) => {
            if (sidur.id === sidurId) {
                const updatedSidur = {...sidur};
                updatedSidur.Name = newName;
                return updatedSidur
            } else {
                return sidur
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

