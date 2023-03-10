import * as React from "react";
import { ChangeEvent, MutableRefObject, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { translations } from "../../services/translations";
import { useDispatch, useSelector } from "react-redux";
import { ActionsTypes } from "../../store/types.actions";
import { SxProps } from "@mui/system";
import { LinearLoading } from "../Loading/linear-loading";
import { Box } from "@mui/material";
import { Styles } from "../../hoc/themes";
import { Check, ErrorOutline, HelpOutline } from "@mui/icons-material";
import { ExplainVideoDialog } from "./explain-video-dialog";
import {SidurStore} from '../../store/store.types';

interface ImportSheetsProps {
  open: boolean;
  selectedValue: string;
  customType?: "EnterUserName";
}

const formatErrorText = (txt: string): string[] => {
  const splitTxt = txt.split(";");
  return splitTxt;
};
export const ImportSheetsDialog = (props: ImportSheetsProps) => {
  const { selectedValue, open } = props;
  const importSheetCheckStatus = useSelector(
    (state: SidurStore) => state.sessionState.importSheetCheckStatus
  );
  const [isExampleVideoOpen, setIsExampleVideoOpen] = useState(false);
  const dispatch = useDispatch();
  const [isWaitingForValidation, setIsWaitingForValidation] = useState(false);
  const valueRef: MutableRefObject<any> = useRef<any>("");
  const handleCloseCancel = () => {
    setIsWaitingForValidation(false);
    setIsWaitingForValidation(false);
    dispatch({ type: ActionsTypes.CLOSE_IMPORT_SHEETS_MODAL });
  };
  const handleShowExample = () => {
    setIsExampleVideoOpen(true);
  };
  const handleCloseExample = () => {
    setIsExampleVideoOpen(false);
  };
  const handleApproveImport = () => {
    const data = valueRef.current.value;
    dispatch({ type: ActionsTypes.APPROVE_IMPORT_SHEETS_DATA, payload: data });
  };
  const handleClearData = () => {
    valueRef.current.value = "";
    setIsWaitingForValidation(false);
    dispatch({ type: ActionsTypes.OPEN_IMPORT_SHEETS_MODAL });
  };
  const dialogStyle: SxProps = {
    minWidth: "35vw",
    minHeight: "50vh",
  };
  const handlePasting = (
    event: ChangeEvent & { target: { value: string } }
  ) => {
    const data = event.target.value;

    if (data.length < 30 && data !== "`") {
      return;
    } else if (data !== "`") {
      // data = "";
    }

    setIsWaitingForValidation(true);

    setTimeout(() => {
      valueRef.current.scrollTo(
        {
          top: 0,
          behavior: "smooth",
        },
        100
      );
    });
    setTimeout(() => {
      dispatch({ type: ActionsTypes.IMPORT_SHEETS_DATA_PASTE, payload: data });
    }, 1000);
  };
  const headerText = translations.ImportFromSheets;
  const inputLabel = translations.PastHereSheet;
  const disableText = isWaitingForValidation;
  return (
    <div>
      <Dialog open={open} onClose={handleCloseCancel}>
        <DialogTitle> {headerText}</DialogTitle>
        <DialogContent sx={dialogStyle}>
          <TextField
            sx={{
              width: "100%",
            }}
            autoFocus
            margin="dense"
            id={"shmiraList-rename-dialog-text-field"}
            label={inputLabel}
            type="text"
            minRows={importSheetCheckStatus ? 2 : 7}
            maxRows={importSheetCheckStatus ? 3 : 9}
            multiline
            fullWidth
            variant="outlined"
            defaultValue={""}
            inputRef={valueRef}
            onChange={handlePasting}
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                handleApproveImport();
              }
            }}
            disabled={disableText}
          />
          {isWaitingForValidation && !importSheetCheckStatus ? (
            <Box id={"waiting-for-validation"}>
              <Box sx={{ padding: "20px", ...Styles.flexRow }}>
                {translations.ImportFromSheetsPastValidating}
              </Box>

              <LinearLoading timeToFinish={200} />
            </Box>
          ) : null}

          {importSheetCheckStatus === "OK" ? (
            <Box
              sx={{
                padding: "20px",
                ...Styles.flexColumn,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ ...Styles.flexRow, marginBottom: "20px" }}>
                <Box sx={{ padding: "0 20px 0 20px " }}>
                  <Check sx={{ fontSize: "30px", color: "green" }} />
                </Box>
                {translations.ImportFromSheetsPastSuccess}
              </Box>

              <Button
                disabled={!importSheetCheckStatus}
                id={"shmiraList-rename-approve-button"}
                variant={"contained"}
                onClick={handleApproveImport}
              >
                {translations.ImportFromSheetsApprove}
              </Button>
            </Box>
          ) : null}

          {importSheetCheckStatus &&
          importSheetCheckStatus.includes("Error") ? (
            <Box
              sx={{
                padding: "20px",
                ...Styles.flexColumn,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ ...Styles.flexRow, marginBottom: "20px" }}>
                <Box sx={{ padding: "0 20px 0 20px " }}>
                  <ErrorOutline sx={{ fontSize: "30px", color: "red" }} />
                </Box>

                {translations.ImportFromSheetsPastFail}
              </Box>
              <Box
                sx={{
                  direction: "ltr",
                  padding: "15px",
                  margin: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#f29c9c",
                }}
              >
                {formatErrorText(importSheetCheckStatus).map((t, i) => (
                  <Box key={"container" + i}>
                    <Box key={i} sx={{ padding: "00px" }}>
                      {t}
                    </Box>
                  </Box>
                ))}
              </Box>

              <Button
                disabled={!importSheetCheckStatus}
                id={"import-approve-btn"}
                variant={"contained"}
                onClick={handleClearData}
              >
                {translations.Approve}
              </Button>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            id={"import-sheets-explain-button"}
            onClick={handleShowExample}
          >
            <HelpOutline />
            &nbsp;
            {translations.exampleVideo}
          </Button>
          <Button
            id={"import-sheets-cancel-button"}
            onClick={handleCloseCancel}
          >
            {translations.Cancel}
          </Button>
        </DialogActions>
      </Dialog>
      <ExplainVideoDialog
        open={isExampleVideoOpen}
        onClose={() => handleCloseExample()}
      />
    </div>
  );
};
