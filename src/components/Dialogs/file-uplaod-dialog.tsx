import * as React from 'react';
import {useRef, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {translations} from '../../services/translations';
import {Box, Select, SelectChangeEvent} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import {FileUploadType} from '../../store/store.types';


interface FileUploadProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;

}

interface TypeOfUpload {
    type: FileUploadType,
    id: string,
    name: string
}

const fileUploadTypes: TypeOfUpload[] = [
    {

        type: FileUploadType.uploadFullDataAndAdd,
        id: FileUploadType[FileUploadType.uploadFullDataAndAdd] as string,
        name: translations.ImportAllData
    },
    {
        type: FileUploadType.uploadFullDataAndReplace,
        id: FileUploadType[FileUploadType.uploadFullDataAndReplace] as string,
        name: translations.DeleteAndImportAllData
    },
    {
        type: FileUploadType.uploadSpecificData,
        id: FileUploadType[FileUploadType.uploadSpecificData] as string,
        name: translations.ImportPart
    }
]
const defaultUploadType: FileUploadType = FileUploadType.uploadFullDataAndAdd;
const defaultId: string = fileUploadTypes.find(upload => upload.type === defaultUploadType)?.id || '1'
export const FileUploadDialog = (props: FileUploadProps) => {
    // const [open, setOpen] = React.useState(false);
    const {
        onClose,
        selectedValue,
        open
    } = props;
    const [uploadType, setUploadType] = useState(defaultId)
    const valueRef: any = useRef('')
    const handleCloseCancel = () => {
        onClose(selectedValue);
    };
    const handleCloseRename = () => {
        onClose(valueRef.current.value || selectedValue);
    };

    const onFileLoadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target?.files;
        if (files?.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event) {
                    
                }

            };
            reader.readAsText(file);
        }

    }
    return (
        <div>
            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {translations.ImportFromFile}</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        minWidth: '25vw',
                        display: 'flex',
                        alignItems: 'center',

                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>


                        <Select dir={'rtl'} disableUnderline={true} variant={'standard'}
                                defaultValue={defaultId}
                                sx={{

                                    fontSize: '1.25rem',
                                    fontWeight: 'normal'
                                }}
                                onChange={(event: SelectChangeEvent<any>, child: React.ReactNode) => {
                                    const chosenId = event.target.value as string;
                                    //  const typeOfUploadChosen: FileUploadType = fileUploadTypes.find(upload => upload.id.toString() === chosenId)?.type || defaultUploadType
                                    setUploadType(chosenId)
                                }}
                        >

                            {fileUploadTypes.map((typeOfUpload: TypeOfUpload) => <MenuItem key={typeOfUpload.id}
                                                                                           value={typeOfUpload.id}> &nbsp;&nbsp;{typeOfUpload.name} &nbsp;&nbsp;</MenuItem>)}
                        </Select>

                        <Button sx={{m: '15px'}}
                                variant="contained"
                                component="label"
                        >
                            {translations.ChooseFile}
                            <input
                                onChange={onFileLoadChange}
                                type="file"
                                hidden
                            />
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancel}>{translations.Cancel}</Button>
                    <Button onClick={handleCloseRename}>{translations.Approve}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
        ;
}
