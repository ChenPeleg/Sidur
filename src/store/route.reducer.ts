import {IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {ActionsTypes} from './types.actions';
import {Utils} from '../services/utils';
import {translations} from '../services/translations';
import {LocationGroup, LocationModel, RoadStopModel, RouteModel} from '../models/Location.model';

export type RouteReducerFunctions =
    ActionsTypes.ADD_NEW_ROUTE
    | ActionsTypes.START_EDIT_ROUTE
    | ActionsTypes.STOP_EDIT_ROUTE
    | ActionsTypes.UPDATE_ROUTE
    | ActionsTypes.DELETE_ROUTE
    | ActionsTypes.ADD_LOCATION_TO_ROUTE
    | ActionsTypes.CLONE_ROUTE


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
            newRoute.name = buildRouteName(newRoute, currentLocationGroup.Locations)

            currentLocationGroup.Routes = [...currentLocationGroup.Routes]
            currentLocationGroup.Routes.push(newRoute);
            newState.sessionState.routeIdInEdit = newId;
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
        const locationToAdd = action.payload;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup && locationToAdd) {
            const routeIdInEdit = newState.sessionState.routeIdInEdit;
            const routeInEdit: RouteModel | undefined = currentLocationGroup.Routes.find(r => r.id === routeIdInEdit);
            if (routeInEdit) {
                const isNameAutoBuild = routeInEdit.name === buildRouteName(routeInEdit, currentLocationGroup.Locations)
                const allPositions = routeInEdit.routStops.map(s => s.position);
                allPositions.push(0)
                const maxPosition = Math.max(...allPositions)

                const routeStop: RoadStopModel = {
                    locationId: locationToAdd.id,
                    minuetsFromLast: 20,
                    position: maxPosition + 1
                }
                routeInEdit.routStops.push(routeStop);
                if (isNameAutoBuild) {
                    routeInEdit.name = buildRouteName(routeInEdit, currentLocationGroup.Locations)
                }
                currentLocationGroup.Routes = currentLocationGroup.Routes.map(r => r.id === routeInEdit.id ? routeInEdit : r);

                newState.LocationGroups = (newState.LocationGroups || []).map(g => {
                    if (g.id === currentLocationGroup.id) {
                        return currentLocationGroup
                    }
                    return g
                })
            }
            // currentLocationGroup.Routes.push(newRoute);


        }


        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.START_EDIT_ROUTE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const routId = action.payload.id
        newState.sessionState.locationMainInEdit = routId;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            const route = currentLocationGroup.Routes.find(l => l.id === routId);
            if (route) {
                newState.sessionState.routeIdInEdit = routId;

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
            const routBeforeUpdate = currentLocationGroup.Routes.find(r => r.id === routeToUpdate.id) as RouteModel;

            const isNameAutoBuild = routBeforeUpdate.name === buildRouteName(routBeforeUpdate, currentLocationGroup.Locations);

            if (isNameAutoBuild && routBeforeUpdate.name === routeToUpdate.name) {
                routeToUpdate.name = buildRouteName(routeToUpdate, currentLocationGroup.Locations)
            }
            currentLocationGroup.Routes =
                currentLocationGroup.Routes.map(l => {
                    if (l.id === routeToUpdate.id) {
                        return routeToUpdate
                    }
                    return l
                })
            newState.LocationGroups = newState.LocationGroups.map(lg => lg.id === currentLocationGroup.id ? currentLocationGroup : lg)

        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

    [ActionsTypes.DELETE_ROUTE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const routeToDeleteId = action.payload.id;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            currentLocationGroup.Routes =
                currentLocationGroup.Routes.filter(l => l.id !== routeToDeleteId);
            newState.LocationGroups = newState.LocationGroups.map(l => l.id === currentLocationGroup.id ? currentLocationGroup : l)
        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.CLONE_ROUTE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const routeToCloneId = action.payload.id;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            const routeToClone: RouteModel | undefined = currentLocationGroup.Routes.find(r => r.id === routeToCloneId);

            if (routeToClone) {
                const newRoute = {...routeToClone};
                const newId = Utils.getNextId(currentLocationGroup.Routes.map(l => l.id));
                newRoute.id = newId;
                newRoute.routStops = newRoute.routStops.map(rs => ({...rs}));
                newRoute.name = buildRouteName(newRoute, currentLocationGroup.Locations)
                currentLocationGroup.Routes =
                    currentLocationGroup.Routes.map(l => l);
                currentLocationGroup.Routes.push(newRoute);
                newState.LocationGroups = newState.LocationGroups.map(l => l.id === currentLocationGroup.id ? currentLocationGroup : l)
            }


        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },


}
const buildRouteName = (route: RouteModel, locations: LocationModel[]): string => {
    if (route.routStops.length === 0) {
        return translations.newRoute + ' ' + route.id.toString();
    } else if (route.routStops.length === 1) {
        return translations.newRoute + ' ' + route.id.toString() + ' - ' + getLocationName(route.routStops[0].locationId, locations);
    } else if (route.routStops.length > 1 && route.routStops.length < 4) {
        return route.routStops.map(s => getLocationName(s.locationId, locations)).join(' - ')
    } else {
        return route.routStops.map(s => getLocationName(s.locationId, locations)).filter((l, i) => (i == 0 || (i + 2) > route.routStops.length) || Math.floor(route.routStops.length / 2) === i).join(' - ')
    }
    return ''


}
const getLocationName = (id: string, locations: LocationModel[]): string => {
    let name = ' ';
    locations.forEach((l: LocationModel) => {
        if (l.id === id) {
            name = l.name;
        }
    })
    return name
}


