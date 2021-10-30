import {hashFunction} from './hash-function';

export const Utilities = {
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

    }
}
