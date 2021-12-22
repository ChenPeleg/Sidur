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
import {Delete} from '@mui/icons-material';
import {DriveModel} from '../../models/Sketch.model';
import {VerticalHourField} from '../buttons/vertical-hour-field';
import {OrderModel} from '../../models/Order.model';
import {useSelector} from 'react-redux';
import {Utils} from '../../services/utils';

interface SketchDriveEditDialogProps {
    open: boolean;
    sketchDriveData: DriveModel;
    onDelete: (id: string | null) => void;
    onClose: (vehicleUpdate: DriveModel | null) => void;
}

export const SketchDriveEditDialog = (props: SketchDriveEditDialogProps) => {
    const {
        onClose,
        onDelete,
        open,
        sketchDriveData
    } = props;


    const [didDialogJustClosed, setDidDialogJustClosed] = useState(false);

    const orders = useSelector((state: { orders: OrderModel[] }) => state.orders || []);
    const [sketchChangedData, setSketchChangedData] = useState<DriveModel>({...sketchDriveData});

    const nameValueRef: any = useRef('')
    const descriptionValueRef: any = useRef('')
    const filedWrapper: SxProps = {
        width: '230px'
    }
    const handleCloseCancel = () => {
        onClose(null);
        setDidDialogJustClosed(true)
    };

    const handleCloseEdit = (): void => {
        const editedData: DriveModel | null = {...sketchChangedData};
        if (descriptionValueRef?.current?.value) {
            editedData.description = descriptionValueRef?.current?.value
        }
        onClose(editedData);

    };
    const handleCloseDelete = (): void => {
        onDelete(sketchDriveData?.id || '');
        setDidDialogJustClosed(true)
    };
    const handleHourChange =
        (event: Event, input: any) => {


            const newSketchData = {...sketchChangedData};
            newSketchData.startHour = Utils.DecimalTimeToHourText(input[0]);
            newSketchData.finishHour = Utils.DecimalTimeToHourText(input[1]);
            setSketchChangedData(newSketchData);


        }
    const implementedOrders = orders.filter((o: OrderModel) => sketchDriveData.implementsOrders.includes(o.id))

    return (


        <Dialog open={open} onClose={handleCloseCancel}>
            <DialogTitle> {translations.EditDrive}</DialogTitle>
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
                                    component="legend"><b>{translations.DriveTimes}</b>
                        </Typography>

                        <VerticalHourField input={[sketchDriveData.startHour, sketchDriveData.finishHour]}
                                           onHoursChange={handleHourChange}
                                           label={translations.Start}/>

                    </Box>
                    <Box sx={{
                        ...filedWrapper,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography align={'center'}
                                    component="legend"><b>{translations.DriveDescription}</b>
                        </Typography>

                        <Box sx={{...filedWrapper}}>
                            <TextField
                                size={'medium'}
                                //sx={{minHeight: '200px'}}
                                margin="dense"
                                id="vehicle-comments-dialog-text-field"
                                //  label={translations.Comments}
                                type="text"
                                fullWidth
                                multiline={true}
                                variant="standard"
                                defaultValue={sketchDriveData?.description || ''}
                                inputRef={descriptionValueRef}
                                onKeyUp={(event) => {
                                    if (event.key === 'Enter') {
                                        handleCloseEdit()
                                    }
                                }}
                            />
                        </Box>
                        <Typography align={'center'} sx={{mt: '1em'}}
                                    component="legend"><b> {
                            translations
                                .connectedOrders
                        }</b>
                        </Typography>
                        <Box id={'connected-orders'}>
                            {implementedOrders.map((order: OrderModel, i: number) => (
                                <Box key={i}>
                                    {order.Comments}
                                </Box>))}
                        </Box>


                        <Box sx={{

                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '1em',
                            display: 'flex'
                        }}>
                            {(sketchDriveData?.id !== '0') ? (
                                <Button variant="contained" onClick={handleCloseDelete} aria-label="add" size="large">
                                    <Delete/> {translations.Delete}
                                </Button>) : null}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button id={'vehicle-edit-cancel-button'} onClick={handleCloseCancel}>{translations.Cancel}</Button>
                <Button id={'vehicle-edit-approve-button'} onClick={handleCloseEdit}>{translations.Approve}</Button>
            </DialogActions>
        </Dialog>

    );
}
