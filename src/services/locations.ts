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
        l('חיפה', 'Haifa'),
        l('עכו', 'Acre'),
        l('חברתי', 'Hevrati'),
        l('משגב', 'misgav'),
        l('צורית', 'Tzurit'),
        l('מרום גליל', 'MaromGalil'),
        l('מרכז', 'Merkaz'),
        l('יובלים', 'Yuvalim'),
        l('יעד', 'Yaad'),
        l('סכנין', 'Sachnin'),
        l('רכבת כרמיאל', 'RailKarmiel'),


    ]
}

export const locations: LocationModel[] = buildLocations();
const locations1: LocationModel[] = [
    {
        EnName: 'Karmiel',
        id: '1',
        Name: 'כרמיאל',
        ETA: 30,
    }, {
        EnName: 'Rakefet',
        id: '2',
        Name: 'רקפת',
        ETA: 30,
    }, {
        EnName: 'Haifa',
        id: '3',
        Name: 'חיפה',
        ETA: 50,
    }, {
        EnName: 'Hevrati',
        id: '4',
        Name: 'חברתי קריות',
        ETA: 40,
    },
    {
        EnName: 'Acre',
        id: '5',
        Name: 'עכו',
        ETA: 40,
    },
    {
        EnName: 'Misgav',
        id: '6',
        Name: 'משגב',
        ETA: 40,
    },
    {
        EnName: 'Tzurit',
        id: '7',
        Name: 'צורית',
        ETA: 40,
    },
    {
        EnName: 'Moatza',
        id: '8',
        Name: 'מרום גליל',
        ETA: 40,
    },
    {
        EnName: 'Merkaz',
        id: '9',
        Name: 'מרכז',
        ETA: 140,
    },
    {
        EnName: 'Yuvalim',
        id: '10',
        Name: 'יובלים',
        ETA: 15,
    },
    {
        EnName: 'Yaad',
        id: '11',
        Name: 'יעד',
        ETA: 15,
    },
    {
        EnName: 'Sachnin',
        id: '12',
        Name: 'סכנין',
        ETA: 25,
    },
    {
        EnName: 'RailKarmiel',
        id: '13',
        Name: 'רכבת',
        ETA: 25,
    },


]

