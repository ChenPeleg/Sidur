import {SaveDataModel, SidurRecord, SidurStore} from './store.types';
import {SaveLoadService} from '../services/save-load.service';
import {hashFunction} from '../services/hash-function';


export const UtilsReducer = {
    saveToLocalStorage: (state: SidurStore): void => {
        const saveObj: SaveDataModel = UtilsReducer.buildSaveDataModel(state, 'chen', 'chen')
        SaveLoadService.saveToLocalStorage(saveObj);
    },
    UpdateSidurCollectionWithCurrenSidur: (state: SidurStore): SidurRecord[] => {
        const newState = {...state}
        const sidurId = newState.sidurId;
        const updatedOrders = newState.orders.map(o => ({...o}))
        newState.sidurCollection = newState.sidurCollection.map((sidur: SidurRecord) => {
            if (sidur.id === sidurId) {
                const updatedSidur = {...sidur};
                updatedSidur.orders = updatedOrders;
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

    }
}
