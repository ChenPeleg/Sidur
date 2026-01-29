import React, {useState} from 'react';

import {Field, Form} from 'react-final-form';
import {MuiFormPropsModel} from '../../models/mui-form-props.model';
import {useDispatch, useSelector} from 'react-redux';
import {HourPicker} from '../Form/hour-picker';
import {OrderFields, OrderModel} from '../../models/Order.model';
import {RenderTextField} from '../Form/text-field';
import {RenderSelectField} from '../Form/select-field';
import {DriveType} from '../../models/DriveType.enum';
import { Box  } from "@mui/system";
import type {   SxProps } from "@mui/system";
import {Button, MenuItem} from '@mui/material';
import {translations} from '../../services/translations';
import {ActionsTypes} from '../../store/types.actions';
import {LocationModel} from '../../models/Location.model';
import {LanguageUtilities} from '../../services/language-utilities';
import {RenderPassengerField} from '../Form/passengers-field';
import {RenderFlexibilityField} from '../Form/flexibility-field';
import {RenderSelectFieldAutoComplete} from '../Form/select-field-auto-complete';


const TRL = translations;


const fieldWrapper: SxProps = {
    padding: '10px'
}
const selectFieldWrapper: SxProps = {
    ...fieldWrapper as SxProps,
    paddingBottom: '0px'
}

const fieldWrapperText = {
    display: 'inline-flex',
    padding: '10px',
    maxWidth: '150px'
};

const orderFields: OrderModel = new OrderFields();

const Divider = () => (<Box sx={{
    width: '10px',
    height: '5px'
}}/>)


const MaterialUiForm = (muiFormProps: MuiFormPropsModel) => {
    const {
        handleSubmit,

        submitting,
        typeOfDrive,
        locations
    } = muiFormProps;
    const [isAdvanced, setIsAdvanced] = useState(false);
    const handleSetAdvanced = (value: boolean = true) => {
        setIsAdvanced(value)
    }
    const advanceFieldWrapper: SxProps = {
        ...fieldWrapper as SxProps,
        display: isAdvanced ? 'initial' : 'none'
    }
    const driveTimeLanguage = LanguageUtilities.getPrefixByDriveType(typeOfDrive)
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
                <Box sx={selectFieldWrapper}>
                    <Field
                        name={'TypeOfDrive'}
                        component={RenderSelectField}
                        label={TRL.TypeOfDrive}
                    >
                        <MenuItem value={DriveType.Tsamud.toString()}>{TRL.Tsamud}</MenuItem>
                        <MenuItem value={DriveType.OneWayFrom.toString()}> {TRL.OneWayFrom}</MenuItem>
                        <MenuItem value={DriveType.OneWayTo.toString()}>{TRL.OneWayTo}</MenuItem>

                    </Field>

                </Box>

                <Box sx={selectFieldWrapper}>

                    <Field name={orderFields.location} component={RenderSelectFieldAutoComplete} label={TRL.Where}
                           selectoptions={locations.map((location: LocationModel) => ({
                               ...location,
                               Name: driveTimeLanguage.location + location.name
                           }))}>

                    </Field> </Box>
                <Box
                    sx={fieldWrapper}
                >
                    <Field name={orderFields.startHour} component={HourPicker}
                           label={driveTimeLanguage.timeStart}/>
                </Box>
                <Box sx={fieldWrapper}
                >
                    <Field name={orderFields.finishHour} custom={{inActive: typeOfDrive !== DriveType.Tsamud}} component={HourPicker}
                           label={driveTimeLanguage.timeEnd}/>
                </Box>

                <Box
                    sx={fieldWrapper}> <Field name={orderFields.Comments}
                                              component={RenderTextField}
                                              label={TRL.Comments}
                    // multiLine={true}
                                              rows={2}
                />
                </Box>


                <Box
                    sx={fieldWrapper}> <Field name={orderFields.passengers}
                                              component={RenderPassengerField}
                                              label={TRL.passengers}
                                              type={'text'}
                                              rows={2}
                />
                </Box>
                <Box
                    sx={advanceFieldWrapper}> <Field name={orderFields.flexibility[0]}
                                                     component={RenderFlexibilityField}
                                                     label={TRL.flexibility}
                                                     rows={2}
                />


                </Box>

                <Box sx={{
                    ...fieldWrapper as SxProps,
                    display: 'flex',
                    flexDirection: 'row'
                }}
                >
                    <Button sx={{display: isAdvanced ? 'none' : 'initial'}} variant="text" type="button"
                            onClick={() => handleSetAdvanced(true)}>{TRL.Advanced}</Button>
                    <Divider/>
                    <Button sx={{m: '5px'}} variant="contained" color={'primary' as any} type="button"
                            onClick={handleSubmit}>{TRL.Submit}</Button>


                </Box>

            </Box>
        </form>
    );
};

export const OrderCarForm = (formProps: MuiFormPropsModel) => {

    const dispatch = useDispatch();

    const id = formProps.orderId;
    const orders = useSelector((state: { orders: OrderModel[] }) => state.orders);

    const initialValues = orders.find(order => order.id === id);

    const [_typeOfDrive, set_typeOfDrive] = useState(initialValues?.TypeOfDrive as DriveType)


    return (
        <Form
            initialValues={initialValues as any}
            onSubmit={(_values: any) => {
                if (!formProps.isInEdit) {
                    return;
                }
                dispatch({
                    type: ActionsTypes.UPDATE_ORDER,
                    payload: {
                        id: id,
                    },
                });
            }}
            validate={(values: any) => {

                if (!formProps.isInEdit) {
                    return
                }
                dispatch({
                    type: ActionsTypes.UPDATE_ORDER_IN_EDIT,
                    payload: {
                        ...values
                    }
                })
                if (values?.TypeOfDrive && values?.TypeOfDrive !== _typeOfDrive) {
                    set_typeOfDrive(values.TypeOfDrive)
                }
                return {} // validate(values)
            }}
            render={({handleSubmit}: any) => (MaterialUiForm({
                ...formProps,
                typeOfDrive: _typeOfDrive,
                handleSubmit,
            }))

            }/>
    )
}


