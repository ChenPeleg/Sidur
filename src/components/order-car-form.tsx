import React from 'react';
import {Checkbox, MenuItem, RadioGroup, Select, TextField} from '@material-ui/core';
import {Field, Form} from 'react-final-form';

import {makeStyles} from '@material-ui/core/styles';
import {translations} from '../services/translations';
import {TextFieldPropertiesModel} from '../models/text-field-properties.model';
import {MuiFormPropsModel} from '../models/mui-form-props.model';
import {useDispatch} from 'react-redux';
import {validate} from './validate';
import {HourPicker} from './Form/time-picker';
import {OrderFields, OrderModel} from '../models/Order.model';

const validateFunc = validate;
const TRL = translations;
const useStyles = makeStyles((theme) => ({
    root: {
        direction: theme.direction,
        '& .MuiFormLabel-root': {
            left: 'inherit'
        }
    },
    fieldWrapper: {
        display: 'inline-flex',
        padding: '10px'
    },
    cardBase: {
        direction: theme.direction,
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
const RenderTextField = (
    {
        input,
        label,
        meta: {
            touched,
            error
        },
        ...custom
    }: TextFieldPropertiesModel,
) => (
    <TextField
        dir={'rtl'}
        style={{direction: 'rtl'}}
        label={label}
        className={useStyles().root}

        onChange={input.onChange}
        {...input}
        {...custom}
    />
);

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

const renderSelectField = (
    {
        input,
        label,
        meta: {
            touched,
            error
        },
        children,
        ...custom
    }: any,
) => (
    <Select
        label={label}
        // floatingLabelText={label}
        // errorText={touched && error}
        {...input}
        onChange={(event: any, index: any, value: any) => {
            input.onChange(value)
        }}
        value={input.value}
        children={children}
        {...custom}>

    </Select>
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

        <form onSubmit={handleSubmit} dir={'rtl'}>
            <div className={classes.fieldWrapper}>
                <Field
                    name={orderFields.driverName}
                    component={RenderTextField}
                    label={TRL.Name}
                />
            </div>
            <div className={classes.fieldWrapper}>
                <Field name={orderFields.startHour} component={HourPicker}
                       label={TRL.From + TRL.Hour}/>
            </div>
            <div className={classes.fieldWrapper}>
                <Field name={orderFields.finishHour} component={HourPicker} label={TRL.Until + ' ' + TRL.Hour}/>
            </div>

            <div className={classes.fieldWrapper}>
                <Field
                    name="favoriteColor"
                    component={renderSelectField}
                    label="Favorite Color"
                >
                    <MenuItem value="Tsamud">{TRL.Tsamud}</MenuItem>
                    <MenuItem value="OnWay"> {TRL.OneWayFrom}</MenuItem>
                    <MenuItem value="OneWayFrom">{TRL.OneWayFrom}</MenuItem>
                </Field>
            </div>
            <div className={classes.fieldWrapper}>
                <Field name="employed" component={renderCheckbox} label="Employed"/>
            </div>
            <div className={classes.fieldWrapper}>
                <Field
                    name="notes"
                    component={RenderTextField}
                    label="Notes"
                    // multiLine={true}
                    rows={2}
                />
            </div>
            <div>
                <button type="submit" disabled={pristine || submitting}>Submit</button>
                <button type="button" disabled={pristine || submitting} onClick={() => {
                }}>
                    Clear Values
                </button>
            </div>
        </form>
    );
};
const onSubmit = () => {
}
export const OrderCarForm = (formProps: MuiFormPropsModel) => {
    const dispatch = useDispatch();
    return (
        <Form
            onSubmit={onSubmit}
            validate={(values: any) => {
                dispatch({
                    type: 'FormChagned',
                    payLoad: {
                        values
                    }
                })
                return validate(values)
            }}

            render={({handleSubmit}: any) => (MaterialUiForm({
                ...formProps,
                handleSubmit
            }))

            }/>
    )
}


