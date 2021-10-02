import React from 'react';
import {Checkbox, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField} from '@material-ui/core';
import {Field, Form} from 'react-final-form';
import validate from './validate';
import {makeStyles} from '@material-ui/core/styles';
import {translations} from '../services/translations';

interface TextFieldProps {
    input: any,
    label: any,
    meta: {
        touched: any,
        error: any
    },
    custom: any
}

interface MuiFormProps {
    handleSubmit: any,
    pristine: any,
    reset: any,
    submitting: any
}

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

const RenderTextField = (
    {
        input,
        label,
        meta: {
            touched,
            error
        },
        ...custom
    }: TextFieldProps,
) => (
    <TextField
        dir={'rtl'}
        style={{direction: 'rtl'}}
        label={label}
        className={useStyles().root}
        // hintText={label}
        // floatingLabelText={label}
        // errorText={touched && error}
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
        checked={input.value ? true : false}
        // onCheck={input.onChange}
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
        // floatingLabelText={label}
        // errorText={touched && error}
        {...input}
        onChange={(event: any, index: any, value: any) => input.onChange(value)}
        children={children}
        {...custom}
    />
);

const MaterialUiForm = (muiFormProps: MuiFormProps) => {
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

                    name="firstName"
                    component={RenderTextField}
                    label={TRL.Name}
                />
            </div>
            <div className={classes.fieldWrapper}>
                <Field name="FromHour" component={RenderTextField}
                       label={TRL.From + TRL.Hour}/>
            </div>
            <div className={classes.fieldWrapper}>
                <Field name="Untill" component={RenderTextField} label={TRL.Until + ' ' + TRL.Hour}/>
            </div>
            <div className={classes.fieldWrapper}>
                <Field name="sex" component={renderRadioGroup}>
                    <FormControlLabel value="Tsamud" control={<Radio/>} label="Female"/>
                    <FormControlLabel value="OnWay" control={<Radio/>} label="Female"/>

                </Field>
            </div>
            <div className={classes.fieldWrapper}>
                <Field
                    name="favoriteColor"
                    component={renderSelectField}
                    label="Favorite Color"
                >
                    <MenuItem value="ff0000"/>
                    <MenuItem value="00ff00"/>
                    <MenuItem value="0000ff"/>
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
export const OrderCarForm = (formProps: MuiFormProps) => (
    <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({handleSubmit}: any) => (MaterialUiForm({
            ...formProps,
            handleSubmit
        }))

        }/>
)


