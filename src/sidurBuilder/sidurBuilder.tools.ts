import {translations} from '../services/translations';

export const SidurBuilderTools = {
    hourTextToDecimal(hourText: string): number {
        if (!hourText.includes(':')) {

        }
        const splitHour = hourText.split(':');
        const hour = Number(splitHour[0]) || 0;
        const minutes = Number(splitHour[1]) || 0;
        const minutesAsFraction = this.minutesToFraction(minutes);
        return hour + minutesAsFraction;


    },
    minutesToFraction(minute: string | number): number {
        const minAsNumber = Number(minute) || 0;
        if (minAsNumber == 0) {
            return 0
        }
        return Math.floor((minAsNumber / 60) * 100) / 100
    },
    createSketchName(id: string): string {
        switch (id) {

            case '1':
                return translations.first
            case '2':
                return translations.second
            case '3':
                return translations.third
            default:
                return translations.number + ' ' + id

        }
    }
}
