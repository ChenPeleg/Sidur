import {defaultOrderValues, IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {OrderModel} from '../models/Order.model';
import {ActionsTypes} from './types.actions';
import {LocationGroup} from '../models/Location.model';

export type LocationReducerFunctions =
    ActionsTypes.NEW_LOCATION
// | ActionsTypes.UPDATE_LOCATION
// | ActionsTypes.DELETE_LOCATION


export const LocationReducer: Record<LocationReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.NEW_LOCATION]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const currentLocationGroupId = newState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);

        const newId = '1';// Utils.getNextId(getAllOrdersIDs(state))
        const newOrder: OrderModel = {
            ...defaultOrderValues,
            id: newId
        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },


}

