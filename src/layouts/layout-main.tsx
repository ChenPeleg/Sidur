import React from 'react'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {theme1} from '../hoc/themes';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },

}));
export const AppLayout = () => {

    return (
        <ThemeProvider theme={theme1}>

            <div className="app-background">
                סידור
            </div>

            </ThemeProvider>

    )

}
