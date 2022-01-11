import {Box} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SidurStore} from '../../store/store.types';
import {LocationGroup} from '../../models/Location.model';
import Button from '@mui/material/Button';
import {translations} from '../../services/translations';
import * as React from 'react';

export const LocationsEdit = () => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.locationGroupInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId)
    const allLocations = currentLocationGroup?.Locations || [];
    const dispatch = useDispatch()

    const handleAddLocation = () => {

    }

    return (<Box>
            <Button variant="contained" onClick={handleAddLocation} aria-label="add" size="large">
                {translations.addLocation}
            </Button>
        </Box>
    )
}
