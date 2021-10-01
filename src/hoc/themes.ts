import {red} from '@material-ui/core/colors';
import {createTheme, Theme} from '@material-ui/core/styles';

// A custom theme for this app
export const theme1: Theme = createTheme({
    typography: {
        h1: {
            fontSize: '3rem',
            marginTop: 0,
            marginBottom: 0
        }
    },
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    },
});

export const theme2: Theme = createTheme({
    palette: {
        primary: {
            main: '#8862a1',
        },
        secondary: {
            main: '#f6144a',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    },
});
