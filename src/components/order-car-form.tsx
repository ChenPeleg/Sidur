import React from 'react';
import {Checkbox, MenuItem, Radio, RadioGroup, Select, TextField} from '@material-ui/core';
import {Field, Form} from 'react-final-form';
import validate from './validate';

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
const renderTextField = (
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
        hintText={label}
        floatingLabelText={label}
        errorText={touched && error}
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
        valueSelected={input.value}
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
        floatingLabelText={label}
        errorText={touched && error}
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
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Field
                    name="firstName"
                    component={renderTextField}
                    label="First Name"
                />
            </div>
            <div>
                <Field name="lastName" component={renderTextField} label="Last Name"/>
            </div>
            <div>
                <Field name="email" component={renderTextField} label="Email"/>
            </div>
            <div>
                <Field name="sex" component={renderRadioGroup}>
                    <Radio value="male"/>
                    <Radio value="female"/>
                </Field>
            </div>
            <div>
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
            <div>
                <Field name="employed" component={renderCheckbox} label="Employed"/>
            </div>
            <div>
                <Field
                    name="notes"
                    component={renderTextField}
                    label="Notes"
                    multiLine={true}
                    rows={2}
                />
            </div>
            <div>
                <button type="submit" disabled={pristine || submitting}>Submit</button>
                <button type="button" disabled={pristine || submitting} onClick={reset}>
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


