import {ActionTypes} from './actionTypes';
import {IAction, SidurStore} from './store.types';

type SidurReducerFunctions =
    ActionTypes.RENAME_SIDUR | ActionTypes.DELETE_SIDUR | ActionTypes.ADD_NEW_SIDUR | ActionTypes.ADD_NEW_ORDER

// const sidurReducer: Record<SidurReducerFunctions, (state: SidurStore, action: IAction) => SidurStore>
// {
//     [ActionTypes.RENAME_SIDUR.toString()]
// :
//     (state: SidurStore, action: IAction): SidurStore => {
//         return state
//
//     }
// }
const SidurReducer: any = {
    [ActionTypes[ActionTypes.CHOOSE_SIDUR]]: (state: SidurStore, action: IAction): SidurStore => {
        return state

    }
}
