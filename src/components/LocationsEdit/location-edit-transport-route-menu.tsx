import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {Delete, DriveFileRenameOutline, FileCopy} from '@mui/icons-material';
import {translations} from '../../services/translations';
import {RouteOrTransEditAction} from '../LocationsEditRoutes/location-route-edit';


interface LocationEditMenuProps {
    routeMoreAnchorEl: HTMLElement | null | undefined;
    routeMenuId: string,
    isRouteMenuOpen: boolean,
    handleRouteMenuClick: (event: React.MouseEvent<HTMLElement>, clickAction: any) => void
    handleRouteMenuClose: () => void
}

export const RouteTransportEditMenu = (props: LocationEditMenuProps) => {
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

            <MenuItem onClick={(e) => handleRouteMenuClick(e, RouteOrTransEditAction.RenameRoute)}>

                <DriveFileRenameOutline/>&nbsp;
                {translations.Rename}
            </MenuItem>
            <MenuItem onClick={(e) => handleRouteMenuClick(e, RouteOrTransEditAction.DeleteRoute)}>

                <Delete/>&nbsp;
                {translations.Delete}
            </MenuItem>
            <MenuItem onClick={(e) => handleRouteMenuClick(e, RouteOrTransEditAction.CloneRoute)}>

                <FileCopy/>&nbsp;
                {translations.CreateCopy}
            </MenuItem>


        </Menu>
    );


}
