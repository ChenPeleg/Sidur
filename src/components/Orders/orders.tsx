import React from "react";
import { OrderCar } from "./order-car";
import { useDispatch, useSelector } from "react-redux";
import { OrderModel } from "../../models/Order.model";
import { ActionsTypes } from "../../store/types.actions";
import { AddButton } from "../Icons/add-button";
import { SessionModel } from "../../store/store.types";
import { AppButton } from "../buttons/app-button";
import { translations } from "../../services/translations";

export const Orders = () => {
    const dispatch = useDispatch();
    const orders = useSelector(
        (state: { orders: OrderModel[] }) => state.orders
    );
    const orderIdInEdit = useSelector(
        (state: { sessionState: SessionModel }) =>
            state.sessionState.orderIdInEdit
    );
    const addClickHandler = (_event: any) => {
        dispatch({
            type: ActionsTypes.ADD_NEW_ORDER,
            payload: {},
        });
    };
    const importOrdersClickHandler = (_event: any) => {
        dispatch({
            type: ActionsTypes.OPEN_IMPORT_SHEETS_MODAL,
        });
    };

    return (
        <div className={"max-w-3xl mx-auto"}>
            <div className="flex flex-row items-center mb-[10px] justify-center gap-[20px] min-w-[30vw]">
                <AddButton addClickHandler={addClickHandler} />

                {orders.length ? null : (
                    <AppButton
                        iconType={"ImportContacts"}
                        color={"secondary"}
                        text={translations.ImportOrders}
                        addClickHandler={importOrdersClickHandler}
                    />
                )}
            </div>
            <div>
                {orders.map((o) => (
                    <OrderCar
                        orderId={o.id}
                        key={o.id}
                        isInEdit={orderIdInEdit === o.id}
                    />
                ))}
            </div>
        </div>
    );
};
