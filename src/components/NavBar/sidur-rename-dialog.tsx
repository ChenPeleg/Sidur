import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
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

    const handleClose = () => {
        onClose(selectedValue);
    };
    return (
        <div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle> {translations.Rename}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {translations.Rename}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={translations.NewName}
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
