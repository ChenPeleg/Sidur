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
import { OrderModel } from "../../models/Order.model";
import { useDispatch, useSelector } from "react-redux";
import { SidurStore } from "../../store/store.types";
import { LocationModel } from "../../models/Location.model";
import { LanguageUtilities } from "../../services/language-utilities";
import { Styles } from "../../hoc/themes";
import { DriveType } from "../../models/DriveType.enum";

interface SketchOrderToTransportDialogProps {
    open: boolean;
    PendingOrderToTransportId: string;
    onClose: (vehicleUpdate: OrderModel | null) => void;
}

export const SketchOrderToTransportDialog = (
    props: SketchOrderToTransportDialogProps
) => {
    const { onClose, open, PendingOrderToTransportId } = props;
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
        (o) => o.id === PendingOrderToTransportId
    ) as OrderModel;
    const sketchOrders = sketchInEdit?.assignedOrders || [];
    const locations = useSelector(
        (state: { Locations: LocationModel[] }) => state.Locations
    );
    const fakseDrive: DriveModel = {
        Comments: "",
        TypeOfDrive: DriveType.Tsamud,
        description: "",
        driverName: "",
        finishHour: "",
        flexibility: ["", ""],
        id: "",
        implementsOrders: [],
        location: "",
        passengers: "",
        startHour: "",
    };
    const driveDataAndIssues = {
        suggestedDrive: fakseDrive,
        issues: [],
    };
    const driveData = driveDataAndIssues.suggestedDrive;
    const issues = driveDataAndIssues.issues;

    const orderToMergeBrief = LanguageUtilities.buildBriefText(
        orderToMerge,
        locations
    );

    const [driveChangedData, setDriveChangedData] = useState<DriveModel>({
        ...driveData,
    });
    const secondOrderToMergeBrief = { ...orderToMergeBrief };
    const descriptionValueRef: any = useRef("");
    const secondDescriptionValueRef: any = useRef("");
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
        editedData.implementsOrders.push(PendingOrderToTransportId);
        onClose(editedData);
    };
    const implementedOrders = sketchOrders.filter((o: OrderModel) =>
        driveChangedData.implementsOrders.includes(o.id)
    );

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
                <MergeType fontSize={"large"} />{" "}
                {translations.publicTransportSolution}{" "}
            </DialogTitle>
            <DialogContent>
                <div className="w-full flex flex-row min-w-[35vw]">
                    <div id={"divider-in-main-row"} className="w-[20px] h-[100px]" />
                    <div className="w-full flex flex-col">
                        <div className="w-full">
                            <TextField
                                size={"medium"}
                                margin="dense"
                                id="vehicle-comments-dialog-text-field"
                                type="text"
                                fullWidth
                                multiline={true}
                                variant="standard"
                                defaultValue={(
                                    orderToMergeBrief.timeText +
                                        " " +
                                        orderToMergeBrief.driverAndLocation ||
                                    ""
                                ).replace("  ", " ")}
                                inputRef={descriptionValueRef}
                                onKeyUp={(event) => {
                                    if (event.key === "Enter") {
                                        handleCloseEdit();
                                    }
                                }}
                            />
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
                        {secondOrderToMergeBrief ? (
                            <div className="w-full">
                                <TextField
                                    size={"medium"}
                                    margin="dense"
                                    id="vehicle-comments-dialog-text-field"
                                    type="text"
                                    fullWidth
                                    multiline={true}
                                    variant="standard"
                                    defaultValue={(
                                        secondOrderToMergeBrief.timeText +
                                            " " +
                                            secondOrderToMergeBrief.driverAndLocation ||
                                        ""
                                    ).replace("  ", " ")}
                                    inputRef={secondDescriptionValueRef}
                                    onKeyUp={(event) => {
                                        if (event.key === "Enter") {
                                            handleCloseEdit();
                                        }
                                    }}
                                />
                            </div>
                        ) : null}

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
                    {translations.Cancel}
                </Button>
                <div className="w-[30px] h-[10px]" />
                <Button
                    size={"large"}
                    variant={"contained"}
                    id={"vehicle-edit-approve-button"}
                    onClick={handleCloseEdit}
                >
                    {translations.Update}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
