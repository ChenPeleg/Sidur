import {mount} from 'enzyme';

import React from 'react';
import {act, render} from '@testing-library/react';
import {Provider} from 'react-redux';
import configureStore from '../../../__tests-utils__/redux-mock-store';
import {TextField} from '@mui/material';
import {VehicleEditDialog} from '../vehicle-edit-dialog';
import {VehicleModel} from '../../../models/Vehicle.model';
import Mock = jest.Mock;


describe('Vehicle edit  Dialog', () => {
    let fileDialog: any = null;
    let component: any = null;
    let _baseElement: any = null;
    let store: any;
    let onClose: Mock = jest.fn();
    let onDelete: Mock = jest.fn();
    const sidurDefaultName = 'Shilgia'
    const mockVehicleData: VehicleModel = {
        id: '1',
        vehicleName: '1',
        seats: '7',
        kmLimit: '1',
        startHour: '1',
        endHour: '1',
        Comments: '1'
    }
    beforeEach(async () => {
        onClose = jest.fn();
        const mockVehiclData = {
            id: '1',
            vehicleName: '1',
            seats: '7',
            kmLimit: '1',
            startHour: '1',
            endHour: '1',
            Comments: '1'
        }
        const middlewares: any = []
        const mockStore = configureStore(middlewares);
        store = mockStore({});
        fileDialog = (<Provider store={store}>
            <VehicleEditDialog onDelete={onDelete} vehicleData={mockVehicleData} open={true} key={'1'} onClose={onClose}/>
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

        component.find('#vehicle-edit-cancel-button').hostNodes().first().simulate('click');
        expect(onClose).toHaveBeenCalledWith(null);


    });
    it('entering value and pressing approve triggers dispatch', async () => {

        act(() => {
            const inputName = component.find('input#vehicle-rename-dialog-text-field');
            const inputComments = component.find('input#vehicle-comments-dialog-text-field');
            inputName.instance().value = 'rename car';
            inputComments.instance().value = 'car comments';
            component.find('#vehicle-edit-approve-button').hostNodes().first().simulate('click');
            expect(onClose).toHaveBeenCalledWith({
                    'Comments': 'car comments',
                    'endHour': '1',
                    'id': '1',
                    'kmLimit': '1',
                    'seats': '7',
                    'startHour': '1',
                    'vehicleName': 'rename car'
                }
            );


        })


    })


})



