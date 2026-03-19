import React, { useState } from "react";
import { SxProps } from "@mui/system";
import { Card, Typography } from "@mui/material";
import { DriveModel } from "../../models/Sketch.model";
import { DriveType } from "../../models/DriveType.enum";
import { Utils } from "../../services/utils";
import { translations } from "../../services/translations";
import { Colors, Styles } from "../../hoc/themes";
import { WarningIcon } from "../buttons/warning-icon";

export enum ChooseDriveMode {
    NotActive = 0,
    selectable = 1,
    nonSelectable = 2,
}

interface sketchDriveProps {
    chooseDriveMode: ChooseDriveMode;
    drive: DriveModel;
    previousDrive: DriveModel | null;
    sketchDriveClick: (
        event: React.MouseEvent<HTMLElement>,
        drive: DriveModel
    ) => void;
}

const custumSxMaker = (chooseDriveMode: ChooseDriveMode): SxProps => {
    switch (chooseDriveMode) {
        case ChooseDriveMode.nonSelectable:
            return {
                filter: "grayscale(120%);",
                opacity: "0.5",
            };
        case ChooseDriveMode.selectable:
            return {
                filter: `drop-shadow(0px 0px 3px ${"#00b705"})`,
            };
        case ChooseDriveMode.NotActive:
        default:
            return {};
    }
};
export const SketchDrive = (props: sketchDriveProps) => {
    const drive = props.drive;
    const [inHover, setInHover] = useState(false);
    const onMouseOver = () => {
        setInHover(true);
    };
    const onMouseOut = () => {
        setInHover(false);
    };
    const calculateIfDrivesOverlap = (
        thisDrive: DriveModel,
        previousDrive: DriveModel | null
    ): DriveModel | null => {
        if (!previousDrive) {
            return null;
        }
        const prevFinish = Utils.hourTextToDecimal(previousDrive.finishHour);
        const thisStart = Utils.hourTextToDecimal(thisDrive.startHour);
        if (prevFinish > thisStart) {
            return previousDrive;
        } else {
            return null;
        }
    };
    const driveOverlap = !!calculateIfDrivesOverlap(
        props.drive,
        props.previousDrive
    );

    const customSx = custumSxMaker(props.chooseDriveMode);
    return (
        <div>
            {driveOverlap ? (
                <div
                    className="z-[50] relative m-[0.2em] mb-[0.3em] flex flex-row items-stretch justify-start cursor-default py-0 px-[0.5em]"
                    style={{
                        backgroundColor: Colors.warningRed,
                        boxShadow: `0px -1px 7px 7px ${Colors.warningRed.replace("1.0", "0.8")}`,
                    }}
                >
                    {" "}
                    <div className={`${Styles.flexRow} items-center justify-center text-center`}>
                        {" "}
                        <div className={Styles.flexColumn}>
                            {" "}
                            <WarningIcon />
                        </div>
                        <div className={`${Styles.flexRow} items-center justify-center text-center`}>
                            {" "}
                            <b> {translations.OverlapingDrives}</b>
                        </div>
                    </div>
                </div>
            ) : null}
            <Card
                onClick={(event: any) => props.sketchDriveClick(event, drive)}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                elevation={inHover ? 8 : 2}
                sx={{
                    m: "0.2em",
                    mb: "0.3em",
                    position: "relative",
                    zIndex: 40,
                    minHeight: "10vh",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "start",
                    cursor: "default",
                    ...customSx,
                }}
            >
                <div
                    id={"drive-hour"}
                    className="flex flex-col items-start justify-start flex-wrap p-[0.2em] pl-[0.25em] pr-[0.25em] bg-[#aadcff] min-h-full"
                >
                    <Typography dir="ltr" variant={"subtitle1"}>
                        {drive.startHour}{" "}
                    </Typography>
                    {drive.TypeOfDrive === DriveType.Tsamud ||
                    drive.TypeOfDrive === DriveType.TwoWay ? (
                        <>
                            <div className="w-[10px] h-[2px] border-b border-black self-center" />
                            <Typography dir="ltr" variant={"subtitle1"}>
                                {drive.finishHour}{" "}
                            </Typography>
                        </>
                    ) : null}
                </div>

                <div
                    id={"drive-description"}
                    className="flex flex-row items-start justify-start p-[0.2em] pl-[0.4em] pr-[0.4em] grow"
                >
                    <div className="w-[5px] h-[10px]" />
                    <Typography variant={"subtitle1"}>
                        {drive.description}{" "}
                    </Typography>
                </div>
            </Card>
        </div>
    );
};
