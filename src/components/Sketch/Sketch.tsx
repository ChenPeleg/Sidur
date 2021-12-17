import React, {useEffect, useState} from 'react'
import {Box} from '@mui/system';
import {useDispatch, useSelector} from 'react-redux';
import {Divider, Typography} from '@mui/material';
import {DriveModel, SketchModel, VehicleScheduleModel} from '../../models/Sketch.model';
import {Utils} from '../../services/utils';
import {VehicleModel} from '../../models/Vehicle.model';
import {SketchDrive} from './SketchDrive';
import {SketchPendingOrders} from './SketchPendeingOrders';
import {SketchDriveEditDialog} from '../Dialogs/sketch-drive-edit-dialog';

const MOckDrive = {
    'id': '0',
    'flexibility': [
        '-30',
        '10'
    ],
    'passengers': '1',
    'location': '6',
    'TypeOfDrive': '2',
    'startHour': '09:45',
    'Comments': 'ורד תשמח לשעה במשגב, גמישה עד 1320. לא דחוף, רק אם מסתדר.',
    'driverName': 'ורד',
    'finishHour': '10:00',
    'implementsOrders': [
        '104'
    ],
    'description': ''
}

export const Sketch = () => {
    const dispatch = useDispatch()
    const vehicles = useSelector((state: { vehicles: VehicleModel[] }) => state.vehicles);
    const sketches: SketchModel[] = useSelector((state: { sketches: SketchModel[] }) => state.sketches);
    const [sketchDriveEditOpen, setSketchDriveEditOpen] = React.useState(false);
    const [sketchMoreAnchorEl, setSketchMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const [chosenDrive, setChosenDrive] = useState<DriveModel | null>(null);
    const [mock, setMock] = useState<boolean>(false)
    const handleSketchDriveEditDelete = () => {
        setSketchDriveEditOpen(false);
    }
    const handleSketchDriveEditClose = () => {
        setSketchDriveEditOpen(false);
    }
    useEffect(() => {
        if (!mock) {
            setTimeout(_ => {
                setChosenDrive(MOckDrive as DriveModel)
                setSketchDriveEditOpen(true);
                setMock(true)
            }, 2000)
        }
    })
    const sketchDriveClickHandler = (event: React.MouseEvent<HTMLElement>, drive: DriveModel) => {
        setChosenDrive(drive)
        setSketchDriveEditOpen(true);
    };

    const getVehicleNameFromId = (vehicleId: string): string | null => {
        return vehicles.find(v => v.id === vehicleId)?.vehicleName || vehicleId
    }


    const sketchInEdit: SketchModel = sketches[0] || Utils.defaultSketchMMock();


    return (
        <Box>
            <Box id={'sketch-wrapper-row'} sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                mb: '10px',
                justifyContent: 'center',
                minWidth: '30vw',
            }}>
                <SketchPendingOrders pendingOrders={sketchInEdit.unassignedOrders}/>


                {sketchInEdit.vehicleSchedules.map((vehicleTimeTable: VehicleScheduleModel) => {
                    return (<>
                        <Box key={vehicleTimeTable.id} id={'vehicle-column'} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            m: '15px',
                            mt: '0px',
                            justifyContent: 'start',
                            minWidth: '6vw',
                            minHeight: '60vh',
                        }}> <Typography variant={'h6'}>{getVehicleNameFromId(vehicleTimeTable.id)}  </Typography>
                            {vehicleTimeTable.drives.map((drive: DriveModel) => {
                                return (
                                    <>
                                        <SketchDrive sketchDriveClick={sketchDriveClickHandler} key={drive.id} drive={drive}/>

                                    </>
                                )

                            })}

                        </Box>
                        <Divider orientation="vertical" variant={'fullWidth'} sx={{borderRight: '2px solid black '}} flexItem/>
                    </>)


                })}

            </Box>
            <SketchDriveEditDialog open={sketchDriveEditOpen} onClose={handleSketchDriveEditClose} sketchDriveData={chosenDrive}
                                   onDelete={handleSketchDriveEditDelete}/>


        </Box>


    )

}
