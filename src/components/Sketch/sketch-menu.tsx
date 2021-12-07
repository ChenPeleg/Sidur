import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {Archive, Delete, DriveFileRenameOutline, FileCopy} from '@mui/icons-material';
import {translations} from '../../services/translations';
import {SketchActionType} from '../../models/SketchMenuClickActionType.enum';


interface SketchMenuProps {
    sketchMoreAnchorEl: Element | ((element: Element) => Element) | null | undefined;
    sketchMenuId: string,
    isSketchMenuOpen: boolean,
    handleSketchMenuClick: (event: React.MouseEvent<HTMLElement>, clickAction: SketchActionType) => void
    handleSketchMenuClose: () => void
}

export const SketchMenu = (props: SketchMenuProps) => {
    const {
        sketchMoreAnchorEl,
        sketchMenuId,
        isSketchMenuOpen,
        handleSketchMenuClick,
        handleSketchMenuClose
    } = props;
    return (
        <Menu
            anchorEl={sketchMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={sketchMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isSketchMenuOpen}
            onClose={handleSketchMenuClose}
        >

            <MenuItem onClick={(e) => handleSketchMenuClick(e, SketchActionType.Rename)}>

                <DriveFileRenameOutline/>&nbsp;
                {translations.Rename}
            </MenuItem>
            <MenuItem onClick={(e) => handleSketchMenuClick(e, SketchActionType.Delete)}>

                <Delete/>&nbsp;
                {translations.Delete}
            </MenuItem>
            <MenuItem onClick={(e) => handleSketchMenuClick(e, SketchActionType.CreateCopy)}>

                <FileCopy/>&nbsp;
                {translations.CreateCopy}
            </MenuItem>
            <MenuItem onClick={(e) => handleSketchMenuClick(e, SketchActionType.Archive)}>
                <Archive/> &nbsp;
                {translations.Archive}
            </MenuItem>
     
        </Menu>
    );


}
