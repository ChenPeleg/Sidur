import {LocationModel} from '../models/Location.model';

let ids: number = 0;


const buildLocations = (): LocationModel[] => {
    const l = (Heb: string, En: string, ETA: number = 30): LocationModel => {
        ids++;
        return {
            EnName: En,
            id: ids.toString(),
            Name: Heb,
            ETA: ETA,
        }
    }
    return [l('כרמיאל', 'Karmiel'),
        l('רקפת', 'Rakefet'),
        l('חיפה', 'Haifa', 50),
        l('עכו', 'Acre', 45),
        l('חברתי', 'Hevrati', 50),
        l('משגב', 'misgav'),
        l('צורית', 'Tzurit'),
        l('מרום גליל', 'MaromGalil'),
        l('מרכז', 'Merkaz'),
        l('יובלים', 'Yuvalim'),
        l('יעד', 'Yaad'),
        l('סכנין', 'Sachnin'),
        l('רכבת כרמיאל', 'RailKarmiel', 25),
        l('אחר', 'Other', 60),


    ]
}

export const locations: LocationModel[] = buildLocations();

