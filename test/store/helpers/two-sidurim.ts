import { SidurStore } from "../../../src/store/store.types";
import { buildStore } from "./build-store";

// Current sidur "5" plus an inactive sidur "6" with a single order.
export const buildTwoSidurStore = (): SidurStore => {
    const state = buildStore();
    const first = state.sidurCollection[0];
    const second = {
        ...JSON.parse(JSON.stringify(first)),
        id: "6",
        Name: "second",
        orders: [{ ...state.orders[0], id: "1", driverName: "second-driver" }],
        deletedOrders: [],
        sketches: [],
    };
    state.sidurCollection = [first, second];
    return state;
};
