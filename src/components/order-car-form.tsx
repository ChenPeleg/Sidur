import React, {useState} from 'react';

import {Field, Form} from 'react-final-form';
import {MuiFormPropsModel} from '../models/mui-form-props.model';
import {useDispatch, useSelector} from 'react-redux';
import {validate} from './validate';
import {HourPicker} from './Form/hour-picker';
import {OrderFields, OrderModel} from '../models/Order.model';
import {RenderTextField} from './Form/text-field';
import {RenderSelectField} from './Form/select-field';
import {DriveType} from '../models/DriveType.enum';
import {Box, Theme} from '@mui/system';
import {Button, Checkbox, MenuItem, RadioGroup} from '@mui/material';
import {translations} from '../services/translations';


const TRL = translations;

type AppProps = {
    orderId: string;
};

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


const renderCheckbox = ({
                            input,
                            label
                        }: any) => (
    <Checkbox
        // label={label}
        checked={!!input.value}
        onChange={input.onChange}
    />
);

const renderRadioGroup = ({
                              input,
                              ...rest
                          }: any) => (
    <RadioGroup
        {...input}
        {...rest}
        //  valueSelected={input.value}
        onChange={(event: any, value: any) => input.onChange(value)}
    />
);


const MaterialUiForm = (muiFormProps: MuiFormPropsModel) => {
    const {
        handleSubmit,
        pristine,
        reset,
        submitting
    } = muiFormProps;
    const classes = useStyles();


    return (

        <form onSubmit={(...args) => submitting(...args)} dir={'rtl'}>

            <Box
                sx={{
                    ...
                        classes
                            .fieldWrapperText
                }}
            >
                <Field
                    name={orderFields.driverName}
                    component={RenderTextField}
                    label={TRL.Name}
                />
            </Box>
            <Box
                sx={{
                    ...classes
                        .fieldWrapper
                }}
            >
                <Field name={orderFields.startHour} component={HourPicker}
                       label={TRL.From + TRL.Hour}/>
            </Box>
            <Box
                sx={{
                    ...
                        classes
                            .fieldWrapper
                }}
            >
                <Field name={orderFields.finishHour} component={HourPicker} label={TRL.Until + ' ' + TRL.Hour}/>
            </Box>

            <Box
                sx={{
                    ...
                        classes
                            .fieldWrapper
                }}
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
            </Box>

            <Box
                sx={{
                    ...
                        classes
                            .fieldWrapper
                }}
            >
                <Field
                    name={orderFields.Comments}
                    component={RenderTextField}
                    label={TRL.Comments}
                    // multiLine={true}
                    rows={2}
                />
            </Box>
            <Box
                sx={{
                    ...
                        classes
                            .fieldWrapper
                }}
            >
                <Button variant="contained" color={'primary'} type="button" onClick={handleSubmit}>{TRL.Submit}</Button>


            </Box>
        </form>
    );
};

export const OrderCarForm = (formProps: MuiFormPropsModel) => {

    const dispatch = useDispatch();
    const submitHandler = (...args: any) => {
        console.log(...args);

    }
    const submittingHandler = (...args: any) => {
        args[0].preventDefault()
        console.log(...args);

    }
    const id = formProps.orderId;
    // const initialValues = useSelector((state: { defaultOrderValues: OrderModel }) => state.defaultOrderValues);
    const order = useSelector((state: { orders: OrderModel[] }) => state.orders);
    const initialValues = order.find(order => order.id === id);
    const [formState, setFormState] = useState(
        {...initialValues}
    );

    return (
        <Form
            initialValues={initialValues}

            onSubmit={(values: any) => {
                // alert('submit')
                // dispatch({
                //     type: ActionTypes.UPDATE_ORDER,
                //     payLoad: {
                //         values
                //     }
                // })
                // return validate(values)
            }}
            validate={(values: any) => {
                // dispatch({
                //     type: ActionTypes.UPDATE_ORDER,
                //     payLoad: {
                //         values
                //     }
                // })
                const newFormState = {...values};
                console.log(newFormState)
                //  setFormState({...values})
                return validate(values)
            }}
            handleSubmit={(event: Event, values: any) => {
                // console.log(formState)
                //
                // dispatch({
                //     type: ActionTypes.UPDATE_ORDER,
                //     payLoad: {
                //         values
                //     }
                // })

            }}
            render={({handleSubmit}: any) => (MaterialUiForm({
                ...formProps,
                handleSubmit,
                //  submitting: submittingHandler
            }))

            }/>
    )
}


