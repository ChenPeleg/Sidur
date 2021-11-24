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
const timeText = (drive: DriveModel) => LanguageUtilites.buildBriefText(drive, locations).timeText;
const driverAndLocation = (drive: DriveModel) => LanguageUtilites.buildBriefText(drive, locations).driverAndLocation;
export const SketchDrive = (props: sketchDriveProps) => {
    const dispatch = useDispatch();
    const drive = props.drive


    return (
        <Box>
            <Card sx={{
                m: '0.2em',
                mb: '0.3em',
                minHeight: '10vh',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                justifyContent: 'start',
            }}>
                <Box id={'drive-description'} sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'start',
                    justifyContent: 'start',
                    flexWrap: 'wrap',
                    p: '0.2em',
                    pl: '0.4em',
                    pr: '0.4em',
                    bgcolor: '#aadcff',
                    flexShrink: 4,
                    width: '20%'
                    //flexShrink: '4'

                }}>
                    <Typography dir="ltr"
                                variant={'subtitle1'}>{timeText(drive)}  </Typography>

                </Box>
                <Box id={'drive-description'} sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'start',
                    justifyContent: 'start',
                    p: '0.2em',
                    pl: '0.4em',
                    pr: '0.4em',
                    flexGrow: 4,

                }}>
                    <Typography
                        variant={'subtitle1'}>{driverAndLocation(drive)}  </Typography>

                </Box>
            </Card>
        </Box>


    )

}
