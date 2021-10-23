import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {translations} from '../../services/translations';
import {Box} from '@mui/material';
import {AppConstants, SidurRecord, SidurStore} from '../../store/store.types';
import {useSelector} from 'react-redux';


interface FileUploadProps {
    open: boolean;
    onClose: () => void;

}

export const SidurManagementDialog = (props: FileUploadProps) => {
    const {
        onClose,
        open
    } = props;
    const sidurArchive: SidurRecord[] = useSelector((state: SidurStore) => state.sidurArchive);
    const sidurCollection: SidurRecord[] = useSelector((state: SidurStore) => state.sidurCollection);
    const handleCloseCancel = () => {
        onClose();
    };


    return (
        <div>
            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {translations.ImportFromFile}</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        minWidth: '25vw',
                        display: 'flex',
                        alignItems: 'center',

                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                        <Box>
                            <p> {translations.inArchive}</p>
                            {sidurArchive.filter((sidur: SidurRecord) => sidur.id.includes(AppConstants.ArchiveIdPrefix))}

                        </Box>
                        <Box>
                            <p> {translations.Trash}</p>

                        </Box>


                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancel}>{translations.Cancel}</Button>
                    {/*<Button onClick={handleCloseUploaded}>{translations.Approve}</Button>*/}
                </DialogActions>
            </Dialog>
        </div>
    )
        ;
}
