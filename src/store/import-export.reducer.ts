import {ActionTypes} from './actionTypes';
import {IAction, SaveDataModel, SidurStore} from './store.types';
import {UtilsReducer} from './utils.reducer';
import {DownloadFile} from '../services/download-file';

export type ImportReducerFunctions =
    ActionTypes.EXPORT_ALL | ActionTypes.IMPORT_FILE_UPLOADED

export const ImportExportReducer: Record<ImportReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {
    [ActionTypes.EXPORT_ALL]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        newState.sidurCollection = UtilsReducer.UpdateSidurCollectionWithCurrenSidur(newState);
        const saveObj: SaveDataModel = UtilsReducer.buildSaveDataModel(newState)
        DownloadFile('sidur.json', JSON.stringify(saveObj))
        return newState

    },
    [ActionTypes.IMPORT_FILE_UPLOADED]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        return newState

    },


}
