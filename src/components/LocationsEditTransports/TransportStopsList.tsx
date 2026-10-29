import * as React from "react";
import { Card, IconButton, Select, SelectChangeEvent } from "@mui/material";
import { Delete, DirectionsBusFilled, LocationOn } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import { translations } from "../../services/translations";
import { ConfigService } from "../../services/config-service";

export interface StopModel {
    locationId: string;
    locationName: string;
    minutesFromLastCode: number;
    minutesFromLast?: number;
}

interface TransportStopsListProps {
    stops: StopModel[];
    isLongRoute: boolean;
    onRemoveLast: () => void;
    onDriveLengthChanged: (
        event: SelectChangeEvent<number>,
        stop: StopModel
    ) => void;
}

export const TransportStopsList = ({
    stops,
    isLongRoute,
    onRemoveLast,
    onDriveLengthChanged,
}: TransportStopsListProps) => {
    const minutesFromLastOptions =
        ConfigService.Constants.RoutesMinutesOptions.map((value) => ({
            value,
            text: value.toString() + " " + translations.min,
        }));

    return (
        <div className="pr-[1em] pl-[1em] flex-row flex-wrap">
            {stops.map((stop: StopModel, i: number) => (
                <div
                    className={isLongRoute ? "inline p-[0.1em]" : "block p-[0.1em]"}
                    key={"stop.locationId" + stop.locationId + i.toString()}
                >
                    {i > 0 ? (
                        <>
                            <Select
                                disableUnderline={true}
                                variant={"standard"}
                                value={stop.minutesFromLastCode}
                                sx={{ fontWeight: "normal" }}
                                onChange={(
                                    event: SelectChangeEvent<number>,
                                    _child: React.ReactNode
                                ) => onDriveLengthChanged(event, stop)}
                            >
                                {minutesFromLastOptions.map((option, j) => (
                                    <MenuItem
                                        key={
                                            "option.value" +
                                            option.value +
                                            j.toString()
                                        }
                                        value={option.value}
                                    >
                                        {option.text}&nbsp;&nbsp;
                                    </MenuItem>
                                ))}
                            </Select>{" "}
                            <div
                                className={
                                    isLongRoute
                                        ? "inline-flex w-[15px] h-[5px]"
                                        : "inline-flex w-[5px] h-[5px]"
                                }
                            />
                        </>
                    ) : null}
                    {i === 0 ? (
                        <DirectionsBusFilled
                            sx={{ mb: "-5px" }}
                            fontSize={"small"}
                        />
                    ) : (
                        <LocationOn sx={{ mb: "-5px" }} fontSize={"small"} />
                    )}
                    <div className="inline-flex w-[15px] h-[5px]" />
                    <Card
                        sx={{
                            maxWidth: "100px",
                            display: "inline-flex",
                            p: "4px",
                        }}
                    >
                        {stop.locationName}
                    </Card>
                    <div
                        className={
                            isLongRoute
                                ? "inline-flex w-[15px] h-[5px] mb-[1.3em]"
                                : "inline-flex w-[15px] h-[5px] mb-[1.6em]"
                        }
                    />
                    {i + 1 === stops.length ? (
                        <IconButton
                            size="small"
                            onClick={onRemoveLast}
                            color="inherit"
                        >
                            <Delete fontSize={"small"} />
                        </IconButton>
                    ) : null}
                </div>
            ))}
        </div>
    );
};
