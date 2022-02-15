import * as React from 'react';
import {useRef, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {translations} from '../../services/translations';
import {Box, Typography} from '@mui/material';
import {SxProps} from '@mui/system';
import {MergeType} from '@mui/icons-material';
import {DriveModel, SketchModel} from '../../models/Sketch.model';
import {VerticalHourField} from '../buttons/vertical-hour-field';
import {OrderModel} from '../../models/Order.model';
import {useDispatch, useSelector} from 'react-redux';
import {Utils} from '../../services/utils';
import {SidurStore} from '../../store/store.types';
import {LocationModel} from '../../models/Location.model';
import {LanguageUtilities} from '../../services/language-utilities';
import {Styles} from '../../hoc/themes';
import {DriveType} from '../../models/DriveType.enum';

interface SketchOrderToTransportDialogProps {
    open: boolean;
    PendingOrderToTransportId: string;
    onClose: (vehicleUpdate: OrderModel | null) => void;
}

export const SketchOrderToTransportDialog = (props: SketchOrderToTransportDialogProps) => {
    const {
        onClose,
        open,
        PendingOrderToTransportId
    } = props;
    const dispatch = useDispatch();
    console.log('in order transport popup')
    const SketchIdInEdit = useSelector((state: SidurStore) => state.sessionState.SketchIdInEdit);
    const sketches: SketchModel[] = useSelector((state: { sketches: SketchModel[] }) => state.sketches);
    const sketchInEdit: SketchModel = sketches.find((sketch: SketchModel) => sketch.id === SketchIdInEdit) as SketchModel;
    const orderToMerge: OrderModel = sketchInEdit.unassignedOrders.find(o => o.id === PendingOrderToTransportId) as OrderModel;
    const sketchOrders = sketchInEdit?.assignedOrders || [];
    const locations = useSelector(((state: { Locations: LocationModel[] }) => state.Locations));
    const fakseDrive: DriveModel = {
        Comments: '',
        TypeOfDrive: DriveType.Tsamud,
        description: '',
        driverName: '',
        finishHour: '',
        flexibility: ['', ''],
        id: '',
        implementsOrders: [],
        location: '',
        passengers: '',
        startHour: ''
    }
    const driveDataAndIssues = {
        suggestedDrive: fakseDrive,
        issues: []
    }
    const driveData = driveDataAndIssues.suggestedDrive;
    const issues = driveDataAndIssues.issues;

    const orderToMergeBrief = LanguageUtilities.buildBriefText(orderToMerge, locations);

    const [driveChangedData, setDriveChangedData] = useState<DriveModel>({...driveData});


    const descriptionValueRef: any = useRef('')
    const filedWrapper: SxProps = {
        //  width: '320px'
    }
    const handleCloseCancel = () => {
        onClose(null);
    };

    const handleCloseEdit = (): void => {
        const editedData: DriveModel | null = {...driveChangedData};
        if (descriptionValueRef?.current?.value) {
            editedData.description = descriptionValueRef?.current?.value
        }
        if (orderToMerge.TypeOfDrive === DriveType.Tsamud) {
            editedData.TypeOfDrive = DriveType.Tsamud;

        }
        editedData.implementsOrders.push(PendingOrderToTransportId);
        onClose(editedData);

    };


    const handleHourChange =
        (event: Event, input: any) => {
            const newriveData = {...driveChangedData};
            newriveData.startHour = Utils.DecimalTimeToHourText(input[0]);
            newriveData.finishHour = Utils.DecimalTimeToHourText(input[1]);
            setDriveChangedData(newriveData);


        }
    const implementedOrders = sketchOrders.filter((o: OrderModel) => driveChangedData.implementsOrders.includes(o.id))
    const newImplementedOrders = [orderToMerge]
    return (


        <Dialog open={open} onClose={handleCloseCancel} fullWidth>
            <DialogTitle sx={{
                fontSize: '22px',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center'

            }}><MergeType fontSize={'large'}/> {translations.publicTransportSolution} </DialogTitle>
            <DialogContent>
                <Box sx={{
                    ...filedWrapper,
                    display: 'flex',
                    flexDirection: 'row',
                    minWidth: '35vw'
                }}>


                    <Box sx={{
                        ...filedWrapper,
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '160px',
                        p: '0 0.2em',

                    }}>
                        <Typography align={'center'}
                                    component="legend"><b>{translations.DriveTimesAfterMerge}</b>
                        </Typography>

                        <VerticalHourField input={[driveData.startHour, driveData.finishHour]}
                                           onHoursChange={handleHourChange}
                                           label={translations.Start}/>

                    </Box>
                    <Box id={'divider-in-main-row'} sx={{
                        width: '20px',
                        height: '100px'
                    }}/>
                    <Box sx={{
                        ...filedWrapper,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography
                            component="legend"><b>{translations.DriveDescriptionNew}</b>
                        </Typography>

                        <Box sx={{...filedWrapper}}>
                            <TextField
                                size={'medium'}
                                margin="dense"
                                id="vehicle-comments-dialog-text-field"
                                type="text"
                                fullWidth
                                multiline={true}
                                variant="standard"
                                defaultValue={(driveData?.description || '').replace('  ', ' ')}
                                inputRef={descriptionValueRef}
                                onKeyUp={(event) => {
                                    if (event.key === 'Enter') {
                                        handleCloseEdit()
                                    }
                                }}
                            />
                        </Box>
                        <Typography sx={{mt: '1em'}}
                                    component="legend"><b> {newImplementedOrders.length === 0 ? (translations.none + ' ') : null} {
                            translations
                                .issues + ':'
                        }</b>
                            <Box id={'issues'}>
                                {issues.map((issue: string, i: number) => (
                                    <Box key={i} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        p: '0.0em'
                                    }}>
                                        <Box sx={{pb: '0em'}}>
                                            {(i + 1).toString() + '. '}{issue}
                                        </Box>


                                    </Box>))}
                            </Box>
                        </Typography> <Typography sx={{mt: '1em'}}
                                                  component="legend"><b> {newImplementedOrders.length === 0 ? (translations.none + ' ') : null} {
                        translations
                            .newMergedOrder
                    }</b>
                    </Typography>

                        <Box id={'connected-orders'}>
                            {newImplementedOrders.map((order: OrderModel, i: number) => (
                                <Box key={i} sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: '0.2em'
                                }}>
                                    <Box sx={{pb: '0.2em'}}>
                                        {orderToMergeBrief.timeText + ' ' + orderToMergeBrief.driverAndLocation + ', ' + order.Comments}
                                    </Box>


                                </Box>))}
                        </Box>


                        <Typography sx={{mt: '0.2em'}}
                                    component="legend"><b> {implementedOrders.length === 0 ? (translations.none + ' ') : null} {
                            translations
                                .connectedOrders
                        }</b>
                        </Typography>

                        <Box id={'connected-orders'}>
                            {implementedOrders.map((order: OrderModel, i: number) => (
                                <Box key={i} sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: '0.2em'
                                }}>
                                    <Box sx={{pb: '0.5em'}}>
                                        {(i + 1).toString() + '. '}{order.Comments}
                                    </Box>

                                </Box>))}
                        </Box>


                        <Box sx={{

                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '1em',
                            display: 'flex'
                        }}>

                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{
                ...Styles.flexRow,
                justifyContent: 'center'
            }}>

                <Button size={'large'} variant={'outlined'} id={'vehicle-edit-cancel-button'}
                        onClick={handleCloseCancel}>{translations.CancelMerge}</Button>
                <Box sx={{
                    width: '30px',
                    height: '10px'
                }}/>
                <Button size={'large'} variant={'contained'} id={'vehicle-edit-approve-button'}
                        onClick={handleCloseEdit}>{translations.ApproveMerge}</Button>
            </DialogActions>
        </Dialog>

    );
}
