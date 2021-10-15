import {ActionTypes} from './actionTypes';

export type ActionType = string;

export type IAction = {
    type: ActionTypes
    payLoad: any
}
