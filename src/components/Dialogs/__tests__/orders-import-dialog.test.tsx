
import React from 'react';
import {act, render} from '@testing-library/react';
import {OrderImportDialog} from '../orders-import-dialog';
import {Provider} from 'react-redux';
import configureStore from '../../../__tests-utils__/redux-mock-store';
import {TextField} from '@mui/material';
import Mock = jest.Mock;


describe('Orders import Dialog', () => {
    let fileDialog: any = null;
    let component: any = null;
    let _baseElement: any = null;
    let store: any;
    let onClose: Mock = jest.fn();
    beforeEach(async () => {
        onClose = jest.fn();

        const middlewares: any = []
        const mockStore = configureStore(middlewares);
        store = mockStore({});
        fileDialog = (<Provider store={store}><OrderImportDialog open={true} key={'1'} onClose={onClose}/> </Provider>);


        const {baseElement} = render(fileDialog);
        _baseElement = baseElement

    })

    it('component renders', async () => {
        // expect(component.children()).toHaveLength(2);
        // expect(component).toBeTruthy();
        // expect(_baseElement.innerHTML.toString()).toContain('MuiDialog');
    });
    it('renders one text-field', async () => {
        // expect(component.find('#import-orders-dialog-text-field').hostNodes().length).toBeGreaterThan(0);
    });
    it('closes dialog on press cancel', async () => {

        // component.find('#orders-import-cancel-button').hostNodes().first().simulate('click');
        // expect(component.find('#orders-import-cancel-button').hostNodes().length).toBeGreaterThan(0);
        // expect(onClose).toHaveBeenCalledWith();


    });
    it('entering value and pressing approve triggers dispatch', async () => {

        act(() => {
            // const textField = component.find(TextField);
            // const input = component.find('textarea#import-orders-dialog-text-field');
            // input.instance().value = 'orders as text'
            // component.find('#orders-import-approve-button').hostNodes().first().simulate('click');
            // expect(component.find('#orders-import-approve-button').hostNodes().length).toBeGreaterThan(0);
            // expect(onClose).toHaveBeenCalledWith();
            //
            // expect(store.getActions()).toEqual([{
            //         'payload': {'importedOrders': 'orders as text'},
            //         'type': 'IMPORT_ORDERS_AS_TEXT'
            //     }]
            // );
        })


    })


})



