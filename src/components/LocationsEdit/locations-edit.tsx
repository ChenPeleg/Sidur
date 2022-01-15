import {Box} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SessionModel, SidurStore} from '../../store/store.types';
import {LocationGroup, LocationModel} from '../../models/Location.model';
import Button from '@mui/material/Button';
import {translations} from '../../services/translations';
import * as React from 'react';
import {useState} from 'react';
import {ActionsTypes} from '../../store/types.actions';
import {LocationForm} from './location-form';
import {Styles} from '../../hoc/themes';
import TextField from '@mui/material/TextField';

export const LocationsEdit = () => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.sessionState.locationGroupInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const sessionState: SessionModel = useSelector((state: { sessionState: SessionModel }) => state.sessionState);
    const locationMainInEdit: string | null = useSelector((state: { sessionState: SessionModel }) => state.sessionState.locationMainInEdit);
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId)
    const allLocations: LocationModel[] = currentLocationGroup?.Locations || [];
    const [filterText, setFilterText] = useState<string>('')
    const dispatch = useDispatch();

    const handleAddLocation = () => {
        setFilterText('')
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
    const handleFilterValueChanged = (event: any) => {
        if (locationMainInEdit) {
            handleStopEditLocation(null);
        }
        setFilterText(event.target.value);
    }
    const filteredLocations = filterText.trim() === '' ? allLocations.filter(l => l) :
        allLocations.filter(l => l.name.includes(filterText.trim()));
    filteredLocations.sort((a, b) => +a.id > +b.id ? -1 : 1)
    return (<Box>
            <Box sx={{...Styles.flexRow}}>
                <Button variant="contained" onClick={handleAddLocation} aria-label="add" size="large">
                    {translations.addLocation}
                </Button>
                <Box sx={{
                    width: '20px',
                    height: '30px'
                }}>

                </Box>
                <TextField
                    autoFocus
                    margin="dense"
                    id={'search-location-dialog-text-field'}
                    placeholder={translations.searchLocation}
                    type="text"
                    variant="standard"
                    value={filterText}
                    onChange={(event) => {

                        return handleFilterValueChanged(event);
                    }}
                    // onKeyUp={(event) => {
                    //     if (event.key === 'Enter') {
                    //         //   handleCloseRename()
                    //     }
                    // }}
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

                            <LocationForm isInEdit={locationMainInEdit === l.id}  {...l} onUpdate={handleLocationUpdate} key={i}/>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    )
}
