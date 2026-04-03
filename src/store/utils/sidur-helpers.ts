import { SidurRecord, SidurStore } from "../store.types";
import { LocationGroup } from "../../models/Location.model";
import { OrderModel } from "../../models/Order.model";
import { StoreUtils } from "../store-utils";
import { Utils } from "../../services/utils";
import { AppConstants, defaultVehicleValues } from "../store.types";
import { translations } from "../../services/translations";

const DefaultSidurTemplate: SidurRecord = {
    id: "1",
    dbId: "",
    Name: "הסידור החדש שלי",
    orders: [],
    deletedOrders: [],
    vehicles: [defaultVehicleValues],
    sketches: [],
    chosenSketch: "",
    locationGroupIdForSidur: "",
};

export const setChosenSidur = (
    state: SidurStore,
    chosenSidur: SidurRecord
): SidurStore => {
    const newState = { ...state };

    newState.orders = chosenSidur?.orders.map((o: OrderModel) => ({ ...o })) || [];
    newState.vehicles = chosenSidur?.vehicles.map((o) => ({ ...o })) || [];
    newState.deletedOrders =
        chosenSidur?.deletedOrders?.map((o: OrderModel) => ({ ...o })) || [];
    newState.sketches = chosenSidur?.sketches?.map((o) => ({ ...o })) || [];
    newState.sessionState.orderIdInEdit = null;
    newState.sessionState.dataHolderForCurrentOrderInEdit = null;
    const newLocationGroup = newState.LocationGroups.find(
        (lg) => lg.id === chosenSidur.locationGroupIdForSidur
    ) as LocationGroup;
    newState.Locations = newLocationGroup.Locations;
    return newState;
};

export const getAllSidurIDs = (state: SidurStore): string[] => {
    const collectionIds = state.sidurCollection.map((o) => o.id);
    const archiveIdsWithWords = state.sidurArchive.map((o) => o.id);

    const archiveIds = archiveIdsWithWords.map((id) =>
        StoreUtils.removeIdPrefix(id)
    );
    return [...archiveIds, ...collectionIds];
};

export const getDefaultSidur = (state: SidurStore): SidurRecord => {
    const newSidur: SidurRecord = { ...DefaultSidurTemplate };
    newSidur.id = Utils.getNextId(getAllSidurIDs(state));
    const allNames = [
        ...state.sidurCollection.map((o) => o.Name),
        ...state.sidurArchive.map((o) => o.Name),
    ];
    if (allNames.some((name) => name === newSidur.Name)) {
        newSidur.Name = newSidur.Name + " " + newSidur.id;
    }
    return newSidur;
};

export const getNewSidurId = (state: SidurStore): string => {
    return Utils.getNextId(getAllSidurIDs(state));
};

export const buildNewSidur = (
    state: SidurStore,
    locationGroupId: string
): SidurRecord => {
    const newSidurId = getNewSidurId(state);
    return {
        id: newSidurId,
        dbId: "",
        Name: translations.Sidur + " " + newSidurId,
        orders: [],
        deletedOrders: [],
        vehicles: [defaultVehicleValues],
        defaultOrderValues: state.defaultOrderValues,
        sketches: [],
        chosenSketch: "",
        locationGroupIdForSidur: locationGroupId,
    };
};

export { AppConstants };
