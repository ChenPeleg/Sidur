import * as React from 'react';
import {useRef, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {translations} from '../../services/translations';
import {Box} from '@mui/material';
import {SxProps} from '@mui/system';
import {Delete} from '@mui/icons-material';
import {DriveModel} from '../../models/Sketch.model';
import {VerticalHourField} from '../buttons/vertical-hour-field';

interface SketchDriveEditDialogProps {
    open: boolean;
    sketchDriveData: DriveModel | null;
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

    const [seatsValue, setSeatsValue] = useState('5');
    const [didDialogJustClosed, setDidDialogJustClosed] = useState(false);


    const nameValueRef: any = useRef('')
    const commentsValueRef: any = useRef('')
    const filedWrapper: SxProps = {width: '230px'}
    const handleCloseCancel = () => {
        onClose(null);
        setDidDialogJustClosed(true)
    };

    const handleCloseEdit = (): void => {
        let editedData: DriveModel | null = null;
        if (sketchDriveData) {
            editedData = {...sketchDriveData};
            // editedData.seats = seatsValue;
            // editedData.vehicleName = nameValueRef?.current?.value || sketchDriveData?.vehicleName || '';
            editedData.Comments = commentsValueRef?.current?.value || sketchDriveData?.Comments || '';
        }

        onClose(editedData);
        setDidDialogJustClosed(true)
    };
    const handleCloseDelete = (): void => {
        onDelete(sketchDriveData?.id || '');
        setDidDialogJustClosed(true)
    };
    const handleHourChange =
        (event: Event, input: any) => {

        }
    const handleSeatsValueChanged = (event: any, value: '7' | '5'): void => {

        setSeatsValue(value);

    }
    return (
        <div>

            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {translations.EditDrive}</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        ...filedWrapper,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <VerticalHourField input={sketchDriveData?.finishHour}
                                           onHoursChange={handleHourChange}
                                           label={translations.Start}/>
                        {/*<TextField*/}
                        {/*    autoFocus*/}
                        {/*    margin="dense"*/}
                        {/*    id="vehicle-rename-dialog-text-field"*/}
                        {/*    label={translations.NewName}*/}
                        {/*    type="text"*/}

                        {/*    variant="standard"*/}
                        {/*    defaultValue={sketchDriveData?.description}*/}
                        {/*    inputRef={nameValueRef}*/}
                        {/*    onKeyUp={(event) => {*/}
                        {/*        if (event.key === 'Enter') {*/}
                        {/*            handleCloseEdit()*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </Box>
                    <Box sx={{...filedWrapper}}>
                        <TextField

                            margin="dense"
                            id="vehicle-comments-dialog-text-field"
                            label={translations.Comments}
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={sketchDriveData?.Comments}
                            inputRef={commentsValueRef}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter') {
                                    handleCloseEdit()
                                }
                            }}
                        />
                    </Box>
                    {
                        translations
                            .connectedOrders
                    }

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
                </DialogContent>
                <DialogActions>
                    <Button id={'vehicle-edit-cancel-button'} onClick={handleCloseCancel}>{translations.Cancel}</Button>
                    <Button id={'vehicle-edit-approve-button'} onClick={handleCloseEdit}>{translations.Approve}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
