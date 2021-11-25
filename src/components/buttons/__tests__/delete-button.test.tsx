import React from 'react';
import '../../../setupTests'
import {shallow} from 'enzyme';
import {DeleteButton, DeleteButtonProps} from '../delete-button';


const clickMock = jest.fn()
const props: DeleteButtonProps = {
    sx: null,
    deleteClickHandler: clickMock
}
const component = shallow(<DeleteButton deleteClickHandler={props.deleteClickHandler} sx={null}/>);
describe('Delete Button', () => {


    it('contains only one button', () => {
        expect(component.children()).toHaveLength(1);
    });
    it('only have delete icon', () => {
        expect(component.html()).toContain('DeleteIcon');
    });
    it('click triggers click handler', () => {
        component.find('#delete-button').simulate('click');
        expect(clickMock).toHaveBeenCalled()
    });

})



