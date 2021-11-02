import * as React from 'react';
import {ReactNode} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {translations} from '../../services/translations';
import {Box, Tooltip} from '@mui/material';
import {AppConstants, SidurRecord, SidurStore} from '../../store/store.types';
import {useDispatch, useSelector} from 'react-redux';
import IconButton from '@mui/material/IconButton';
import {Archive, Delete, DeleteForever, Edit, Unarchive} from '@mui/icons-material';
import {SidurManagementActionType} from '../../models/SidurMenuClickActionType.enum';
import {SxProps} from '@mui/system';
import {customStyles} from '../../hoc/themes';
import {red} from '@mui/material/colors';
import {ActionsTypes} from '../../store/types.actions';


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
    const dispatch = useDispatch()

    const handleCloseCancel = () => {
        onClose();
    };
    const handleActionClick = (event: any, props: { action: SidurManagementActionType, sidurId: string }) => {
        switch (props.action) {
            case SidurManagementActionType.DeleteForever:
                dispatch({
                    type: ActionsTypes.DELETE_FOREVER_SIDUR,
                    payload: {id: props.sidurId}
                })
                break;
            case SidurManagementActionType.MoveToArchive:
                dispatch({
                    type: ActionsTypes.ARCHIVE_SIDUR,
                    payload: {id: props.sidurId}
                })
                break;
            case SidurManagementActionType.MoveToTrash:
                dispatch({
                    type: ActionsTypes.DELETE_SIDUR,
                    payload: {id: props.sidurId}
                })
                break;
            case SidurManagementActionType.Rename:
                // dispatch({
                //     type: ActionTypes.ARCHIVE_SIDUR,
                //     payload: {id: props.sidurId}
                // })
                break;
            case SidurManagementActionType.MoveToActive:
                dispatch({
                    type: ActionsTypes.MOVE_TO_ACTIVE_SIDUR,
                    payload: {id: props.sidurId}
                })
                break;
        }
    }
    const ActionButton = (props: { action: SidurManagementActionType, sidurId: string }) => {

        const buttonBuilder = (action: SidurManagementActionType): { text: string, icon: ReactNode } | null => {
            switch (action) {
                case SidurManagementActionType.DeleteForever:
                    return {
                        text: translations.DeleteForever,
                        icon: (<DeleteForever sx={{
                            ...customStyles.smallIcons,
                            color: red
                        }}/>)
                    }
                case SidurManagementActionType.MoveToArchive:
                    return {
                        text: translations.Archive,
                        icon: (<Archive sx={customStyles.smallIcons}/>)
                    }
                case SidurManagementActionType.MoveToTrash:
                    return {
                        text: translations.MoveToTrash,
                        icon: (<Delete sx={customStyles.smallIcons}/>)
                    }
                case SidurManagementActionType.Rename:
                    return {
                        text: translations.Rename,
                        icon: (<Edit sx={customStyles.smallIcons}/>)
                    }
                case SidurManagementActionType.MoveToActive:
                    return {
                        text: translations.MoveToActive,
                        icon: (<Unarchive sx={customStyles.smallIcons}/>)
                    }
                default:
                    return null

            }

        }
        const buttonProps = buttonBuilder(props.action)
        return (
            <Tooltip title={buttonProps?.text || ''} placement="top">
                <IconButton
                    size="small"
                    aria-label="show more"
                    onClick={(event) =>
                        handleActionClick(event, props)}
                    color="inherit"
                >
                    {buttonProps?.icon}
                </IconButton>
            </Tooltip>
        )
    }
    const DividingLine = () =>
        (

            <Box sx={{
                borderBottom: 'solid grey 1px',
                margin: '20px 5px',
                width: '100%',
                height: '5px',
            }}/>
        )

    const listBoxSx: SxProps = {
        minWidth: '5vw',
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
    }
    const headerSx: SxProps = {
        fontWeight: 'bold',
        mb: '15px'
    }
    const oneSidurSx: SxProps = {
        minWidth: '20vw',
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
    //Box sx={headerSx}
    return (
        <div>
            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {translations.ManageAllSidrurim}</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        minWidth: '40vw',
                        display: 'flex',
                        m: '20px',
                        alignItems: 'start',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={listBoxSx}>
                            <Box sx={headerSx}>{translations.ActiveSidurim}</Box>
                            {sidurCollection.map((sidur: SidurRecord, index: number) => (
                                <Box sx={oneSidurSx} key={index}> {sidur.Name}
                                    <ActionButton sidurId={sidur.id} action={SidurManagementActionType.MoveToArchive}/>
                                    <ActionButton sidurId={sidur.id} action={SidurManagementActionType.MoveToTrash}/>
                                    <ActionButton sidurId={sidur.id} action={SidurManagementActionType.Rename}/>
                                </Box>))}
                        </Box>
                        <DividingLine/>
                        <Box sx={listBoxSx}>
                            <Box sx={headerSx}>{translations.inArchive}</Box>

                            {sidurArchive.filter((s: SidurRecord) => s.id.includes(AppConstants.ArchiveIdPrefix)).map((sidur: SidurRecord, index: number) => (
                                <Box sx={oneSidurSx} key={index}>  {sidur.Name}
                                    <ActionButton sidurId={sidur.id} action={SidurManagementActionType.MoveToActive}/>
                                    <ActionButton sidurId={sidur.id} action={SidurManagementActionType.MoveToTrash}/>
                                    <ActionButton sidurId={sidur.id} action={SidurManagementActionType.Rename}/>
                                </Box>))}

                        </Box>
                        <DividingLine/>
                        <Box sx={listBoxSx}>
                            <Box sx={headerSx}>{translations.Trash}</Box>
                            {sidurArchive.filter((s: SidurRecord) => s.id.includes(AppConstants.deleteIdPrefix)).map((sidur: SidurRecord, index: number) => (
                                <Box sx={oneSidurSx} key={index}> {sidur.Name}<ActionButton sidurId={sidur.id}
                                                                                            action={SidurManagementActionType.MoveToActive}/>
                                    <ActionButton sidurId={sidur.id}
                                                  action={SidurManagementActionType.DeleteForever}/> </Box>))}
                        </Box>


                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancel}>{translations.Finish}</Button>
                    {/*<Button onClick={handleCloseUploaded}>{translations.Approve}</Button>*/}
                </DialogActions>
            </Dialog>
        </div>
    )
        ;
}
