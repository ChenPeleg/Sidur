import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';
import {defaultOrderValues} from '../store/store.types';
import {LocationModel} from '../models/Location.model';
import {translations} from './translations';

const NewRowToken = 'New_row_';

interface EshbalOrder {
    name: string,
    hour: string,
    text: string
}


const stringIntoRows = (str: string): string [] => {
    return str.split(NewRowToken).filter(s => s.replace(/\t/g, '').length > 5);
}

const DetectFormRows = (completeText: string): string => {
    return completeText.replace(/\n((0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4})/g, NewRowToken + '$1');
}
const rowsToEshbalOrders = (rows: string [][]): EshbalOrder[] => {
    let EshbalOrders: EshbalOrder[] = [];
    rows.forEach((row: string[], index: number) => {
        if (row[1].length > 1 && index > 0) {
            let name = row[1];
            for (let c = 2; c < 8; c += 2) {
                if (row[c].length > 1) {
                    const newRide: EshbalOrder = {
                        name: name,
                        hour: row[c],
                        text: row[c + 1],
                    }
                    EshbalOrders.push(newRide);

                }
            }
        }
    })
    return EshbalOrders
}

const ordersToOrderModel = (orders: EshbalOrder[]): OrderModel[] => {
    let idNum = 99;
    const defaultValues: OrderModel = {...defaultOrderValues}
    return orders.map((eOrder) => {
        const appOrder: OrderModel = {
            id: idNum.toString(),
            flexibility: defaultValues.flexibility,
            passengers: '1',
            location: '',
            TypeOfDrive: null,
            startHour: convertTimeTo4Digits(eOrder.hour),
            Comments: eOrder.text,
            driverName: eOrder.name,
            finishHour: ''
        }
        idNum++;
        return appOrder;
    });
}
/**
 * @description Searches for Time (number in hour pattern in the text, if the returned number is not equal to start hour, returns them
 * @param {OrderModel} order
 * @returns {{anotherTime: string | null}}
 */
const searchAnotherTimeInText = (order: OrderModel): { anotherTime: string | null } => {
    const text = order.Comments;
    const results: { anotherTime: string | null } = {anotherTime: null}
    const matchingTime = text.matchAll(/(\d{1,2}:\d\d)/g);
    const matchingArray = Array.from(matchingTime)

    if (matchingArray && matchingArray[0]) {
        matchingArray.forEach(t => {
            const convertedTime = convertTimeTo4Digits(t.toString());
            if (convertedTime !== order.startHour) {
                results.anotherTime = convertedTime
            }
        })
    }

    if (!results.anotherTime) {
        const matchingTime = text.matchAll(/(1\d|20|21|22|23)/g);
        const matchingArray = Array.from(matchingTime)

        if (matchingArray && matchingArray[0]) {
            matchingArray.forEach(t => {
                const convertedTime = convert2DigitTimeTo4Digits(t.toString());
                if (convertedTime !== order.startHour) {
                    results.anotherTime = convertedTime
                }
            })
        }
    }

    return results
}
const searchLocationInText = (text: string, locations: LocationModel[]): { locationFound: LocationModel | null, typeOfDrive: DriveType | null } => {
    const allLocations: LocationModel[] = [...locations];
    const results: { locationFound: LocationModel | null, typeOfDrive: DriveType | null } = {
        locationFound: null,
        typeOfDrive:
            null
    }
    allLocations.forEach((location: LocationModel) => {
        if (text.includes(location.name)) {
            results.locationFound = location;
        }
    });

    if (results.locationFound) {
        const locName = results.locationFound.name;
        const fromPrefixes = [translations.From, translations.fromLocationWithThe];
        const toPrefixes = [translations.toLocation, translations.toLocationLe];
        const tzamudPrefix = [translations.inLocation];
        if (fromPrefixes.some(pre => text.includes(pre + locName))) {
            results.typeOfDrive = DriveType.OneWayFrom
        }
        if (toPrefixes.some(pre => text.includes(pre + locName))) {
            results.typeOfDrive = DriveType.OneWayTo
        }
        if (tzamudPrefix.some(pre => text.includes(pre + locName))) {
            results.typeOfDrive = DriveType.Tsamud
        }
    }
    if (text.includes(translations.TsamudWord)) {
        results.typeOfDrive = DriveType.Tsamud
    }

    return results
}
const convertTimeTo4Digits = (time: string): string => {
    if (time.match(/^\d:\d\d$/)) {
        return '0' + time
    } else {
        return time
    }
}
const convert2DigitTimeTo4Digits = (time: string): string => {
    if (time.match(/^\d\d$/)) {
        return time + ':00'
    } else {
        return time
    }
}
const getLocationAndTypeFromComments = (orders: OrderModel[], locations: LocationModel[]): OrderModel[] => {
    orders.map(order => {
        const LocationSearchResult = searchLocationInText(order.Comments, locations);
        if (LocationSearchResult.locationFound) {
            order.location = LocationSearchResult.locationFound.id
        }
        if (LocationSearchResult.typeOfDrive) {
            order.TypeOfDrive = LocationSearchResult.typeOfDrive
        }
        const anotherTimeSearchResults = searchAnotherTimeInText(order);
        if (anotherTimeSearchResults.anotherTime && anotherTimeSearchResults.anotherTime !== order.startHour) {
            order.finishHour = anotherTimeSearchResults.anotherTime
        }
        return order
    })
    return orders
}
export const ImportOrdersFromText = (text: string, locations: LocationModel[]): OrderModel[] => {
    // text = stringValue;
    const rowsWithoutUserLineBreaks = DetectFormRows(text)
    const rows = stringIntoRows(rowsWithoutUserLineBreaks);
    const rowsWithColumns = rows.map(r => r.split(/\t/g));
    const orders: EshbalOrder[] = rowsToEshbalOrders(rowsWithColumns);
    let appOrders: OrderModel[] = ordersToOrderModel(orders)
    //TODO - AD 19 Ad 6
    return getLocationAndTypeFromComments(appOrders, locations);


}
export const validateImportedData = (prefs: OrderModel[]) => {
    const errors = [];
    const guardWithoutName = prefs
        .map((p, i) => ({
            driverName: p.driverName,
            row: i + 1,
        }))
        .filter((g) => g.driverName?.trim() === "")
        .map((g) => g.row.toString());

    const guardWithoutDates = prefs.filter(
        (p) => p.startHour.length === 0
    );
    if (prefs.length < 5) {
        errors.push(
            prefs.length
                ? "only " + prefs.length + " rows were found"
                : "no guard duty google sheets rows were found"
        );
    }
    if (guardWithoutDates[0]) {
        errors.push("Guard " + guardWithoutDates[0].driverName + " has no dates");
    }
    if (guardWithoutName[0]) {
        errors.push("Row " + guardWithoutName[0] + " has no name");
    }
    const guardWithError = prefs.filter((p) =>
        p.driverName.toLowerCase().includes("error")
    );
    if (guardWithError[0]) {
        errors.push("Row " + prefs.indexOf(guardWithError[0]) + " has an error");
    }
    if (errors.length) {
        const text = errors.join("; ");
        throw {
            message: text,
        };
    }

    return true;
};
