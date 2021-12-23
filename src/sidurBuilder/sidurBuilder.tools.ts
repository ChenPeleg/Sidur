import {translations} from '../services/translations';

export const SidurBuilderTools = {

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
    },
    EnumeratorConstructor(startId: number = 1): { getId: () => number, getStrId: () => string, } {
        let currentId = startId;
        return {
            getId() {
                return ++currentId
            },
            getStrId() {
                return (++currentId).toString()
            }
        }
    }

}
