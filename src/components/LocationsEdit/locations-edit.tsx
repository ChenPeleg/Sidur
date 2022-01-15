import {Box} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SessionModel, SidurStore} from '../../store/store.types';
import {LocationGroup, LocationModel} from '../../models/Location.model';
import Button from '@mui/material/Button';
import {translations} from '../../services/translations';
import * as React from 'react';
import {ActionsTypes} from '../../store/types.actions';
import {LocationForm} from './location-form';

export const LocationsEdit = () => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.sessionState.locationGroupInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const sessionState: SessionModel = useSelector((state: { sessionState: SessionModel }) => state.sessionState);
    const locationMainInEdit: string | null = useSelector((state: { sessionState: SessionModel }) => state.sessionState.locationMainInEdit);
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId)
    const allLocations: LocationModel[] = currentLocationGroup?.Locations || [];

    const dispatch = useDispatch();

    const handleAddLocation = () => {
        dispatch({
            type: ActionsTypes.ADD_NEW_LOCATION
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

    const handleLocationUpdate = (updatedLocation: LocationModel) => {
        dispatch({
            type: ActionsTypes.UPDATE_LOCATION,
            payload: updatedLocation
        })
    }

    return (<Box>
            <Button variant="contained" onClick={handleAddLocation} aria-label="add" size="large">
                {translations.addLocation}
            </Button>
            <Box sx={{mt: '1em'}} id={'loactions-container'} onBlur={handleStopEditLocation}>
                {allLocations.map((l: LocationModel, i: number) =>
                    <Box key={i} onClick={(event) => handleStartEditLocation(event, l.id)}>

                        <LocationForm isInEdit={locationMainInEdit === l.id}  {...l} onUpdate={handleLocationUpdate} key={i}/>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
