import * as React from "react";
import { SelectChangeEvent } from "@mui/material";
import { useDispatch } from "react-redux";
import { LocationModel, RoadStopModel, TransportModel } from "../../../models/Location.model";
import { ActionsTypes } from "../../../store/types.actions";
import { StopModel } from "../TransportStopsList";

interface UseTransportEditResult {
    RenameOpen: boolean;
    scheduleOpen: boolean;
    routeMoreAnchorEl: null | HTMLElement;
    isRouteMenuOpen: boolean;
    allStops: StopModel[];
    isLongRoute: boolean;
    timeTableBrief: string[];
    handleRouteMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    handleRouteMenuClose: () => void;
    handleRouteMenuClick: (
        event: React.MouseEvent<HTMLElement>,
        clickAction: number
    ) => void;
    handleRenameClose: (value: string | null) => void;
    handleScheduleClose: (value: string[] | null) => void;
    handleEditTransportTimes: () => void;
    handleRemoveLast: () => void;
    handleDriveLengthChanged: (
        event: SelectChangeEvent<number>,
        stop: StopModel
    ) => void;
}

const MAX_HOURS_TO_SHOW = 6;

export const useTransportEdit = (
    transportRoute: TransportModel,
    allLocations: LocationModel[]
): UseTransportEditResult => {
    const dispatch = useDispatch();
    const [RenameOpen, setRenameOpen] = React.useState(false);
    const [scheduleOpen, setScheduleOpen] = React.useState(false);
    const [routeMoreAnchorEl, setRouteMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isRouteMenuOpen = Boolean(routeMoreAnchorEl);

    const allStops: StopModel[] = transportRoute.TransportStops.map(
        (r: RoadStopModel) => {
            const location = allLocations.find((l) => l.id === r.locationId);
            if (location) {
                return {
                    ...r,
                    locationName: location.name,
                    minutesFromLastCode: r.minutesFromLast || 30,
                };
            }
            return null;
        }
    ).filter((s) => s) as StopModel[];

    const isLongRoute: boolean = allStops?.length > 5;
    const timeTableBrief =
        transportRoute.TransportTime?.slice(0, MAX_HOURS_TO_SHOW) || [];

    const handleRouteMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setRouteMoreAnchorEl(event.currentTarget);
    };

    const handleRouteMenuClose = () => {
        setRouteMoreAnchorEl(null);
    };

    const handleRouteMenuClick = (
        _event: React.MouseEvent<HTMLElement>,
        clickAction: number
    ) => {
        setRouteMoreAnchorEl(null);
        switch (clickAction) {
            case 3: // CloneRoute
                dispatch({
                    type: ActionsTypes.CLONE_TRANSPORT,
                    payload: { id: transportRoute.id },
                });
                break;
            case 2: // DeleteRoute
                dispatch({
                    type: ActionsTypes.DELETE_TRANSPORT,
                    payload: { id: transportRoute.id },
                });
                break;
            case 1: // RenameRoute
                setRenameOpen(true);
                break;
        }
    };

    const handleRenameClose = (value: string | null) => {
        setRenameOpen(false);
        if (value) {
            const updatedRoute = { ...transportRoute, name: value };
            dispatch({
                type: ActionsTypes.UPDATE_TRANSPORT,
                payload: updatedRoute,
            });
        }
    };

    const handleScheduleClose = (value: string[] | null) => {
        setScheduleOpen(false);
        if (value && value.length) {
            const updatedRoute = {
                ...transportRoute,
                TransportTime: value,
            };
            dispatch({
                type: ActionsTypes.UPDATE_TRANSPORT,
                payload: updatedRoute,
            });
        }
    };

    const handleEditTransportTimes = () => {
        setScheduleOpen(true);
    };

    const handleRemoveLast = () => {
        const updatedRoute = { ...transportRoute };
        updatedRoute.TransportStops = [...updatedRoute.TransportStops];
        updatedRoute.TransportStops.pop();
        dispatch({
            type: ActionsTypes.UPDATE_TRANSPORT,
            payload: updatedRoute,
        });
    };

    const handleDriveLengthChanged = (
        event: SelectChangeEvent<number>,
        stop: StopModel
    ): void => {
        const updatedRoute = {
            ...transportRoute,
            TransportStops: transportRoute.TransportStops.map((s) => {
                if (s.locationId === stop.locationId) {
                    return { ...s, minutesFromLast: event.target.value };
                }
                return s;
            }),
        };
        dispatch({
            type: ActionsTypes.UPDATE_TRANSPORT,
            payload: updatedRoute,
        });
    };

    return {
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
    };
};
