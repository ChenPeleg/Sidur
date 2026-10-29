import * as React from "react";
import { useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { translations } from "../../services/translations";
import { Typography } from "@mui/material";
import { MergeType } from "@mui/icons-material";
import { DriveModel, SketchModel } from "../../models/Sketch.model";
import { VerticalHourField } from "../buttons/vertical-hour-field";
import { OrderModel } from "../../models/Order.model";
import { useDispatch, useSelector } from "react-redux";
import { Utils } from "../../services/utils";
import { SidurStore } from "../../store/store.types";
import { LocationModel } from "../../models/Location.model";
import { SidurEditorService } from "../../sidurEditor/sidurEditor.service";
import { LanguageUtilities } from "../../services/language-utilities";
import { Styles } from "../../hoc/themes";
import { DriveType } from "../../models/DriveType.enum";

interface SketchDriveMergeDialogProps {
    open: boolean;
    sketchDriveData: { drive: DriveModel; vehicleId: string };
    PendingOrderToMergeId: string;
    vehicleId: string;
    onDelete: (sketchDriveData: {
        drive: DriveModel;
        vehicleId: string;
    }) => void;

    onClose: (vehicleUpdate: DriveModel | null) => void;
}

export const SketchDriveMergeDialog = (props: SketchDriveMergeDialogProps) => {
    const { onClose, onDelete, open, sketchDriveData, PendingOrderToMergeId } =
        props;
    const dispatch = useDispatch();
    const sketchIdInEdit = useSelector(
        (state: SidurStore) => state.sessionState.sketchIdInEdit
    );
    const sketches: SketchModel[] = useSelector(
        (state: { sketches: SketchModel[] }) => state.sketches
    );
    const sketchInEdit: SketchModel = sketches.find(
        (sketch: SketchModel) => sketch.id === sketchIdInEdit
    ) as SketchModel;
    const orderToMerge: OrderModel = sketchInEdit.unassignedOrders.find(
        (o) => o.id === PendingOrderToMergeId
    ) as OrderModel;
    const sketchOrders = sketchInEdit?.assignedOrders || [];
    const locations = useSelector(
        (state: { Locations: LocationModel[] }) => state.Locations
    );
    const originalDriveData = sketchDriveData.drive;
    const driveDataAndIssues = SidurEditorService.SuggestMergedDrive(
        originalDriveData,
        orderToMerge,
        locations
    );

    const driveData = driveDataAndIssues.suggestedDrive;
    const issues = driveDataAndIssues.issues;

    const orderToMergeBrief = LanguageUtilities.buildBriefText(
        orderToMerge,
        locations
    );

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
        if (orderToMerge.TypeOfDrive === DriveType.Tsamud) {
            editedData.TypeOfDrive = DriveType.Tsamud;
        }
        editedData.implementsOrders.push(PendingOrderToMergeId);
        onClose(editedData);
    };

    const handleHourChange = (event: Event, input: any) => {
        const newriveData = { ...driveChangedData };
        newriveData.startHour = Utils.DecimalTimeToHourText(input[0]);
        newriveData.finishHour = Utils.DecimalTimeToHourText(input[1]);
        setDriveChangedData(newriveData);
    };
    const implementedOrders = sketchOrders.filter((o: OrderModel) =>
        driveChangedData.implementsOrders.includes(o.id)
    );
    const newImplementedOrders = [orderToMerge];
    return (
        <Dialog open={open} onClose={handleCloseCancel} fullWidth>
            <DialogTitle
                sx={{
                    fontSize: "22px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <MergeType fontSize={"large"} /> {translations.MergeDrive}{" "}
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-row min-w-[35vw]">
                    <div className="flex flex-col max-w-[160px] py-0 px-[0.2em]">
                        <Typography align={"center"} component="legend">
                            <b>{translations.DriveTimesAfterMerge}</b>
                        </Typography>

                        <VerticalHourField
                            input={[driveData.startHour, driveData.finishHour]}
                            onHoursChange={handleHourChange}
                            label={translations.Start}
                        />
                    </div>
                    <div id={"divider-in-main-row"} className="w-[20px] h-[100px]" />
                    <div className="flex flex-col">
                        <Typography component="legend">
                            <b>{translations.DriveDescriptionNew}</b>
                        </Typography>
                        <div>
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
                        <Typography sx={{ mt: "1em" }} component="legend">
                            <b>
                                {" "}
                                {newImplementedOrders.length === 0
                                    ? translations.none + " "
                                    : null}{" "}
                                {translations.issues + ":"}
                            </b>
                            <div id={"issues"}>
                                {issues.map((issue: string, i: number) => (
                                    <div
                                        key={i}
                                        className="flex flex-col"
                                    >
                                        <div>
                                            {(i + 1).toString() + ". "}
                                            {issue}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Typography>{" "}
                        <Typography sx={{ mt: "1em" }} component="legend">
                            <b>
                                {" "}
                                {newImplementedOrders.length === 0
                                    ? translations.none + " "
                                    : null}{" "}
                                {translations.newMergedOrder}
                            </b>
                        </Typography>
                        <div id={"connected-orders"}>
                            {newImplementedOrders.map(
                                (order: OrderModel, i: number) => (
                                    <div
                                        key={i}
                                        className="flex flex-col p-[0.2em]"
                                    >
                                        <div className="pb-[0.2em]">
                                            {orderToMergeBrief.timeText +
                                                " " +
                                                orderToMergeBrief.driverAndLocation +
                                                ", " +
                                                order.Comments}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <Typography sx={{ mt: "0.2em" }} component="legend">
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
                                    <div
                                        key={i}
                                        className="flex flex-col p-[0.2em]"
                                    >
                                        <div className="pb-[0.5em]">
                                            {(i + 1).toString() + ". "}
                                            {order.Comments}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="flex flex-row items-center justify-center mt-[1em]"></div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "start",
                    justifyContent: "center",
                }}
            >
                <Button
                    size={"large"}
                    variant={"outlined"}
                    id={"vehicle-edit-cancel-button"}
                    onClick={handleCloseCancel}
                >
                    {translations.CancelMerge}
                </Button>
                <div className="w-[30px] h-[10px]" />
                <Button
                    size={"large"}
                    variant={"contained"}
                    id={"vehicle-edit-approve-button"}
                    onClick={handleCloseEdit}
                >
                    {translations.ApproveMerge}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
