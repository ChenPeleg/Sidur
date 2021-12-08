import React from 'react'
import {Box} from '@mui/system';
import {useDispatch, useSelector} from 'react-redux';
import {OrderModel} from '../../models/Order.model';
import {Divider, Typography} from '@mui/material';
import {DriveModel, SketchModel, VehicleScheduleModel} from '../../models/Sketch.model';
import {Utilities} from '../../services/utilities';
import {VehicleModel} from '../../models/Vehicle.model';
import {locations} from '../../services/locations';
import {SketchDrive} from './SketchDrive';
import {SidurStore} from '../../store/store.types';


export const Sketch = () => {
    const dispatch = useDispatch()
    const orders = useSelector((state: { orders: OrderModel[] }) => state.orders);
    const vehicles = useSelector((state: { vehicles: VehicleModel[] }) => state.vehicles);
    const orderIdInEdit = useSelector((state: { orderIdInEdit: string | null }) => state.orderIdInEdit);
    const sketches: SketchModel[] = useSelector((state: { sketches: SketchModel[] }) => state.sketches);

    const [sketchMoreAnchorEl, setSketchMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const isSketchMenuOpen = Boolean(sketchMoreAnchorEl);

    const sketchMenuId = 'primary-sketch-menu';
    const handleSketchMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSketchMoreAnchorEl(event.currentTarget);
    };
    const SketchIdInEdit = useSelector((state: SidurStore) => state.SketchIdInEdit);


    const getVehicleNameFromId = (vehicleId: string): string | null => {
        return vehicles.find(v => v.id === vehicleId)?.vehicleName || vehicleId
    }
    const getLocationFromId = (locationId: string): string | null => {
        return locations.find(v => v.id === locationId)?.Name || locationId
    }

    const sketchInEdit: SketchModel = sketches[0] || Utilities.defaultSketchMMock();


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
                {sketchInEdit.vehicleSchedules.map((vehicleTimeTable: VehicleScheduleModel) => {
                    return (<>
                        <Box key={vehicleTimeTable.id} id={'vehicle-column'} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            m: '15px',
                            mt: '0px',
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


        </Box>


    )

}
