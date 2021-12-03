import React from 'react'
import {Box} from '@mui/system';
import {useDispatch, useSelector} from 'react-redux';
import {OrderModel} from '../../models/Order.model';
import {Button, Divider, Typography} from '@mui/material';
import {translations} from '../../services/translations';
import {DriveModel, SketchModel, VehicleScheduleModel} from '../../models/Sketch.model';
import {Utilities} from '../../services/utilities';
import {VehicleModel} from '../../models/Vehicle.model';
import {locations} from '../../services/locations';
import {SketchDrive} from './SketchDrive';
import {ActionsTypes} from '../../store/types.actions';


export const Sketches = () => {
    const dispatch = useDispatch()
    const orders = useSelector((state: { orders: OrderModel[] }) => state.orders);
    const vehicles = useSelector((state: { vehicles: VehicleModel[] }) => state.vehicles);
    const orderIdInEdit = useSelector((state: { orderIdInEdit: string | null }) => state.orderIdInEdit);
    const getVehicleNameFromId = (vehicleId: string): string | null => {
        return vehicles.find(v => v.id === vehicleId)?.vehicleName || vehicleId
    }
    const getLocationFromId = (locationId: string): string | null => {
        return locations.find(v => v.id === locationId)?.Name || locationId
    }
    const handleCreateSketch = () => {
        dispatch({
            type: ActionsTypes.NEW_SKETCH,
            payload: {
                value: null,
            }
        })
    }
    const defaultSketch: SketchModel = Utilities.defaultSketchMMock();


    return (
        <Box>
            <Button variant={'contained'} id={'sketches-create-sketch'} onClick={handleCreateSketch}>{translations.CreateSketch}</Button>

            <Typography variant={'h5'}>{translations.Sketch} {defaultSketch.name}</Typography>
            <Box id={'sketch-wrapper-row'} sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mb: '10px',
                justifyContent: 'center',
                minWidth: '30vw',
            }}>
                {defaultSketch.vehicleSchedules.map((vehicleTimeTable: VehicleScheduleModel) => {
                    return (<>
                        <Box key={vehicleTimeTable.id} id={'vehicle-column'} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            m: '15px',
                            justifyContent: 'start',
                            minWidth: '20vw',
                            minHeight: '60vh',
                        }}> <Typography variant={'h6'}>{getVehicleNameFromId(vehicleTimeTable.id)}  </Typography>
                            {vehicleTimeTable.drives.map((drive: DriveModel) => {
                                return (
                                    <>
                                        <SketchDrive key={drive.id} drive={drive}/>

                                    </>
                                )

                            })}

                        </Box>
                        <Divider orientation="vertical" variant={'fullWidth'} sx={{borderRight: '2px solid black '}} flexItem/>
                    </>)


                })}

            </Box>
            <Box>


            </Box>
        </Box>


    )

}
