import {DriveModel, SketchModel} from '../models/Sketch.model';
import {Utils} from '../services/utils';
import {OrderModel} from '../models/Order.model';
import {LocationModel} from '../models/Location.model';
import {LanguageUtilities} from '../services/language-utilities';
import {CloneUtil} from '../services/clone-utility';

export const SidurEditorService = {
    getRelevantDriveIdsToChoose(sketch: SketchModel, pendingOrderId: string): string [] {
        const pendingOrder = sketch.unassignedOrders.find(o => o.id === pendingOrderId);
        if (!pendingOrder) {
            return []
        }
        const originOrd = {
            start: Utils.hourTextToDecimal(pendingOrder.startHour),
            finish: Utils.hourTextToDecimal(pendingOrder.finishHour)

        }

        const allDrives: DriveModel[] = this.getAllDrivesFromSketch(sketch)

        const allRelevantDrives = allDrives.filter((d: DriveModel) => {
            const drv = {
                start: Utils.hourTextToDecimal(d.startHour),
                finish: Utils.hourTextToDecimal(d.finishHour),
            }
            return this.shouldIMergeDrives(originOrd, drv)
        })

        return allRelevantDrives.map(d => d.id)
    },
    getAllDrivesFromSketch(sketch: SketchModel): DriveModel[] {
        const allDrives: DriveModel[] = []

        sketch.vehicleSchedules.forEach(v => {
            const drives = v.drives.map(d => ({...d}))
            allDrives.push(...drives)
        })
        return allDrives
    },
    shouldIMergeDrives(origin: { start: number, finish: number }, destination: { start: number, finish: number }): boolean {
        const hours = (s: number, f: number): number[] => {
            const arr = [];
            for (let i: number = Math.floor(s) - 1; i < (f); i++) {
                arr.push(i)
            }
            return arr
        }
        const org: number [] = hours(origin.start, origin.finish)
        const dest: number [] = hours(destination.start, destination.finish)
        return org.some(n => dest.includes(n))
    },
    SuggestMergedDrive(drive: DriveModel, orderToMerge: OrderModel, locations: LocationModel[]): DriveModel {
        const h2n = (h: string): number => {
            return Utils.hourTextToDecimal(h)
        }
        const newDrive = CloneUtil.deepCloneDrive(drive);
        const orderToMergeBrief = LanguageUtilities.buildBriefText(orderToMerge, locations).driverAndLocation;
        newDrive.description = newDrive.description + ', ' + orderToMergeBrief;
        const newDriveStartHour = Math.min(h2n(newDrive.startHour), h2n(orderToMerge.startHour))
        const newDriveFinishHour = Math.max(h2n(newDrive.finishHour), h2n(orderToMerge.finishHour));
        newDrive.startHour = Utils.DecimalTimeToHourText(newDriveStartHour)
        newDrive.finishHour = Utils.DecimalTimeToHourText(newDriveFinishHour)
        return newDrive
    }
}
