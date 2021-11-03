import {FileUploadType, IAction, SaveDataModel, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {DownloadFile} from '../services/download-file';
import {Utilities} from '../services/utilities';
import {ActionsTypes} from './types.actions';
import {ImportOrdersFromText} from '../services/import-orders-from-text';

export type ImportReducerFunctions =
    ActionsTypes.EXPORT_ALL |
    ActionsTypes.IMPORT_FILE_UPLOADED |
    ActionsTypes.IMPORT_ORDERS_AS_TEXT

export const ImportExportReducer: Record<ImportReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionsTypes.EXPORT_ALL]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState);
        const saveObj: SaveDataModel = StoreUtils.buildSaveDataModel(newState)
        DownloadFile('sidur.json', JSON.stringify(saveObj))
        return newState

    },
    [ActionsTypes.IMPORT_FILE_UPLOADED]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const uploadType: FileUploadType = action.payload.uploadType;
        const fileAsString: string = action.payload.fileAsString;
        try {
            const fileObj: any = JSON.parse(fileAsString);
            if (fileObj && fileObj?.savedStore && fileObj?.hash) {
                Utilities.validateHash(fileObj?.savedStore, fileObj?.hash);
                const storeFromFile = {
                    ...fileObj
                        .savedStore
                }
                switch (uploadType) {
                    case FileUploadType.uploadFullDataAndAdd:
                        newState = storeFromFile
                        break;
                }

            }

        } catch (e) {

        } finally {

        }
        return newState


    },
    [ActionsTypes.IMPORT_ORDERS_AS_TEXT]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const importedOrders: string = action.payload.importedOrders;
        ImportOrdersFromText(importedOrders);
        // try {
        //
        //
        // } catch (e) {
        //
        // } finally {
        //
        // }
        return newState


    },


}
