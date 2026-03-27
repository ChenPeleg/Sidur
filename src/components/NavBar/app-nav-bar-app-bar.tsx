import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { translations } from "../../services/translations";
import { useDispatch, useSelector } from "react-redux";
import { Select, SelectChangeEvent } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { ActionsTypes } from "../../store/types.actions";
import { SidurRecord, SidurStore } from "../../store/store.types";
import { ToggleNavigationButtons } from "../buttons/toggle-navigation-buttons.tsx";

interface AppNavBarAppBarProps {
    menuId: string;
    sidurMenuId: string;
    onProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    onSidurMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

export const AppNavBarAppBar: React.FC<AppNavBarAppBarProps> = ({
    menuId,
    sidurMenuId,
    onProfileMenuOpen,
    onSidurMenuOpen,
}) => {
    const dispatch = useDispatch();
    const sidurId = useSelector((state: SidurStore) => state.sidurId);
    const sidurCollection = useSelector(
        (state: SidurStore) => state.sidurCollection
    );

    const handleSidurChanged = (
        event: SelectChangeEvent<any>,
        _child: React.ReactNode
    ) => {
        const chosenSidur = event.target.value as string;
        if (chosenSidur === "NEW") {
            dispatch({
                type: ActionsTypes.ADD_NEW_SIDUR,
                payload: null,
            });
        } else {
            dispatch({
                type: ActionsTypes.CHOOSE_SIDUR,
                payload: { id: chosenSidur },
            });
        }
    };

    return (
        <header className="flex flex-col bg-[#556cd6] text-white">
            <nav className="flex flex-row flex-wrap items-center min-h-16 px-4">
                <div className=" sm:block text-xl whitespace-nowrap">
                    <span className={"hidden lg:flex"}>
                        &nbsp; &nbsp;
                        {translations.Sidur}
                    </span>

                    <Select
                        dir={"rtl"}
                        disableUnderline={true}
                        variant={"standard"}
                        value={sidurId}
                        sx={{
                            color: "white",
                            fontSize: "1.25rem",
                            fontWeight: "normal",
                        }}
                        onChange={(
                            event: SelectChangeEvent<any>,
                            child: React.ReactNode
                        ) => {
                            handleSidurChanged(event, child);
                        }}
                    >
                        <MenuItem key={10000} value={"NEW"}>
                            {" "}
                            &nbsp;&nbsp;<b>{translations.NewSidur}</b>{" "}
                            &nbsp;&nbsp;
                        </MenuItem>

                        {sidurCollection.map(
                            (sidurRecord: SidurRecord, i: number) => (
                                <MenuItem key={i} value={sidurRecord.id}>
                                    {" "}
                                    &nbsp;&nbsp;{sidurRecord.Name} &nbsp;&nbsp;
                                </MenuItem>
                            )
                        )}
                    </Select>
                </div>
                <button
                    type="button"
                    className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
                    aria-label="show more"
                    aria-controls={sidurMenuId}
                    aria-haspopup="true"
                    onClick={onSidurMenuOpen}
                >
                    <Edit />
                </button>
                <div className="w-5 h-1.5" />
                <ToggleNavigationButtons />

                <div className="grow" />
                <div className=" ">
                    <button
                        type="button"
                        className="p-3 rounded-full hover:bg-white/10 transition-colors text-white"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={onProfileMenuOpen}
                    >
                        <AccountCircle />
                    </button>
                </div>
                <div className="flex  ">
                    <button
                        type="button"
                        className="p-3 rounded-full hover:bg-white/10 transition-colors text-white"
                        aria-label="show more"
                        aria-controls={sidurMenuId}
                        aria-haspopup="true"
                        onClick={onSidurMenuOpen}
                    >
                        <MoreIcon />
                    </button>
                </div>
            </nav>
        </header>
    );
};
