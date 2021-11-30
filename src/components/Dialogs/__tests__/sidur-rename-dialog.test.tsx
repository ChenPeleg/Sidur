import {mount} from 'enzyme';

import React from 'react';
import {act, render} from '@testing-library/react';
import {Provider} from 'react-redux';
import configureStore from '../../../__tests-utils__/redux-mock-store';
import {TextField} from '@mui/material';
import {SidurRenameDialog} from '../sidur-rename-dialog';
import Mock = jest.Mock;


describe('Sidur rename import Dialog', () => {
    let fileDialog: any = null;
    let component: any = null;
    let _baseElement: any = null;
    let store: any;
    let onClose: Mock = jest.fn();
    const sidurDefaultName = 'name of sidur'
    beforeEach(async () => {
        onClose = jest.fn();

        const middlewares: any = []
        const mockStore = configureStore(middlewares);
        store = mockStore({});
        fileDialog = (<Provider store={store}><SidurRenameDialog selectedValue={sidurDefaultName} open={true} key={'1'} onClose={onClose}/>
        </Provider>);
        component = mount(fileDialog);

        const {baseElement} = render(fileDialog);
        _baseElement = baseElement

    })

    it('component renders', async () => {
        expect(component.children()).toHaveLength(1);
        expect(component).toBeTruthy();
        expect(_baseElement.innerHTML.toString()).toContain('MuiDialog');
    });
    it('renders one text-field', async () => {
        expect(component.find(TextField).length).toBeGreaterThan(0);
    });
    it('closes dialog on press cancel', async () => {

        component.find('#sidur-rename-cancel-button').hostNodes().first().simulate('click');
        expect(onClose).toHaveBeenCalledWith(null);


    });
    it('entering value and pressing approve triggers dispatch', async () => {

        act(() => {
            const input = component.find('input#sidur-rename-dialog-text-field');

            input.instance().value = 'rename sidur';
            component.find('#sidur-rename-approve-button').hostNodes().first().simulate('click');
            expect(onClose).toHaveBeenCalledWith('rename sidur');

         
        })


    })


})



