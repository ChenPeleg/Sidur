import {DriveType} from './DriveType.enum';

export interface MuiFormPropsModel {
    handleSubmit: any,
    pristine: any,
    reset: any,
    submitting: any,
    orderId: any,
    isInEdit: boolean,
    typeOfDrive?: DriveType

}
