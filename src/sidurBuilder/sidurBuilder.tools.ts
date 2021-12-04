export const SidurBuilderTools = {
    hourTextToDecimal(hourText: string): number {
        if (!hourText.includes(':')) {
            // throw {
            //     message: 'hour is not set correctly'
            // }
        }
        const splitHour = hourText.split(':');
        const hour = Number(splitHour[0]) || 0;
        const minutes = Number(splitHour[1]) || 0;
        const minutesAsFraction = this.minutesToFraction(minutes);
        return hour + minutesAsFraction;


        return 0
    },
    minutesToFraction(minute: string | number): number {
        const minAsNumber = Number(minute) || 0;
        if (minAsNumber == 0) {
            return 0
        }
        return Math.floor((minAsNumber / 60) * 100) / 100
    }
}
