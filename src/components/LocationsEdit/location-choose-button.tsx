import {Box, Card} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SidurStore} from '../../store/store.types';
import {LocationGroup, LocationModel} from '../../models/Location.model';
import * as React from 'react';
import {useState} from 'react';

interface LocationFormProps extends LocationModel {
    onUpdate: (locationUpdate: LocationModel) => void,
}

export const LocationChooseButton = (props: LocationFormProps) => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.sessionState.locationGroupInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId)
    const [wasJustEdited, setWasJustEdited] = useState<boolean>(false)
    const dispatch = useDispatch();


    return (

        <Box sx={{display: 'flex'}}>
            <Card elevation={2} sx={{
                m: '0.2em',
                mb: '0.3em',
                minWidth: '200px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'start',
            }}>
                <Box id={'text-field-container'}
                     sx={{
                         m: '0.5em',
                         mr: '1em',
                         ml: '1em',
                     }
                     }>

                    {props.name}

                </Box>


            </Card>
        </Box>
    )
}
