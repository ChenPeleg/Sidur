import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {Archive, Delete, DriveFileRenameOutline, FileCopy, ImportContacts, ListAlt} from '@mui/icons-material';
import {translations} from '../../services/translations';
import {SidurActionType} from '../../models/SidurMenuClickActionType.enum';


interface sidurMenuProps {
    sidurMoreAnchorEl: Element | ((element: Element) => Element) | null | undefined;
    sidurMenuId: string,
    isSidurMenuOpen: boolean,
    handleSidurMenuClick: (event: React.MouseEvent<HTMLElement>, clickAction: SidurActionType) => void
    handleSidurMenuClose: () => void
}

export const SidurMenu = (props: sidurMenuProps) => {
    const {
        sidurMoreAnchorEl,
        sidurMenuId,
        isSidurMenuOpen,
        handleSidurMenuClick,
        handleSidurMenuClose
    } = props;
    return (
        <Menu
            anchorEl={sidurMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={sidurMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isSidurMenuOpen}
            onClose={handleSidurMenuClose}
        >

            <MenuItem onClick={(e) => handleSidurMenuClick(e, SidurActionType.Rename)}>

                <DriveFileRenameOutline/>&nbsp;
                {translations.Rename}
            </MenuItem>
            <MenuItem onClick={(e) => handleSidurMenuClick(e, SidurActionType.Delete)}>

                <Delete/>&nbsp;
                {translations.Delete}
            </MenuItem>
            <MenuItem onClick={(e) => handleSidurMenuClick(e, SidurActionType.CreateCopy)}>

                <FileCopy/>&nbsp;
                {translations.CreateCopy}
            </MenuItem>
            <MenuItem onClick={(e) => handleSidurMenuClick(e, SidurActionType.Archive)}>
                <Archive/> &nbsp;
                {translations.Archive}
            </MenuItem>
            <MenuItem onClick={(e) => handleSidurMenuClick(e, SidurActionType.ImportOrders)}>

                <ImportContacts/>&nbsp;
                {translations.ImportOrders}
            </MenuItem>
            <MenuItem onClick={(e) => handleSidurMenuClick(e, SidurActionType.ManageSidurim)}>

                <ListAlt/>&nbsp;
                {translations.ManageAllSidrurim}
            </MenuItem>
        </Menu>
    );


}
