import {Box, Card, CardContent} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SidurStore} from '../../store/store.types';
import {LocationGroup, LocationModel} from '../../models/Location.model';
import * as React from 'react';
import {useRef} from 'react';
import TextField from '@mui/material/TextField';
import {translations} from '../../services/translations';

interface LocationFormProps extends LocationModel {
    onChange: (e: any) => void
}

export const LocationForm = (props: LocationFormProps) => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.locationGroupInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId)
    const allLocations = currentLocationGroup?.Locations || [];
    const dispatch = useDispatch();
    const valueRef: any = useRef('')
    const handleAddLocation = () => {

    }

    return (

        <Box sx={{display: 'flex'}}>
            <Card elevation={2} sx={{
                m: '0.2em',
                mb: '0.3em',

                minHeight: '8vh',
                minWidth: '40vw',
                maxWidth: '50vw',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'start',
            }}>
                <CardContent sx={{
                    p: '5px',
                    m: 0
                }}>


                    <TextField
                        autoFocus
                        margin="dense"
                        id={'sidur-rename-dialog-text-field'}
                        label={translations.NewName}
                        type="text"
                        variant="standard"
                        defaultValue={props.name}
                        inputRef={valueRef}
                        onKeyUp={(event) => {
                            if (event.key === 'Enter') {
                                //  handleCloseRename()
                            }
                        }}
                    />

                </CardContent>
            </Card>
        </Box>
    )
}
