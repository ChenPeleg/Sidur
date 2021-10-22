import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';
import {IAction} from './store.types';
import {ActionTypes} from './actionTypes';
import {SaveLoadService} from '../services/save-load.service';
import {DownloadFile} from '../services/download-file';
import {translations} from '../services/translations';
import {Utilites} from '../services/utilites';

export interface SidurRecord {
    id: string,
    Name: string,
    orders: OrderModel[];
    deletedOrders: OrderModel[];
    defaultOrderValues?: OrderModel,
}

export interface SidurStore {
    sidurCollection: SidurRecord[];
    sidurArchive: SidurRecord[];
    sidurId: string;
    orders: OrderModel[];
    deletedOrders: OrderModel[];
    orderIdInEdit: null | string;
    dataHolderForCurrentOrderInEdit: OrderModel | null;
    defaultOrderValues: OrderModel,
}

const DefaultSidur: SidurRecord = {
    id: '1',
    Name: 'סידור יום שני',
    orders: [],
    deletedOrders: []
}
const defaultOrderValues: OrderModel = {
    id: '1',
    driverName: '',
    startHour: '08:00',
    finishHour: '09:00',
    TypeOfDrive: DriveType.OneWayTo,
    Comments: ''
}

const startOrders: OrderModel[] = ['Chen', 'Avi', 'Roni'].map((name: string, index: number): OrderModel => ({
    ...defaultOrderValues,
    id: (index + 1).toString(),
    driverName: name
}))

const defaultInitialState: SidurStore = {
    sidurArchive: [],
    sidurCollection: [{
        id: '1',
        Name: 'סידור יום שני',
        orders: [],
        deletedOrders: []
    }, {
        id: '2',
        Name: 'סידור גנים',
        orders: [],
        deletedOrders: []
    }

    ],
    sidurId: '1',
    orders: startOrders,
    orderIdInEdit: '1',
    dataHolderForCurrentOrderInEdit: null,
    deletedOrders: [],
    defaultOrderValues: {...defaultOrderValues}
}

const stateFromLocalStorage: SidurStore | undefined = SaveLoadService.loadFromLocalStorage('chen').data?.savedStore
const initialState = stateFromLocalStorage || defaultInitialState;

const reducer = (state: SidurStore = initialState, action: IAction) => {
    let newState = {
        ...state
    }
    let shouldUpdateSidurCollection: boolean = false;
    switch (action.type) {
        /**
         * @code Sidur actions
         */
        case ActionTypes.CHOOSE_SIDUR:
            const chosenSidurId = action.payLoad.id;
            const previousSidurId = newState.sidurId;
            if (chosenSidurId === previousSidurId) {
                break;
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

                setChosenSidur(newState, chosenSidurObj);
                // newState.orders = chosenSidurObj?.orders.map(o => ({...o})) || []
                // newState.deletedOrders = chosenSidurObj?.deletedOrders.map(o => ({...o})) || [];
                // newState.orderIdInEdit = null;
                // newState.dataHolderForCurrentOrderInEdit = null;


            }
            break;

        case ActionTypes.RENAME_SIDUR:
            const sidurId = newState.sidurId;
            const newName = action.payLoad.value;
            if (!newName) {
                break;
            }
            newState.sidurCollection = newState.sidurCollection.map((sidur: SidurRecord) => {
                if (sidur.id === sidurId) {
                    const updatedSidur = {...sidur};
                    updatedSidur.Name = newName;
                    return updatedSidur
                } else {
                    return sidur
                }
            });
            break;
        case ActionTypes.ADD_NEW_SIDUR:
            const newSidurId = Utilites.getNextId(newState.sidurCollection.map(o => o.id))
            const newSidur: SidurRecord = {
                id: newSidurId,
                Name: translations.Sidur + ' ' + newSidurId,
                orders: [],
                deletedOrders: [],
                defaultOrderValues: newState.defaultOrderValues
            }
            newState.sidurCollection = newState.sidurCollection.map(c => c);
            newState.sidurCollection.push(newSidur);
            newState.sidurId = newSidurId;
            newState.orderIdInEdit = null;
            newState.dataHolderForCurrentOrderInEdit = null;
            break;
        case ActionTypes.DELETE_SIDUR:
            const sidurIdToDelete = newState.sidurId;
            newState.sidurCollection = newState.sidurCollection.filter(s => s.id !== sidurIdToDelete);

            const chosenSidurAfterDelete: SidurRecord = newState.sidurCollection[0] || DefaultSidur;
            setChosenSidur(newState, chosenSidurAfterDelete);
            break;
        /**
         * @code Order actions
         */
        case ActionTypes.CLICKED_ORDER:
            const clickedOrderId = action.payLoad.id;
            if (newState.dataHolderForCurrentOrderInEdit) {
                const currentOrderId = newState.dataHolderForCurrentOrderInEdit.id
                newState.orders = newState.orders.map(order => {
                    if ((currentOrderId === order.id) && newState.dataHolderForCurrentOrderInEdit) {
                        order = newState.dataHolderForCurrentOrderInEdit
                    }
                    return order
                });
            }
            newState.dataHolderForCurrentOrderInEdit = null;
            newState.orderIdInEdit = clickedOrderId
            break;
        case ActionTypes.UPDATE_ORDER:
            const orderId = action.payLoad.id;
            newState.orders = newState.orders.map(order => {
                if ((orderId === order.id) && newState.dataHolderForCurrentOrderInEdit) {
                    order = newState.dataHolderForCurrentOrderInEdit
                }
                return order
            });
            newState.dataHolderForCurrentOrderInEdit = null;
            newState.orderIdInEdit = null;
            shouldUpdateSidurCollection = true;
            break;
        case ActionTypes.UPDATE_ORDER_IN_EDIT:
            newState.dataHolderForCurrentOrderInEdit = action.payLoad;
            break;
        case ActionTypes.DELETE_ORDER:
            const deleteOrderId = action.payLoad.id;
            newState.orders = newState.orders.filter(order => deleteOrderId !== order.id)
            if (newState.dataHolderForCurrentOrderInEdit && newState.dataHolderForCurrentOrderInEdit.id === deleteOrderId) {
                newState.dataHolderForCurrentOrderInEdit = null;
            }
            if (newState.orderIdInEdit === deleteOrderId) {
                newState.orderIdInEdit = null;
            }
            shouldUpdateSidurCollection = true
            break;
        case ActionTypes.ADD_NEW_ORDER:
            const newId = Utilites.getNextId(newState.orders.map(o => o.id))
            const newOrder: OrderModel = {
                ...defaultOrderValues,
                id: newId
            }
            newState.orders = [...newState.orders]
            newState.orders.unshift(newOrder);
            shouldUpdateSidurCollection = true;
            break;
        /**
         * @code General User actions
         */
        case ActionTypes.EXPORT_ALL:
            newState.sidurCollection = UpdateSidurCollectionWithCurrenSidur(newState);
            DownloadFile('sidur.json', JSON.stringify(newState))
            break;
        default:
            break;

    }
    if (shouldUpdateSidurCollection) {
        newState.sidurCollection = UpdateSidurCollectionWithCurrenSidur(newState)
        saveToLocalStorage(newState);

    }
    return newState
}
const UpdateSidurCollectionWithCurrenSidur = (state: SidurStore): SidurRecord[] => {
    const newState = {...state}
    const sidurId = newState.sidurId;
    const updatedOrders = newState.orders.map(o => ({...o}))
    newState.sidurCollection = newState.sidurCollection.map((sidur: SidurRecord) => {
        if (sidur.id === sidurId) {
            const updatedSidur = {...sidur};
            updatedSidur.orders = updatedOrders;
            return updatedSidur
        } else {
            return sidur
        }
    });
    return newState.sidurCollection
}
const saveToLocalStorage = (state: SidurStore): void => {
    SaveLoadService.saveToLocalStorage({
        userName: 'chen',
        userId: 'chen',
        savedStore: state,
        timeStamp: ''
    })
}
const setChosenSidur = (state: SidurStore, chosenSidur: SidurRecord): SidurStore => {
    const newState = {...state};
    newState.orders = chosenSidur?.orders.map(o => ({...o})) || []
    newState.deletedOrders = chosenSidur?.deletedOrders.map(o => ({...o})) || [];
    newState.orderIdInEdit = null;
    newState.dataHolderForCurrentOrderInEdit = null;
    return newState

}
export default reducer
