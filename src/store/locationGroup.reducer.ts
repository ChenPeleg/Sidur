import {ActionsTypes} from './types.actions';


import {IAction, SidurStore} from './store.types';
import {Utils} from '../services/utils';
import {StoreUtils} from './store-utils';

export type LocationGroupReducerFunctions =
    ActionsTypes.UPDATE_LOCATION_GROUP |
    ActionsTypes.DELETE_LOCATION_GROUP |
    ActionsTypes.NEW_LOCATION_GROUP
    | ActionsTypes.CLONE_LOCATION_GROUP
    | ActionsTypes.RENAME_LOCATION_GROUP
    | ActionsTypes.CHOOSE_LOCATION_GROUP
    | ActionsTypes.CHOOSE_LOCATION_GROUP_TAB


export const LocationGroupReducer: Record<LocationGroupReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.UPDATE_LOCATION_GROUP]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        if (!newState.LocationGroups) {
            newState.LocationGroups = [];
        }


        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.DELETE_LOCATION_GROUP]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const groupToDeleteId = action.payload.id;
        if (!newState.LocationGroups) {
            newState.LocationGroups = [];
        } else {

            newState.LocationGroups = newState.LocationGroups.filter(l => l.id !== groupToDeleteId)
        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.NEW_LOCATION_GROUP]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        if (!newState.LocationGroups) {
            newState.LocationGroups = [];
        }
        const newId = Utils.getNextId(newState.LocationGroups.map(l => l.id))
        newState.LocationGroups = [...newState.LocationGroups];
        newState.LocationGroups.push({
            name: 'בסיס סידור ' + newId,
            id: newId,
            Locations: []
        })
        StoreUtils.HandleReducerSaveToLocalStorage(newState);

        newState.locationGroupInEdit = newId

        return newState
    },
    [ActionsTypes.CHOOSE_LOCATION_GROUP]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const groupIdWasChosen = action.payload.id;
        newState.locationGroupInEdit = groupIdWasChosen;
        StoreUtils.HandleReducerSaveToLocalStorage(newState);

        return newState
    },
    [ActionsTypes.CHOOSE_LOCATION_GROUP_TAB]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const tabWasChosen = action.payload.id;
        if (!newState.currentSessionState) {
            newState.currentSessionState = {
                LocationGroupTabOpen: null,
                SketchIdInEdit: null,
                dataHolderForCurrentOrderInEdit: null,
                locationGroupInEdit: null,
                orderIdInEdit: null,
                pendingOrderIdInEdit: null,
                isAnimationRunning: true
            };
        }
        newState.currentSessionState = {...newState.currentSessionState};
        newState.currentSessionState.LocationGroupTabOpen = tabWasChosen;
        StoreUtils.HandleReducerSaveToLocalStorage(newState);

        return newState
    },
    [ActionsTypes.CLONE_LOCATION_GROUP]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        if (!newState.LocationGroups) {
            newState.LocationGroups = [];
        }
        StoreUtils.HandleReducerSaveToLocalStorage(newState);

        return newState
    },
    [ActionsTypes.RENAME_LOCATION_GROUP]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        if (!newState.LocationGroups) {
            newState.LocationGroups = [];
        }

        const groupToRenameId = action.payload.id;
        const newName = action.payload.value;

        newState.LocationGroups = newState.LocationGroups.map(l => {
            if (l.id === groupToRenameId) {
                const newLG = {...l};
                newLG.name = newName;
                return newLG
            } else {
                return l
            }

        })
        console.log(newState.LocationGroups)
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },


}


