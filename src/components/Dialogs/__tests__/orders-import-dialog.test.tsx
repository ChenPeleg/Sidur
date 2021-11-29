import {shallow} from 'enzyme';

import React from 'react';
import {render} from '@testing-library/react';
import {OrderImportDialog} from '../orders-import-dialog';
import {Provider} from 'react-redux';
import configureStore from '../../../__tests-utils__/redux-mock-store';
import Mock = jest.Mock;


describe('Orders import Dialog', () => {
    let fileDialog: any = null;
    let component: any = null;
    let _baseElement: any = null;
    let onClose: Mock = jest.fn();
    beforeEach(async () => {
        onClose = jest.fn();

        const middlewares: any = []
        const mockStore = configureStore(middlewares);
        const store = mockStore({});
        fileDialog = (<Provider store={store}><OrderImportDialog open={true} key={'1'} onClose={onClose}/> </Provider>);
        component = shallow(fileDialog);
        const {baseElement} = render(fileDialog);
        _baseElement = baseElement

    })

    it('component renders', async () => {
        expect(component.children()).toHaveLength(2);
        expect(component).toBeTruthy();
        expect(_baseElement.innerHTML.toString()).toContain('MuiDialog');
    });
    it('only have text to add', async () => {
        expect(_baseElement.querySelector('#import-orders-dialog-text-field')).toBeTruthy();
        expect(component.find('#import-orders-dialog-text-field')).toBeTruthy();
    });
    it('closes dialog on press cancel', async () => {
        //_baseElement.querySelector('#import-orders-dialog-text-field').simulate('click')

        component.find('button').simulate('click')
        expect(onClose).toHaveBeenCalledWith(null);

    })
    it('click triggers click handler', async () => {

        // component.find('#add-order-button').simulate('click');
        //  expect(onClose).toHaveBeenCalled()
    });

})



