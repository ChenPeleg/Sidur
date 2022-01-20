export interface LocationModel {
    id: string,
    name: string,
    ETA: number,
    EnName: string
}

export interface TransportModel {
    id: string,
    name: string,
    comments: string,
    TransportStops: RoadStopModel[]
}

export interface RoadStopModel {
    locationId: string,
    minuetsFromLast: number,
    position: number
}

export interface RouteModel {
    id: string,
    name: string,
    comments: string,
    routStops: RoadStopModel[]
}

export interface LocationGroup {
    id: string,
    name: string,
    Locations: LocationModel[],
    Routes: RouteModel[],
    Transports: TransportModel[]
}
