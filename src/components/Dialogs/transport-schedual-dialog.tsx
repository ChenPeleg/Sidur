import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {translations} from '../../services/translations';
import {TransportModel} from '../../models/Location.model';
import {Theme} from '@mui/system';
import {Box, IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';

interface RenameProps {
    open: boolean;
    transport: TransportModel;
    onClose: (value: string [] | null) => void;
}

export const TransportScheduleDialog = (props: RenameProps) => {
    // const [open, setOpen] = React.useState(false);
    const {
        onClose,
        transport,
        open
    } = props;
    const sxRoot = {
        direction: (theme: Theme) => theme.direction,
        '& .MuiFormLabel-root': {
            left: 'inherit'
        },
        '& .MuiInputBase-input': {
            // padding: '10px'
        }
    }
    const emptyValues = ['', '', '', '', ''];
    const transportTimes = transport.TransportTime || []
    const allTimes = transportTimes.concat(emptyValues);

    const [hourValues, setHourValues] = useState(allTimes)
    const handleCloseCancel = () => {
        onClose(null);
    };
    const handleCloseHours = () => {
        onClose(hourValues.filter(v => v && v.length && v.trim()));
    };
    const handleAddHours = () => {
        setHourValues(hourValues.concat(emptyValues))
    }


    const onChangeHour = (changeEvent: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newHourValues = [...hourValues];
        const newValue = changeEvent.target.value;
        const changedHourValues = newHourValues.map((h: string, i: number) => i === index ? newValue : h)
        if (newValue) {
            setHourValues(changedHourValues)

        }

    }
    const onDeleteHour = (index: number) => {
        const newHourValues = [...hourValues];
        const newValue = ' ';
        const changedHourValues = newHourValues.map((h: string, i: number) => i === index ? newValue : h)
        if (newValue) {
            setHourValues(changedHourValues)

        }

    }

    return (
        <div>

            <Dialog open={open} onClose={handleCloseCancel}>
                <DialogTitle> {transport.name + ' ' + translations.exitTime + ':'}</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{
                            'display': 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap'
                        }}>
                            {hourValues.map((s: string, i: number) => (
                                <Box sx={{'display': 'inline-flex'}}>

                                    <Box id={'divider-hours'} sx={{
                                        width: '55px',
                                        height: '20px'
                                    }}/>

                                    <IconButton size="small"
                                                onClick={(_e) => onDeleteHour(i)}
                                                color="inherit"
                                    ><Delete fontSize={'small'}/> </IconButton>
                                    <TextField variant={'standard'}
                                               sx={{...sxRoot}}
                                               type="time"
                                               value={s}
                                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeHour(event, i)}/>
                                </Box>))}
                        </Box>
                        <Button sx={{
                            maxWidth: '100%',
                            mt: '1em',
                            alignSelf: 'center'
                        }} variant="contained" onClick={handleAddHours} aria-label="add" size="medium">
                            &nbsp;&nbsp;&nbsp; {translations.addHours}&nbsp;&nbsp;&nbsp;
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button id={'sidur-rename-cancel-button'} onClick={handleCloseCancel}>{translations.Cancel}</Button>
                    <Button id={'sidur-rename-approve-button'} onClick={handleCloseHours}>{translations.Approve}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
