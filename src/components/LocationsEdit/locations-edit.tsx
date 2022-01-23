import {Box} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {RecordBriefModel, SessionModel, SidurStore, TypeOfRecord} from '../../store/store.types';
import {LocationGroup, LocationModel} from '../../models/Location.model';
import Button from '@mui/material/Button';
import {translations} from '../../services/translations';
import * as React from 'react';
import {useState} from 'react';
import {ActionsTypes} from '../../store/types.actions';
import {LocationForm} from './location-form';
import {Styles} from '../../hoc/themes';
import TextField from '@mui/material/TextField';

type deleteButtonStatus = 'active' | 'missing' | 'warning'

interface LocationWithUses extends LocationModel {
    usedIn: string[]
}

export const LocationsEdit = () => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.sessionState.locationGroupInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const sessionState: SessionModel = useSelector((state: { sessionState: SessionModel }) => state.sessionState);
    const locationMainInEdit: string | null = useSelector((state: { sessionState: SessionModel }) => state.sessionState.locationMainInEdit);
    const recordBriefs: RecordBriefModel [] = useSelector((state: { recordBriefs: RecordBriefModel[] }) => state.recordBriefs);

    const isLocationInSidur: RecordBriefModel [] | [] = recordBriefs.filter(lb => lb.typeOfRecord === TypeOfRecord.Sidur && lb.locationGroupOrSidurId === locationGroupInEditId);
    const currentLocationGroup: LocationGroup = locationGroups.find(l => l.id === locationGroupInEditId) as LocationGroup
    const allRawLocations: LocationModel[] = currentLocationGroup?.Locations || [];
    const routeStopsWithLocations = currentLocationGroup.Routes.map(r => {
        return {
            name: r.name,
            locations: r.routStops.map(rs => rs.locationId)
        }
    })
    const transportsWithLocations = currentLocationGroup.Transports.map(r => {
        return {
            name: r.name,
            locations: r.TransportStops.map(rs => rs.locationId)
        }
    })
    const allLocations: LocationWithUses[] = allRawLocations.map(l => {
            const usesRoutes = routeStopsWithLocations.filter(s => s.locations.includes(l.id)).map(s => s.name)
            const usesTransports = transportsWithLocations.filter(s => s.locations.includes(l.id)).map(s => s.name)
            return {
                ...l,
                usedIn: usesRoutes.concat(usesTransports)
            }
        }
    );
   
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
                    {filteredLocations.map((l: LocationWithUses, i: number) =>
                        <Box key={l.id} onClick={(event) => handleStartEditLocation(event, l.id)}>

                            <LocationForm preventDelete={isLocationInSidur.length > 0} isInEdit={locationMainInEdit === l.id}  {...l}
                                          onUpdate={handleLocationUpdate} key={i}/>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    )
}
