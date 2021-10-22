//interface
import {SidurStore} from '../store/reducer';

interface SaveDataModel {
    userId: string,
    userName: string,
    timeStamp: string,
    savedStore: SidurStore
}


const APPID = '$123AT6'
export const SaveLoadService = {
    saveToLocalStorage: (data: SaveDataModel): { success: boolean } => {
        const userId = data.userId || 'Chen123';
        data.timeStamp = data.timeStamp || SaveLoadService.getTimeStamp()
        localStorage.setItem(APPID + userId, JSON.stringify(data));
        return {success: true}
    },
    loadFromLocalStorage(userId: string): { data: SaveDataModel | null, success: boolean } {
        userId = userId || 'Chen123';

        const data = localStorage.getItem(APPID + userId);
        const parsedData = data ? JSON.parse(data) : '';

        return {
            data: parsedData as SaveDataModel | null,
            success: !!data
        }


    },
    getTimeStamp: (): string => {
        return new Date().getTime().toString()
    }
}

