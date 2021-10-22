import * as React from 'react';
import {useRef} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {translations} from '../../services/translations';

interface SidurRenameProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

export const SidurRenameDialog = (props: SidurRenameProps) => {
    // const [open, setOpen] = React.useState(false);
    const {
        onClose,
        selectedValue,
        open
    } = props;
    const valueRef: any = useRef('')
    const handleCloseCancel = () => {
        onClose(selectedValue);
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
                        id="name"
                        label={translations.NewName}
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={selectedValue}
                        inputRef={valueRef}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancel}>{translations.Cancel}</Button>
                    <Button onClick={handleCloseRename}>{translations.Approve}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
