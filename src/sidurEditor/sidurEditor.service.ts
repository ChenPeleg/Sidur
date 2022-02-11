import {DriveModel, SketchModel} from '../models/Sketch.model';
import {Utils} from '../services/utils';
import {OrderModel} from '../models/Order.model';
import {LocationModel} from '../models/Location.model';
import {LanguageUtilities} from '../services/language-utilities';
import {CloneUtil} from '../services/clone-utility';
import {ConfigService} from '../services/config-service';
import {translations} from '../services/translations';
import {DriveType} from '../models/DriveType.enum';

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
    SuggestMergedDrive(drive: DriveModel, orderToMerge: OrderModel, locations: LocationModel[]): { suggestedDrive: DriveModel, issues: string[] } {
        const h2n = (h: string): number => {
            return Utils.hourTextToDecimal(h)
        }
        const issues: string[] = [];
        const newDrive = CloneUtil.deepCloneDrive(drive);
        const orderToMergeBrief = LanguageUtilities.buildBriefText(orderToMerge, locations).driverAndLocation;
        newDrive.description = newDrive.description + ', ' + orderToMergeBrief;
        const driveStart: number = h2n(newDrive.startHour);
        const driveFinish: number = h2n(newDrive.finishHour);
        const orderStart: number = h2n(orderToMerge.startHour);
        const orderFinish: number = h2n(orderToMerge.finishHour);

        const startGapInMinutes = Utils.HourDecimalToMinutes(Math.abs((driveStart - orderStart)));
        const finishGapInMinutes = Utils.HourDecimalToMinutes(Math.abs((driveFinish - orderFinish)));

        if (startGapInMinutes > ConfigService.MinimumMinuetGapFormNotifications) {
            let message = translations.gapForMergeDrives1 + ' ' + startGapInMinutes.toString() + ' ' + translations.gapForMergeDrives3StartTimes
            issues.push(message)
        }
        if (finishGapInMinutes > ConfigService.MinimumMinuetGapFormNotifications) {
            let message = translations.gapForMergeDrives1 + ' ' + finishGapInMinutes.toString() + ' ' + translations.gapForMergeDrives3FinishTimes
            issues.push(message)
        }

        const newDriveStartHour = Math.min(driveStart, orderStart)
        const newDriveFinishHour = Math.max(driveFinish, orderFinish);
        newDrive.startHour = Utils.DecimalTimeToHourText(newDriveStartHour)
        newDrive.finishHour = Utils.DecimalTimeToHourText(newDriveFinishHour);

        return {
            suggestedDrive: newDrive,
            issues: issues
        }
    },
    getDriveDurationInHours(ride: DriveModel | OrderModel): number {
        const start = Utils.hourTextToDecimal(ride.startHour)
        const finish = Utils.hourTextToDecimal(ride.finishHour)
        return Math.abs(finish - start)
    },
    splitTsamudOrder(order: OrderModel, locations: LocationModel[]): [OrderModel, OrderModel] {
        const location = locations.find((l: LocationModel) => l.id === order.location)
        const eta = location?.ETA || 30;
        const order1 = CloneUtil.deepCloneOrder(order);
        const order2 = CloneUtil.deepCloneOrder(order);

        order1.finishHour = Utils.DecimalTimeToHourText(Utils.hourTextToDecimal(order1.startHour) + Math.floor(((eta + 5) * 2) / 60));
        order1.TypeOfDrive = DriveType.OneWayTo;
        order1.Comments = translations.beforeSplit + ': ' + order1.Comments


        order2.startHour = Utils.DecimalTimeToHourText(Utils.hourTextToDecimal(order1.startHour) - Math.floor(((eta + 5) * 2) / 60));
        order2.TypeOfDrive = DriveType.OneWayFrom;
        order1.Comments = translations.beforeSplit + ': ' + order2.Comments
        return [order1, order2]
    }
}
