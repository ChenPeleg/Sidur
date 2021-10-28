import React, {useState} from 'react';

import {Field, Form} from 'react-final-form';
import {MuiFormPropsModel} from '../models/mui-form-props.model';
import {useDispatch, useSelector} from 'react-redux';
import {HourPicker} from './Form/hour-picker';
import {OrderFields, OrderModel} from '../models/Order.model';
import {RenderTextField} from './Form/text-field';
import {RenderSelectField} from './Form/select-field';
import {DriveType} from '../models/DriveType.enum';
import {Box, Theme} from '@mui/system';
import {Button, MenuItem} from '@mui/material';
import {translations} from '../services/translations';
import {validate} from './validate';
import {ActionTypes} from '../store/actionTypes';
import {LocationModel} from '../models/Location.model';
import {locations} from '../services/locations';


const TRL = translations;


const useStyles: any = (() => ({
    root: {
        direction: (theme: Theme) => theme.direction,
        '& .MuiFormLabel-root': {
            left: 'inherit'
        }
    },
    fieldWrapper: {
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
}));
const fieldWrapper = {
    padding: '10px'
}

const fieldWrapperText = {
    display: 'inline-flex',
    padding: '10px',
    maxWidth: '150px'
};
const allLocations: LocationModel[] = locations.map(o => ({...o}))
const orderFields: OrderModel = new OrderFields();

const Divider = () => (<Box sx={{
    width: '10px',
    height: '5px'
}}/>)


const MaterialUiForm = (muiFormProps: MuiFormPropsModel) => {
    const {
        handleSubmit,
        pristine,
        reset,
        submitting
    } = muiFormProps;
    const classes = useStyles();
    const [isAdvanced, setIsAdvanced] = useState(false);
    const handleSetAdvanced = (value: boolean = true) => {
        setIsAdvanced(value)
    }
    return (

        <form onSubmit={(...args) => submitting(...args)} dir={'rtl'}>
            <Box id={'form-wrapper'} sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
            }}>


                <Box
                    sx={fieldWrapperText}
                >
                    <Field name={orderFields.driverName}
                           component={RenderTextField}
                           label={TRL.Name}
                    />
                </Box>
                <Box
                    sx={fieldWrapper}
                >
                    <Field name={orderFields.startHour} component={HourPicker}
                           label={TRL.From + TRL.Hour}/>
                </Box>
                <Box sx={fieldWrapper}
                >
                    <Field name={orderFields.finishHour} component={HourPicker} label={TRL.Until + ' ' + TRL.Hour}/>
                </Box>

                <Box
                    sx={fieldWrapper}
                >
                    <Field
                        name={'TypeOfDrive'}
                        component={RenderSelectField}
                        label={TRL.TypeOfDrive}
                    >
                        <MenuItem value={DriveType.Tsamud.toString()}>{TRL.Tsamud}</MenuItem>
                        <MenuItem value={DriveType.OneWayFrom.toString()}> {TRL.OneWayFrom}</MenuItem>
                        <MenuItem value={DriveType.OneWayTo.toString()}>{TRL.OneWayTo}</MenuItem>
                        {/*<MenuItem value={DriveType.TwoWay.toString()}>{TRL.TwoWay}</MenuItem>*/}
                    </Field>

                    <Field
                        name={orderFields.location}
                        component={RenderSelectField}
                        label={TRL.TypeOfDrive}
                    >
                        {allLocations.map((location: LocationModel) => (

                            <MenuItem key={location.id} value={location.id}>{location.Name}</MenuItem>

                        ))}     </Field>

                </Box>

                <Box
                    sx={fieldWrapper}>
                    <Field
                        name={orderFields.Comments}
                        component={RenderTextField}
                        label={TRL.Comments}
                        // multiLine={true}
                        rows={2}
                    />
                </Box>
                <Box
                    sx={fieldWrapper
                    }
                >
                    <Button variant="text" type="button" onClick={() => handleSetAdvanced(true)}>{TRL.Advanced}</Button>
                    <Divider/>


                    <Button variant="contained" color={'primary'} type="button" onClick={handleSubmit}>{TRL.Submit}</Button>

                </Box>
            </Box>
        </form>
    );
};

export const OrderCarForm = (formProps: MuiFormPropsModel) => {

    const dispatch = useDispatch();

    const id = formProps.orderId;
    const order = useSelector((state: { orders: OrderModel[] }) => state.orders);
    const initialValues = order.find(order => order.id === id);
    let formValues = {...initialValues}

    return (
        <Form
            initialValues={initialValues}

            onSubmit={(values: any) => {

            }}
            validate={(values: any) => {
                if (!formProps.isInEdit) {
                    return
                }
                dispatch({
                    type: ActionTypes.UPDATE_ORDER_IN_EDIT,
                    payload: {
                        ...values
                    }
                })


                return validate(values)
            }}
            handleSubmit={(event: Event, values: any) => {
                if (!formProps.isInEdit) {
                    return
                }
                dispatch({
                    type: ActionTypes.UPDATE_ORDER,
                    payload: {
                        id: id
                    }
                })

            }}
            render={({handleSubmit}: any) => (MaterialUiForm({
                ...formProps,
                handleSubmit,
                //  submitting: submittingHandler
            }))

            }/>
    )
}


