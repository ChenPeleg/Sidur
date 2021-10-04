import React from 'react';
import {Button, Checkbox, MenuItem, RadioGroup} from '@material-ui/core';
import {Field, Form} from 'react-final-form';

import {makeStyles} from '@material-ui/core/styles';
import {translations} from '../services/translations';
import {MuiFormPropsModel} from '../models/mui-form-props.model';
import {useDispatch, useSelector} from 'react-redux';
import {validate} from './validate';
import {HourPicker} from './Form/hour-picker';
import {OrderFields, OrderModel} from '../models/Order.model';
import {RenderTextField} from './Form/text-field';
import {RenderSelectField} from './Form/select-field';
import {DriveType} from '../models/DriveType.enum';


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
    fieldWrapperText: {
        display: 'inline-flex',
        padding: '10px',
        maxWidth: '150px'
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

        <form onSubmit={handleSubmit} dir={'rtl'}>
            <div className={classes.fieldWrapperText}>
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
                    name={'TypeOfDrive'}
                    component={RenderSelectField}
                    label={TRL.TypeOfDrive}
                >
                    <MenuItem value={DriveType.Tsamud.toString()}>{TRL.Tsamud}</MenuItem>
                    <MenuItem value={DriveType.OneWayFrom.toString()}> {TRL.OneWayFrom}</MenuItem>
                    <MenuItem value={DriveType.OneWayTo.toString()}>{TRL.OneWayTo}</MenuItem>
                    {/*<MenuItem value={DriveType.TwoWay.toString()}>{TRL.TwoWay}</MenuItem>*/}
                </Field>
            </div>

            <div className={classes.fieldWrapper}>
                <Field
                    name={orderFields.Comments}
                    component={RenderTextField}
                    label={TRL.Comments}
                    // multiLine={true}
                    rows={2}
                />
            </div>
            <div className={classes.fieldWrapper}>
                <Button variant="contained" color={'primary'} type="submit">{TRL.Submit}</Button>


            </div>
        </form>
    );
};
const onSubmit = () => {
}
export const OrderCarForm = (formProps: MuiFormPropsModel) => {
    const dispatch = useDispatch();

    const initialValues = useSelector((state: { defaultOrderValues: OrderModel }) => state.defaultOrderValues);
    console.log(initialValues)
    return (
        <Form
            initialValues={initialValues}
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

