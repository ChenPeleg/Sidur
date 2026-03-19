import {
    Card,
    IconButton,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import {
    LocationModel,
    RoadStopModel,
    TransportModel,
} from "../../models/Location.model";
import * as React from "react";
import { ActionsTypes } from "../../store/types.actions";
import { useDispatch } from "react-redux";

import {
    Delete,
    DirectionsBusFilled,
    Edit,
    LocationOn,
} from "@mui/icons-material";
import { RenameDialog } from "../Dialogs/rename-dialog";
import { ConfigService } from "../../services/config-service";
import MenuItem from "@mui/material/MenuItem";
import { translations } from "../../services/translations";
import { RouteTransportEditMenu } from "../LocationsEdit/location-edit-transport-route-menu";
import Button from "@mui/material/Button";
import { TransportScheduleDialog } from "../Dialogs/transport-schedual-dialog";

export enum RouteOrTransEditAction {
    RenameRoute = 1,
    DeleteRoute = 2,
    CloneRoute = 3,
}

interface StopModel extends RoadStopModel {
    locationName: string;
    minuetsFromLastCode: number;
}

interface LocationRouteEditProps {
    transportRoute: TransportModel;
    allLocations: LocationModel[];
}

const maxHoursToSHow = 6;

export const LocationTransportEdit = (props: LocationRouteEditProps) => {
    const dispatch = useDispatch();
    const [RenameOpen, setRenameOpen] = React.useState(false);
    const [scheduleOpen, setScheduleOpen] = React.useState(false);
    const [routeMoreAnchorEl, setRouteMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const isRouteMenuOpen = Boolean(routeMoreAnchorEl);

    const handleRouteMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setRouteMoreAnchorEl(event.currentTarget);
    };
    const sketchMenuId = "primary-transport-menu";
    const handleEditTransportTimes = (_event: any) => {
        setScheduleOpen(true);
    };
    const handleRouteMenuClose = () => {
        setRouteMoreAnchorEl(null);
    };
    const handleRouteMenuClick = (
        event: React.MouseEvent<HTMLElement>,
        clickAction: RouteOrTransEditAction
    ) => {
        setRouteMoreAnchorEl(null);

        switch (clickAction) {
            case RouteOrTransEditAction.CloneRoute:
                dispatch({
                    type: ActionsTypes.CLONE_TRANSPORT,
                    payload: { id: props.transportRoute.id },
                });
                break;

            case RouteOrTransEditAction.DeleteRoute:
                dispatch({
                    type: ActionsTypes.DELETE_TRANSPORT,
                    payload: { id: props.transportRoute.id },
                });
                break;

            case RouteOrTransEditAction.RenameRoute:
                setRenameOpen(true);
                break;
            default:
                break;
        }
    };
    const handleScheduleClose = (value: any) => {
        setScheduleOpen(false);
        if (value && value.length) {
            const updatedRout = { ...props.transportRoute };
            updatedRout.TransportTime = value;
            dispatch({
                type: ActionsTypes.UPDATE_TRANSPORT,
                payload: updatedRout,
            });
        }
    };
    const handleRenameClose = (value: string | null) => {
        setRenameOpen(false);
        if (value) {
            const updatedRout = { ...props.transportRoute };
            updatedRout.name = value;
            dispatch({
                type: ActionsTypes.UPDATE_TRANSPORT,
                payload: updatedRout,
            });
        }
    };
    const allStops: StopModel[] = props.transportRoute.TransportStops.map(
        (r: RoadStopModel) => {
            const location = props.allLocations.find(
                (l) => l.id === r.locationId
            );

            if (location) {
                const stop: StopModel = {
                    ...r,
                    locationName: location.name,
                    minuetsFromLastCode: r.minuetsFromLast || 30,
                };
                return stop;
            } else {
                return null;
            }
        }
    ).filter((s) => s) as StopModel[];
    const minutesFromLastOptions =
        ConfigService.Constants.RoutesMinutesOptions.map((value) => ({
            value: value,
            text: value.toString() + " " + translations.min,
        }));
    const handleRemoveLast = (_event: any) => {
        const updatedRout = { ...props.transportRoute };
        updatedRout.TransportStops = [...updatedRout.TransportStops];
        updatedRout.TransportStops.pop();
        dispatch({
            type: ActionsTypes.UPDATE_TRANSPORT,
            payload: updatedRout,
        });
    };
    const handleDriveLengthChanged = (
        event: SelectChangeEvent<any>,
        stop: StopModel
    ): void => {
        const updatedRout = { ...props.transportRoute };

        updatedRout.TransportStops = updatedRout.TransportStops.map((s) => {
            if (s.locationId === stop.locationId) {
                const newStop = { ...s };
                newStop.minuetsFromLast = event.target.value;
                return newStop;
            }
            return s;
        });
        dispatch({
            type: ActionsTypes.UPDATE_TRANSPORT,
            payload: updatedRout,
        });
    };
    const isLongRoute: boolean = allStops?.length > 5;
    const timeTableBrief =
        props.transportRoute.TransportTime?.filter((t, i) =>
            i < maxHoursToSHow ? t : ""
        ) || [];

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
                        {" "}
                        <b>{props.transportRoute.name}</b>
                        <IconButton
                            size="small"
                            aria-label="show more"
                            aria-controls={sketchMenuId}
                            aria-haspopup="true"
                            onClick={handleRouteMenuOpen}
                            color="inherit"
                        >
                            <Edit fontSize={"small"} />
                        </IconButton>
                    </div>
                    <div className="pr-[1em] pl-[1em] flex-row flex-wrap">
                        {allStops.map((stop: StopModel, i: number) => (
                            <div
                                className={isLongRoute ? "inline p-[0.1em]" : "block p-[0.1em]"}
                                key={
                                    "stop.locationId" +
                                    stop.locationId +
                                    i.toString()
                                }
                            >
                                {i > 0 ? (
                                    <>
                                        <Select
                                            disableUnderline={true}
                                            variant={"standard"}
                                            value={stop.minuetsFromLastCode}
                                            sx={{
                                                fontWeight: "normal",
                                            }}
                                            onChange={(
                                                event: SelectChangeEvent<any>,
                                                _child: React.ReactNode
                                            ) => {
                                                handleDriveLengthChanged(
                                                    event,
                                                    stop
                                                );
                                            }}
                                        >
                                            {minutesFromLastOptions.map(
                                                (option, i) => (
                                                    <MenuItem
                                                        key={
                                                            "option.value" +
                                                            option.value +
                                                            i.toString()
                                                        }
                                                        value={option.value}
                                                    >
                                                        {" "}
                                                        {option.text}{" "}
                                                        &nbsp;&nbsp;{" "}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>{" "}
                                        <div className={isLongRoute ? "inline-flex w-[15px] h-[5px]" : "inline-flex w-[5px] h-[5px]"} />
                                    </>
                                ) : null}
                                {i === 0 ? (
                                    <DirectionsBusFilled
                                        sx={{ mb: "-5px" }}
                                        fontSize={"small"}
                                    />
                                ) : (
                                    <LocationOn
                                        sx={{ mb: "-5px" }}
                                        fontSize={"small"}
                                    />
                                )}
                                <div className="inline-flex w-[15px] h-[5px]" />

                                <Card
                                    sx={{
                                        maxWidth: "100px",
                                        display: "inline-flex",
                                        p: "4px",
                                    }}
                                >
                                    {stop.locationName}{" "}
                                </Card>

                                <div className={isLongRoute ? "inline-flex w-[15px] h-[5px] mb-[1.3em]" : "inline-flex w-[15px] h-[5px] mb-[1.6em]"} />
                                {i + 1 === allStops.length ? (
                                    <IconButton
                                        size="small"
                                        onClick={handleRemoveLast}
                                        color="inherit"
                                    >
                                        <Delete fontSize={"small"} />{" "}
                                    </IconButton>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
                <hr />

                <div className="flex-col items-center justify-center">
                    <div className="m-[1em] w-[100px] flex flex-col items-center">
                        {" "}
                        <b>{translations.exitTime}</b>
                        <Button
                            sx={{
                                mb: "0.3em",
                                mt: "0.3em",
                            }}
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
                                {i + 1 === maxHoursToSHow ? "..." : t}
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
