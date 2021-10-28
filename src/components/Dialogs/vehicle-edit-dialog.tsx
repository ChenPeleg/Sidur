import * as React from 'react';
import {useRef, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {translations} from '../../services/translations';
import {VehicleModel} from '../../models/Vehicle.model';
import {Box, ToggleButton, ToggleButtonGroup} from '@mui/material';
import {SxProps} from '@mui/system';
import {Delete} from '@mui/icons-material';

interface VehicleEditDialogProps {
    open: boolean;
    vehicleData: VehicleModel | null;
    onDelete: (id: string | null) => void;
    onClose: (vehicleUpdate: VehicleModel | null) => void;
}

export const VehicleEditDialog = (props: VehicleEditDialogProps) => {
    const {
        onClose,
        onDelete,
        open,
        vehicleData
    } = props;

    const [seatsValue, setSeatsValue] = useState(vehicleData?.seats || '5')
    const nameValueRef: any = useRef('')
    const commentsValueRef: any = useRef('')
    const filedWrapper: SxProps = {width: '230px'}
    const handleCloseCancel = () => {
        onClose(null);
    };
    const handleCloseEdit = () => {
        let editedData: VehicleModel | null = null;
        if (vehicleData) {
            editedData = {...vehicleData};
            editedData.seats = seatsValue;
            editedData.vehicleName = nameValueRef?.current?.value || vehicleData?.vehicleName || '';
            editedData.Comments = commentsValueRef?.current?.value || vehicleData?.Comments || '';
        }

        onClose(editedData);
    };
    const handleCloseDelete = () => {
        onDelete(vehicleData?.id || '');
    };
    return (
        <div>

            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {vehicleData?.vehicleName}</DialogTitle>
                <DialogContent>
                    <Box sx={{...filedWrapper}}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label={translations.NewName}
                            type="text"

                            variant="standard"
                            defaultValue={vehicleData?.vehicleName}
                            inputRef={nameValueRef}
                            onKeyUp={(event) => {
                                if (event.key == 'Enter') {
                                    handleCloseEdit()
                                }
                            }}
                        />
                    </Box>
                    <Box sx={{...filedWrapper}}>
                        <TextField

                            margin="dense"
                            id="name"
                            label={translations.Comments}
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={vehicleData?.Comments}
                            inputRef={commentsValueRef}
                            onKeyUp={(event) => {
                                if (event.key == 'Enter') {
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
                            value={seatsValue}
                            exclusive
                            onChange={(event, value) => {
                                setSeatsValue(value)
                            }}

                        >
                            <ToggleButton value="7" dir={'rtl'}>7 {translations.seats} </ToggleButton>
                            <ToggleButton value="5" dir={'rtl'}>5 {translations.seats} </ToggleButton>

                        </ToggleButtonGroup>
                    </Box>
                    <Box sx={{

                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '1em',
                        display: 'flex'
                    }}>
                        {(vehicleData?.id !== '0') ? (
                            <Button variant="contained" onClick={handleCloseDelete} aria-label="add" size="large">
                                <Delete/> {translations.Delete}
                            </Button>) : null}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancel}>{translations.Cancel}</Button>
                    <Button onClick={handleCloseEdit}>{translations.Approve}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
