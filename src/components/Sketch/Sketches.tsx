import React from 'react'
import {Box} from '@mui/system';
import {useDispatch, useSelector} from 'react-redux';
import {OrderModel} from '../../models/Order.model';
import {Typography} from '@mui/material';
import {translations} from '../../services/translations';
import {SketchModel, VehicleScheduleModel} from '../../models/Sketch.model';
import {Utilities} from '../../services/utilities';
import {VehicleModel} from '../../models/Vehicle.model';


export const Sketches = () => {
    const dispatch = useDispatch()
    const orders = useSelector((state: { orders: OrderModel[] }) => state.orders);
    const vehicles = useSelector((state: { vehicles: VehicleModel[] }) => state.vehicles);
    const orderIdInEdit = useSelector((state: { orderIdInEdit: string | null }) => state.orderIdInEdit);
    const getVehicleNameFromId = (vehicleId: string): string | null => {
        return vehicles.find(v => v.id === vehicleId)?.vehicleName || vehicleId
    }
    const defaultSketch: SketchModel = Utilities.defaultSketchMMock();


    return (
        <Box>
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
                    return (
                        <Box key={vehicleTimeTable.id} id={'vehicle-column'} sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            mb: '10px',
                            justifyContent: 'center',
                            minWidth: '30vw',
                        }}> <Typography variant={'h6'}>{getVehicleNameFromId(vehicleTimeTable.id)}  </Typography> </Box>
                    )


                })}

            </Box>
            <Box>


            </Box>
        </Box>


    )

}
