import React from 'react';
import '../../../setupTests'
import {shallow} from 'enzyme';
import {AddButton, AddButtonProps} from '../add-button';
import {translations} from '../../../services/translations';


const clickMock = jest.fn()
const props: AddButtonProps = {
    sx: null,
    addClickHandler: clickMock
}
const addButton = shallow(<AddButton addClickHandler={props.addClickHandler}/>);
describe('Add Button', () => {


    it('only one button', () => {
        expect(addButton.children()).toHaveLength(1);
    });
    it('only have text  AddOrder', () => {
        // expect(addButton.children()).toHaveLength(1);
        expect(addButton.text().includes(translations.AddOrder)).toBe(true);
    });
    it('click triggers click handler', () => {

        addButton.find('#add-order-button').simulate('click');
        expect(clickMock).toHaveBeenCalled()
    });

})



