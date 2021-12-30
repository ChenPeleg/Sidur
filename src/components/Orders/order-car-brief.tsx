import React from 'react';
import {useSelector} from 'react-redux';
import {OrderFields, OrderModel} from '../../models/Order.model';
import {Box, SxProps, Theme} from '@mui/system';
import {Typography} from '@mui/material';
import {translations} from '../../services/translations';
import {LanguageUtilities} from '../../services/language-utilities';
import {LocationModel} from '../../models/Location.model';
import {locations} from '../../services/locations';
import {DriveType} from '../../models/DriveType.enum';


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

const areDetailsMissing = (orderValues: OrderModel): boolean => {
    if (!orderValues.TypeOfDrive || !orderValues.driverName || !orderValues.startHour) {
        return true
    }
    if (orderValues.TypeOfDrive === DriveType.Tsamud) {
        if (!orderValues.finishHour || !orderValues.startHour) {
            return true
        }
    }
    return false
}

const buildBriefText = (orderValues: OrderModel): string => {
    const isWithName = orderValues.driverName.trim() !== '';
    if (!isWithName) {
        return translations.NewOrder
    }
    let timeText = orderValues?.startHour || '';
    if (orderValues.TypeOfDrive === DriveType.Tsamud && orderValues?.startHour && orderValues?.finishHour) {
        timeText = orderValues.finishHour + ' - ' + orderValues.startHour;
    }
    let briefText = timeText + ' ' + orderValues.driverName;
    if (orderValues.TypeOfDrive && orderValues.location) {
        const driveTimeLanguage = LanguageUtilities.getPrefixByDriveType(orderValues.TypeOfDrive);
        const location = allLocations.find(l => l.id === orderValues.location);
        if (location) {
            briefText += ' ' + driveTimeLanguage.location + location.name
        }

    }

    return briefText
}
export const OrderCarBrief = (props: AppProps) => {
    const id = props.orderId;
    const orderValues = useSelector((state: { orders: OrderModel[] }) => {
        return state.orders.find(order => order.id === id) as OrderModel;
    });
    const missingDetailsShown: boolean = areDetailsMissing(orderValues) && !props.isInEdit;


    return (
        <Box sx={{
            padding: '5px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            alignItems: 'start'
        }}>
            <Typography fontWeight={props.isInEdit ? 'bold' : 'initial'} fontSize={'large'} padding={'initial'}>
                {buildBriefText(orderValues)}
            </Typography>
            <Typography fontSize={'large'} color={'red'} padding={'initial'}>  &nbsp;
                {missingDetailsShown ? ' (' + translations.missingDetails + ') ' : null}
            </Typography>

        </Box>


    )
}


