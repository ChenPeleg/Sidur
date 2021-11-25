import React from 'react';
import '../../../setupTests'
import {shallow} from 'enzyme';
import {CloneButton, CloneButtonProps} from '../clone-button';


const clickMock = jest.fn()
const props: CloneButtonProps = {
    sx: null,
    cloneClickHandler: clickMock
}
const addButton = shallow(<CloneButton cloneClickHandler={props.cloneClickHandler} sx={null}/>);
describe('basic app rendering', () => {


    it('only one button', () => {
        expect(addButton.children()).toHaveLength(1);
    });
    it('only have text to add', () => {
        // expect(addButton.children()).toHaveLength(1);
        expect(addButton.html()).toContain('ContentCopyIcon');
    });
    it('click triggers click handler', () => {

        addButton.find('#clone-button').simulate('click');
        expect(clickMock).toHaveBeenCalled()
    });

})



