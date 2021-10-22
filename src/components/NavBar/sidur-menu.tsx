import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {Archive, Delete, DriveFileRenameOutline, FileCopy} from '@mui/icons-material';
import {translations} from '../../services/translations';
import {SidurMenuClickActionType} from '../../models/SidurMenuClickActionType.enum';


interface sidurMenuProps {
    sidurMoreAnchorEl: Element | ((element: Element) => Element) | null | undefined;
    sidurMenuId: string,
    isSidurMenuOpen: boolean,
    handleSidurMenuClick: (event: React.MouseEvent<HTMLElement>, clickAction: SidurMenuClickActionType) => void
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
            {/*<MenuItem onClick={(e) => handleSidurMenuClick(e, SidurMenuClickActionType.CreateNew)}>*/}

            {/*    <Add/>&nbsp;*/}
            {/*    {translations.NewSidur}*/}
            {/*</MenuItem>*/}
            <MenuItem onClick={(e) => handleSidurMenuClick(e, SidurMenuClickActionType.Rename)}>

                <DriveFileRenameOutline/>&nbsp;
                {translations.Rename}
            </MenuItem>
            <MenuItem onClick={(e) => handleSidurMenuClick(e, SidurMenuClickActionType.Delete)}>

                <Delete/>&nbsp;
                {translations.Delete}
            </MenuItem>
            <MenuItem onClick={(e) => handleSidurMenuClick(e, SidurMenuClickActionType.CreateCopy)}>

                <FileCopy/>&nbsp;
                {translations.CreateCopy}
            </MenuItem>
            <MenuItem onClick={(e) => handleSidurMenuClick(e, SidurMenuClickActionType.Export)}>
                <Archive/> &nbsp;

                {translations.Archive}
            </MenuItem>
        </Menu>
    );


}
