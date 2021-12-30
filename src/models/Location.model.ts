export interface LocationModel {
    id: string,
    name: string,
    ETA: number,
    EnName: string
}

export interface LocationGroup {
    id: string,
    name: string,
    Locations: LocationModel[]
}
