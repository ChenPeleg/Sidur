import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { OrderModel } from "../../models/Order.model";
import { SketchPendingOrderBrief } from "./SketchPendingOrderBrief";
import { ActionsTypes } from "../../store/types.actions";
import { Card, Collapse } from "@mui/material";
import { SketchPendingOrderFull } from "./SketchPendingOrderFull";

interface sketchPendingOrderProps {
    order: OrderModel;
    isInEdit: boolean;
}

export const SketchPendingOrder = (props: sketchPendingOrderProps) => {
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
            type: ActionsTypes.CLICKED_PENDING_ORDER,
            payload: {
                id: props.order.id,
            },
        });
    };

    const order = props.order;
    return (
        <>
            <div className="flex">
                <Card
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    elevation={inHover ? 7 : 2}
                    sx={{
                        m: "0.2em",
                        mb: "0.3em",
                        minHeight: "10vh",
                        minWidth: "30vw",
                        maxWidth: "50vw",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "stretch",
                        justifyContent: "start",
                    }}
                    onClick={(event: any) =>
                        !props.isInEdit ? cardClickHandler(event) : null
                    }
                >
                    <div className="flex flex-col items-start justify-start">
                        <div tabIndex={0}>
                            <div className="flex flex-row justify-between mr-[0.6em] ml-[0.6em] mt-0">
                                <SketchPendingOrderBrief
                                    isInEdit={props.isInEdit}
                                    order={props.order}
                                />
                            </div>
                        </div>

                        <Collapse in={props.isInEdit} unmountOnExit>
                            <SketchPendingOrderFull
                                isInEdit={props.isInEdit}
                                order={order}
                            />
                        </Collapse>
                    </div>
                </Card>
            </div>
        </>
    );
};
