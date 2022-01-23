import {IAction, SidurStore} from './store.types';
import {ActionsTypes} from './types.actions';

export type DisplayReducerFunctions =
    ActionsTypes.CHANGE_VIEW | ActionsTypes.STOP_LOADING_ANIMATION |
    ActionsTypes.START_LOADING_ANIMATION


export const DisplayReducer: Record<DisplayReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.CHANGE_VIEW]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.displaySetting = {...newState.displaySetting}
        newState.displaySetting.view = action.payload.value
        return newState
    },
    [ActionsTypes.STOP_LOADING_ANIMATION]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.sessionState = {...newState.sessionState};
        newState.sessionState.isAnimationRunning = false;

        return newState
    },
    [ActionsTypes.START_LOADING_ANIMATION]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.sessionState = {...newState.sessionState};
        newState.sessionState.isAnimationRunning = true
        return newState
    }


}



