import React, {useState} from 'react'
import {Box} from '@mui/system';
import {useDispatch, useSelector} from 'react-redux';
import {Collapse, Divider, Typography} from '@mui/material';
import {DriveModel, SketchModel, VehicleScheduleModel} from '../../models/Sketch.model';
import {VehicleModel} from '../../models/Vehicle.model';
import {ChooseDriveMode, SketchDrive} from './SketchDrive';
import {SketchPendingOrders} from './SketchPendeingOrders';
import {SketchDriveEditDialog} from '../Dialogs/sketch-drive-edit-dialog';
import {ActionsTypes} from '../../store/types.actions';
import {SidurStore} from '../../store/store.types';
import {SketchNoSketchMessage} from './sketch-no-sketch-message';

import {TransitionGroup} from 'react-transition-group';
import {SketchDriveMergeDialog} from '../Dialogs/sketch-drive-merge-dialog';
import {OrderModel} from '../../models/Order.model';


export const Sketch = () => {
    const dispatch = useDispatch()
    const SketchIdInEdit = useSelector((state: SidurStore) => state.sessionState.SketchIdInEdit);
    const pendingOrderInEditActionSelectDrives = useSelector((state: SidurStore) => state.sessionState.pendingOrderInEditActionSelectDrives || []);
    const sessionState = useSelector((state: SidurStore) => state.sessionState);

    const vehicles = useSelector((state: { vehicles: VehicleModel[] }) => state.vehicles);
    const sketches: SketchModel[] = useSelector((state: { sketches: SketchModel[] }) => state.sketches);
    const [sketchDriveEditOpen, setSketchDriveEditOpen] = React.useState(false);
    const [sketchDriveMergeOpen, setSketchDriveMergeOpen] = React.useState(false);

    const [chosenDrive, setChosenDrive] = useState<{ drive: DriveModel, vehicleId: string } | null>(null);

    const handleSketchDriveEditDelete = (sketchDriveData: { drive: DriveModel, vehicleId: string }) => {
        setSketchDriveEditOpen(false);
        setChosenDrive(null);
        const value = sketchDriveData.drive
        dispatch({
            type: ActionsTypes.DELETE_SKETCH_DRIVE,
            payload: {
                value
            }
        })

    }


    const handleSketchDriveEditClose = (value: DriveModel | null) => {
        setSketchDriveEditOpen(false);
        setChosenDrive(null);
        if (value) {

            dispatch({
                type: ActionsTypes.UPDATE_SKETCH_DRIVE,
                payload: {
                    value
                }
            })


        }
    };
    const handleSketchDriveMergeClose = (value: DriveModel | null) => {

        setSketchDriveMergeOpen(false);

        setChosenDrive(null);
        if (value) {

            dispatch({
                type: ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER,
                payload: {
                    value
                }
            })


        } else {
            dispatch({
                type: ActionsTypes.REMOVE_PENDING_ORDER_STATUS,
                payload: {
                    value
                }
            })
        }
    };
    const HandleDriveMerge = (pendingOrderToMerge: OrderModel, driveToMerge: DriveModel, vehicleId: string): void => {
        setChosenDrive({
            drive: driveToMerge,
            vehicleId: vehicleId
        })
        setSketchDriveMergeOpen(true);
    }
    const sketchDriveClickHandler = (event: React.MouseEvent<HTMLElement>, drive: DriveModel, vehicleId: string) => {

        if (sessionState.pendingOrderInEditAction && sessionState.pendingOrderIdInEdit) {
            const Order = sketchInEdit?.unassignedOrders.find(o => o.id === sessionState.pendingOrderIdInEdit)
            if (Order) {
                HandleDriveMerge(Order, drive, vehicleId)
            }
            return;
        }
        setChosenDrive({
            drive: drive,
            vehicleId: vehicleId
        })
        setSketchDriveEditOpen(true);
    };

    const getVehicleNameFromId = (vehicleId: string): string | null => {
        return vehicles.find(v => v.id === vehicleId)?.vehicleName || vehicleId
    }

    const sketchInEdit: SketchModel | null = sketches.find((sketch: SketchModel) => sketch.id === SketchIdInEdit) || null;


    return (
        sketchInEdit ? (
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


                    {sketchInEdit.vehicleSchedules.map((vehicleTimeTable: VehicleScheduleModel, i: number) => {
                        return (<Box key={i}>
                            <Box key={i} id={'vehicle-column'} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                m: '15px',
                                mt: '0px',
                                justifyContent: 'start',
                                minWidth: '6vw',
                                minHeight: '60vh',
                            }}> <Typography variant={'h6'}>{getVehicleNameFromId(vehicleTimeTable.VehicleId)}  </Typography>
                                <TransitionGroup>
                                    {vehicleTimeTable.drives.map((drive: DriveModel, i: number) => {
                                        let chooseDriveMode = ChooseDriveMode.NotActive
                                        if (pendingOrderInEditActionSelectDrives.length > 0) {
                                            if (pendingOrderInEditActionSelectDrives.includes(drive.id)) {
                                                chooseDriveMode = ChooseDriveMode.selectable
                                            } else {
                                                chooseDriveMode = ChooseDriveMode.nonSelectable
                                            }
                                        }

                                        return (
                                            <Collapse key={i}>
                                                <SketchDrive chooseDriveMode={chooseDriveMode}
                                                             sketchDriveClick={(event: React.MouseEvent<HTMLElement>, drive: DriveModel) => sketchDriveClickHandler(event, drive, vehicleTimeTable.id)}
                                                             key={i} drive={drive} previousDrive={vehicleTimeTable.drives[i - 1] || null}/>
                                            </Collapse>

                                        )

                                    })}
                                </TransitionGroup>

                            </Box>
                            <Divider orientation="vertical" variant={'fullWidth'} sx={{borderRight: '2px solid black '}} flexItem/>
                        </Box>)


                    })}

                </Box>
                {chosenDrive ?
                    <SketchDriveEditDialog vehicleId={'1'} open={sketchDriveEditOpen} onClose={handleSketchDriveEditClose}
                                           sketchDriveData={chosenDrive}
                                           onDelete={handleSketchDriveEditDelete}/> : null}
                {chosenDrive && sessionState.pendingOrderIdInEdit && sketchDriveMergeOpen ?
                    <SketchDriveMergeDialog vehicleId={'1'} open={sketchDriveMergeOpen} onClose={handleSketchDriveMergeClose}
                                            sketchDriveData={chosenDrive}
                                            PendingOrderToMergeId={sessionState.pendingOrderIdInEdit}
                                            onDelete={handleSketchDriveEditDelete}/> : null}


            </Box>) : <SketchNoSketchMessage/>)


}
