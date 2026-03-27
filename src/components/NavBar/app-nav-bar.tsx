import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionsTypes } from "../../store/types.actions";
import { SidurActionType } from "../../models/SidurMenuClickActionType.enum";
import { ProfileMenuClickActionType } from "../../models/profile-menu-click-action-type.enum";
import {
    FileUploadType,
    SidurRecord,
    SidurStore,
} from "../../store/store.types";
import { StoreUtils } from "../../store/store-utils";
import { AppNavBarAppBar } from "./app-nav-bar-app-bar";
import { ProfileMenu } from "./profile-menu";
import { SidurMenu } from "./sidur-menu";
import { RenameDialog } from "../Dialogs/rename-dialog";
import { FileUploadDialog } from "../Dialogs/file-uplaod-dialog";
import { SidurManagementDialog } from "../Dialogs/sidur-management-dialog";
import { ImportSheetsDialog } from "../Dialogs/import-sheets-dialog";
import { useNavBarMenuState } from "./app-nav-bar-use-menus.tsx";

export const AppNavBar = () => {
    const dispatch = useDispatch();

    const {
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
    } = useNavBarMenuState();

    const importOrdersOpen = useSelector(
        (state: SidurStore) => state.sessionState.openDialog === "importOrders"
    );

    const sidurId = useSelector((state: SidurStore) => state.sidurId);
    const sidurCollection = useSelector(
        (state: SidurStore) => state.sidurCollection
    );
    const sidurSelected = sidurCollection.find(
        (sidurRecord: SidurRecord) => sidurRecord.id === sidurId
    );
    const sidurName = sidurSelected?.Name || "";

    const openImportSheetModal = () => {
        dispatch({
            type: ActionsTypes.OPEN_IMPORT_SHEETS_MODAL,
        });
    };

    const handleRenameClose = (value: string | null) => {
        setRenameOpen(false);
        const id = sidurId;
        if (value) {
            dispatch({
                type: ActionsTypes.RENAME_SIDUR,
                payload: {
                    value,
                    id,
                },
            });
        }
    };

    const handleUploadClose = (
        result: { uploadType: FileUploadType; fileAsString: string } | null
    ): void => {
        setUploadOpen(false);
        if (result) {
            dispatch({
                type: ActionsTypes.IMPORT_FILE_UPLOADED,
                payload: { ...result },
            });
        }
    };

    const handleSidurMenuClick = (
        event: React.MouseEvent<HTMLElement>,
        clickAction: SidurActionType
    ) => {
        switch (clickAction) {
            case SidurActionType.CreateCopy:
                dispatch({
                    type: ActionsTypes.CLONE_SIDUR,
                    payload: { id: sidurId },
                });
                break;
            case SidurActionType.Archive:
                dispatch({
                    type: ActionsTypes.ARCHIVE_SIDUR,
                    payload: { id: sidurId },
                });
                break;
            case SidurActionType.Delete:
                dispatch({
                    type: ActionsTypes.DELETE_SIDUR,
                    payload: { id: sidurId },
                });
                break;
            case SidurActionType.Rename:
                setRenameOpen(true);
                break;
            case SidurActionType.ManageSidurim:
                setManageSidurimOpen(true);
                break;
            case SidurActionType.ImportOrders:
                openImportSheetModal();
                break;

            default:
        }
        handleSidurMenuClose();
    };

    const handleProfileMenuCloseWithAction = (
        result: any,
        action?: ProfileMenuClickActionType
    ) => {
        handleProfileMenuClose();
        switch (action) {
            case ProfileMenuClickActionType.MyProfile:
                dispatch({
                    type: ActionsTypes.OPEN_MY_PROFILE,
                    payload: null,
                });
                break;
            case ProfileMenuClickActionType.Export:
                StoreUtils.shieldAnimationBeforeDispatch(() => {
                    dispatch({
                        type: ActionsTypes.EXPORT_ALL,
                        payload: null,
                    });
                }, dispatch);
                break;
            case ProfileMenuClickActionType.Import:
                setUploadOpen(true);
                break;
            case null:
            case undefined:
                break;
            default:
        }
        handleSidurMenuClose();
    };

    const menuId = "primary-search-account-menu";
    const sidurMenuId = "primary-search-account-menu-mobile";

    return (
        <div dir="rtl">
            <AppNavBarAppBar
                menuId={menuId}
                sidurMenuId={sidurMenuId}
                onProfileMenuOpen={handleProfileMenuOpen}
                onSidurMenuOpen={handleSidurMenuOpen}
            />

            <SidurMenu
                sidurMoreAnchorEl={sidurMoreAnchorEl}
                sidurMenuId={sidurMenuId}
                isSidurMenuOpen={isSidurMenuOpen}
                handleSidurMenuClick={handleSidurMenuClick}
                handleSidurMenuClose={handleSidurMenuClose}
            />
            <ProfileMenu
                menuId={menuId}
                anchorEl={anchorEl}
                handleMenuClose={handleProfileMenuCloseWithAction}
                isMenuOpen={isProfileMenuOpen}
            />
            <RenameDialog
                open={RenameOpen}
                onClose={handleRenameClose}
                selectedValue={sidurName}
            />
            <FileUploadDialog
                open={UploadOpen}
                onClose={handleUploadClose}
                selectedValue={""}
            />
            <SidurManagementDialog
                open={ManageSidurimOpen}
                onClose={() => {
                    setManageSidurimOpen(false);
                }}
            />
            <ImportSheetsDialog
                open={importOrdersOpen}
                selectedValue={sidurName}
            />
        </div>
    );
};
