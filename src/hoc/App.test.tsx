import React from 'react';
import {Provider} from 'react-redux';


// @ts-ignore
const ReduxProvider = ({
                           children,
                           reduxStore
                       }: any) => (
    <Provider store={reduxStore}>{children}</Provider>
)

test('renders learn react link', async () => {

});
