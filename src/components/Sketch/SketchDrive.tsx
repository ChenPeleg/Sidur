import React from 'react'
import {Box} from '@mui/system';
import {useDispatch} from 'react-redux';
import {Card, Typography} from '@mui/material';
import {DriveModel} from '../../models/Sketch.model';
import {locations} from '../../services/locations';
import {LanguageUtilites} from '../../services/language-utilites';


interface sketchDriveProps {
    drive: DriveModel,
}

const getLocationFromId = (locationId: string): string | null => {
    return locations.find(v => v.id === locationId)?.Name || locationId
}
export const SketchDrive = (props: sketchDriveProps) => {
    const dispatch = useDispatch();
    const drive = props.drive


    return (
        <Box>
            <Card sx={{
                m: '0.1em',
                mb: '0.3em',
                minHeight: '10vh'
            }}>
                <Box key={drive.id} id={'vehicle-drive-' + drive.id} sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'start',
                    justifyContent: 'start',
                    p: '0.2em'

                }}>
                    <Typography
                        variant={'subtitle1'}>{LanguageUtilites.buildBriefText(drive, locations)}  </Typography>

                </Box>
            </Card>
        </Box>


    )

}
