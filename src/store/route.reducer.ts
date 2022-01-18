import {IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {ActionsTypes} from './types.actions';
import {Utils} from '../services/utils';
import {translations} from '../services/translations';
import {LocationGroup, RouteModel} from '../models/Location.model';

export type RouteReducerFunctions =
    ActionsTypes.ADD_NEW_ROUTE
    | ActionsTypes.START_EDIT_ROUTE
    | ActionsTypes.STOP_EDIT_ROUTE
    | ActionsTypes.UPDATE_ROUTE
    | ActionsTypes.DELETE_ROUTE
    | ActionsTypes.ADD_LOCATION_TO_ROUTE


export const RouteReducer: Record<RouteReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.ADD_NEW_ROUTE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);

        if (currentLocationGroup) {
            currentLocationGroup.Routes = currentLocationGroup.Routes || [];
            const newId = Utils.getNextId(currentLocationGroup.Routes.map(l => l.id))
            const name = translations.Route + ' ' + newId.toString();
            const newRoute: RouteModel = {
                name: name,
                id: newId,
                comments: '',
                routStops: []
            }
            currentLocationGroup.Routes = [...currentLocationGroup.Routes]
            currentLocationGroup.Routes.push(newRoute);

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
    [ActionsTypes.ADD_LOCATION_TO_ROUTE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            const newId = Utils.getNextId(currentLocationGroup.Routes.map(l => l.id))
            const name = translations.Route + ' ' + newId.toString();
            const newRoute: RouteModel = {
                name: name,
                id: newId,
                comments: '',
                routStops: []
            }
            currentLocationGroup.Routes = [...currentLocationGroup.Routes]
            currentLocationGroup.Routes.push(newRoute);

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
    [ActionsTypes.START_EDIT_ROUTE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const locationId = action.payload.id
        newState.sessionState.locationMainInEdit = locationId;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            const location = currentLocationGroup.Routes.find(l => l.id === locationId);
            if (location) {
                newState.sessionState.locationMainInEdit = locationId;

            }


        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.STOP_EDIT_ROUTE]: (state: SidurStore, action: IAction): SidurStore => {
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

    [ActionsTypes.UPDATE_ROUTE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const routeToUpdate = action.payload;
        // newState.sessionState.locationMainInEdit = locationId;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup && routeToUpdate) {
            currentLocationGroup.Routes =
                currentLocationGroup.Routes.map(l => {
                    if (l.id === routeToUpdate.id) {
                        return routeToUpdate
                    }
                    return l
                })

        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

    [ActionsTypes.DELETE_ROUTE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const locationToDeleteId = action.payload.id;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            currentLocationGroup.Routes =
                currentLocationGroup.Routes.filter(l => l.id !== locationToDeleteId);
            newState.LocationGroups = newState.LocationGroups.map(l => l.id === currentLocationGroup.id ? currentLocationGroup : l)
        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

}

