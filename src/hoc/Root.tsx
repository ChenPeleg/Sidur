import React from 'react';
import './App.css';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from '../store/reducer';


const store = createStore(reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__());

export const Root = ({
                         children,
                         initialState = {}
                     }: any) => (
    <React.StrictMode> <Provider store={store}>{children}</Provider></React.StrictMode>
);

