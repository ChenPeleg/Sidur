import {AppConstants, SaveDataModel, SidurRecord, SidurStore} from './store.types';
import {SaveLoadService} from '../services/save-load.service';
import {hashFunction} from '../services/hash-function';
import {CloneUtil} from '../services/clone-utility';


export const StoreUtils = {
    removeIdPrefix: (id: string): string => {
        const replaceIdsNames: RegExp = new RegExp(AppConstants.ArchiveIdPrefix + '|' + AppConstants.deleteIdPrefix, 'g');
        return id.replace(replaceIdsNames, '')
    },
    HandleReducerSaveToLocalStorage: (state: SidurStore): void => {
        const saveObj: SaveDataModel = StoreUtils.buildSaveDataModel(state, 'chen', 'chen')
        SaveLoadService.saveToLocalStorage(saveObj);
    },

    UpdateSidurCollectionWithCurrenSidur: (state: SidurStore): SidurRecord[] => {
        const newState = {...state}
        const sidurId = newState.sidurId;
        const updatedOrders = newState.orders.map(o => ({...o}));
        const updatedVehicles = newState.vehicles.map(o => ({...o}));
        const updatedDeletedOrders = newState.deletedOrders.map(o => ({...o}));
        const updatedSketches = newState.sketches.map(o => ({...o}))
        newState.sidurCollection = newState.sidurCollection.map((sidur: SidurRecord) => {
            if (sidur.id === sidurId) {
                const updatedSidur = {...sidur};
                updatedSidur.orders = updatedOrders;
                updatedSidur.vehicles = updatedVehicles;
                updatedSidur.sketches = updatedSketches;
                updatedSidur.deletedOrders = updatedDeletedOrders;
                return updatedSidur
            } else {
                return sidur
            }
        });
        return newState.sidurCollection
    },
    buildSaveDataModel: (state: SidurStore, userName: string = 'chen', userId: string = 'chen'): SaveDataModel => {
        const hash = hashFunction(JSON.stringify(state))
        return {
            userName: 'chen',
            userId: 'chen',
            savedStore: state,
            timeStamp: SaveLoadService.getTimeStampFromDate(),
            hash: hash.toString()
        }

    },
    updateSidurRecordWithSketchChanges(state: SidurStore): SidurStore {
        const newState = {...state};
        const thisSidurInCollection: SidurRecord | undefined = newState.sidurCollection.find((sidur: SidurRecord) => sidur.id === newState.sidurId);


        if (thisSidurInCollection) {
            thisSidurInCollection.sketches = newState.sketches.map(s => CloneUtil.deepCloneSketch(s))
        }

        return newState

    }
}
