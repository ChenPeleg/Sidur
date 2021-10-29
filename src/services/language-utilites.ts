import {DriveType} from '../models/DriveType.enum';
import {translations} from './translations';

interface driveHourPrefixes {
    timeStart: string,
    timeEnd: string,
    location: string

}

export const LanguageUtilites = {
    getPrefixByDriveType(driveType: DriveType | undefined): driveHourPrefixes {
        switch (driveType) {
            case DriveType.OneWayFrom:
                return {
                    timeStart: translations.Start,
                    timeEnd: translations.pickupTime,
                    location: translations.fromLocation
                }
            case DriveType.OneWayTo:
                return {
                    timeStart: translations.exitTime,
                    timeEnd: translations.Finish,
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

    }

}
