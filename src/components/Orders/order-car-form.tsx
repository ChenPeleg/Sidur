import React, {useState} from 'react';

import {Field, Form} from 'react-final-form';
import {MuiFormPropsModel} from '../../models/mui-form-props.model';
import {useDispatch, useSelector} from 'react-redux';
import {HourPicker} from '../Form/hour-picker';
import {OrderFields, OrderModel} from '../../models/Order.model';
import {RenderTextField} from '../Form/text-field';
import {RenderSelectField} from '../Form/select-field';
import {DriveType} from '../../models/DriveType.enum';
import {Box, SxProps, Theme} from '@mui/system';
import {Button, MenuItem} from '@mui/material';
import {translations} from '../../services/translations';
import {ActionsTypes} from '../../store/types.actions';
import {LocationModel} from '../../models/Location.model';
import {locations} from '../../services/locations';
import {LanguageUtilities} from '../../services/language-utilities';
import {RenderPassengerField} from '../Form/passengers-field';
import {RenderFlexibilityField} from '../Form/flexibility-field';
import {RenderSelectFieldAutoComplete} from '../Form/select-field-auto-complete';


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
const fieldWrapper: SxProps = {
    padding: '10px'
}
const selectFieldWrapper: SxProps = {
    ...fieldWrapper,
    paddingBottom: '0px'
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
        submitting,
        typeOfDrive
    } = muiFormProps;
    const classes = useStyles();
    const [isAdvanced, setIsAdvanced] = useState(false);
    const handleSetAdvanced = (value: boolean = true) => {
        setIsAdvanced(value)
    }
    const advanceFieldWrapper: SxProps = {
        ...fieldWrapper,
        display: isAdvanced ? 'initial' : 'none'
    }
    const driveTimelanguage = LanguageUtilities.getPrefixByDriveType(typeOfDrive)
    //console.log(typeOfDrive, driveTimelanguage.location)
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
                           selectoptions={allLocations.map((location: LocationModel) => ({
                               ...location,
                               Name: driveTimelanguage.location + location.name
                           }))}>

                    </Field> </Box>
                <Box
                    sx={fieldWrapper}
                >
                    <Field name={orderFields.startHour} component={HourPicker}
                           label={driveTimelanguage.timeStart}/>
                </Box>
                <Box sx={fieldWrapper}
                >
                    <Field name={orderFields.finishHour} custom={{inActive: typeOfDrive !== DriveType.Tsamud}} component={HourPicker}
                           label={driveTimelanguage.timeEnd}/>
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
                    ...fieldWrapper,
                    display: 'flex',
                    flexDirection: 'row'
                }}
                >
                    <Button sx={{display: isAdvanced ? 'none' : 'initial'}} variant="text" type="button"
                            onClick={() => handleSetAdvanced(true)}>{TRL.Advanced}</Button>
                    <Divider/>
                    <Button sx={{m: '5px'}} variant="contained" color={'primary'} type="button"
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
    // @ts-ignore
    const [_typeOfDrive, set_typeOfDrive] = useState(initialValues.TypeOfDrive as DriveType)
    let formValues = {...initialValues};


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
            handleSubmit={(event: Event, values: any) => {
                if (!formProps.isInEdit) {
                    return
                }
                dispatch({
                    type: ActionsTypes.UPDATE_ORDER,
                    payload: {
                        id: id
                    }
                })

            }}
            render={({handleSubmit}: any) => (MaterialUiForm({
                ...formProps,
                typeOfDrive: _typeOfDrive,
                handleSubmit,
            }))

            }/>
    )
}


