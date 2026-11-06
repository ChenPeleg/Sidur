import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/import-orders-from-text", () => ({
    ImportOrdersFromText: vi.fn(),
    validateImportedData: vi.fn(),
}));
vi.mock("../../src/services/download-file", () => ({
    DownloadFile: vi.fn(),
}));

import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore } from "./helpers/build-store";
import { stubPersistence } from "./helpers/setup";
import { FileUploadType, IAction } from "../../src/store/store.types";
import {
    ImportOrdersFromText,
    validateImportedData,
} from "../../src/services/import-orders-from-text";
import { DownloadFile } from "../../src/services/download-file";
import { StoreUtils } from "../../src/store/store-utils";

const act = (type: ActionsTypes, payload: IAction["payload"] = {}) =>
    ({ type, payload }) as IAction;

describe("root reducer - import / export", () => {
    beforeEach(() => {
        stubPersistence();
        vi.mocked(ImportOrdersFromText).mockReset();
        vi.mocked(validateImportedData).mockReset();
        vi.mocked(DownloadFile).mockReset();
    });
    afterEach(() => vi.restoreAllMocks());

    const imported = () => {
        const base = buildStore().orders[0];
        return [
            { ...base, id: "99" },
            { ...base, id: "100" },
        ];
    };

    it("opens and closes the import modal", () => {
        const opened = reducer(
            buildStore(),
            act(ActionsTypes.OPEN_IMPORT_SHEETS_MODAL)
        );
        expect(opened.sessionState.openDialog).toBe("importOrders");
        expect(opened.sessionState.importSheetCheckStatus).toBe(false);
        const closed = reducer(
            opened,
            act(ActionsTypes.CLOSE_IMPORT_SHEETS_MODAL)
        );
        expect(closed.sessionState.openDialog).toBeNull();
    });

    it("paste validation reports OK for valid data", () => {
        vi.mocked(ImportOrdersFromText).mockReturnValue(imported());
        const result = reducer(
            buildStore(),
            act(ActionsTypes.IMPORT_SHEETS_DATA_PASTE, "text")
        );
        expect(result.sessionState.importSheetCheckStatus).toBe("OK");
    });

    it("paste validation reports the error message for invalid data", () => {
        vi.mocked(ImportOrdersFromText).mockReturnValue([]);
        vi.mocked(validateImportedData).mockImplementation(() => {
            throw new Error("bad data");
        });
        const result = reducer(
            buildStore(),
            act(ActionsTypes.IMPORT_SHEETS_DATA_PASTE, "text")
        );
        expect(result.sessionState.importSheetCheckStatus).toBe(
            "Error: bad data"
        );
    });

    it("approve appends the imported orders and closes the dialog", () => {
        const state = buildStore();
        state.sessionState.openDialog = "importOrders";
        vi.mocked(ImportOrdersFromText).mockReturnValue(imported());
        const result = reducer(
            state,
            act(ActionsTypes.APPROVE_IMPORT_SHEETS_DATA, "text")
        );
        expect(result.orders).toHaveLength(state.orders.length + 2);
        expect(result.sessionState.openDialog).toBeNull();
    });

    it("approve with invalid data keeps the orders and reports the error", () => {
        const state = buildStore();
        vi.mocked(ImportOrdersFromText).mockReturnValue(imported());
        vi.mocked(validateImportedData).mockImplementation(() => {
            throw new Error("bad data");
        });
        const result = reducer(
            state,
            act(ActionsTypes.APPROVE_IMPORT_SHEETS_DATA, "text")
        );
        expect(result.orders).toHaveLength(state.orders.length);
        expect(result.sessionState.importSheetCheckStatus).toBe(
            "Error: bad data"
        );
    });

    it("IMPORT_ORDERS_AS_TEXT appends parsed orders", () => {
        const state = buildStore();
        vi.mocked(ImportOrdersFromText).mockReturnValue(imported());
        const result = reducer(
            state,
            act(ActionsTypes.IMPORT_ORDERS_AS_TEXT, { importedOrders: "text" })
        );
        expect(result.orders).toHaveLength(state.orders.length + 2);
    });

    it("EXPORT_ALL downloads the saved model as sidur.json", () => {
        const state = buildStore();
        reducer(state, act(ActionsTypes.EXPORT_ALL));
        expect(DownloadFile).toHaveBeenCalledTimes(1);
        const [name, text] = vi.mocked(DownloadFile).mock.calls[0];
        expect(name).toBe("sidur.json");
        expect(JSON.parse(text).savedStore.sidurId).toBe(state.sidurId);
    });

    it("file upload with a valid hash replaces the store (uploadFullDataAndAdd)", () => {
        const state = buildStore();
        const uploaded = buildStore({ sidurId: "uploaded" });
        const fileAsString = JSON.stringify(
            StoreUtils.buildSaveDataModel(uploaded)
        );
        const result = reducer(
            state,
            act(ActionsTypes.IMPORT_FILE_UPLOADED, {
                uploadType: FileUploadType.uploadFullDataAndAdd,
                fileAsString,
            })
        );
        expect(result.sidurId).toBe("uploaded");
    });

    it("file upload with invalid JSON keeps the state", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.IMPORT_FILE_UPLOADED, {
                uploadType: FileUploadType.uploadFullDataAndAdd,
                fileAsString: "not json",
            })
        );
        expect(result).toEqual(state);
    });
});
