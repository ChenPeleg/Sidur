import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';
import {IAction} from './store.types';
import {ActionTypes} from './actionTypes';

// noinspection SpellCheckingInspection
export interface SidurRecord {
    id: string,
    Name: string,
    orders: OrderModel[];
    deletedOrders: OrderModel[]
    defaultOrderValues?: OrderModel,
}

export interface SidurStore {
    sidurCollection: SidurRecord[]
    sidurId: string;
    orders: OrderModel[];
    deletedOrders: OrderModel[];
    orderIdInEdit: null | string;
    dataHolderForCurrentOrderInEdit: OrderModel | null;
    defaultOrderValues: OrderModel,
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

const initialState: SidurStore = {
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
        // , {
        //     id: '3',
        //     Name: 'סידור שבת'
        // }, {
        //     id: '4',
        //     Name: 'סידור יום ראשון'
        // }
    ],
    sidurId: '1',
    orders: startOrders,
    orderIdInEdit: '1',
    dataHolderForCurrentOrderInEdit: null,
    deletedOrders: [],
    defaultOrderValues: {...defaultOrderValues}
}

const reducer = (state = initialState, action: IAction) => {
    let newState = {
        ...state
    }
    switch (action.type) {
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


                newState.orders = chosenSidurObj?.orders.map(o => ({...o})) || []
                newState.deletedOrders = chosenSidurObj?.deletedOrders.map(o => ({...o})) || [];
                newState.orderIdInEdit = null;
                newState.dataHolderForCurrentOrderInEdit = null;


            }
            break;
        case ActionTypes.CLICKED_ORDER:
            const clickeOrderId = action.payLoad.id;
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
            newState.orderIdInEdit = clickeOrderId
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
            newState.orderIdInEdit = null

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

            break;
        case ActionTypes.ADD_NEW_ORDER:
            const allOrdersIds: number [] = newState.orders.map(o => Number(o.id));
            const newId = Math.max(...allOrdersIds) + 1;
            const newOrder: OrderModel = {
                ...defaultOrderValues,
                id: newId.toString()
            }
            newState.orders = [...newState.orders]
            newState.orders.unshift(newOrder)


            break;
        default:
            break;

    }

    return newState
}

export default reducer
