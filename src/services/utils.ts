import {hashFunction} from './hash-function';
import {DriveModel, SketchModel, VehicleScheduleModel} from '../models/Sketch.model';
import {DriveType} from '../models/DriveType.enum';


export const Utils = {
    getNextId: (currentIds: string[]): string => {
        const allIds: number [] = currentIds.map(id => Number(id));
        allIds.push(0)
        const newId = Math.max(...allIds) + 1;
        return newId.toString()
    },
    validateHash: (data: string, hash: string): boolean => {
        return (data && hash) ? hashFunction(data).toString() === hash : false
    },
    convertStrToNum: (str: string): number => {
        let numberToReturn = 0
        try {
            const parsed = parseInt(str, 10)
            if (!isNaN(parsed)) {
                numberToReturn = parsed;
            }
        } catch (e) {

        } finally {

        }
        return numberToReturn

    },
    defaultSketchMMock(): SketchModel {
        let ids: number = 1
        const mkDrv = (driver: string, start: string, finish: string, location: string, TypeOfDrive: DriveType = DriveType.Tsamud): DriveModel => {
            ids++
            return {
                id: ids.toString(),
                driverName: driver,
                startHour: start,
                finishHour: finish,
                TypeOfDrive: TypeOfDrive,
                location: '1',
                Comments: '',
                passengers: '1',
                flexibility: ['-30', '10'],
                implementsOrders: [],
                description: '',
            }

        }
        const vehicle1: VehicleScheduleModel = {
            id: '1',
            VehicleId: '1',
            drives: [
                mkDrv('יוסי', '08:00', '10:00', '1'),
                mkDrv('חן', '11:00', '14:00', '1'),
                mkDrv('אברהם', '16:00', '20:00', '1'),
                mkDrv('רונה', '20:30', '20:00', '1'),
            ],
            Comments: 'רכב ראשון'
        }
        const vehicle2: VehicleScheduleModel = {
            id: '2',
            VehicleId: '1',
            drives: [
                mkDrv('יוליה', '06:00', '12:00', '1'),
                mkDrv('רונן', '12:30', '14:00', '1'),
                mkDrv('שמואל', '15:00', '19:00', '1'),
                mkDrv('מיכל', '20:00', '23:00', '1'),
            ],
            Comments: 'רכב ראשון'
        }
        return {
            vehicleSchedules: [vehicle1, vehicle2],
            id: '1',
            Comments: '',
            name: 'סידור בשני רכבים',
            unassignedOrders: []
        }
    },

}
