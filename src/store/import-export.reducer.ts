import {FileUploadType, IAction, SaveDataModel, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {DownloadFile} from '../services/download-file';
import {Utils} from '../services/utils';
import {ActionsTypes} from './types.actions';
import {ImportOrdersFromText} from '../services/import-orders-from-text';
import {OrderModel} from '../models/Order.model';

export type ImportReducerFunctions =
    ActionsTypes.EXPORT_ALL |
    ActionsTypes.IMPORT_FILE_UPLOADED |
    ActionsTypes.IMPORT_ORDERS_AS_TEXT | ActionsTypes.OPEN_CLOSE_IMPORT_DIALOG
    | ActionsTypes.OPEN_IMPORT_SHEETS_MODAL
    | ActionsTypes.CLOSE_IMPORT_SHEETS_MODAL
    | ActionsTypes.IMPORT_SHEETS_DATA_PASTE
    | ActionsTypes.APPROVE_IMPORT_SHEETS_DATA;

export const ImportExportReducer: Record<ImportReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {



    [ActionsTypes.EXPORT_ALL]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState);
        const saveObj: SaveDataModel = StoreUtils.buildSaveDataModel(newState)
        DownloadFile('sidur.json', JSON.stringify(saveObj))
        return newState

    },
    [ActionsTypes.OPEN_CLOSE_IMPORT_DIALOG]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.sessionState.openDialog = (action.payload === 'importOrders') ? 'importOrders' : null
        return newState

    },
    [ActionsTypes.IMPORT_FILE_UPLOADED]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const uploadType: FileUploadType = action.payload.uploadType;
        const fileAsString: string = action.payload.fileAsString;
        try {
            const fileObj: any = JSON.parse(fileAsString);
            if (fileObj && fileObj?.savedStore && fileObj?.hash) {
                Utils.validateHash(fileObj?.savedStore, fileObj?.hash);
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
        const modeledImportedOrders: OrderModel[] = ImportOrdersFromText(importedOrders, newState.Locations);
        newState.orders = newState.orders.concat(modeledImportedOrders)
      
        return newState


    },


}
