import {DriveModel, SketchModel} from '../models/Sketch.model';
import {Utils} from '../services/utils';

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
    }
}
