import * as React from "react";

export const useNavBarMenuState = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [sidurMoreAnchorEl, setSidurMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const [RenameOpen, setRenameOpen] = React.useState(false);
    const [UploadOpen, setUploadOpen] = React.useState(false);
    const [ManageSidurimOpen, setManageSidurimOpen] = React.useState(false);

    const isProfileMenuOpen = Boolean(anchorEl);
    const isSidurMenuOpen = Boolean(sidurMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSidurMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSidurMoreAnchorEl(event.currentTarget);
    };

    const handleSidurMenuClose = () => {
        setSidurMoreAnchorEl(null);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    return {
        anchorEl,
        sidurMoreAnchorEl,
        RenameOpen,
        UploadOpen,
        ManageSidurimOpen,
        isProfileMenuOpen,
        isSidurMenuOpen,
        setRenameOpen,
        setUploadOpen,
        setManageSidurimOpen,
        handleProfileMenuOpen,
        handleSidurMenuOpen,
        handleSidurMenuClose,
        handleProfileMenuClose,
    };
};
