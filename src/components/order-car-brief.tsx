import React from 'react';
import {useSelector} from 'react-redux';
import {OrderFields, OrderModel} from '../models/Order.model';
import {Box, SxProps, Theme} from '@mui/system';
import {Typography} from '@mui/material';
import {translations} from '../services/translations';
import {LanguageUtilites} from '../services/language-utilites';
import {LocationModel} from '../models/Location.model';
import {locations} from '../services/locations';


//const TRL = translations;

type AppProps = {
    orderId: string;
    sx: SxProps,
    isInEdit: boolean
};
const allLocations: LocationModel[] = locations.map(o => ({...o}))
const useStyles: any = (() => ({
    root: {
        direction: (theme: Theme) => theme.direction,
        '& .MuiFormLabel-root': {
            left: 'inherit'
        }
    },
    fieldWrapper: {
        display: 'inline-flex',
        padding: '10px'
    },
    fieldWrapperText: {
        display: 'inline-flex',
        padding: '10px',
        maxWidth: '150px'
    },
    cardBase: {
        direction: (theme: Theme) => theme.direction,
        padding: '10px',
        cursor: 'pointer',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'

    },
    additionalText: {
        fontSize: '14px'
    }
}))
const orderFields: OrderModel = new OrderFields();

const buildBriefText = (orderValues: OrderModel): string => {
    const isWithName = orderValues.driverName.trim() !== '';
    if (!isWithName) {
        return translations.NewOrder
    }
    let briefText = orderValues?.startHour + ' ' + orderValues.driverName;
    if (orderValues.TypeOfDrive && orderValues.location) {
        const driveTimeLanguage = LanguageUtilites.getPrefixByDriveType(orderValues.TypeOfDrive);
        const location = allLocations.find(l => l.id === orderValues.location);
        if (location) {
            briefText += ' ' + driveTimeLanguage.location + location.Name
        }

    }

    return briefText
}
export const OrderCarBrief = (props: AppProps) => {
    const id = props.orderId;
    const orderValues = useSelector((state: { orders: OrderModel[] }) => {
        return state.orders.find(order => order.id === id) as OrderModel;
    });


    return (
        <Box sx={{padding: '5px'}}>
            <Typography fontWeight={props.isInEdit ? 'bold' : 'initial'} fontSize={'large'} padding={'initial'}>
                {buildBriefText(orderValues)}
            </Typography>

        </Box>


    )
}


