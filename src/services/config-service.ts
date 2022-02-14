import {LocationModel} from '../models/Location.model';
import {translations} from './translations';


export const ConfigService = {
    Constants: {
        RoutesMinutesOptions: [5, 10, 15, 20, 30, 45, 60, 90, 120],
        HomeLocationId: 'HOME_LOCATION',
        get HomeLocation(): LocationModel {
            const id = this.HomeLocationId;
            return {
                ETA: 0,
                EnName: 'HOME_LOCATION',
                id: id,
                name: translations.Home
            }
        }
    },
    MinimumMinuetGapFormNotifications: 30
}
