import {IAction, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {ActionsTypes} from './types.actions';
import {Utils} from '../services/utils';
import {translations} from '../services/translations';
import {LocationGroup, LocationModel, RoadStopModel, TransportModel} from '../models/Location.model';

export type TransportReducerFunctions =
    ActionsTypes.ADD_NEW_TRANSPORT
    | ActionsTypes.START_EDIT_TRANSPORT
    | ActionsTypes.STOP_EDIT_TRANSPORT
    | ActionsTypes.UPDATE_TRANSPORT
    | ActionsTypes.DELETE_TRANSPORT
    | ActionsTypes.ADD_LOCATION_TO_TRANSPORT
    | ActionsTypes.CLONE_TRANSPORT


export const TransportReducer: Record<TransportReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.ADD_NEW_TRANSPORT]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);

        if (currentLocationGroup) {
            currentLocationGroup.Transports = currentLocationGroup.Transports || [];
            const newId = Utils.getNextId(currentLocationGroup.Transports.map(l => l.id))
            const name = translations.Route + ' ' + newId.toString();
            const newTransport: TransportModel = {
                name: name,
                id: newId,
                comments: '',
                TransportStops: [],
                TransportTime: []
            }
            newTransport.name = buildTransportName(newTransport, currentLocationGroup.Locations)

            currentLocationGroup.Transports = [...currentLocationGroup.Transports]
            currentLocationGroup.Transports.push(newTransport);
            newState.sessionState.transportIdInEdit = newId;
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
    [ActionsTypes.ADD_LOCATION_TO_TRANSPORT]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const locationToAdd = action.payload;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup && locationToAdd) {
            const transportIdInEdit = newState.sessionState.transportIdInEdit;
            const transportInEdit: TransportModel | undefined = currentLocationGroup.Transports.find(r => r.id === transportIdInEdit);
            if (transportInEdit) {
                const isNameAutoBuild = transportInEdit.name === buildTransportName(transportInEdit, currentLocationGroup.Locations)
                const allPositions = transportInEdit.TransportStops.map(s => s.position);
                allPositions.push(0)
                const maxPosition = Math.max(...allPositions)

                const transportStop: RoadStopModel = {
                    locationId: locationToAdd.id,
                    minuetsFromLast: 20,
                    position: maxPosition + 1
                }
                transportInEdit.TransportStops.push(transportStop);
                if (isNameAutoBuild) {
                    transportInEdit.name = buildTransportName(transportInEdit, currentLocationGroup.Locations)
                }
                currentLocationGroup.Transports = currentLocationGroup.Transports.map(r => r.id === transportInEdit.id ? transportInEdit : r);

                newState.LocationGroups = (newState.LocationGroups || []).map(g => {
                    if (g.id === currentLocationGroup.id) {
                        return currentLocationGroup
                    }
                    return g
                })
            }
            // currentLocationGroup.Transports.push(newTransport);


        }


        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.START_EDIT_TRANSPORT]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const transportId = action.payload.id
        newState.sessionState.locationMainInEdit = transportId;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            const transport = currentLocationGroup.Transports.find(l => l.id === transportId);
            if (transport) {
                newState.sessionState.transportIdInEdit = transportId;

            }


        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.STOP_EDIT_TRANSPORT]: (state: SidurStore, action: IAction): SidurStore => {
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

    [ActionsTypes.UPDATE_TRANSPORT]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const transportToUpdate = action.payload;
        // newState.sessionState.locationMainInEdit = locationId;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup && transportToUpdate) {
            const routBeforeUpdate = currentLocationGroup.Transports.find(r => r.id === transportToUpdate.id) as TransportModel;

            const isNameAutoBuild = routBeforeUpdate.name === buildTransportName(routBeforeUpdate, currentLocationGroup.Locations);

            if (isNameAutoBuild && routBeforeUpdate.name === transportToUpdate.name) {
                transportToUpdate.name = buildTransportName(transportToUpdate, currentLocationGroup.Locations)
            }
            currentLocationGroup.Transports =
                currentLocationGroup.Transports.map(l => {
                    if (l.id === transportToUpdate.id) {
                        return transportToUpdate
                    }
                    return l
                })
            newState.LocationGroups = newState.LocationGroups.map(lg => lg.id === currentLocationGroup.id ? currentLocationGroup : lg)

        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },

    [ActionsTypes.DELETE_TRANSPORT]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const transportToDeleteId = action.payload.id;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            currentLocationGroup.Transports =
                currentLocationGroup.Transports.filter(l => l.id !== transportToDeleteId);
            newState.LocationGroups = newState.LocationGroups.map(l => l.id === currentLocationGroup.id ? currentLocationGroup : l)
        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },
    [ActionsTypes.CLONE_TRANSPORT]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const transportToCloneId = action.payload.id;
        const currentLocationGroupId = newState.sessionState.locationGroupInEdit;
        const currentLocationGroup: LocationGroup | undefined = newState.LocationGroups?.find(l => l.id === currentLocationGroupId);
        if (currentLocationGroup) {
            const transportToClone: TransportModel | undefined = currentLocationGroup.Transports.find(r => r.id === transportToCloneId);

            if (transportToClone) {
                const newTransport = {...transportToClone};
                const newId = Utils.getNextId(currentLocationGroup.Transports.map(l => l.id));
                newTransport.id = newId;
                newTransport.TransportStops = newTransport.TransportStops.map(rs => ({...rs}));
                newTransport.name = buildTransportName(newTransport, currentLocationGroup.Locations)
                currentLocationGroup.Transports =
                    currentLocationGroup.Transports.map(l => l);
                currentLocationGroup.Transports.push(newTransport);
                newState.LocationGroups = newState.LocationGroups.map(l => l.id === currentLocationGroup.id ? currentLocationGroup : l)
            }


        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState
    },


}
const buildTransportName = (transport: TransportModel, locations: LocationModel[]): string => {
    if (transport.TransportStops.length === 0) {
        return translations.newTransport + ' ' + transport.id.toString();
    } else if (transport.TransportStops.length === 1) {
        return translations.newTransport + ' ' + transport.id.toString() + ' - ' + getLocationName(transport.TransportStops[0].locationId, locations);
    } else if (transport.TransportStops.length > 1 && transport.TransportStops.length < 4) {
        return transport.TransportStops.map(s => getLocationName(s.locationId, locations)).join(' - ')
    } else {
        return transport.TransportStops.map(s => getLocationName(s.locationId, locations)).filter((l, i) => (i == 0 || (i + 2) > transport.TransportStops.length) || Math.floor(transport.TransportStops.length / 2) === i).join(' - ')
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


