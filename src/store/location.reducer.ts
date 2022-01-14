import {IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {ActionsTypes} from './types.actions';
import {LocationGroup, LocationModel} from '../models/Location.model';
import {Utils} from '../services/utils';
import {translations} from '../services/translations';

export type LocationReducerFunctions =
    ActionsTypes.ADD_NEW_LOCATION | ActionsTypes.START_EDIT_LOCATION | ActionsTypes.STOP_EDIT_LOCATION | ActionsTypes.UPDATE_LOCATION
// | ActionsTypes.DELETE_LOCATION


export const LocationReducer: Record<LocationReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.ADD_NEW_LOCATION]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            const newId = Utils.getNextId(currentLocationGroup.Locations.map(l => l.id))
            const name = translations.Locations + ' ' + newId.toString();
            const newLocation: LocationModel = {
                ETA: 25,
                EnName: '',
                name: name,
                id: newId
            }
            currentLocationGroup.Locations = [...currentLocationGroup.Locations]
            currentLocationGroup.Locations.push(newLocation);

            newState.LocationGroups = (newState.LocationGroups || []).map(g => {
                if (g.id === currentLocationGroup.id) {
                    return currentLocationGroup
                }
                return g
            })
        }


        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.START_EDIT_LOCATION]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const locationId = action.payload.id
        newState.sessionState.locationMainInEdit = locationId;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            const location = currentLocationGroup.Locations.find(l => l.id === locationId);
            if (location) {
                newState.sessionState.locationMainInEdit = locationId;

            }


        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.STOP_EDIT_LOCATION]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        // newState.sessionState.locationMainInEdit = locationId;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {

            newState.sessionState.locationMainInEdit = null;


        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

    [ActionsTypes.UPDATE_LOCATION]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const locationToUpdate = action.payload;
        // newState.sessionState.locationMainInEdit = locationId;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup && locationToUpdate) {
            currentLocationGroup.Locations =
                currentLocationGroup.Locations.map(l => {
                    if (l.id === locationToUpdate.id) {
                        return locationToUpdate
                    }
                    return l
                })

        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

}

