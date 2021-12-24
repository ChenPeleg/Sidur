import React, {useState} from 'react'
import {Box} from '@mui/system';
import {useDispatch} from 'react-redux';
import {Card, Typography} from '@mui/material';
import {DriveModel} from '../../models/Sketch.model';
import {locations} from '../../services/locations';
import {LanguageUtilities} from '../../services/language-utilities';
import {DriveType} from '../../models/DriveType.enum';
import {Utils} from '../../services/utils';
import {translations} from '../../services/translations';
import {ArrowDownward, ArrowUpward} from '@mui/icons-material';


interface sketchDriveProps {
    drive: DriveModel,
    prevoiusDrive: DriveModel | null,
    sketchDriveClick: (event: React.MouseEvent<HTMLElement>, drive: DriveModel) => void
}


const timeText = (drive: DriveModel) => LanguageUtilities.buildBriefText(drive, locations).timeText;
const driverAndLocation = (drive: DriveModel) => LanguageUtilities.buildBriefText(drive, locations).driverAndLocation;

function ArrowUpwardIcon() {
    return null;
}


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
    const calculateIfDrivesOverlap = (thisDrive: DriveModel, perviousDrive: DriveModel | null): DriveModel | null => {
        if (!perviousDrive) {
            return null
        }
        const prevFinish = Utils.hourTextToDecimal(perviousDrive.finishHour);
        const thisStart = Utils.hourTextToDecimal(thisDrive.startHour);
        if (prevFinish > thisStart) {
            return perviousDrive
        } else {
            return null
        }
    }
    const driveOverlap = !!calculateIfDrivesOverlap(props.drive, props.prevoiusDrive);


    return (
        <Box>
            {driveOverlap ? <Card sx={{
                m: '0.2em',
                mb: '0.3em',
                minHeight: '10vh',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'start',
                cursor: 'default',
                bgcolor: '#e6a5a5'
            }}> <Box><ArrowDownward/> <b> {translations.OverlapingDrives}</b> <ArrowUpward/></Box></Card> : null}
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
                    {drive.TypeOfDrive === DriveType.Tsamud || drive.TypeOfDrive === DriveType.TwoWay ?
                        (<><Box sx={{
                            width: '10px',
                            height: '2px',
                            borderBottom: '1px solid black',
                            alignSelf: 'center'
                        }}/>
                            <Typography dir="ltr"
                                        variant={'subtitle1'}>{drive.finishHour}  </Typography>

                        </>) : null
                    }</Box>

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
                        variant={'subtitle1'}>{drive.description}  </Typography>

                </Box>
            </Card>
        </Box>


    )

}
