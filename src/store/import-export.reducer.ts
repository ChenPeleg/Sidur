import {ActionTypes} from './actionTypes';
import {FileUploadType, IAction, SaveDataModel, SidurStore} from './store.types';
import {StoreUtils} from './store-utils';
import {DownloadFile} from '../services/download-file';
import {Utilities} from '../services/utilities';

export type ImportReducerFunctions =
    ActionTypes.EXPORT_ALL | ActionTypes.IMPORT_FILE_UPLOADED

export const ImportExportReducer: Record<ImportReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionTypes.EXPORT_ALL]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.sidurCollection = StoreUtils.UpdateSidurCollectionWithCurrenSidur(newState);
        const saveObj: SaveDataModel = StoreUtils.buildSaveDataModel(newState)
        DownloadFile('sidur.json', JSON.stringify(saveObj))
        return newState

    },
    [ActionTypes.IMPORT_FILE_UPLOADED]: (state: SidurStore, action: IAction): SidurStore => {
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


}
