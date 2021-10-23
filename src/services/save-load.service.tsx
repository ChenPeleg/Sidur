//interface
import {SaveDataModel} from '../store/store.types';


const APPID = '$123AT6'
export const SaveLoadService = {
    saveToLocalStorage: (data: SaveDataModel): { success: boolean } => {
        const userId = data.userId || 'Chen123';
        data.timeStamp = data.timeStamp || SaveLoadService.getTimeStampFromDate()
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
    getTimeStampFromDate: (date: Date = new Date()): string => {
        return date.getTime().toString()
    }
}

