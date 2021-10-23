import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {translations} from '../../services/translations';
import {ImportExport, Person} from '@mui/icons-material';
import {ProfileMenuClickActionType} from '../../models/profile-menu-click-action-type.enum';

interface profileMenuProps {
    anchorEl: Element | ((element: Element) => Element) | null | undefined;
    menuId: string,
    isMenuOpen: boolean,
    handleMenuClose: (result: any, action?: ProfileMenuClickActionType) => void
}

export const ProfileMenu = (props: profileMenuProps) => {
    const {
        anchorEl,
        menuId,
        isMenuOpen,
        handleMenuClose
    } = props;
    return (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={(e: any) => handleMenuClose(e)}
        >
            <MenuItem onClick={(event) => handleMenuClose(event, ProfileMenuClickActionType.MyProfile)}>
                <Person/> &nbsp;{translations.MyProfile}</MenuItem>
            <MenuItem onClick={(event) => handleMenuClose(event, ProfileMenuClickActionType.Export)}>
                <ImportExport/> &nbsp;{translations.ExportToFile}</MenuItem>
            <MenuItem onClick={(event) => handleMenuClose(event, ProfileMenuClickActionType.Import)}>
                <ImportExport/>&nbsp; {translations.ImportFromFile}</MenuItem>
        </Menu>
    );

}
