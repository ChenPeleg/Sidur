export interface LocationModel {
    id: string,
    name: string,
    ETA: number,
    EnName: string
}

export interface TransportModel {
    id: string,
    name: string,
    destinationId: string,
    busStopLocationId: string,
    hours: string[]

}

export interface RoutStopModel {
    locationId: string,
    minuetsFromLast: number,
    position: number
}

export interface RouteModel {
    id: string,
    name: string,
    comments: string,
    routStops: RoutStopModel[]
}

export interface LocationGroup {
    id: string,
    name: string,
    Locations: LocationModel[],
    Routes: RouteModel[],
    Transports: TransportModel[]
}
