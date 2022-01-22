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
    TransportStops: RoadStopModel[],
    TransportTime: string[]
}

export interface RoadStopModel {
    locationId: string,
    minuetsFromLast: number,
    position: number
}

export enum RouteOrTransport {
    Route = 1,
    Transport = 2
}

export interface RouteModel {
    id: string,
    name: string,
    comments: string,
    routStops: RoadStopModel[]
}

export interface LocationGroup {

    id: string,
    dbId: string,
    name: string,
    Locations: LocationModel[],
    Routes: RouteModel[],
    Transports: TransportModel[]
}
