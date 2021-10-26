import React from 'react'
import {translations} from '../services/translations';
import {Box} from '@mui/system';
import {useDispatch, useSelector} from 'react-redux';

import {ActionTypes} from '../store/actionTypes';
import {VehicleModel} from '../models/Vehicle.model';
import {TimeToLeave} from '@mui/icons-material';

const TRL = translations;
const useStyles = (() => ({
    cardBase: {
        padding: '10px',
        cursor: 'pointer',
        width: '50vw',

        borderRadius: '15px'

    },
    cardHeader: {
        paddingBottom: 0,
        paddingTop: '10px'
    },
    additionalText: {
        fontSize: '14px'
    }
}))

export const Vehicles = () => {
    const dispatch = useDispatch();
    const vehicles = useSelector((state: { vehicles: VehicleModel[] }) => state.vehicles);
    //  const orderIdInEdit = useSelector((state: { orderIdInEdit: string | null }) => state.orderIdInEdit);
    const classes = useStyles();
    const addClickHandler = (event: any) => {
        dispatch({
            type: ActionTypes.ADD_NEW_ORDER,
            payload: {}
        })
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
                {translations.vehicles}
                {vehicles.map((v: VehicleModel, index: number) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        margin: '1em',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                        // width: '15px'
                    }}> <TimeToLeave sx={{
                        width: '1.2em',
                        height: '1.2em'
                    }}/>{v.vehicleName}
                    </Box>))}
            </Box>

        </Box>


    )

}
