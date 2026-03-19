import { Fade } from "@mui/material";
import { LoadingShield } from "./loading-shield";
import { useSelector } from "react-redux";
import { SessionModel } from "../../store/store.types";

export const Loading = () => {
    const session: SessionModel = useSelector(
        (state: { sessionState: SessionModel }) => state.sessionState
    );
    const isAnimationRunning = session ? session.isAnimationRunning : true;

    return (
        <Fade in={isAnimationRunning} unmountOnExit>
            <div className="absolute top-[65px] left-[75px] h-[50px] w-[50px] z-[10000]">
                <LoadingShield />
            </div>
        </Fade>
    );
};
