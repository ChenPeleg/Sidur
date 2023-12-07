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
import {OrderModel} from '../../models/Order.model';
import {useDispatch, useSelector} from 'react-redux';
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
    const secondOrderToMergeBrief = {...orderToMergeBrief};
    const descriptionValueRef: any = useRef('')
    const secondDescriptionValueRef: any = useRef('')
    const filedWrapper: SxProps = {
        width: '100%'
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
    const implementedOrders = sketchOrders.filter((o: OrderModel) => driveChangedData.implementsOrders.includes(o.id))

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


                    <Box id={'divider-in-main-row'} sx={{
                        width: '20px',
                        height: '100px'
                    }}/>
                    <Box sx={{
                        ...filedWrapper,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>


                        <Box sx={{...filedWrapper}}>
                            <TextField
                                size={'medium'}
                                margin="dense"
                                id="vehicle-comments-dialog-text-field"
                                type="text"
                                fullWidth
                                multiline={true}
                                variant="standard"
                                defaultValue={((orderToMergeBrief.timeText + ' ' + orderToMergeBrief.driverAndLocation) || '').replace('  ', ' ')}
                                inputRef={descriptionValueRef}
                                onKeyUp={(event) => {
                                    if (event.key === 'Enter') {
                                        handleCloseEdit()
                                    }
                                }}
                            />
                        </Box>


                        <Typography sx={{mt: '0.2em'}}
                                    component="legend"><b> {implementedOrders.length === 0 ? (translations.none + ' ') : null} {
                            translations
                                .connectedOrders
                        }</b>
                        </Typography>
                        {
                            secondOrderToMergeBrief ? (

                                <Box sx={{...filedWrapper}}>
                                    <TextField
                                        size={'medium'}
                                        margin="dense"
                                        id="vehicle-comments-dialog-text-field"
                                        type="text"
                                        fullWidth
                                        multiline={true}
                                        variant="standard"
                                        defaultValue={((secondOrderToMergeBrief.timeText + ' ' + secondOrderToMergeBrief.driverAndLocation) || '').replace('  ', ' ')}
                                        inputRef={secondDescriptionValueRef}
                                        onKeyUp={(event) => {
                                            if (event.key === 'Enter') {
                                                handleCloseEdit()
                                            }
                                        }}
                                    />
                                </Box>) : null
                        }


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
                        onClick={handleCloseCancel}>{translations.Cancel}</Button>
                <Box sx={{
                    width: '30px',
                    height: '10px'
                }}/>
                <Button size={'large'} variant={'contained'} id={'vehicle-edit-approve-button'}
                        onClick={handleCloseEdit}>{translations.Update}</Button>
            </DialogActions>
        </Dialog>

    );
}
