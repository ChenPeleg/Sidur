import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {Archive, Delete, DriveFileRenameOutline, FileCopy, ImportContacts, ListAlt} from '@mui/icons-material';
import {translations} from '../../services/translations';
import {SidurActionType} from '../../models/SidurMenuClickActionType.enum';


interface PendingOrderMenuProps {
    PendingOrderMenuAnchor: Element | ((element: Element) => Element) | null | undefined;
    PendingOrderMenuId: string,
    isPendingOrderMenuOpen: boolean,
    handlePendingOrderMenuClick: (event: React.MouseEvent<HTMLElement>, clickAction: SidurActionType) => void
    handlePendingOrderMenuClose: () => void
}

export const PendingOrderMenu = (props: PendingOrderMenuProps) => {
    const {
        PendingOrderMenuAnchor,
        PendingOrderMenuId,
        isPendingOrderMenuOpen,
        handlePendingOrderMenuClick,
        handlePendingOrderMenuClose
    } = props;
    return (
        <Menu
            anchorEl={PendingOrderMenuAnchor}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={PendingOrderMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isPendingOrderMenuOpen}
            onClose={handlePendingOrderMenuClose}
        >

            <MenuItem onClick={(e) => handlePendingOrderMenuClick(e, SidurActionType.Rename)}>

                <DriveFileRenameOutline/>&nbsp;
                {translations.Rename}
            </MenuItem>
            <MenuItem onClick={(e) => handlePendingOrderMenuClick(e, SidurActionType.Delete)}>

                <Delete/>&nbsp;
                {translations.Delete}
            </MenuItem>
            <MenuItem onClick={(e) => handlePendingOrderMenuClick(e, SidurActionType.CreateCopy)}>

                <FileCopy/>&nbsp;
                {translations.CreateCopy}
            </MenuItem>
            <MenuItem onClick={(e) => handlePendingOrderMenuClick(e, SidurActionType.Archive)}>
                <Archive/> &nbsp;
                {translations.Archive}
            </MenuItem>
            <MenuItem onClick={(e) => handlePendingOrderMenuClick(e, SidurActionType.ImportOrders)}>

                <ImportContacts/>&nbsp;
                {translations.ImportOrders}
            </MenuItem>
            <MenuItem onClick={(e) => handlePendingOrderMenuClick(e, SidurActionType.ManageSidurim)}>

                <ListAlt/>&nbsp;
                {translations.ManageAllSidrurim}
            </MenuItem>
        </Menu>
    );


}
