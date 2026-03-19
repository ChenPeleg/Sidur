import * as React from "react";
import { translations } from "../../services/translations";
import { Card, CardContent } from "@mui/material";
import { LockTwoTone } from "@mui/icons-material";
import { Styles } from "../../hoc/themes";

export const LocationCantEditMessage = () => {
    return (
        <div>
            <Card
                sx={{
                    width: "300px",
                    height: "180px",
                    p: "0.5em",
                    m: "3em",
                }}
            >
                <div className={`${Styles.flexRow} justify-start items-center m-[0.5em] mb-[0.1em]`}>
                    <b>
                        {" "}
                        <LockTwoTone
                            sx={{
                                mt: "0.4em",
                                mb: "0.2em",
                            }}
                        />{" "}
                    </b>
                    <b>&nbsp; {translations.lockedForEdit}</b>
                </div>
                <CardContent>{translations.cantEditLocationMessag}</CardContent>
            </Card>
        </div>
    );
};
