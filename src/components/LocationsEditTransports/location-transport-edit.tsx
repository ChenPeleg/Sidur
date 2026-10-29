import { Card, IconButton } from "@mui/material";
import { LocationModel, TransportModel } from "../../models/Location.model";
import * as React from "react";
import { Edit } from "@mui/icons-material";
import { RenameDialog } from "../Dialogs/rename-dialog";
import { translations } from "../../services/translations";
import { RouteTransportEditMenu } from "../LocationsEdit/location-edit-transport-route-menu";
import Button from "@mui/material/Button";
import { TransportScheduleDialog } from "../Dialogs/transport-schedual-dialog";
import { TransportStopsList } from "./TransportStopsList";
import { useTransportEdit } from "./hooks/useTransportEdit";

export enum RouteOrTransEditAction {
    RenameRoute = 1,
    DeleteRoute = 2,
    CloneRoute = 3,
}

interface LocationRouteEditProps {
    transportRoute: TransportModel;
    allLocations: LocationModel[];
}

const transportMenuId = "primary-transport-menu";
const maxHoursToShow = 6;

export const LocationTransportEdit = (props: LocationRouteEditProps) => {
    const {
        RenameOpen,
        scheduleOpen,
        routeMoreAnchorEl,
        isRouteMenuOpen,
        allStops,
        isLongRoute,
        timeTableBrief,
        handleRouteMenuOpen,
        handleRouteMenuClose,
        handleRouteMenuClick,
        handleRenameClose,
        handleScheduleClose,
        handleEditTransportTimes,
        handleRemoveLast,
        handleDriveLengthChanged,
    } = useTransportEdit(props.transportRoute, props.allLocations);

    return (
        <div>
            <Card
                sx={{
                    height: "300px",
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <div className="w-[400px] flex flex-col">
                    <div className="m-[1em] mb-0">
                        <b>{props.transportRoute.name}</b>
                        <IconButton
                            size="small"
                            aria-label="show more"
                            aria-controls={transportMenuId}
                            aria-haspopup="true"
                            onClick={handleRouteMenuOpen}
                            color="inherit"
                        >
                            <Edit fontSize={"small"} />
                        </IconButton>
                    </div>
                    <TransportStopsList
                        stops={allStops}
                        isLongRoute={isLongRoute}
                        onRemoveLast={handleRemoveLast}
                        onDriveLengthChanged={handleDriveLengthChanged}
                    />
                </div>
                <hr />

                <div className="flex-col items-center justify-center">
                    <div className="m-[1em] w-[100px] flex flex-col items-center">
                        <b>{translations.exitTime}</b>
                        <Button
                            sx={{ mb: "0.3em", mt: "0.3em" }}
                            variant="contained"
                            onClick={handleEditTransportTimes}
                            aria-label="add"
                            size="small"
                        >
                            {translations.editTimeStarts}
                        </Button>
                        {timeTableBrief.map((t, i) => (
                            <div
                                key={
                                    "props.transportRoute.id" +
                                    i.toString() +
                                    props.transportRoute.id
                                }
                                className="m-[1em] mb-[5px] mt-[5px] text-[large]"
                            >
                                {i + 1 === maxHoursToShow ? "..." : t}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
            <RouteTransportEditMenu
                routeMoreAnchorEl={routeMoreAnchorEl}
                routeMenuId={props.transportRoute.id}
                isRouteMenuOpen={isRouteMenuOpen}
                handleRouteMenuClick={handleRouteMenuClick}
                handleRouteMenuClose={handleRouteMenuClose}
            />
            <RenameDialog
                key={"RenameDialog.transportRoute.id" + props.transportRoute.id}
                open={RenameOpen}
                onClose={handleRenameClose}
                selectedValue={props.transportRoute.name}
            />
            <TransportScheduleDialog
                key={
                    "TransportScheduleDialog.transportRoute.id" +
                    props.transportRoute.id
                }
                open={scheduleOpen}
                onClose={handleScheduleClose}
                transport={props.transportRoute}
            />
        </div>
    );
};
