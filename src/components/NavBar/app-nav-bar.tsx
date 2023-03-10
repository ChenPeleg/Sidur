import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import {translations} from '../../services/translations';
import {useDispatch, useSelector} from 'react-redux';
import {Select, SelectChangeEvent} from '@mui/material';
import {Edit} from '@mui/icons-material';
import {ProfileMenu} from './profile-menu';
import {ActionsTypes} from '../../store/types.actions';
import {SidurMenu} from './sidur-menu';
import {SidurActionType} from '../../models/SidurMenuClickActionType.enum';
import {ProfileMenuClickActionType} from '../../models/profile-menu-click-action-type.enum';
import {FileUploadType, SidurRecord, SidurStore} from '../../store/store.types';
import {FileUploadDialog} from '../Dialogs/file-uplaod-dialog';
import {SidurManagementDialog} from '../Dialogs/sidur-management-dialog';
import {OrderImportDialog} from '../Dialogs/orders-import-dialog';
import {ToggleButtons} from '../buttons/toggle-button-group';
import {RenameDialog} from '../Dialogs/rename-dialog';
import {StoreUtils} from '../../store/store-utils';


export const AppNavBar = () => {
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [RenameOpen, setRenameOpen] = React.useState(false);
    const [UploadOpen, setUploadOpen] = React.useState(false);
    const [ManageSidurimOpen, setManageSidurimOpen] = React.useState(false);

    // const [importOrdersOpen, closeOpenImportOrders] = React.useState(false);
    const importOrdersOpen = useSelector((state: SidurStore) => state.sessionState.openDialog === 'importOrders');

    const [sidurMoreAnchorEl, setSidurMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const sidurId = useSelector((state: SidurStore) => state.sidurId);
    const sidurCollection = useSelector((state: SidurStore) => state.sidurCollection);
    const sidurSelected = sidurCollection.find((sidurRecord: SidurRecord) => sidurRecord.id === sidurId);

    const sidurName = sidurSelected?.Name || '';

    const closeOpenImportOrders = (action : 'close' | 'open') => {
        dispatch({
            type: ActionsTypes.OPEN_CLOSE_IMPORT_DIALOG,
            payload : action === 'open' ? 'importOrders' :  null
        })
    }

    const isProfileMenuOpen = Boolean(anchorEl);
    const isSidurMenuOpen = Boolean(sidurMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleRenameClose = (value: string | null) => {
        setRenameOpen(false);
        const id = sidurId;
        if (value) {
            dispatch({
                type: ActionsTypes.RENAME_SIDUR,
                payload: {
                    value,
                    id
                }
            })
        }
    };
    const handleUploadClose = (result: { uploadType: FileUploadType, fileAsString: string } | null): void => {
        setUploadOpen(false);
        if (result) {
            dispatch({
                type: ActionsTypes.IMPORT_FILE_UPLOADED,
                payload: {...result}
            })
        }
    };
    const handleSidurMenuClick = (event: React.MouseEvent<HTMLElement>, clickAction: SidurActionType) => {

        switch (clickAction) {

            case SidurActionType.CreateCopy:
                dispatch({
                    type: ActionsTypes.CLONE_SIDUR,
                    payload: {id: sidurId}
                })
                break;
            case SidurActionType.Archive:
                dispatch({
                    type: ActionsTypes.ARCHIVE_SIDUR,
                    payload: {id: sidurId}
                })
                break;
            case SidurActionType.Delete:
                dispatch({
                    type: ActionsTypes.DELETE_SIDUR,
                    payload: {id: sidurId}
                })
                break;
            case SidurActionType.Rename:
                setRenameOpen(true);
                break;
            case SidurActionType.ManageSidurim:
                setManageSidurimOpen(true);
                break;
            case SidurActionType.ImportOrders:
                closeOpenImportOrders('open')
                break;

            default:
        }
        handleSidurMenuClose()
    };
    const handleSidurMenuClose = () => {
        setSidurMoreAnchorEl(null);
    };

    const handleProfileMenuClose = (result: any, action?: ProfileMenuClickActionType) => {
        setAnchorEl(null);
        switch (action) {
            case ProfileMenuClickActionType.MyProfile:
                dispatch({
                    type: ActionsTypes.OPEN_MY_PROFILE,
                    payload: null
                })
                break;
            case ProfileMenuClickActionType.Export:
                StoreUtils.shieldAnimationBeforeDispatch(() => {
                    dispatch({
                        type: ActionsTypes.EXPORT_ALL,
                        payload: null
                    })
                }, dispatch)
                break;
            case ProfileMenuClickActionType.Import:
                setUploadOpen(true)
                break;
            case null:
            case undefined:
                break;
            default:
        }
        handleSidurMenuClose();
    };

    const handleSidurMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSidurMoreAnchorEl(event.currentTarget);
    };
    const handleSidurChanged = (event: any, _child: React.ReactNode) => {

        const chosenSidur = event.target.value as string;
        if (chosenSidur === 'NEW') {
            dispatch({
                type: ActionsTypes.ADD_NEW_SIDUR,
                payload: null
            });
        } else {
            dispatch({
                type: ActionsTypes.CHOOSE_SIDUR,
                payload: {id: chosenSidur}
            })
        }


    }
    const menuId = 'primary-search-account-menu';
    const sidurMenuId = 'primary-search-account-menu-mobile';
    return (
        <Box dir="rtl"
        >
            <AppBar position="static" sx={{
                mr: 0,
                ml: 0,
                'div.MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular': {
                    margin: 0
                }
            }}>
                <Toolbar sx={{
                    mr: 0,
                    ml: 0
                }}>
                    <IconButton
                        size="large"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{mr: 0}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            display: {
                                xs: 'none',
                                sm: 'block'
                            }
                        }}
                    >    &nbsp; &nbsp;
                        {translations.Sidur}
                        <Select dir={'rtl'} disableUnderline={true} variant={'standard'} value={sidurId}
                                sx={{
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    fontWeight: 'normal'
                                }}
                                onChange={(event: SelectChangeEvent<any>, child: React.ReactNode) => {
                                    handleSidurChanged(event, child)
                                }}>
                            <MenuItem key={10000}
                                      value={'NEW'}> &nbsp;&nbsp;<b>{translations.NewSidur}</b> &nbsp;&nbsp;</MenuItem>

                            {sidurCollection.map((sidurRecord: SidurRecord, i: number) => <MenuItem key={i}
                                                                                                    value={sidurRecord.id}> &nbsp;&nbsp;{sidurRecord.Name} &nbsp;&nbsp;</MenuItem>)}
                        </Select>
                    </Typography>
                    <IconButton
                        size="small"
                        aria-label="show more"
                        aria-controls={sidurMenuId}
                        aria-haspopup="true"
                        onClick={handleSidurMenuOpen}
                        color="inherit"
                    >
                        <Edit/>
                    </IconButton>
                    <Box sx={{
                        width: '20px',
                        height: '5px'
                    }}/>
                    <ToggleButtons/>

                    <Box sx={{flexGrow: 1}}/>
                    <Box sx={{
                        display: {
                            xs: 'none',
                            md: 'flex'
                        }
                    }}>

                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                    </Box>
                    <Box sx={{
                        display: {
                            xs: 'flex',
                            md: 'none'
                        }
                    }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={sidurMenuId}
                            aria-haspopup="true"
                            onClick={handleSidurMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <SidurMenu sidurMoreAnchorEl={sidurMoreAnchorEl} sidurMenuId={sidurMenuId} isSidurMenuOpen={isSidurMenuOpen}
                       handleSidurMenuClick={handleSidurMenuClick} handleSidurMenuClose={handleSidurMenuClose}/>
            <ProfileMenu menuId={menuId} anchorEl={anchorEl} handleMenuClose={handleProfileMenuClose} isMenuOpen={isProfileMenuOpen}/>
            <RenameDialog open={RenameOpen} onClose={handleRenameClose} selectedValue={sidurName}/>
            <FileUploadDialog open={UploadOpen} onClose={handleUploadClose} selectedValue={''}/>
            <SidurManagementDialog open={ManageSidurimOpen} onClose={() => {
                setManageSidurimOpen(false)
            }}/>
            <OrderImportDialog open={importOrdersOpen} onClose={() => {
                closeOpenImportOrders('close')
            }}/>

        </Box>
    );
}
