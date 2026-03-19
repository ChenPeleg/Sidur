import * as React from "react";
import { ReactNode } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { translations } from "../../services/translations";
import { Tooltip } from "@mui/material";
import { AppConstants, SidurRecord, SidurStore } from "../../store/store.types";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import {
    Archive,
    Delete,
    DeleteForever,
    Edit,
    Unarchive,
} from "@mui/icons-material";
import { SidurManagementActionType } from "../../models/SidurMenuClickActionType.enum";
import { IconStyles } from "../../hoc/themes";
import { red } from "@mui/material/colors";
import { ActionsTypes } from "../../store/types.actions";

interface FileUploadProps {
    open: boolean;
    onClose: () => void;
}

export const SidurManagementDialog = (props: FileUploadProps) => {
    const { onClose, open } = props;
    const sidurArchive: SidurRecord[] = useSelector(
        (state: SidurStore) => state.sidurArchive
    );
    const sidurCollection: SidurRecord[] = useSelector(
        (state: SidurStore) => state.sidurCollection
    );
    const dispatch = useDispatch();

    const handleCloseCancel = () => {
        onClose();
    };
    const handleActionClick = (
        event: any,
        props: { action: SidurManagementActionType; sidurId: string }
    ) => {
        switch (props.action) {
            case SidurManagementActionType.DeleteForever:
                dispatch({
                    type: ActionsTypes.DELETE_FOREVER_SIDUR,
                    payload: { id: props.sidurId },
                });
                break;
            case SidurManagementActionType.MoveToArchive:
                dispatch({
                    type: ActionsTypes.ARCHIVE_SIDUR,
                    payload: { id: props.sidurId },
                });
                break;
            case SidurManagementActionType.MoveToTrash:
                dispatch({
                    type: ActionsTypes.DELETE_SIDUR,
                    payload: { id: props.sidurId },
                });
                break;
            case SidurManagementActionType.Rename:
                break;
            case SidurManagementActionType.MoveToActive:
                dispatch({
                    type: ActionsTypes.MOVE_TO_ACTIVE_SIDUR,
                    payload: { id: props.sidurId },
                });
                break;
        }
    };
    const ActionButton = (props: {
        action: SidurManagementActionType;
        sidurId: string;
    }) => {
        const buttonBuilder = (
            action: SidurManagementActionType
        ): { text: string; icon: ReactNode } | null => {
            switch (action) {
                case SidurManagementActionType.DeleteForever:
                    return {
                        text: translations.DeleteForever,
                        icon: (
                            <DeleteForever
                                sx={{
                                    ...IconStyles.smallIcons,
                                    color: red,
                                }}
                            />
                        ),
                    };
                case SidurManagementActionType.MoveToArchive:
                    return {
                        text: translations.Archive,
                        icon: <Archive sx={IconStyles.smallIcons} />,
                    };
                case SidurManagementActionType.MoveToTrash:
                    return {
                        text: translations.MoveToTrash,
                        icon: <Delete sx={IconStyles.smallIcons} />,
                    };
                case SidurManagementActionType.Rename:
                    return {
                        text: translations.Rename,
                        icon: <Edit sx={IconStyles.smallIcons} />,
                    };
                case SidurManagementActionType.MoveToActive:
                    return {
                        text: translations.MoveToActive,
                        icon: <Unarchive sx={IconStyles.smallIcons} />,
                    };
                default:
                    return null;
            }
        };
        const buttonProps = buttonBuilder(props.action);
        return (
            <Tooltip title={buttonProps?.text || ""} placement="top">
                <IconButton
                    size="small"
                    aria-label="show more"
                    onClick={(event) => handleActionClick(event, props)}
                    color="inherit"
                >
                    {buttonProps?.icon}
                </IconButton>
            </Tooltip>
        );
    };
    const DividingLine = () => (
        <div className="border-b border-gray-400 mx-[5px] my-[20px] w-full h-[5px]" />
    );

    return (
        <div>
            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {translations.ManageAllSidrurim}</DialogTitle>
                <DialogContent>
                    <div className="min-w-[40vw] flex m-[20px] items-start flex-col justify-between">
                        <div className="min-w-[5vw] flex items-start flex-col">
                            <div className="font-bold mb-[15px]">
                                {translations.ActiveSidurim}
                            </div>
                            {sidurCollection.map(
                                (sidur: SidurRecord, index: number) => (
                                    <div className="min-w-[20vw] flex items-start flex-row flex-wrap" key={index}>
                                        {" "}
                                        {sidur.Name}
                                        <ActionButton
                                            sidurId={sidur.id}
                                            action={
                                                SidurManagementActionType.MoveToArchive
                                            }
                                        />
                                        <ActionButton
                                            sidurId={sidur.id}
                                            action={
                                                SidurManagementActionType.MoveToTrash
                                            }
                                        />
                                        <ActionButton
                                            sidurId={sidur.id}
                                            action={
                                                SidurManagementActionType.Rename
                                            }
                                        />
                                    </div>
                                )
                            )}
                        </div>
                        <DividingLine />
                        <div className="min-w-[5vw] flex items-start flex-col">
                            <div className="font-bold mb-[15px]">{translations.inArchive}</div>

                            {sidurArchive
                                .filter((s: SidurRecord) =>
                                    s.id.includes(AppConstants.ArchiveIdPrefix)
                                )
                                .map((sidur: SidurRecord, index: number) => (
                                    <div className="min-w-[20vw] flex items-start flex-row flex-wrap" key={index}>
                                        {" "}
                                        {sidur.Name}
                                        <ActionButton
                                            sidurId={sidur.id}
                                            action={
                                                SidurManagementActionType.MoveToActive
                                            }
                                        />
                                        <ActionButton
                                            sidurId={sidur.id}
                                            action={
                                                SidurManagementActionType.MoveToTrash
                                            }
                                        />
                                        <ActionButton
                                            sidurId={sidur.id}
                                            action={
                                                SidurManagementActionType.Rename
                                            }
                                        />
                                    </div>
                                ))}
                        </div>
                        <DividingLine />
                        <div className="min-w-[5vw] flex items-start flex-col">
                            <div className="font-bold mb-[15px]">{translations.Trash}</div>
                            {sidurArchive
                                .filter((s: SidurRecord) =>
                                    s.id.includes(AppConstants.deleteIdPrefix)
                                )
                                .map((sidur: SidurRecord, index: number) => (
                                    <div className="min-w-[20vw] flex items-start flex-row flex-wrap" key={index}>
                                        {" "}
                                        {sidur.Name}
                                        <ActionButton
                                            sidurId={sidur.id}
                                            action={
                                                SidurManagementActionType.MoveToActive
                                            }
                                        />
                                        <ActionButton
                                            sidurId={sidur.id}
                                            action={
                                                SidurManagementActionType.DeleteForever
                                            }
                                        />{" "}
                                    </div>
                                ))}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancel}>
                        {translations.Finish}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
