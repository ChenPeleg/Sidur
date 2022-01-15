import {Box, Card, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SidurStore} from '../../store/store.types';
import {LocationGroup, LocationModel} from '../../models/Location.model';
import * as React from 'react';
import {useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import {translations} from '../../services/translations';

interface LocationFormProps extends LocationModel {
    onUpdate: (locationUpdate: LocationModel) => void,
    isInEdit: boolean
}

export const LocationForm = (props: LocationFormProps) => {
    const locationGroupInEditId = useSelector((state: SidurStore) => state.sessionState.locationGroupInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId)
    const [wasJustEdited, setWasJustEdited] = useState<boolean>(false)
    const [nameValue, setNameValue] = useState<string>(props.name)
    const [etaValue, setEtaValue] = useState<number>(props.ETA);
    const dispatch = useDispatch();
    const valueNameRef: any = useRef('');
    const valueMinutesRef: any = useRef('');

    if (wasJustEdited && !props.isInEdit) {
        setWasJustEdited(false);
        const id = props.id;
        const updatedLocation: LocationModel = {
            id: props.id,
            ETA: props.ETA,
            name: props.name,
            EnName: props.EnName
        };
        const refName = valueNameRef.current.value;
        const refMinutes = valueMinutesRef.current.value;

        updatedLocation.name = refName || updatedLocation.name;
        updatedLocation.ETA = refMinutes || updatedLocation.ETA;

        props.onUpdate(updatedLocation);
    }
    const handleAddLocation = () => {

    }

    return (

        <Box sx={{display: 'flex'}}>
            <Card elevation={2} sx={{
                m: '0.2em',
                mb: '0.3em',

                //
                // minHeight: '8vh',
                // minWidth: '50vw',
                // maxWidth: '70vw',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'start',
            }}>
                <Box id={'text-field-container'}
                     sx={{
                         m: '0.3em',
                         mr: '1em',
                         ml: '1em',
                     }
                     }>


                    <TextField

                        margin="dense"
                        InputProps={{disableUnderline: !props.isInEdit}}

                        id={'sidur-rename-dialog-text-field'}

                        type="text"
                        variant="standard"
                        inputRef={valueNameRef}
                        value={nameValue}
                        onChange={(event) => {
                            if (props.isInEdit) {
                                setNameValue(event.target.value)
                                setWasJustEdited(true)
                            }
                        }}

                    />

                </Box>

                <Box id={'hour-field-container'}
                     sx={{
                         m: '0.3em',
                         mr: '0.7em',
                         ml: '0.7em',
                         mt: '0.5em',
                     }
                     }>

                    <TextField
                        type="number"
                        variant="standard"
                        inputRef={valueMinutesRef}
                        value={etaValue}
                        InputProps={{
                            inputProps: {
                                max: 120,
                                min: 10,

                            },
                            disableUnderline: !props.isInEdit
                        }}
                        onChange={(event) => {
                            if (props.isInEdit) {

                                setEtaValue(Number(event.target.value))
                                setWasJustEdited(true)
                            }
                        }}

                    />
                </Box>
                <Box id={'caption-container'} sx={{
                    m: '0.2em',
                    mr: '0em',
                    ml: '0em',
                    mt: '0.5em',
                }}>

                    < Typography component={'span'} variant={'caption'}>{translations.ETAtext}</Typography>

                </Box>
                <Box id={'caption-container'} sx={{
                    width: '80px',
                    height: '20px'
                }}/>
            </Card>
        </Box>
    )
}
