import {DriveType} from '../models/DriveType.enum';
import {translations} from './translations';
import {OrderModel} from '../models/Order.model';
import {LocationModel} from '../models/Location.model';
import {DriveModel} from '../models/Sketch.model';
import {SketchDriveOrderEditActionEnum} from '../models/SketchDriveOrderEditActionEnum';

interface driveHourPrefixes {
    timeStart: string,
    timeEnd: string,
    location: string

}

export const LanguageUtilities = {
    getPrefixByDriveType(driveType: DriveType | undefined): driveHourPrefixes {
        switch (driveType) {
            case DriveType.OneWayFrom:
                return {
                    timeStart: translations.pickupTime,
                    timeEnd: '',
                    location: translations.fromLocation
                }
            case DriveType.OneWayTo:
                return {
                    timeStart: translations.exitTime,
                    timeEnd: '',
                    location: translations.toLocation
                }
            case DriveType.Tsamud:
                return {
                    timeStart: translations.exitTime,
                    timeEnd: translations.returnTime,
                    location: translations.inLocation
                }
            case DriveType.TwoWay:
                return {
                    timeStart: translations.Start,
                    timeEnd: translations.returnTime,
                    location: translations.inLocation
                }

        }
        return {
            timeStart: translations.exitTime,
            timeEnd: translations.returnTime,
            location: translations.Where + ' '
        }

    },

    buildBriefText(orderValues: OrderModel | DriveModel, locations: LocationModel[]): { timeText: string, driverAndLocation: string } {
        //console.log(orderValues)
        const isWithName = orderValues.driverName.trim() !== '';
        if (!isWithName) {
            return {
                timeText: '',
                driverAndLocation: translations.NewOrder
            }

        }
        let timeText = orderValues?.startHour || '';
        if (orderValues.TypeOfDrive === DriveType.Tsamud && orderValues?.startHour && orderValues?.finishHour) {
            timeText = orderValues.startHour + ' - ' + orderValues.finishHour;
        }
        let briefText = orderValues.driverName;
        if (orderValues.TypeOfDrive && orderValues.location) {
            const driveTimeLanguage = LanguageUtilities.getPrefixByDriveType(orderValues.TypeOfDrive);
            const location = locations.find(l => l.id === orderValues.location);
            if (location) {
                briefText += ' ' + driveTimeLanguage.location + location.name
            }

        }

        return {
            timeText: timeText,
            driverAndLocation: briefText
        }
    },
    renderPassengerText(num: string): string {
        if (num === '1') {
            return translations.onePassenger
        }
        return num.toString() + ' ' + translations.passengers
    },
    addLineBreaksToString(str: string, numberOfBR: number = 2): string {
        const br = '\n   ';
        const arr = new Array(numberOfBR)
        return str + arr.map(s => br).join('')
    },
    buildSketchEditActionsArray(): { action: SketchDriveOrderEditActionEnum, name: string, icon: string } [] {
        const ret: { action: SketchDriveOrderEditActionEnum, name: string, icon: string } [] = []
        for (let sketchEditActionEnumKey in SketchDriveOrderEditActionEnum) {
            if (isNaN(Number(sketchEditActionEnumKey))) {
                continue
            }
            let name = sketchEditActionEnumKey;
            const enumbEntry = Number(sketchEditActionEnumKey) as SketchDriveOrderEditActionEnum;
            let icon = SketchDriveOrderEditActionEnum[enumbEntry];
            let isDisabled: boolean = false
            switch (enumbEntry) {
                case SketchDriveOrderEditActionEnum.Split:
                    name = translations.SketchActionSplit;
                    break;
                case SketchDriveOrderEditActionEnum.Merge:
                    name = translations.SketchActionMerge;
                    break;
                case SketchDriveOrderEditActionEnum.Change:
                    name = translations.SketchActionChange;
                    isDisabled = true;
                    break;
                case SketchDriveOrderEditActionEnum.ChangeTime:
                    name = translations.SketchActionChangeTime;
                    isDisabled = true;
                    break;
                case SketchDriveOrderEditActionEnum.ReplaceExisting:
                    name = translations.SketchActionReplaceExisting;
                    break;
                case SketchDriveOrderEditActionEnum.publicTransport:
                    name = translations.SketchActionPublicTransport
                    break;
                case SketchDriveOrderEditActionEnum.RemoveFromPending:
                    name = translations.SketchActionRemove;
                    isDisabled = true;
                    break;
                case SketchDriveOrderEditActionEnum.AddToPending:
                    name = translations.SketchActionAddToPending;
                    isDisabled = true;
                    break;
                case SketchDriveOrderEditActionEnum.MoveToTop:
                    name = translations.SketchActionMoveToTop;
                    break;
                case SketchDriveOrderEditActionEnum.MoveToBottom:
                    name = translations.SketchActionMoverToBottom;
                    break;
                case SketchDriveOrderEditActionEnum.AddToVehicle:
                    name = translations.SketchActionAddToVehicle;
                    break;
            }
            if (isDisabled) {
                continue
            }
            ret.push({
                action: Number(sketchEditActionEnumKey),
                name: name,
                icon: icon
            })
        }
        return ret
    }
}
