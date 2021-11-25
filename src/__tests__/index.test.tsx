import React from 'react';
import ReactDOM from 'react-dom';
import App from '../hoc/App';
import {Root} from '../hoc/Root';


jest.mock('react-dom', () => ({render: jest.fn()}));

describe('Application root', () => {
    it('should render without crashing', () => {
        const div = document.createElement('div');
        div.id = 'root';
        document.body.appendChild(div);
        require('../index.tsx');
        expect(ReactDOM.render).toHaveBeenCalledWith(<Root>
            <App/>
        </Root>, div);
    });
});
