import {Box} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SessionModel, SidurStore} from '../../store/store.types';
import {LocationGroup, LocationModel, RouteOrTransport, TransportModel} from '../../models/Location.model';
import {translations} from '../../services/translations';
import * as React from 'react';
import {useState} from 'react';
import {ActionsTypes} from '../../store/types.actions';
import {Styles} from '../../hoc/themes';
import TextField from '@mui/material/TextField';
import {LocationChooseButton} from '../LocationsEdit/location-choose-button';
import Button from '@mui/material/Button';
import {LocationTransportEdit} from './location-transport-edit';
import {LocationRouteTransportChoose} from '../LocationsEdit/location-route-transport-choose';
import {ConfigService} from '../../services/config-service';

export const LocationsTransportEditWrapper = () => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.sessionState.locationGroupInEdit);
    const transportRouteIdInEdit = useSelector((state: SidurStore) => state.sessionState.transportIdInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const locationMainInEdit: string | null = useSelector((state: { sessionState: SessionModel }) => state.sessionState.locationMainInEdit);
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId) as LocationGroup
    const allLocationsFromStore: LocationModel[] = currentLocationGroup?.Locations || [];
    const allTransportRoutes: TransportModel[] = currentLocationGroup?.Transports || [];
    const [filterLocationText, setFilterLocationText] = useState<string>('')
    const [filterRouteText, setFilterRouteText] = useState<string>('')
    const HomeLocation: LocationModel = ConfigService.Constants.HomeLocation;

    const allLocations = [...allLocationsFromStore];
    if (allLocations.length) {
        allLocations.unshift(HomeLocation)
    }

    const dispatch = useDispatch();

    const handleAddRoute = () => {
        setFilterLocationText('')
        dispatch({
            type: ActionsTypes.ADD_NEW_TRANSPORT
        })
    }
    const handleAddLocationToRoute = (location: LocationModel) => {
        dispatch({
            type: ActionsTypes.ADD_LOCATION_TO_TRANSPORT,
            payload: location
        })
    }

    const handleFilterLocationValueChanged = (event: any) => {
        setFilterLocationText(event.target.value);
    }
    const handleFilterRouteValueChanged = (event: any) => {
        if (locationMainInEdit) {
            // handleStopEditLocation(null);
        }
        setFilterRouteText(event.target.value);
    }
    const routeClickedHandler = (routId: string) => {
        if (transportRouteIdInEdit !== routId) {
            dispatch(
                {
                    type: ActionsTypes.START_EDIT_TRANSPORT,
                    payload: {id: routId}
                }
            )
        }
    }

    const transportRoutInEdit: TransportModel | undefined = currentLocationGroup.Transports.find(r => r.id === transportRouteIdInEdit);
    const filteredLocationsBeforeRouteCalc = filterLocationText.trim() === '' ? allLocations.filter(l => l) :
        allLocations.filter(l => l.name.includes(filterLocationText.trim()));
    const routInEditLocations: string [] = transportRoutInEdit ? transportRoutInEdit.TransportStops.map(rs => rs.locationId) : [];

    const filteredLocations = filteredLocationsBeforeRouteCalc.filter(l => !routInEditLocations.includes(l.id));
    filteredLocations.sort((a, b) => +a.id > +b.id ? -1 : 1)


    const filteredRoutes = filterRouteText.trim() === '' ? allTransportRoutes.filter(l => l) :
        allTransportRoutes.filter(l => l.name.includes(filterRouteText.trim()));
    filteredRoutes.sort((a, b) => +a.id > +b.id ? -1 : 1)

    return (<Box sx={{...Styles.flexRow}}>
            <Box sx={{...Styles.flexCol}}>
                <Box sx={{...Styles.flexRow}}>

                    <TextField
                        autoFocus
                        margin="dense"
                        id={'search-location-dialog-text-field'}
                        placeholder={translations.searchLocation}
                        type="text"
                        variant="standard"
                        value={filterLocationText}
                        onChange={(event) => {
                            return handleFilterLocationValueChanged(event);
                        }}

                    />

                </Box>

                <Box sx={{
                    mt: '1em',
                    overflowY: 'auto',
                    maxHeight: '50vh',
                    direction: 'ltr'
                }}>

                    <Box sx={{direction: 'rtl'}} id={'locations-container'}>
                        {filteredLocations.map((l: LocationModel, i: number) =>
                            <Box key={l.id}>

                                <LocationChooseButton    {...l} onClick={handleAddLocationToRoute} key={i}/>
                            </Box>
                        )}
                    </Box>

                </Box>
            </Box>
            <Box sx={{
                ...Styles.flexCol,
                m: '1em',
                mt: '0'
            }}>
                <Box sx={{...Styles.flexRow}}>
                    <Button variant="contained" onClick={handleAddRoute} aria-label="add" size="large">
                        {translations.addTransportRoute}
                    </Button>
                    <Box sx={{
                        width: '20px',
                        height: '30px'
                    }}/>
                    <TextField
                        autoFocus
                        margin="dense"
                        id={'search-location-dialog-text-field'}
                        placeholder={translations.searchTransport}
                        type="text"
                        variant="standard"
                        value={filterRouteText}
                        onChange={(event) => {

                            return handleFilterRouteValueChanged(event);
                        }}

                    />
                </Box>

                <Box sx={{
                    height: '10px',
                    width: '20px'
                }}/>
                {transportRoutInEdit ?
                    <LocationTransportEdit allLocations={allLocations} transportRoute={transportRoutInEdit}/> : null}
            </Box>
            <Box sx={{...Styles.flexCol}}>
                <Box sx={{
                    mt: '1em',
                    overflowY: 'auto',
                    maxHeight: '50vh',
                    direction: 'ltr'
                }}>
                    <Box sx={{direction: 'rtl'}} id={'routes-container'}>
                        {filteredRoutes.map((r: TransportModel) => (
                            <LocationRouteTransportChoose routeOrTransport={RouteOrTransport.Transport} key={r.id} route={r}
                                                          routeClicked={routeClickedHandler}/>))}
                    </Box>
                </Box>
            </Box>

        </Box>
    )
}
