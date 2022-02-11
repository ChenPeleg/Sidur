import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {LanguageUtilities} from '../../services/language-utilities';
import {SketchOrderEditActionEnum} from '../../models/SketchOrderEditActionEnum';
import {Icons} from '../Icons/icons';


interface PendingOrderMenuProps {
    PendingOrderMenuAnchor: Element | ((element: Element) => Element) | null | undefined;
    PendingOrderMenuId: string,
    isPendingOrderMenuOpen: boolean,
    handlePendingOrderMenuClick: (event: React.MouseEvent<HTMLElement>, action: SketchOrderEditActionEnum) => void
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

    let pendingOrdersActions: { action: SketchOrderEditActionEnum, name: string, icon: string } [] = LanguageUtilities.buildSketchEditActionsArray();
  
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
