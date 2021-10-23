import {ActionTypes} from './actionTypes';
import {IAction, SidurRecord, SidurStore} from './store.types';
import {OrderModel} from '../models/Order.model';
import {Utilites} from '../services/utilites';
import {translations} from '../services/translations';

export type SidurReducerFunctions =
    ActionTypes.RENAME_SIDUR | ActionTypes.DELETE_SIDUR | ActionTypes.ADD_NEW_SIDUR | ActionTypes.CHOOSE_SIDUR

const DefaultSidur: SidurRecord = {
    id: '1',
    Name: 'הסידור החדש שלי',
    orders: [],
    deletedOrders: []
}


export const SidurReducer: Record<SidurReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionTypes.CHOOSE_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const chosenSidurId = action.payLoad.id;
        const previousSidurId = newState.sidurId;
        if (chosenSidurId === previousSidurId) {
            return newState
        }
        newState.sidurId = chosenSidurId;
        const chosenSidurObj: SidurRecord | undefined = newState.sidurCollection.find((record: SidurRecord) => record.id === chosenSidurId);
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
    [ActionTypes.RENAME_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sidurId = newState.sidurId;
        const newName = action.payLoad.value;
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
    [ActionTypes.DELETE_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}


        const sidurIdToDelete = newState.sidurId;
        let deletedSidur: SidurRecord | undefined = newState.sidurCollection.find(s => s.id === sidurIdToDelete);
        if (deletedSidur) {
            deletedSidur = {...deletedSidur};
            deletedSidur.id = 'Del' + deletedSidur.id;
            newState.sidurArchive.push(deletedSidur);
        }

        newState.sidurCollection = newState.sidurCollection.filter(s => s.id !== sidurIdToDelete);
        if (!newState.sidurCollection.length) {
            newState.sidurCollection.push(DefaultSidur);
        }
        const chosenSidurAfterDelete: SidurRecord = newState.sidurCollection[0];
        newState.sidurId = chosenSidurAfterDelete.id
        newState = setChosenSidur(newState, chosenSidurAfterDelete);


        return newState
    },
    [ActionTypes.ADD_NEW_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}

        const newSidurId = Utilites.getNextId(newState.sidurCollection.map(o => o.id))
        const newSidur: SidurRecord = {
            id: newSidurId,
            Name: translations.Sidur + ' ' + newSidurId,
            orders: [],
            deletedOrders: [],
            defaultOrderValues: newState.defaultOrderValues
        }
        newState.sidurCollection = newState.sidurCollection.map(c => c);
        newState.sidurCollection.push(newSidur);
        newState.sidurId = newSidurId;
        newState = setChosenSidur(newState, newSidur);
        return newState
    },


}
const setChosenSidur = (state: SidurStore, chosenSidur: SidurRecord): SidurStore => {
    const newState = {...state};
    newState.orders = chosenSidur?.orders.map(o => ({...o})) || []
    newState.deletedOrders = chosenSidur?.deletedOrders.map(o => ({...o})) || [];
    newState.orderIdInEdit = null;
    newState.dataHolderForCurrentOrderInEdit = null;
    return newState

}
