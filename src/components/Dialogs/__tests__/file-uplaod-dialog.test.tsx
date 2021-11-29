import {FileUploadDialog} from '../file-uplaod-dialog';
import {shallow} from 'enzyme';

import React from 'react';
import {render} from '@testing-library/react';
import Mock = jest.Mock;


describe('File Upload Dialog', () => {
    let fileDialog: any = null;
    let component: any = null;
    let _baseElement: any = null;
    let onClose: Mock = jest.fn();
    beforeEach(async () => {
        onClose = jest.fn();
        fileDialog = (<FileUploadDialog selectedValue={'abc'} open={true} key={'1'} onClose={onClose}/>);
        component = shallow(fileDialog);
        const {baseElement} = render(fileDialog);
        _baseElement = baseElement

    })

    it('component renders', async () => {
        expect(component.children()).toHaveLength(1);
        expect(component).toBeTruthy();
        expect(_baseElement.innerHTML.toString()).toContain('MuiDialog');
    });
    it('only have text to add', async () => {
        expect(component.find('#choose-file-button')).toHaveLength(1);
    });
    it('closes dialog on press cancel', () => {
        component.find('#file-upload-cancel-button').simulate('click')
        expect(onClose).toHaveBeenCalledWith(null);

    })
    it('click triggers click handler', async () => {

        // component.find('#add-order-button').simulate('click');
        //  expect(onClose).toHaveBeenCalled()
    });

})



