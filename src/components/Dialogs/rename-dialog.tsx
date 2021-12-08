import * as React from 'react';
import {useRef} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {translations} from '../../services/translations';

interface RenameProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string | null) => void;
}

export const RenameDialog = (props: RenameProps) => {
    // const [open, setOpen] = React.useState(false);
    const {
        onClose,
        selectedValue,
        open
    } = props;
    const valueRef: any = useRef('')
    const handleCloseCancel = () => {
        onClose(null);
    };
    const handleCloseRename = () => {
        onClose(valueRef.current.value || selectedValue);
    };
    return (
        <div>

            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {translations.Rename}</DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
                        margin="dense"
                        id={'sidur-rename-dialog-text-field'}
                        label={translations.NewName}
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedValue}
                        inputRef={valueRef}
                        onKeyUp={(event) => {
                            if (event.key === 'Enter') {
                                handleCloseRename()
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button id={'sidur-rename-cancel-button'} onClick={handleCloseCancel}>{translations.Cancel}</Button>
                    <Button id={'sidur-rename-approve-button'} onClick={handleCloseRename}>{translations.Approve}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
