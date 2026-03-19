import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";

const presentAverageEachInterval = 20;

export const LinearLoading = (
    props: { timeToFinish: number } = { timeToFinish: 1000 }
) => {
    const { timeToFinish } = props;
    const timeForEachInterval =
        timeToFinish / (100 / presentAverageEachInterval);
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    //  return 0;
                }
                const diff = Math.random() * (presentAverageEachInterval / 2);
                return Math.min(oldProgress + diff, 100);
            });
        }, timeForEachInterval);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="w-full">
            <LinearProgress variant="indeterminate" value={progress} />
        </div>
    );
};
