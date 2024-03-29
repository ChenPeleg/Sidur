import React, {useState} from 'react'
import {Box, SxProps} from '@mui/system';
import {Card, Typography} from '@mui/material';
import {DriveModel} from '../../models/Sketch.model';
import {DriveType} from '../../models/DriveType.enum';
import {Utils} from '../../services/utils';
import {translations} from '../../services/translations';
import {Colors, Styles} from '../../hoc/themes';
import {WarningIcon} from '../buttons/warning-icon';

export enum ChooseDriveMode {
    NotActive = 0,
    selectable = 1,
    nonSelectable = 2,

}

interface sketchDriveProps {
    chooseDriveMode: ChooseDriveMode
    drive: DriveModel,
    previousDrive: DriveModel | null,
    sketchDriveClick: (event: React.MouseEvent<HTMLElement>, drive: DriveModel) => void
}

const custumSxMaker = (chooseDriveMode: ChooseDriveMode): SxProps => {
    switch (chooseDriveMode) {


        case ChooseDriveMode.nonSelectable:
            return {
                filter: 'grayscale(120%);',
                opacity: '0.5'
            }
        case ChooseDriveMode.selectable:
            return {
                filter: `drop-shadow(0px 0px 3px ${'#00b705'})`,

            }
        case ChooseDriveMode.NotActive:
        default:
            return {};

    }
}
export const SketchDrive = (props: sketchDriveProps) => {

    const drive = props.drive;
    const [inHover, setInHover] = useState(false);
    const onMouseOver = () => {
        setInHover(true)
    };
    const onMouseOut = () => {
        setInHover(false)
    };
    const calculateIfDrivesOverlap = (thisDrive: DriveModel, previousDrive: DriveModel | null): DriveModel | null => {
        if (!previousDrive) {
            return null
        }
        const prevFinish = Utils.hourTextToDecimal(previousDrive.finishHour);
        const thisStart = Utils.hourTextToDecimal(thisDrive.startHour);
        if (prevFinish > thisStart) {
            return previousDrive
        } else {
            return null
        }
    }
    const driveOverlap = !!calculateIfDrivesOverlap(props.drive, props.previousDrive);


    const customSx = custumSxMaker(props.chooseDriveMode)
    return (

        <Box>
            {driveOverlap ? <Box sx={{
                zIndex: 50,
                position: 'relative',
                m: '0.2em',
                mb: '0.3em',

                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'start',
                cursor: 'default',
                bgcolor: Colors.warningRed,
                boxShadow: '0px -1px 7px 7px ' + Colors.warningRed.replace('1.0', '0.8'),
                p: '0 0.5em'
            }}> <Box sx={{
                ...Styles.flexRow,
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}> < Box sx={Styles.flexColumn}> <WarningIcon/>
            </Box><Box sx={{
                ...Styles.flexRow,
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}> <b> {translations.OverlapingDrives}</b></Box>
            </Box></Box> : null}
            <Card onClick={(event: any) => props.sketchDriveClick(event, drive)} onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut} elevation={inHover ? 8 : 2} sx={{
                m: '0.2em',
                mb: '0.3em',
                position: 'relative',

                zIndex: 40,
                minHeight: '10vh',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'start',
                cursor: 'default',
                ...customSx
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
