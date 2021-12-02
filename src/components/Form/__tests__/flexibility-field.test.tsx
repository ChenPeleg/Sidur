import {mount} from 'enzyme';

import React from 'react';
import {render} from '@testing-library/react';
import {Slider} from '@mui/material';
import {TextFieldPropertiesModel} from '../../../models/text-field-properties.model';
import {RenderFlexibilityField} from '../flexibility-field';


describe('Form Flexibility field ', () => {
    let rawComponent: any = null;
    let wrapper: any = null;
    let _baseElement: any = null;

    const onChangeStub = jest.fn()
    const TextFieldProps: TextFieldPropertiesModel = {
        input: {
            value: [-10, 20],
            onChange: onChangeStub
        },
        label: 'flx',
        meta: {
            touched: null,
            error: null
        },
        custom: {
            inActive: false
        }
    };
    beforeEach(async () => {


        rawComponent = (
            <RenderFlexibilityField  {...TextFieldProps} />
        );
        wrapper = mount(rawComponent);

        const {baseElement} = render(rawComponent);
        _baseElement = baseElement

    })

    it('component renders', async () => {
        expect(wrapper.children()).toHaveLength(3);
        expect(wrapper).toBeTruthy();
        expect(_baseElement.innerHTML.toString()).toContain('MuiSlider');
    });


    it('renders one slider', async () => {
        expect(wrapper.find(Slider).length).toBeGreaterThan(0);
    });
    it('change event triggers bound input onChange function', async () => {

        wrapper.find(Slider).props().onChange([-20, 30])
        expect(onChangeStub).toHaveBeenCalledWith([-20, 30]);


    });

})



