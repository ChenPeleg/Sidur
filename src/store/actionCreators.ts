import {OrderModel} from '../models/Order.model';
import {IAction} from './store.types';
import {ActionTypes} from './actionTypes';

export const addOrder = (order: OrderModel): any => {
    const action: IAction = {
        type: ActionTypes.ADD_NEW_ORDER,
        
        payLoad: {}
    };

    return {}
}

export const t = () => {
}
