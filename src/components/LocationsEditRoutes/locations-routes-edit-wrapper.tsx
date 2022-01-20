import {Box} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SessionModel, SidurStore} from '../../store/store.types';
import {LocationGroup, LocationModel, RouteModel} from '../../models/Location.model';
import {translations} from '../../services/translations';
import * as React from 'react';
import {useState} from 'react';
import {ActionsTypes} from '../../store/types.actions';
import {Styles} from '../../hoc/themes';
import TextField from '@mui/material/TextField';
import {LocationChooseButton} from './location-choose-button';
import Button from '@mui/material/Button';
import {LocationRouteEdit} from './location-route-edit';
import {LocationRouteChooseRoute} from './location-route-choose-route';

export const LocationsRoutesEditWrapper = () => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.sessionState.locationGroupInEdit);
    const routeIdInEdit = useSelector((state: SidurStore) => state.sessionState.routeIdInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const locationMainInEdit: string | null = useSelector((state: { sessionState: SessionModel }) => state.sessionState.locationMainInEdit);
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId) as LocationGroup
    const allLocations: LocationModel[] = currentLocationGroup?.Locations || [];
    const allRoutes: RouteModel[] = currentLocationGroup?.Routes || [];

    const [filterLocationText, setFilterLocationText] = useState<string>('')
    const [filterRouteText, setFilterRouteText] = useState<string>('')

    const dispatch = useDispatch();

    const handleAddRoute = () => {
        setFilterLocationText('')
        dispatch({
            type: ActionsTypes.ADD_NEW_ROUTE
        })
    }
    const handleAddLocationToRoute = (location: LocationModel) => {
        dispatch({
            type: ActionsTypes.ADD_LOCATION_TO_ROUTE,
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
        if (routeIdInEdit !== routId) {
            dispatch(
                {
                    type: ActionsTypes.START_EDIT_ROUTE,
                    payload: {id: routId}
                }
            )
        }
    }

    const routInEdit: RouteModel | undefined = currentLocationGroup.Routes.find(r => r.id === routeIdInEdit);
    const filteredLocationsBeforeRouteCalc = filterLocationText.trim() === '' ? allLocations.filter(l => l) :
        allLocations.filter(l => l.name.includes(filterLocationText.trim()));
    const routInEditLocations: string [] = routInEdit ? routInEdit.routStops.map(rs => rs.locationId) : [];

    const filteredLocations = filteredLocationsBeforeRouteCalc.filter(l => !routInEditLocations.includes(l.id));
    filteredLocations.sort((a, b) => +a.id > +b.id ? -1 : 1)


    const filteredRoutes = filterRouteText.trim() === '' ? allRoutes.filter(l => l) :
        allRoutes.filter(l => l.name.includes(filterRouteText.trim()));
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
                        {translations.addRoute}
                    </Button>
                    <Box sx={{
                        width: '20px',
                        height: '30px'
                    }}/>
                    <TextField
                        autoFocus
                        margin="dense"
                        id={'search-location-dialog-text-field'}
                        placeholder={translations.searchRoute}
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
                {routInEdit ?
                    <LocationRouteEdit allLocations={allLocations} route={routInEdit}/> : null}
            </Box>
            <Box sx={{...Styles.flexCol}}>
                <Box sx={{
                    mt: '1em',
                    overflowY: 'auto',
                    maxHeight: '50vh',
                    direction: 'ltr'
                }}>
                    <Box sx={{direction: 'rtl'}} id={'routes-container'}>
                        {filteredRoutes.map((r: RouteModel) => (
                            <LocationRouteChooseRoute key={r.id} route={r} routeClicked={routeClickedHandler}/>))}
                    </Box>
                </Box>
            </Box>

        </Box>
    )
}
