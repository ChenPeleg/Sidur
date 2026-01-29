import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { translations } from "../../services/translations";
import { CardMedia } from "@mui/material";

interface ExplainVideoDialogProps {
    open: boolean;
    onClose: (value: string | null) => void;
}

export const ExplainVideoDialog = (props: ExplainVideoDialogProps) => {
    // const [open, setOpen] = React.useState(false);
    const { onClose, open } = props;

    const handleCloseCancel = () => {
        onClose(null);
    };

    return (
        <div>
            <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                onClose={handleCloseCancel}
            >
                <DialogTitle> {translations.exampleVideo}</DialogTitle>
                <DialogContent>
                    <CardMedia
                        component="video"
                        src={process.env.PUBLIC_URL + "/example-import.mp4"}
                        autoPlay
                    ></CardMedia>
                </DialogContent>
                <DialogActions>
                    <Button
                        data-testid={"shmiraList-rename-cancel-button"}
                        id={"shmiraList-rename-cancel-button"}
                        onClick={handleCloseCancel}
                    >
                        {translations.close}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
