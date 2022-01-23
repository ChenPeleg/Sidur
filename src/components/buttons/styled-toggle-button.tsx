import {styled} from '@mui/system';
import {ToggleButtonGroup} from '@mui/material';


export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({theme: _theme}) => ({
    '& .MuiToggleButtonGroup-grouped': {
        backgroundColor: 'rgba(255,255,255,0.11)',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.21)',
        },
        // margin: _theme.spacing(0.5),
        // border: 0,
        '&.Mui-disabled': {
            // border: 0,
        },
        '&.Mui-selected': {
            backgroundColor: 'rgb(187,185,249)',
            // border: 0,
        },

        '&:not(:first-of-type)': {
            // borderRadius: _theme.shape.borderRadius,
        },
        '&:first-of-type': {
            // borderRadius: _theme.shape.borderRadius,
        },
    },
}));
