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
import {SidurRecord, SidurStore} from '../../store/reducer';
import {Edit} from '@mui/icons-material';
import {SidurRenameDialog} from './sidur-rename-dialog';
import {ProfileMenu} from './profile-menu';
import {ActionTypes} from '../../store/actionTypes';
import {SidurMenu} from './sidur-menu';
import {SidurMenuClickActionType} from '../../models/SidurMenuClickActionType.enum';


export const AppNavBar = () => {
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [RenameOpen, setRenameOpen] = React.useState(false);
    const [sidurMoreAnchorEl, setSidurMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const sidurInitialId = useSelector((state: SidurStore) => state.sidurId);
    const sidurCollection = useSelector((state: SidurStore) => state.sidurCollection);
    const sidurSelected = sidurCollection.find((sidurRecord: SidurRecord) => sidurRecord.id === sidurInitialId)
    const sidurName = sidurSelected?.Name || '';


    const isProfileMenuOpen = Boolean(anchorEl);
    const isSidurMenuOpen = Boolean(sidurMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleRenameClose = (value: string) => {
        setRenameOpen(false);
        //  setSelectedValue(value);
    };
    const handleSidurMenuClick = (event: React.MouseEvent<HTMLElement>, clickAction: SidurMenuClickActionType) => {
        switch (clickAction) {
            case SidurMenuClickActionType.CreateCopy:
                break;
            case SidurMenuClickActionType.Delete:
                break;
            case SidurMenuClickActionType.Rename:
                setRenameOpen(true);
                break;
            case SidurMenuClickActionType.Export:
                break;
            default:
        }
        handleSidurMenuClose()
    };

    const handleSidurMenuClose = () => {
        setSidurMoreAnchorEl(null);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
        handleSidurMenuClose();
    };

    const handleSidurMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSidurMoreAnchorEl(event.currentTarget);
    };
    const handleSidurChanged = (event: SelectChangeEvent<any>, child: React.ReactNode) => {
        const chosenSidur = event.target.value as string;
        dispatch({
            type: ActionTypes.CHOOSE_SIDUR,
            payLoad: {id: chosenSidur}
        })

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
                        // edge="start"
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
                        <Select dir={'rtl'} disableUnderline={true} variant={'standard'} defaultValue={sidurInitialId}
                                sx={{
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    fontWeight: 'normal'
                                }}


                                onChange={(event: SelectChangeEvent<any>, child: React.ReactNode) => {
                                    handleSidurChanged(event, child)


                                }}

                        >
                            {sidurCollection.map((sidurRecord: SidurRecord) => <MenuItem key={sidurRecord.id}
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
            <SidurRenameDialog open={RenameOpen} onClose={handleRenameClose} selectedValue={sidurName}/>

        </Box>
    );
}
