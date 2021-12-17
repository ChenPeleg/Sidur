import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {translations} from '../../services/translations';
import {Box, ToggleButton, ToggleButtonGroup} from '@mui/material';
import {SxProps} from '@mui/system';
import {Delete} from '@mui/icons-material';
import {DriveModel} from '../../models/Sketch.model';

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

    // if (didDialogJustClosed && open) {
    //     setSeatsValue(sketchDriveData?.seats || '5');
    //
    //     setDidDialogJustClosed(false);
    // }

    const nameValueRef: any = useRef('')
    const commentsValueRef: any = useRef('')
    const filedWrapper: SxProps = {width: '230px'}
    const handleCloseCancel = () => {
        onClose(null);
        setDidDialogJustClosed(true)
    };
    useEffect(() => {
        // Update the document title using the browser API

        // document.title = `You clicked ${count} times`;
    });
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
    const handleSeatsValueChanged = (event: any, value: '7' | '5'): void => {

        setSeatsValue(value);

    }
    return (
        <div>

            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {sketchDriveData?.Comments}</DialogTitle>
                <DialogContent>
                    <Box sx={{...filedWrapper}}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="vehicle-rename-dialog-text-field"
                            label={translations.NewName}
                            type="text"

                            variant="standard"
                            defaultValue={sketchDriveData?.description}
                            inputRef={nameValueRef}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter') {
                                    handleCloseEdit()
                                }
                            }}
                        />
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

                    <Box dir={'ltr'} sx={{

                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '1em',
                        display: 'flex'
                    }}>
                        <ToggleButtonGroup
                            color="primary"
                            // value={seatsValue}
                            // defaultValue={vehicleData?.seats || '5'}
                            exclusive
                            onChange={(event, value) => {

                                handleSeatsValueChanged(event, value)
                            }}

                        >
                            <ToggleButton selected={seatsValue === '7'} key={'7'} value="7"
                                          dir={'rtl'}>7 {translations.seats} </ToggleButton>
                            <ToggleButton selected={seatsValue === '5'} key={'5'} value="5"
                                          dir={'rtl'}>5 {translations.seats} </ToggleButton>

                        </ToggleButtonGroup>
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
                </DialogContent>
                <DialogActions>
                    <Button id={'vehicle-edit-cancel-button'} onClick={handleCloseCancel}>{translations.Cancel}</Button>
                    <Button id={'vehicle-edit-approve-button'} onClick={handleCloseEdit}>{translations.Approve}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
