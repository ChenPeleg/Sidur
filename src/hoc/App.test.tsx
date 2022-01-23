import React from 'react';
import {shallow} from 'enzyme';
import App from './App';
import {Root} from './Root';
import '../setupTests'

let wrapped: any;
describe('basic app rendering', () => {
    beforeEach(() => {
        wrapped = shallow(
            <Root>
                <App/>
            </Root>
        );
    });

    afterEach(() => {
        if (wrapped) {
            wrapped.unmount();
        }
    });

    it('renders correctly', () => {
       

        expect(wrapped).toEqual({});
    });

})



