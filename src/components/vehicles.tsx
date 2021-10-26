import React, {useState} from 'react'
import {translations} from '../services/translations';
import {Box, SxProps} from '@mui/system';
import {useDispatch, useSelector} from 'react-redux';

import {ActionTypes} from '../store/actionTypes';
import {VehicleModel} from '../models/Vehicle.model';
import {Add, TimeToLeave} from '@mui/icons-material';
import {Button} from '@mui/material';
import {VehicleEditDialog} from './Dialogs/vehicle-edit-dialog';
import {defaultVehicleValues} from '../store/store.types';


export const Vehicles = () => {
    const [vehicleEditOpen, setVehicleEditOpen] = useState(false);
    const [vehicleClicked, setVehicleClicked] = useState(null);
    const dispatch = useDispatch();
    const vehicles = useSelector((state: { vehicles: VehicleModel[] }) => state.vehicles);

    const vehicleButtonDesign: { boxSX: SxProps, variant: 'text' | 'outlined' | 'contained' } = {
        boxSX: {
            display: 'flex',
            margin: '0.5em',
            mt: '0',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        variant: 'contained'
    }
    const handleVehicleEditClose = (value: VehicleModel | null) => {
        setVehicleEditOpen(false);
        const id = 'sidurId';
        if (value) {
            dispatch({
                type: ActionTypes.RENAME_SIDUR,
                payload: {
                    value,
                    id
                }
            })
        }
    };
    const handleVehicleDelete = (value: string | null) => {
        setVehicleEditOpen(false);
        const id = 'sidurId';
        if (value) {
            dispatch({
                type: ActionTypes.RENAME_SIDUR,
                payload: {
                    value,
                    id
                }
            })
        }
    };
    const vehicleClickHandler = (event: any, vehicleId: string) => {
        const foundVehicle = vehicles.find(v => v.id === vehicleId);
        const vehicle: any = vehicleId !== '0' && foundVehicle ? foundVehicle : defaultVehicleValues;
        setVehicleClicked(vehicle);
        setVehicleEditOpen(true)
        // dispatch({
        //     type: ActionTypes.ADD_NEW_ORDER,
        //     payload: {}
        // })
    }

    return (
        <Box>
            <Box sx={{
                fontSize: 'large',
                height: '150px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                justifyContent: 'space-around'
            }}>

                {vehicles.map((v: VehicleModel, index: number) => (
                    <Box key={index} sx={{
                        ...vehicleButtonDesign
                            .boxSX
                    }}>
                        <Button variant={vehicleButtonDesign
                            .variant} onClick={(event) => {
                            vehicleClickHandler(event, v.id)
                        }}>
                            <TimeToLeave sx={{
                                width: '1.2em',
                                height: '1.2em'
                            }}/>{v.vehicleName}</Button>
                    </Box>))}
                <Box sx={{
                    ...vehicleButtonDesign
                        .boxSX
                }}>
                    <Button variant={vehicleButtonDesign
                        .variant} onClick={(event) => vehicleClickHandler(event, '0')}>
                        <Add sx={{
                            width: '1.2em',
                            height: '1.2em'
                        }}/> {translations.AddVehicles} </Button>

                </Box>
            </Box>
            <VehicleEditDialog vehicleData={vehicleClicked} open={vehicleEditOpen} onClose={handleVehicleEditClose}
                               onDelete={handleVehicleDelete}/>

        </Box>


    )

}
