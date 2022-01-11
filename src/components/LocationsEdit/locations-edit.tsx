import {Box} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SidurStore} from '../../store/store.types';
import {LocationGroup, LocationModel} from '../../models/Location.model';
import Button from '@mui/material/Button';
import {translations} from '../../services/translations';
import * as React from 'react';
import {ActionsTypes} from '../../store/types.actions';
import {LocationForm} from './location-form';

export const LocationsEdit = () => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.locationGroupInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId)
    const allLocations: LocationModel[] = currentLocationGroup?.Locations || [];
    console.log(currentLocationGroup)
    const dispatch = useDispatch();

    const handleAddLocation = () => {
        dispatch({
            type: ActionsTypes.ADD_NEW_LOCATION
        })
    }

    return (<Box>
            <Button variant="contained" onClick={handleAddLocation} aria-label="add" size="large">
                {translations.addLocation}
            </Button>
            <Box id={'loactions-container'}>
                {allLocations.map((l: LocationModel, i: number) =>
                    <LocationForm {...l} onChange={(e): void => {
                        
                    }} key={i}/>
                )}
            </Box>
        </Box>
    )
}
