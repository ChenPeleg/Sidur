import * as React from "react";
import { useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { translations } from "../../services/translations";
import { Card, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { DriveModel, SketchModel } from "../../models/Sketch.model";
import { VerticalHourField } from "../buttons/vertical-hour-field";
import { OrderModel } from "../../models/Order.model";
import { useDispatch, useSelector } from "react-redux";
import { Utils } from "../../services/utils";
import { OrderActionButton } from "../buttons/order-action-button";
import { SketchDriveOrderEditActionEnum } from "../../models/SketchDriveOrderEditActionEnum";
import { ActionsTypes } from "../../store/types.actions";
import { SidurStore } from "../../store/store.types";
import { SidurEditorService } from "../../sidurEditor/sidurEditor.service";
import { DriveType } from "../../models/DriveType.enum";

interface SketchDriveEditDialogProps {
    open: boolean;
    sketchDriveData: { drive: DriveModel; vehicleId: string };
    vehicleId: string;
    onDelete: (sketchDriveData: {
        drive: DriveModel;
        vehicleId: string;
    }) => void;
    onClose: (vehicleUpdate: DriveModel | null) => void;
}

export const SketchDriveEditDialog = (props: SketchDriveEditDialogProps) => {
    const { onClose, onDelete, open, sketchDriveData } = props;

    const driveData = sketchDriveData.drive;
    const dispatch = useDispatch();
    const SketchIdInEdit = useSelector(
        (state: SidurStore) => state.sessionState.SketchIdInEdit
    );
    const sketches: SketchModel[] = useSelector(
        (state: { sketches: SketchModel[] }) => state.sketches
    );
    const sketchInEdit: SketchModel | null =
        sketches.find((sketch: SketchModel) => sketch.id === SketchIdInEdit) ||
        null;

    const sketchOrders = sketchInEdit?.assignedOrders || [];
    const [driveChangedData, setDriveChangedData] = useState<DriveModel>({
        ...driveData,
    });

    const descriptionValueRef: any = useRef("");
    const handleCloseCancel = () => {
        onClose(null);
    };

    const handleCloseEdit = (): void => {
        const editedData: DriveModel | null = { ...driveChangedData };
        if (descriptionValueRef?.current?.value) {
            editedData.description = descriptionValueRef?.current?.value;
        }
        if (SidurEditorService.getDriveDurationInHours(editedData) > 1.2) {
            editedData.TypeOfDrive = DriveType.Tsamud;
        }
        onClose(editedData);
    };
    const handleCloseDelete = (): void => {
        const sketchDriveDataForDelete = { ...sketchDriveData };
        onDelete(sketchDriveDataForDelete);
    };
    const addToPendingClickHandler = (event: Event, orderId: string) => {
        dispatch({
            type: ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE,
            payload: {
                orderId,
                sketchDriveId: driveData.id,
            },
        });
        const newDrive = { ...driveChangedData };
        newDrive.implementsOrders = newDrive.implementsOrders.filter(
            (o) => o !== orderId
        );
        setDriveChangedData(newDrive);
    };
    const addToPendingAndDeleteClickHandler = (
        event: Event,
        orderId: string
    ) => {
        addToPendingClickHandler(event, orderId);
        handleCloseDelete();
    };
    const handleHourChange = (event: Event, input: any) => {
        const newSketchData = { ...driveChangedData };
        newSketchData.startHour = Utils.DecimalTimeToHourText(input[0]);
        newSketchData.finishHour = Utils.DecimalTimeToHourText(input[1]);
        setDriveChangedData(newSketchData);
    };
    const implementedOrders = sketchOrders.filter((o: OrderModel) =>
        driveChangedData.implementsOrders.includes(o.id)
    );

    return (
        <Dialog open={open} onClose={handleCloseCancel}>
            <DialogTitle> {translations.EditDrive}</DialogTitle>
            <DialogContent>
                <div className="w-[230px] flex flex-row min-w-[35vw]">
                    <div className="w-[230px] flex flex-col max-w-[160px] py-0 px-[0.2em]">
                        <Typography align={"center"} component="legend">
                            <b>{translations.DriveTimes}</b>
                        </Typography>

                        <VerticalHourField
                            input={[driveData.startHour, driveData.finishHour]}
                            onHoursChange={handleHourChange}
                            label={translations.Start}
                        />
                    </div>
                    <div className="w-[230px] flex flex-col">
                        <Typography align={"center"} component="legend">
                            <b>{translations.DriveDescription}</b>
                        </Typography>

                        <div className="w-[230px]">
                            <TextField
                                size={"medium"}
                                margin="dense"
                                id="vehicle-comments-dialog-text-field"
                                type="text"
                                fullWidth
                                multiline={true}
                                variant="standard"
                                defaultValue={(
                                    driveData?.description || ""
                                ).replace("  ", " ")}
                                inputRef={descriptionValueRef}
                                onKeyUp={(event) => {
                                    if (event.key === "Enter") {
                                        handleCloseEdit();
                                    }
                                }}
                            />
                        </div>
                        <Typography
                            align={"center"}
                            sx={{ mt: "1em" }}
                            component="legend"
                        >
                            <b>
                                {" "}
                                {implementedOrders.length === 0
                                    ? translations.none + " "
                                    : null}{" "}
                                {translations.connectedOrders}
                            </b>
                        </Typography>
                        <div id={"connected-orders"}>
                            {implementedOrders.map(
                                (order: OrderModel, i: number) => (
                                    <Card
                                        key={i}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            p: "1em",
                                        }}
                                    >
                                        <div className="pb-[0.5em]">
                                            {order.Comments}
                                        </div>

                                        <OrderActionButton
                                            sx={{ width: "100%" }}
                                            size={"small"}
                                            actionType={
                                                SketchDriveOrderEditActionEnum.AddToPending
                                            }
                                            text={
                                                "      " +
                                                translations.SketchActionAddToPending
                                            }
                                            actionClickHandler={(event: any) =>
                                                addToPendingClickHandler(
                                                    event,
                                                    order.id
                                                )
                                            }
                                        />

                                        <OrderActionButton
                                            sx={{ width: "100%", mt: "5px" }}
                                            size={"small"}
                                            actionType={
                                                SketchDriveOrderEditActionEnum.AddToPending
                                            }
                                            text={
                                                "      " +
                                                translations.SketchActionAddToPending +
                                                " " +
                                                translations.AndDelete
                                            }
                                            actionClickHandler={(event: any) =>
                                                addToPendingAndDeleteClickHandler(
                                                    event,
                                                    order.id
                                                )
                                            }
                                        />
                                    </Card>
                                )
                            )}
                        </div>

                        <div className="flex flex-row items-center justify-center mt-[1em]"></div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCloseDelete}
                    aria-label="add"
                    size="large"
                >
                    <Delete /> {translations.Delete}
                </Button>
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
    );
};
