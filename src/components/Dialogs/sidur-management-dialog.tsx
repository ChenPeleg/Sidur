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
import IconButton from '@mui/material/IconButton';
import {Edit} from '@mui/icons-material';
import {SidurManagementActionType} from '../../models/SidurMenuClickActionType.enum';


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

    const ActionButton = (props: { action: SidurManagementActionType }) => {
        return (<IconButton
            size="small"
            aria-label="show more"
            aria-haspopup="true"
            //   onClick={handleSidurMenuOpen}
            color="inherit"
        >
            <Edit/>
        </IconButton>)
    }


    return (
        <div>
            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {translations.ManageAllSidrurim}</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        minWidth: '40vw',
                        display: 'flex',
                        alignItems: 'start',
                        flexDirection: 'row',
                        justifyContent: 'start'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'start',
                            flexDirection: 'column',
                        }}>
                            <p> {translations.inArchive}</p>
                            {sidurArchive.filter((s: SidurRecord) => s.id.includes(AppConstants.ArchiveIdPrefix)).map((sidur: SidurRecord, index: number) => (
                                <Box key={index} sx={{fontSize: 'large'}}>  {sidur.Name}
                                    <ActionButton action={SidurManagementActionType.MoveToActive}/></Box>))}

                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'start',
                            flexDirection: 'column',
                        }}>
                            <p> {translations.Trash}</p>
                            {sidurArchive.filter((s: SidurRecord) => s.id.includes(AppConstants.deleteIdPrefix)).map((sidur: SidurRecord, index: number) => (
                                <Box key={index}> {sidur.Name} </Box>))}
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
