import React, { useState } from "react";
import { Card } from "@mui/material";
import { Add } from "@mui/icons-material";

interface sketchVehicleAddButtonProps {
    sketchDriveClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const SketchVehicleAddButton = (props: sketchVehicleAddButtonProps) => {
    const [inHover, setInHover] = useState(false);
    const onMouseOver = () => {
        setInHover(true);
    };
    const onMouseOut = () => {
        setInHover(false);
    };

    return (
        <div>
            <Card
                onClick={(event: any) => props.sketchDriveClick(event)}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                elevation={inHover ? 8 : 2}
                sx={{
                    m: "0.2em",
                    mb: "0.3em",
                    position: "relative",
                    zIndex: 40,
                    minHeight: "7vh",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "default",
                }}
            >
                <div className="mt-[0.2em]">
                    {" "}
                    <Add fontSize={"large"} />{" "}
                </div>
            </Card>
        </div>
    );
};
