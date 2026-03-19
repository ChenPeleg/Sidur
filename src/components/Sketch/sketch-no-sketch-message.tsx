import * as React from "react";
import { translations } from "../../services/translations";
import { Card, CardContent } from "@mui/material";

export const SketchNoSketchMessage = () => {
    return (
        <div>
            <Card
                sx={{
                    width: "300px",
                    height: "150px",
                    m: "3em",
                }}
            >
                <CardContent>{translations.NoSketchMessage}</CardContent>
            </Card>
        </div>
    );
};
