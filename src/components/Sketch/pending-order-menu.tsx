import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {LanguageUtilities} from '../../services/language-utilities';
import {SketchEditActionEnum} from '../../models/SketchEditAction.enum';
import {Icons} from '../Icons/icons';


interface PendingOrderMenuProps {
    PendingOrderMenuAnchor: Element | ((element: Element) => Element) | null | undefined;
    PendingOrderMenuId: string,
    isPendingOrderMenuOpen: boolean,
    handlePendingOrderMenuClick: (event: React.MouseEvent<HTMLElement>, action: SketchEditActionEnum) => void
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

    let pendingOrdersActions: { action: SketchEditActionEnum, name: string, icon: string } [] = LanguageUtilities.buildSketchEditActionsArray();
    pendingOrdersActions.pop();
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
            {pendingOrdersActions.map((item, i: number) => <MenuItem key={i} onClick={(e) => handlePendingOrderMenuClick(e, item.action)}>
                {Icons[item.icon] as React.ReactElement} &nbsp;
                {item.name}
            </MenuItem>)}


        </Menu>
    );


}
