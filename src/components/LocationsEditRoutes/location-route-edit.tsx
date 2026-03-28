import {
    Card,
    IconButton,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import {
    LocationModel,
    RoadStopModel,
    RouteModel,
} from "../../models/Location.model";
import * as React from "react";
import { ActionsTypes } from "../../store/types.actions";
import { useDispatch } from "react-redux";
import { RouteTransportEditMenu } from "../LocationsEdit/location-edit-transport-route-menu";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { RenameDialog } from "../Dialogs/rename-dialog";
import { ConfigService } from "../../services/config-service";
import MenuItem from "@mui/material/MenuItem";
import { translations } from "../../services/translations";

export enum RouteOrTransEditAction {
    RenameRoute = 1,
    DeleteRoute = 2,
    CloneRoute = 3,
}

interface StopModel extends RoadStopModel {
    locationName: string;
    minutesFromLastCode: number;
}

interface LocationRouteEditProps {
    route: RouteModel;
    allLocations: LocationModel[];
}

export const LocationRouteEdit = (props: LocationRouteEditProps) => {
    const dispatch = useDispatch();

    const [RenameOpen, setRenameOpen] = React.useState(false);
    const [routeMoreAnchorEl, setRouteMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const isRouteMenuOpen = Boolean(routeMoreAnchorEl);

    const handleRouteMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setRouteMoreAnchorEl(event.currentTarget);
    };
    const routeMenuId = "primary-transportRoute-menu";

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
                    type: ActionsTypes.CLONE_ROUTE,
                    payload: { id: props.route.id },
                });
                break;

            case RouteOrTransEditAction.DeleteRoute:
                dispatch({
                    type: ActionsTypes.DELETE_ROUTE,
                    payload: { id: props.route.id },
                });
                break;

            case RouteOrTransEditAction.RenameRoute:
                setRenameOpen(true);
                break;
            default:
                break;
        }
    };

    const handleRenameClose = (value: string | null) => {
        setRenameOpen(false);
        if (value) {
            const updatedRout = { ...props.route };
            updatedRout.name = value;
            dispatch({
                type: ActionsTypes.UPDATE_ROUTE,
                payload: updatedRout,
            });
        }
    };
    const allStops: StopModel[] = props.route.routeStops
        .map((r: RoadStopModel) => {
            const location = props.allLocations.find(
                (l) => l.id === r.locationId
            );

            if (location) {
                const stop: StopModel = {
                    ...r,
                    locationName: location.name,
                    minutesFromLastCode: r.minutesFromLast || 30,
                };
                return stop;
            } else {
                return null;
            }
        })
        .filter((s) => s) as StopModel[];
    const minutesFromLastOptions =
        ConfigService.Constants.RoutesMinutesOptions.map((value) => ({
            value: value,
            text: value.toString() + " " + translations.min,
        }));
    const handleRemoveLast = (_event: any) => {
        const updatedRout = { ...props.route };
        updatedRout.routeStops = [...updatedRout.routeStops];
        updatedRout.routeStops.pop();
        dispatch({
            type: ActionsTypes.UPDATE_ROUTE,
            payload: updatedRout,
        });
    };
    const handleDriveLengthChanged = (
        event: SelectChangeEvent<any>,
        stop: StopModel
    ): void => {
        const updatedRout = { ...props.route };

        updatedRout.routeStops = updatedRout.routeStops.map((s) => {
            if (s.locationId === stop.locationId) {
                const newStop = { ...s };
                newStop.minutesFromLast = event.target.value;
                return newStop;
            }
            return s;
        });
        dispatch({
            type: ActionsTypes.UPDATE_ROUTE,
            payload: updatedRout,
        });
    };
    const isLongRoute: boolean = allStops?.length > 5;

    return (
        <div>
            <Card
                sx={{
                    width: "400px",
                    minHeight: "300px",
                }}
            >
                <div className="m-[1em] mb-0">
                    {" "}
                    <b>{props.route.name}</b>
                    <IconButton
                        size="small"
                        aria-label="show more"
                        aria-controls={routeMenuId}
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
                            key={stop.locationId + i.toString()}
                            className={isLongRoute ? "inline p-[0.1em]" : "block p-[0.1em]"}
                        >
                            {i > 0 ? (
                                <>
                                    <Select
                                        disableUnderline={true}
                                        variant={"standard"}
                                        value={stop.minutesFromLastCode}
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
                                            (option) => (
                                                <MenuItem
                                                    key={option.value}
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
                                    <ArrowBack
                                        sx={{ mb: "-5px" }}
                                        fontSize={"small"}
                                    />
                                    <div className="inline-flex w-[15px] h-[5px]" />
                                </>
                            ) : null}
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
                            ) : (
                                <ArrowBack
                                    sx={{ mb: "-5px" }}
                                    fontSize={"small"}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </Card>
            <RouteTransportEditMenu
                routeMoreAnchorEl={routeMoreAnchorEl}
                routeMenuId={props.route.id}
                isRouteMenuOpen={isRouteMenuOpen}
                handleRouteMenuClick={handleRouteMenuClick}
                handleRouteMenuClose={handleRouteMenuClose}
            />
            <RenameDialog
                open={RenameOpen}
                onClose={handleRenameClose}
                selectedValue={props.route.name}
            />
        </div>
    );
};
