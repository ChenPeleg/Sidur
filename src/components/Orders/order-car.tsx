import React, { useState } from "react";

import { OrderCarForm } from "./order-car-form";
import { Card, Collapse } from "@mui/material";
import { OrderCarBrief } from "./order-car-brief";
import { useDispatch, useSelector } from "react-redux";
import { ActionsTypes } from "../../store/types.actions";
import { DeleteButton } from "../buttons/delete-button";
import { CloneButton } from "../buttons/clone-button";
import { LocationModel } from "../../models/Location.model";

type AppProps = {
    orderId: string;
    isInEdit: boolean;
};

export const OrderCar = (props: AppProps) => {
    const locations = useSelector(
        (state: { Locations: LocationModel[] }) => state.Locations
    );

    const [inHover, setInHover] = useState(false);
    const onMouseOver = () => {
        setInHover(!props.isInEdit);
    };
    const onMouseOut = () => {
        setInHover(false);
    };
    const dispatch = useDispatch();
    const cardClickHandler = (_event: MouseEvent) => {
        dispatch({
            type: ActionsTypes.CLICKED_ORDER,
            payload: {
                id: props.orderId,
            },
        });
    };
    const deleteClickHandler = (event: any) => {
        event.stopPropagation();
        dispatch({
            type: ActionsTypes.DELETE_ORDER,
            payload: {
                id: props.orderId,
            },
        });
    };
    const cloneClickHandler = (event: any) => {
        event.stopPropagation();
        dispatch({
            type: ActionsTypes.CLONE_ORDER,
            payload: {
                id: props.orderId,
            },
        });
    };

    const cardCursorClass = props.isInEdit ? "" : "cursor-pointer";

    return (
        <div>
            <div className="flex">
                <Card
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    elevation={inHover ? 7 : 2}
                    sx={{
                        padding: "10px",
                        width: "100%",
                        borderRadius: "15px",
                    }}
                    className={cardCursorClass}
                    onClick={(event: any) =>
                        !props.isInEdit ? cardClickHandler(event) : null
                    }
                >
                    <div tabIndex={0}>
                        <div className="flex flex-row justify-between">
                            <OrderCarBrief
                                isInEdit={props.isInEdit}
                                className="p-[10px] w-full rounded-[15px]"
                                orderId={props.orderId}
                            />
                            <div className="flex flex-row">
                                <CloneButton
                                    cloneClickHandler={cloneClickHandler}
                                    sx={{ fontSize: "14px" }}
                                />
                                <DeleteButton
                                    deleteClickHandler={deleteClickHandler}
                                    sx={{ fontSize: "14px" }}
                                />
                            </div>
                        </div>
                    </div>

                    {props.isInEdit ? <></> : null}

                    <Collapse in={props.isInEdit} unmountOnExit>
                        <OrderCarForm
                            locations={locations}
                            isInEdit={props.isInEdit}
                            orderId={props.orderId}
                            handleSubmit={"d"}
                            pristine={"b"}
                            reset={"c"}
                            submitting={"d"}
                        />
                    </Collapse>
                </Card>
            </div>
            <div className="w-[20px] h-[20px]" />
        </div>
    );
};
