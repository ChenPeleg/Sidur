import React, {useState} from 'react'
import {Box} from '@mui/system';
import {useDispatch} from 'react-redux';
import {Card, Typography} from '@mui/material';
import {DriveModel} from '../../models/Sketch.model';
import {locations} from '../../services/locations';
import {LanguageUtilities} from '../../services/language-utilities';


interface sketchDriveProps {
    drive: DriveModel,
    sketchDriveClick: (event: React.MouseEvent<HTMLElement>, drive: DriveModel) => void
}


const timeText = (drive: DriveModel) => LanguageUtilities.buildBriefText(drive, locations).timeText;
const driverAndLocation = (drive: DriveModel) => LanguageUtilities.buildBriefText(drive, locations).driverAndLocation;
export const SketchDrive = (props: sketchDriveProps) => {
    const dispatch = useDispatch();
    const drive = props.drive;
    const [inHover, setInHover] = useState(false);
    const onMouseOver = () => {
        setInHover(true)
    };
    const onMouseOut = () => {
        setInHover(false)
    };


    return (
        <Box>
            <Card onClick={(event: any) => props.sketchDriveClick(event, drive)} onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut} elevation={inHover ? 8 : 2} sx={{
                m: '0.2em',
                mb: '0.3em',
                minHeight: '10vh',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'start',
                cursor: 'default'
            }}>
                <Box id={'drive-hour'} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'start',
                    flexWrap: 'wrap',
                    p: '0.2em',
                    pl: '0.25em',
                    pr: '0.25em',
                    bgcolor: '#aadcff',
                    //flexShrink: 4,
                    //width: '20%',
                    minHeight: '100%',
                    //flexShrink: '4'

                }}>
                    <Typography dir="ltr"
                                variant={'subtitle1'}>{drive.startHour}  </Typography>
                    <Box sx={{
                        width: '10px',
                        height: '2px',
                        borderBottom: '1px solid black',
                        alignSelf: 'center'
                    }}/>
                    <Typography dir="ltr"
                                variant={'subtitle1'}>{drive.finishHour}  </Typography>

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
                    <Box sx={{
                        width: '5px',
                        height: '10px'
                    }}/>
                    <Typography
                        variant={'subtitle1'}>{driverAndLocation(drive)}  </Typography>

                </Box>
            </Card>
        </Box>


    )

}
