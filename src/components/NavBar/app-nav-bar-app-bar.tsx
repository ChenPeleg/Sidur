import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { translations } from "../../services/translations";
import { useDispatch, useSelector } from "react-redux";
import { Select, SelectChangeEvent } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { ActionsTypes } from "../../store/types.actions";
import { SidurRecord, SidurStore } from "../../store/store.types";
import { ToggleButtons } from "../buttons/toggle-button-group";

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

    const handleSidurChanged = (event: SelectChangeEvent<any>, _child: React.ReactNode) => {
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
        <AppBar
            position="static"
            sx={{
                mr: 0,
                ml: 0,
                "div.MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular": {
                    margin: 0,
                },
            }}
        >
            <Toolbar
                sx={{
                    mr: 0,
                    ml: 0,
                }}
            >
                <IconButton
                    size="large"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 0 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                    }}
                >
                    {" "}
                    &nbsp; &nbsp;
                    {translations.Sidur}
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
                                    &nbsp;&nbsp;{sidurRecord.Name}{" "}
                                    &nbsp;&nbsp;
                                </MenuItem>
                            )
                        )}
                    </Select>
                </Typography>
                <IconButton
                    size="small"
                    aria-label="show more"
                    aria-controls={sidurMenuId}
                    aria-haspopup="true"
                    onClick={onSidurMenuOpen}
                    color="inherit"
                >
                    <Edit />
                </IconButton>
                <div className="w-5 h-1.5" />
                <ToggleButtons />

                <div className="grow" />
                <div className="hidden md:flex">
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={onProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                </div>
                <div className="flex md:hidden">
                    <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={sidurMenuId}
                        aria-haspopup="true"
                        onClick={onSidurMenuOpen}
                        color="inherit"
                    >
                        <MoreIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
};

