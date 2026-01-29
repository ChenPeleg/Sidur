import React, {useState, useEffect} from 'react';
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

const createInputProps = (name: string, value: any, onChange: (name: string, val: any) => void) => ({
    name,
    value: value === undefined || value === null ? '' : value,
    onChange: (eventOrValue: any, possibleValue?: any) => {
         let val = eventOrValue;
         if (possibleValue !== undefined) {
             val = possibleValue;
         } else if (eventOrValue && eventOrValue.target && eventOrValue.target.value !== undefined) {
             val = eventOrValue.target.value;
         }
         onChange(name, val);
    }
});

const getInputAdapter = (name: string, values: any, handleChange: any): { input: any, meta: any, custom: any } => {
    return {
        input: createInputProps(name, values ? values[name] : '', handleChange),
        meta: {
            touched: false,
            error: null
        },
        custom: {}
    }
}

export const OrderCarForm = (formProps: MuiFormPropsModel) => {
    const dispatch = useDispatch();
    const id = formProps.orderId;
    const orders = useSelector((state: { orders: OrderModel[] }) => state.orders);
    
    // Find initial order
    const initialValues = orders.find(order => order.id === id);

    // State
    const [values, setValues] = useState<OrderModel | undefined>(initialValues);
    const [isAdvanced, setIsAdvanced] = useState(false);

    useEffect(() => {
        if (initialValues && !values) {
             setValues(initialValues);
        }
    }, [initialValues, values]);

    if (!values) return <div>Loading...</div>;

    const handleFieldChange = (name: string, value: any) => {
        const newValues = { ...values, [name]: value };
        setValues(newValues);

        if (formProps.isInEdit) {
             dispatch({
                type: ActionsTypes.UPDATE_ORDER_IN_EDIT,
                payload: newValues
            })
        }
    }

    const handleSubmit = () => {
         if (!formProps.isInEdit) {
            return;
        }
        dispatch({
            type: ActionsTypes.UPDATE_ORDER,
            payload: {
                id: id,
            },
        });
    }

    const typeOfDrive = values.TypeOfDrive || undefined;
    const driveTimeLanguage = LanguageUtilities.getPrefixByDriveType(typeOfDrive);
    const locations = formProps.locations;

    const advanceFieldWrapper: SxProps = {
        ...fieldWrapper as SxProps,
        display: isAdvanced ? 'initial' : 'none'
    }

    const propsFor = (name: string) => getInputAdapter(name, values, handleFieldChange);
    
    // TODO: (Refactor) Remove these `any` casts.
    // The `TextFieldPropertiesModel` is currently too strict (missing optional props like `rows`, `type`, `multiline`).
    // We cast to `any` here to allow passing these props without changing the shared model which affects other components.
    // A proper fix would be to create a more flexible interface or update the existing one + fix all consumers.
    const TextFieldAny = RenderTextField as any;
    const SelectFieldAny = RenderSelectField as any;
    const AutoCompleteAny = RenderSelectFieldAutoComplete as any;
    const HourPickerAny = HourPicker as any;
    const PassengerFieldAny = RenderPassengerField as any;
    const FlexibilityFieldAny = RenderFlexibilityField as any;

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} dir={'rtl'}>
            <Box id={'form-wrapper'} sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
            }}>
                <Box sx={fieldWrapperText}>
                    <TextFieldAny 
                        {...propsFor(orderFields.driverName)}
                        label={TRL.Name}
                    />
                </Box>
                <Box sx={selectFieldWrapper}>
                    <SelectFieldAny
                        {...propsFor('TypeOfDrive')}
                        label={TRL.TypeOfDrive}
                    >
                         <MenuItem value={DriveType.Tsamud.toString()}>{TRL.Tsamud}</MenuItem>
                         <MenuItem value={DriveType.OneWayFrom.toString()}> {TRL.OneWayFrom}</MenuItem>
                         <MenuItem value={DriveType.OneWayTo.toString()}>{TRL.OneWayTo}</MenuItem>
                    </SelectFieldAny>
                </Box>

                 <Box sx={selectFieldWrapper}>
                    <AutoCompleteAny
                           {...propsFor(orderFields.location)}
                           label={TRL.Where}
                           selectoptions={locations.map((location: LocationModel) => ({
                               ...location,
                               Name: driveTimeLanguage.location + location.name
                           }))}
                    />
                 </Box>

                 <Box sx={fieldWrapper}>
                    <HourPickerAny 
                        {...propsFor(orderFields.startHour)}
                        label={driveTimeLanguage.timeStart}
                    />
                </Box>
                <Box sx={fieldWrapper}>
                    <HourPickerAny 
                        {...propsFor(orderFields.finishHour)}
                        custom={{inActive: typeOfDrive !== DriveType.Tsamud}} 
                        label={driveTimeLanguage.timeEnd}
                    />
                </Box>
                
                 <Box sx={fieldWrapper}> 
                    <TextFieldAny 
                        {...propsFor(orderFields.Comments)}
                        label={TRL.Comments}
                        rows={2}
                    />
                 </Box>

                 <Box sx={fieldWrapper}> 
                     <PassengerFieldAny 
                        {...propsFor(orderFields.passengers)}
                        label={TRL.passengers}
                        type={'text'}
                    />
                 </Box>

                 <Box sx={advanceFieldWrapper}>
                     <FlexibilityFieldAny
                        {...propsFor(orderFields.flexibility[0])}
                        label={TRL.flexibility}
                        rows={2}
                     />
                 </Box>

                 <Box sx={{
                    ...fieldWrapper as SxProps,
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <Button sx={{display: isAdvanced ? 'none' : 'initial'}} variant="text" type="button"
                            onClick={() => setIsAdvanced(true)}>{TRL.Advanced}</Button>
                    <Divider/>
                    <Button sx={{m: '5px'}} variant="contained" color={'primary' as any} type="button"
                            onClick={handleSubmit}>{TRL.Submit}</Button>
                </Box>

            </Box>
        </form>
    )
}
