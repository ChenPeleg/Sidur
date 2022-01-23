import {DriveType} from './DriveType.enum';
import {LocationModel} from './Location.model';

export interface MuiFormPropsModel {
    handleSubmit: any,
    pristine: any,
    reset: any,
    submitting: any,
    orderId: any,
    isInEdit: boolean,
    typeOfDrive?: DriveType,
    locations: LocationModel[]

}
