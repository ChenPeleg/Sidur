import { useDispatch, useSelector } from "react-redux";
import { SessionModel, SidurStore } from "../../store/store.types";
import {
    LocationGroup,
    LocationModel,
    RouteModel,
    RouteOrTransport,
} from "../../models/Location.model";
import { translations } from "../../services/translations";
import * as React from "react";
import { useState } from "react";
import { ActionsTypes } from "../../store/types.actions";
import { Styles } from "../../hoc/themes";
import TextField from "@mui/material/TextField";
import { LocationChooseButton } from "../LocationsEdit/location-choose-button";
import Button from "@mui/material/Button";
import { LocationRouteEdit } from "./location-route-edit";
import { LocationRouteTransportChoose } from "../LocationsEdit/location-route-transport-choose";

export const LocationsRoutesEditWrapper = () => {
    const locationGroupInEditId = useSelector(
        (state: SidurStore) => state.sessionState.locationGroupInEdit
    );
    const routeIdInEdit = useSelector(
        (state: SidurStore) => state.sessionState.routeIdInEdit
    );
    const locationGroups: LocationGroup[] = useSelector(
        (state: { LocationGroups: LocationGroup[] }) =>
            state.LocationGroups || []
    );
    const locationMainInEdit: string | null = useSelector(
        (state: { sessionState: SessionModel }) =>
            state.sessionState.locationMainInEdit
    );
    const currentLocationGroup: LocationGroup | undefined = locationGroups.find(
        (l) => l.id === locationGroupInEditId
    ) as LocationGroup;
    const allLocations: LocationModel[] = currentLocationGroup?.Locations || [];
    const allRoutes: RouteModel[] = currentLocationGroup?.Routes || [];

    const [filterLocationText, setFilterLocationText] = useState<string>("");
    const [filterRouteText, setFilterRouteText] = useState<string>("");

    const dispatch = useDispatch();

    const handleAddRoute = () => {
        setFilterLocationText("");
        dispatch({
            type: ActionsTypes.ADD_NEW_ROUTE,
        });
    };
    const handleAddLocationToRoute = (location: LocationModel) => {
        dispatch({
            type: ActionsTypes.ADD_LOCATION_TO_ROUTE,
            payload: location,
        });
    };
    const handleFilterLocationValueChanged = (event: any) => {
        setFilterLocationText(event.target.value);
    };
    const handleFilterRouteValueChanged = (event: any) => {
        if (locationMainInEdit) {
            // handleStopEditLocation(null);
        }
        setFilterRouteText(event.target.value);
    };
    const routeClickedHandler = (routId: string) => {
        if (routeIdInEdit !== routId) {
            dispatch({
                type: ActionsTypes.START_EDIT_ROUTE,
                payload: { id: routId },
            });
        }
    };

    const routInEdit: RouteModel | undefined = currentLocationGroup.Routes.find(
        (r) => r.id === routeIdInEdit
    );
    const filteredLocationsBeforeRouteCalc =
        filterLocationText.trim() === ""
            ? allLocations.filter((l) => l)
            : allLocations.filter((l) =>
                  l.name.includes(filterLocationText.trim())
              );
    const routInEditLocations: string[] = routInEdit
        ? routInEdit.routeStops.map((rs) => rs.locationId)
        : [];

    const filteredLocations = filteredLocationsBeforeRouteCalc.filter(
        (l) => !routInEditLocations.includes(l.id)
    );
    filteredLocations.sort((a, b) => (+a.id > +b.id ? -1 : 1));

    const filteredRoutes =
        filterRouteText.trim() === ""
            ? allRoutes.filter((l) => l)
            : allRoutes.filter((l) => l.name.includes(filterRouteText.trim()));
    filteredRoutes.sort((a, b) => (+a.id > +b.id ? -1 : 1));

    return (
        <div className={Styles.flexRow}>
            <div className={Styles.flexColumn}>
                <div className={Styles.flexRow}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id={"search-location-dialog-text-field"}
                        placeholder={translations.searchLocation}
                        type="text"
                        variant="standard"
                        value={filterLocationText}
                        onChange={(event) => {
                            return handleFilterLocationValueChanged(event);
                        }}
                    />
                </div>

                <div className="mt-[1em] overflow-y-auto max-h-[50vh]" dir="ltr">
                    <div dir="rtl" id={"locations-container"}>
                        {filteredLocations.map(
                            (l: LocationModel, i: number) => (
                                <div key={l.id}>
                                    <LocationChooseButton
                                        {...l}
                                        onClick={handleAddLocationToRoute}
                                        key={i}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className={`${Styles.flexColumn} m-[1em] mt-0`}>
                <div className={Styles.flexRow}>
                    <Button
                        variant="contained"
                        onClick={handleAddRoute}
                        aria-label="add"
                        size="large"
                    >
                        {translations.addRoute}
                    </Button>
                    <div className="w-[20px] h-[30px]" />
                    <TextField
                        autoFocus
                        margin="dense"
                        id={"search-location-dialog-text-field"}
                        placeholder={translations.searchRoute}
                        type="text"
                        variant="standard"
                        value={filterRouteText}
                        onChange={(event) => {
                            return handleFilterRouteValueChanged(event);
                        }}
                    />
                </div>

                <div className="h-[10px] w-[20px]" />
                {routInEdit ? (
                    <LocationRouteEdit
                        allLocations={allLocations}
                        route={routInEdit}
                    />
                ) : null}
            </div>
            <div className={Styles.flexColumn}>
                <div className="mt-[1em] overflow-y-auto max-h-[50vh]" dir="ltr">
                    <div dir="rtl" id={"routes-container"}>
                        {filteredRoutes.map((r: RouteModel) => (
                            <LocationRouteTransportChoose
                                key={r.id}
                                route={r}
                                routeOrTransport={RouteOrTransport.Route}
                                routeClicked={routeClickedHandler}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
