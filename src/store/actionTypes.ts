import {ActionType} from './store.types';

interface ObjectLiteral {
    [key: string]: ActionType;
}


export const actionTypes: ObjectLiteral = {
    ADD_ORDER: 'ADD_ORDER',
    UPDATE_ORDER: 'UPDATE_ORDER',
    DELETE_ORDER: 'DELETE_ORDER',
    EDIT_ORDER: 'EDIT_ORDER',
}


