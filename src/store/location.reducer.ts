import {IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {ActionsTypes} from './types.actions';
import {LocationGroup, LocationModel} from '../models/Location.model';

export type LocationReducerFunctions =
    ActionsTypes.ADD_NEW_LOCATION
// | ActionsTypes.UPDATE_LOCATION
// | ActionsTypes.DELETE_LOCATION


export const LocationReducer: Record<LocationReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.ADD_NEW_LOCATION]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const currentLocationGroupId = newState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            const newId = '1';// Utils.getNextId(getAllOrdersIDs(state))
            const newLocation: LocationModel = {
                ETA: 25,
                EnName: '',
                name: '',
                id: newId
            }
            currentLocationGroup.Locations = [...currentLocationGroup.Locations]
            currentLocationGroup.Locations.push(newLocation);

        }


        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },


}

