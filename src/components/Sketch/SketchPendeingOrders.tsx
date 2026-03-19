import React, { useState } from "react";
import { SxProps } from "@mui/system";
import { useSelector } from "react-redux";
import { Badge, Collapse, Typography } from "@mui/material";
import { OrderModel } from "../../models/Order.model";
import { translations } from "../../services/translations";
import { SketchPendingOrder } from "./SketchPendingOrder";
import { SidurStore } from "../../store/store.types";
import IconButton from "@mui/material/IconButton";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { StyledBadge } from "../Icons/styled-badge";

interface sketchPendingOrdersProps {
    pendingOrders: OrderModel[];
}

const foldingButtonSX: SxProps = {
    backgroundColor: "rgba(240,240,240,0.7)",
    borderRadius: "50%",
    boxShadow: `rgb(9 30 66 / 16%) 0px 0px 0px 1px, rgb(9 30 66 / 16%) 0px 2px 4px 1`,
};
export const SketchPendingOrders = (props: sketchPendingOrdersProps) => {
    const [isPendingOrdersFolded, setIsPendingOrdersFolded] = useState(false);
    const handleOpenClosePendingOrders = () => {
        setIsPendingOrdersFolded(!isPendingOrdersFolded);
    };
    const pendingOrderInEdit = useSelector(
        (state: SidurStore) => state.sessionState.pendingOrderIdInEdit
    );

    return (
        <div
            id={"pending-order-hide-container"}
            className="flex flex-row pr-[10px]"
        >
            <Collapse orientation="horizontal" in={!isPendingOrdersFolded}>
                <div
                    id={"pending-order-container"}
                    className="m-[0.2em] mb-[0.3em] min-h-[80vh] min-w-[30vw] h-full flex flex-col items-stretch justify-start"
                >
                    <Typography variant={"h6"}>
                        {" "}
                        &nbsp; {translations.PendingOrders}{" "}
                    </Typography>

                    {(props.pendingOrders || []).map((order: OrderModel) => {
                        return (
                            <SketchPendingOrder
                                isInEdit={pendingOrderInEdit === order.id}
                                key={order.id}
                                order={order}
                            />
                        );
                    })}
                </div>
            </Collapse>
            <div id={"close-button-container"} className="h-[30px] mr-[-12px]">
                <IconButton
                    size="medium"
                    edge="end"
                    aria-label="account of current user"
                    onClick={handleOpenClosePendingOrders}
                    color="inherit"
                >
                    {isPendingOrdersFolded ? (
                        <StyledBadge
                            badgeContent={props.pendingOrders.length}
                            color="secondary"
                        >
                            <KeyboardArrowLeft
                                fontSize={"medium"}
                                sx={foldingButtonSX}
                            />
                        </StyledBadge>
                    ) : (
                        <KeyboardArrowRight
                            fontSize={"medium"}
                            sx={foldingButtonSX}
                        />
                    )}
                </IconButton>
            </div>
        </div>
    );
};
