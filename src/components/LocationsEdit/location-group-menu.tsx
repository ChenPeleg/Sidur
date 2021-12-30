import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {Delete, DriveFileRenameOutline, FileCopy} from '@mui/icons-material';
import {translations} from '../../services/translations';
import {LocationGroupActionType} from '../../models/LocationGroupMenuClickActionType.enum';


interface LocationGroupMenuProps {
    locationGroupMoreAnchorEl: Element | ((element: Element) => Element) | null | undefined;
    locationGroupMenuId: string,
    isLocationGroupMenuOpen: boolean,
    handleLocationGroupMenuClick: (event: React.MouseEvent<HTMLElement>, clickAction: LocationGroupActionType) => void
    handleLocationGroupMenuClose: () => void
}

export const LocationGroupMenu = (props: LocationGroupMenuProps) => {
    const {
        locationGroupMoreAnchorEl,
        locationGroupMenuId,
        isLocationGroupMenuOpen,
        handleLocationGroupMenuClick,
        handleLocationGroupMenuClose
    } = props;
    return (
        <Menu
            anchorEl={locationGroupMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={locationGroupMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isLocationGroupMenuOpen}
            onClose={handleLocationGroupMenuClose}
        >

            <MenuItem onClick={(e) => handleLocationGroupMenuClick(e, LocationGroupActionType.Rename)}>

                <DriveFileRenameOutline/>&nbsp;
                {translations.Rename}
            </MenuItem>
            <MenuItem onClick={(e) => handleLocationGroupMenuClick(e, LocationGroupActionType.Delete)}>

                <Delete/>&nbsp;
                {translations.Delete}
            </MenuItem>
            <MenuItem onClick={(e) => handleLocationGroupMenuClick(e, LocationGroupActionType.CreateCopy)}>

                <FileCopy/>&nbsp;
                {translations.CreateCopy}
            </MenuItem>


        </Menu>
    );


}
