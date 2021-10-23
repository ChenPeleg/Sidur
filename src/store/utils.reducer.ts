import {SidurRecord, SidurStore} from './store.types';
import {SaveLoadService} from '../services/save-load.service';


export const UtilsReducer = {
    saveToLocalStorage: (state: SidurStore): void => {
        SaveLoadService.saveToLocalStorage({
            userName: 'chen',
            userId: 'chen',
            savedStore: state,
            timeStamp: ''
        })
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
    }
}
