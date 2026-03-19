import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { translations } from "../../services/translations";
import { VehicleModel } from "../../models/Vehicle.model";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Delete } from "@mui/icons-material";

interface VehicleEditDialogProps {
    open: boolean;
    vehicleData: VehicleModel | null;
    onDelete: (id: string | null) => void;
    onClose: (vehicleUpdate: VehicleModel | null) => void;
}

export const VehicleEditDialog = (props: VehicleEditDialogProps) => {
    const { onClose, onDelete, open, vehicleData } = props;

    const [seatsValue, setSeatsValue] = useState(vehicleData?.seats || "5");
    const [didDialogJustClosed, setDidDialogJustClosed] = useState(false);

    if (didDialogJustClosed && open) {
        setSeatsValue(vehicleData?.seats || "5");

        setDidDialogJustClosed(false);
    }

    const nameValueRef: any = useRef("");
    const commentsValueRef: any = useRef("");
    const handleCloseCancel = () => {
        onClose(null);
        setDidDialogJustClosed(true);
    };
    useEffect(() => {
        // Update the document title using the browser API
    });
    const handleCloseEdit = (): void => {
        let editedData: VehicleModel | null = null;
        if (vehicleData) {
            editedData = { ...vehicleData };
            editedData.seats = seatsValue;
            editedData.vehicleName =
                nameValueRef?.current?.value || vehicleData?.vehicleName || "";
            editedData.Comments =
                commentsValueRef?.current?.value || vehicleData?.Comments || "";
        }

        onClose(editedData);
        setDidDialogJustClosed(true);
    };
    const handleCloseDelete = (): void => {
        onDelete(vehicleData?.id || "");
        setDidDialogJustClosed(true);
    };
    const handleSeatsValueChanged = (event: any, value: "7" | "5"): void => {
        setSeatsValue(value);
    };
    return (
        <div>
            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {vehicleData?.vehicleName}</DialogTitle>
                <DialogContent>
                    <div className="w-[230px]">
                        <TextField
                            autoFocus
                            margin="dense"
                            id="vehicle-rename-dialog-text-field"
                            label={translations.NewName}
                            type="text"
                            variant="standard"
                            defaultValue={vehicleData?.vehicleName}
                            inputRef={nameValueRef}
                            onKeyUp={(event) => {
                                if (event.key === "Enter") {
                                    handleCloseEdit();
                                }
                            }}
                        />
                    </div>
                    <div className="w-[230px]">
                        <TextField
                            margin="dense"
                            id="vehicle-comments-dialog-text-field"
                            label={translations.Comments}
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={vehicleData?.Comments}
                            inputRef={commentsValueRef}
                            onKeyUp={(event) => {
                                if (event.key === "Enter") {
                                    handleCloseEdit();
                                }
                            }}
                        />
                    </div>

                    <div dir="ltr" className="flex flex-row items-center justify-center mt-[1em]">
                        <ToggleButtonGroup
                            color="primary"
                            exclusive
                            onChange={(event, value) => {
                                handleSeatsValueChanged(event, value);
                            }}
                        >
                            <ToggleButton
                                selected={seatsValue === "7"}
                                key={"7"}
                                value="7"
                                dir={"rtl"}
                            >
                                7 {translations.seats}{" "}
                            </ToggleButton>
                            <ToggleButton
                                selected={seatsValue === "5"}
                                key={"5"}
                                value="5"
                                dir={"rtl"}
                            >
                                5 {translations.seats}{" "}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className="flex flex-row items-center justify-center mt-[1em]">
                        {vehicleData?.id !== "0" ? (
                            <Button
                                variant="contained"
                                onClick={handleCloseDelete}
                                aria-label="add"
                                size="large"
                            >
                                <Delete /> {translations.Delete}
                            </Button>
                        ) : null}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        id={"vehicle-edit-cancel-button"}
                        onClick={handleCloseCancel}
                    >
                        {translations.Cancel}
                    </Button>
                    <Button
                        id={"vehicle-edit-approve-button"}
                        onClick={handleCloseEdit}
                    >
                        {translations.Approve}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
