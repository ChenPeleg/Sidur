import React from 'react';
import '../../../setupTests'
import {shallow} from 'enzyme';
import {CloneButton, CloneButtonProps} from '../clone-button';


const clickMock = jest.fn()
const props: CloneButtonProps = {
    sx: null,
    cloneClickHandler: clickMock
}
const component = shallow(<CloneButton cloneClickHandler={props.cloneClickHandler} sx={null}/>);
describe('Clone Button', () => {


    it('only one button', () => {
        expect(component.children()).toHaveLength(1);
    });
    it('only have text to add', () => {
        // expect(addButton.children()).toHaveLength(1);
        expect(component.html()).toContain('ContentCopyIcon');
    });
    it('click triggers click handler', () => {

        component.find('#clone-button').simulate('click');
        expect(clickMock).toHaveBeenCalled()
    });

})



