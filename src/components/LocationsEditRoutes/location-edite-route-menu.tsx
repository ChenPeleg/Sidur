import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {Delete, DriveFileRenameOutline, FileCopy} from '@mui/icons-material';
import {translations} from '../../services/translations';
import {RouteEditAction} from './location-route-edit';


interface LocationEditMenuProps {
    routeMoreAnchorEl: Element | ((element: Element) => Element) | null | undefined;
    routeMenuId: string,
    isRouteMenuOpen: boolean,
    handleRouteMenuClick: (event: React.MouseEvent<HTMLElement>, clickAction: any) => void
    handleRouteMenuClose: () => void
}

export const RouteEditMenu = (props: LocationEditMenuProps) => {
    const {
        routeMoreAnchorEl,
        routeMenuId,
        isRouteMenuOpen,
        handleRouteMenuClick,
        handleRouteMenuClose
    } = props;
    return (
        <Menu
            anchorEl={routeMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={routeMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isRouteMenuOpen}
            onClose={handleRouteMenuClose}
        >

            <MenuItem onClick={(e) => handleRouteMenuClick(e, RouteEditAction.RenameRoute)}>

                <DriveFileRenameOutline/>&nbsp;
                {translations.Rename}
            </MenuItem>
            <MenuItem onClick={(e) => handleRouteMenuClick(e, RouteEditAction.DeleteRoute)}>

                <Delete/>&nbsp;
                {translations.Delete}
            </MenuItem>
            <MenuItem onClick={(e) => handleRouteMenuClick(e, RouteEditAction.CloneRoute)}>

                <FileCopy/>&nbsp;
                {translations.CreateCopy}
            </MenuItem>


        </Menu>
    );


}
