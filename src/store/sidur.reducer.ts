import {ActionTypes} from './actionTypes';
import {IAction, SidurRecord, SidurStore} from './store.types';
import {OrderModel} from '../models/Order.model';

type SidurReducerFunctions =
    ActionTypes.RENAME_SIDUR | ActionTypes.DELETE_SIDUR | ActionTypes.ADD_NEW_SIDUR | ActionTypes.ADD_NEW_ORDER | ActionTypes.CHOOSE_SIDUR

// const sidurReducer: Record<SidurReducerFunctions, (state: SidurStore, action: IAction) => SidurStore>
// {
//     [ActionTypes.RENAME_SIDUR.toString()]
// :
//     (state: SidurStore, action: IAction): SidurStore => {
//         return state
//
//     }
// }
export const SidurReducer: any = {
    [ActionTypes.CHOOSE_SIDUR]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const chosenSidurId = action.payLoad.id;
        const previousSidurId = newState.sidurId;
        if (chosenSidurId === previousSidurId) {
            return newState
        }
        newState.sidurId = chosenSidurId;
        const chosenSidurObj: SidurRecord | undefined = newState.sidurCollection.find((record: SidurRecord) => record.id === chosenSidurId);
        if (chosenSidurObj !== undefined) {
            const previousSidurObj: SidurRecord | undefined = newState.sidurCollection.find((record: SidurRecord) => record.id === previousSidurId);
            if (previousSidurObj !== undefined) {
                const NewPreviousSidurObj = {...previousSidurObj};
                NewPreviousSidurObj.orders = newState.orders.map(o => ({
                    ...o
                }));
                NewPreviousSidurObj.deletedOrders = newState.deletedOrders.map(o => ({
                    ...o
                }));

                NewPreviousSidurObj.defaultOrderValues = {
                    ...
                        NewPreviousSidurObj
                            .defaultOrderValues
                } as OrderModel;
                newState.sidurCollection = newState.sidurCollection.map((sidur: SidurRecord) => {
                    if (sidur.id === previousSidurId) {
                        return NewPreviousSidurObj
                    } else {
                        return sidur
                    }
                })
            }

            newState = setChosenSidur(newState, chosenSidurObj);


        }
        return newState

    }
}
const setChosenSidur = (state: SidurStore, chosenSidur: SidurRecord): SidurStore => {
    const newState = {...state};
    newState.orders = chosenSidur?.orders.map(o => ({...o})) || []
    newState.deletedOrders = chosenSidur?.deletedOrders.map(o => ({...o})) || [];
    newState.orderIdInEdit = null;
    newState.dataHolderForCurrentOrderInEdit = null;
    return newState

}
