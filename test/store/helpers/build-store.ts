import { DefaultSidurFetching } from "../../../src/store/store-inital-state";
import { SidurStore } from "../../../src/store/store.types";
import { deepFreeze } from "./deep-freeze";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export const buildStore = (partial: Partial<SidurStore> = {}): SidurStore => {
    const store = clone(DefaultSidurFetching) as SidurStore;
    // top-level data belongs to the current sidur record
    const current = store.sidurCollection.find((s) => s.id === store.sidurId)!;
    current.orders = clone(store.orders);
    current.vehicles = clone(store.vehicles);
    current.sketches = clone(store.sketches);
    current.deletedOrders = clone(store.deletedOrders);
    return { ...store, ...partial };
};

// sessionState is intentionally left unfrozen: several reducers mutate it
export const freezeCollections = (store: SidurStore): SidurStore => {
    deepFreeze(store.orders);
    deepFreeze(store.deletedOrders);
    deepFreeze(store.vehicles);
    deepFreeze(store.sketches);
    deepFreeze(store.sidurCollection);
    deepFreeze(store.sidurArchive);
    return store;
};
