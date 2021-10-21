import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';

interface profileMenuProps {
    anchorEl: Element | ((element: Element) => Element) | null | undefined;
    menuId: string,
    isMenuOpen: boolean,
    handleMenuClose: (result: any) => void


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
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

}
