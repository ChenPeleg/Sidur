import {Box, Card} from '@mui/material';
import {LocationModel} from '../../models/Location.model';
import * as React from 'react';
import {useState} from 'react';

interface LocationFormProps extends LocationModel {
    onClick: (locationUpdate: LocationModel) => void,
}

export const LocationChooseButton = (props: LocationFormProps) => {
    // const locationGroupInEditId = useSelector((state: SidurStore) => state.sessionState.locationGroupInEdit);
    // const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    //const currentLocationGroup: LocationGroup | undefined = locationGroups.find(l => l.id === locationGroupInEditId)
    //const [wasJustEdited, setWasJustEdited] = useState<boolean>(false);
    const justLocationObject = {
        ...props,
        onClick: null
    }
    const [inHover, setInHover] = useState(false);
    const onMouseOver = () => {
        setInHover(true)
    };
    const onMouseOut = () => {
        setInHover(false)
    };

    return (

        <Box sx={{display: 'flex'}}>
            <Card sx={{
                m: '0.2em',
                mb: '0.3em',
                minWidth: '200px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'start',
                backgroundColor: inHover ? '#e7f2f7' : '',
            }} onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut} elevation={inHover ? 6 : 2} onClick={(_event) => props.onClick(justLocationObject)}>
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
