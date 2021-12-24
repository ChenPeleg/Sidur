import {DriveType} from '../models/DriveType.enum';
import {translations} from './translations';
import {OrderModel} from '../models/Order.model';
import {LocationModel} from '../models/Location.model';
import {DriveModel} from '../models/Sketch.model';
import {SketchEditActionEnum} from '../models/SketchEditAction.enum';

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
                briefText += ' ' + driveTimeLanguage.location + location.Name
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
    buildSketchEditActionsArray(): { action: SketchEditActionEnum, name: string, icon: string } [] {
        const ret: { action: SketchEditActionEnum, name: string, icon: string } [] = []
        for (let sketchEditActionEnumKey in SketchEditActionEnum) {
            if (isNaN(Number(sketchEditActionEnumKey))) {
                continue
            }
            let name = sketchEditActionEnumKey;
            const enumbEntry = Number(sketchEditActionEnumKey) as SketchEditActionEnum
            switch (enumbEntry) {
                case SketchEditActionEnum.Split:


                    name = translations.SketchActionSplit;

                    break;
                case SketchEditActionEnum.Merge:
                    name = translations.SketchActionMerge;
                    break;
                case SketchEditActionEnum.Change:
                    name = translations.SketchActionChange;
                    break;
                case SketchEditActionEnum.ChangeTime:
                    name = translations.SketchActionChangeTime;
                    break;
                case SketchEditActionEnum.ReplaceExisting:
                    name = translations.SketchActionReplaceExisting;
                    break;
                case SketchEditActionEnum.publicTransport:
                    name = translations.SketchActionPublicTransport
                    break;
                case SketchEditActionEnum.Remove:
                    name = translations.SketchActionRemove;
                    break;
            }
            ret.push({
                action: Number(sketchEditActionEnumKey),
                name: name,
                icon: SketchEditActionEnum[enumbEntry]
            })
        }
        return ret
    }
}
