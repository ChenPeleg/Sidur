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
import {LocationRouteEdit, RouteEditAction} from './location-route-edit';

export const LocationsRoutesEditWrapper = () => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.sessionState.locationGroupInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const locationMainInEdit: string | null = useSelector((state: { sessionState: SessionModel }) => state.sessionState.locationMainInEdit);
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId)
    const allLocations: LocationModel[] = currentLocationGroup?.Locations || [];
    const [filterLocationText, setFilterLocationText] = useState<string>('')
    const [filterRouteText, setFilterRouteText] = useState<string>('')
    const RouteIdInEdit: string | null = useSelector((state: { sessionState: SessionModel }) => state.sessionState.routeIdInEdit);
    const dispatch = useDispatch();

    const handleAddLocation = () => {
        setFilterLocationText('')
        dispatch({
            type: ActionsTypes.ADD_NEW_ROUTE
        })
    }

    const handleStartEditLocation = (event: any, id: string) => {
        if (locationMainInEdit === id) {
            return
        }
        dispatch({
            type: ActionsTypes.START_EDIT_LOCATION,
            payload: {
                id
            }
        })
    }
    const handleStopEditLocation = (event: any) => {


        dispatch({
            type: ActionsTypes.STOP_EDIT_LOCATION,
            payload: null
        })
    }

    const handleLocationAdd = (updatedLocation: LocationModel) => {
        dispatch({
            type: ActionsTypes.ADD_LOCATION_TO_ROUTE,
            payload: updatedLocation
        })
    }
    const handleFilterLocationValueChanged = (event: any) => {
        if (locationMainInEdit) {
            handleStopEditLocation(null);
        }
        setFilterLocationText(event.target.value);
    }
    const handleFilterRouteValueChanged = (event: any) => {
        if (locationMainInEdit) {
            // handleStopEditLocation(null);
        }
        setFilterRouteText(event.target.value);
    }
    const routeEditAction = (updatedRout: RouteModel, actionType: RouteEditAction) => {

    }
    const filteredLocations = filterLocationText.trim() === '' ? allLocations.filter(l => l) :
        allLocations.filter(l => l.name.includes(filterLocationText.trim()));
    filteredLocations.sort((a, b) => +a.id > +b.id ? -1 : 1)
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

                    <Box sx={{direction: 'rtl'}} id={'loactions-container'} onBlur={handleStopEditLocation}>
                        {filteredLocations.map((l: LocationModel, i: number) =>
                            <Box key={l.id} onClick={(event) => handleStartEditLocation(event, l.id)}>

                                <LocationChooseButton    {...l} onClick={handleLocationAdd} key={i}/>
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
                    <Button variant="contained" onClick={handleAddLocation} aria-label="add" size="large">
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
                        value={filterLocationText}
                        onChange={(event) => {

                            return handleFilterLocationValueChanged(event);
                        }}

                    />
                </Box>

                <Box sx={{
                    height: '10px',
                    width: '20px'
                }}/>
                {currentLocationGroup?.Routes[0] ?
                    <LocationRouteEdit route={currentLocationGroup.Routes[0]} routeEditActon={routeEditAction}/> : null}
            </Box>

        </Box>
    )
}
