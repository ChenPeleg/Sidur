import { vi } from "vitest";
import { StoreUtils } from "../../../src/store/store-utils";

export const stubPersistence = () => {
    vi.spyOn(StoreUtils, "HandleReducerSaveToLocalStorage").mockImplementation(
        () => undefined
    );
};
