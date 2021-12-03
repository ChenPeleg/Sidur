import {ActionsTypes} from './types.actions';
import {AppConstants, defaultVehicleValues, IAction, SidurRecord, SidurStore} from './store.types';
import {OrderModel} from '../models/Order.model';
import {Utilities} from '../services/utilities';
import {translations} from '../services/translations';
import {StoreUtils} from './store-utils';

export type SidurReducerFunctions =
    ActionsTypes.RENAME_SIDUR
    | ActionsTypes.DELETE_SIDUR
    | ActionsTypes.ADD_NEW_SIDUR
    | ActionsTypes.CHOOSE_SIDUR
    | ActionsTypes.CLONE_SIDUR
    | ActionsTypes.ARCHIVE_SIDUR
    | ActionsTypes.MOVE_TO_ACTIVE_SIDUR
    | ActionsTypes.DELETE_FOREVER_SIDUR

const DefaultSidur: SidurRecord = {
    id: '1',
    Name: 'הסידור החדש שלי',
    orders: [],
    deletedOrders: [],
    vehicles: [defaultVehicleValues],
    sketches: []

}

export const SidurReducer: Record<SidurReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.CHOOSE_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const chosenSidurId = action.payload.id;
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
    [ActionsTypes.RENAME_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
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
    [ActionsTypes.DELETE_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
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
            newState.sidurCollection.push(getDefaultSidur(newState));
        }
        if (newState.sidurId === sidurIdToDelete) {
            const chosenSidurAfterDelete: SidurRecord = newState.sidurCollection[0];
            newState.sidurId = chosenSidurAfterDelete.id
            newState = setChosenSidur(newState, chosenSidurAfterDelete);
        }


        return newState
    },
    [ActionsTypes.ARCHIVE_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sidurIdToArchive = action.payload.id;
        if (sidurIdToArchive.includes(AppConstants.deleteIdPrefix)) {
            newState.sidurArchive = newState.sidurArchive.map(sidur => {
                if (sidurIdToArchive === sidur.id) {
                    const updatedSidur = {...sidur};
                    updatedSidur.id = updatedSidur.id.replace(AppConstants.ArchiveIdPrefix, AppConstants.deleteIdPrefix);
                    return updatedSidur
                }
                return sidur
            })
        } else {
            let archivedSidur: SidurRecord | undefined = newState.sidurCollection.find(s => s.id === sidurIdToArchive);
            if (archivedSidur) {
                archivedSidur = {...archivedSidur};
                archivedSidur.id = AppConstants.ArchiveIdPrefix + archivedSidur.id;
                newState.sidurArchive.push(archivedSidur);
                newState.sidurCollection = newState.sidurCollection.filter(s => s.id !== sidurIdToArchive);
            }

        }


        if (!newState.sidurCollection.length) {
            newState.sidurCollection.push(getDefaultSidur(newState));
        }
        if (newState.sidurId === sidurIdToArchive) {
            const chosenSidurAfterArchive: SidurRecord = newState.sidurCollection[0];
            newState.sidurId = chosenSidurAfterArchive.id
            newState = setChosenSidur(newState, chosenSidurAfterArchive);
        }

        return newState
    },
    [ActionsTypes.ADD_NEW_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}

        const newSidurId = Utilities.getNextId(getAllSidurIDs(state))
        const newSidur: SidurRecord = {
            id: newSidurId,
            Name: translations.Sidur + ' ' + newSidurId,
            orders: [],
            deletedOrders: [],
            vehicles: [defaultVehicleValues],
            defaultOrderValues: newState.defaultOrderValues,
            sketches: []
        }
        newState.sidurCollection = newState.sidurCollection.map(c => c);
        newState.sidurCollection.push(newSidur);
        newState.sidurId = newSidurId;
        newState = setChosenSidur(newState, newSidur);
        return newState
    },
    [ActionsTypes.CLONE_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sidurIdToClone = action.payload.id;// newState.sidurId;
        let sidurForCloning: SidurRecord | undefined = newState.sidurCollection.find(s => s.id === sidurIdToClone);

        if (sidurForCloning) {
            const newSidur: SidurRecord = StoreUtils.deepCloneSidur(sidurForCloning);
            newSidur.Name = translations.CopyOf + ' ' + newSidur.Name;
            const newSidurId = Utilities.getNextId(getAllSidurIDs(state));
            newSidur.id = newSidurId
            newState.sidurCollection = newState.sidurCollection.map(c => c);
            newState.sidurCollection.push(newSidur);
            newState.sidurId = newSidurId;
            newState = setChosenSidur(newState, newSidur);
        }

        return newState
    },
    [ActionsTypes.MOVE_TO_ACTIVE_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sidurIdToActivate = action.payload.id;

        let toActivateSidur: SidurRecord | undefined = newState.sidurArchive.find(s => s.id === sidurIdToActivate);
        if (toActivateSidur) {
            toActivateSidur = {...toActivateSidur};

            toActivateSidur.id = StoreUtils.removeIdPrefix(toActivateSidur.id);
            newState.sidurCollection.push(toActivateSidur);
            newState.sidurArchive = newState.sidurArchive.filter(s => s.id !== sidurIdToActivate);
        }


        return newState
    },
    [ActionsTypes.DELETE_FOREVER_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sidurIdToDeleteForever = action.payload.id;
        newState.sidurArchive = newState.sidurArchive.filter(s => s.id !== sidurIdToDeleteForever);
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
const getAllSidurIDs = (state: SidurStore): string[] => {
    const collectionIds = state.sidurCollection.map(o => o.id);
    const ArchiveIdsWithWords = state.sidurArchive.map(o => o.id);

    const ArchiveIds = ArchiveIdsWithWords.map(id => StoreUtils.removeIdPrefix(id))
    return [...ArchiveIds, ...collectionIds]
}

const getDefaultSidur = (state: SidurStore): SidurRecord => {
    const newSidur: SidurRecord = {...DefaultSidur};
    newSidur.id = Utilities.getNextId(getAllSidurIDs(state));
    const allNames = [...state.sidurCollection.map(o => o.Name), ...state.sidurArchive.map(o => o.Name)];
    if (allNames.some(name => name === newSidur.Name)) {
        newSidur.Name = newSidur.Name + ' ' + newSidur.id
    }
    return newSidur

}
