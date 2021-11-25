import React from 'react'

import {themeMain} from '../hoc/themes';
import {MainLayout} from './main-layout';
import {ThemeProvider} from '@mui/material';
import {AppNavBar} from '../components/NavBar/app-nav-bar';


export const AppLayout = () => {
    // useLayoutEffect(() => {
    //     document.body.setAttribute('dir', 'rtl');
    // }, [])

    return (
        <ThemeProvider theme={themeMain}>
            <div className="app-background" dir={'rtl'}>
                <AppNavBar/>

                <MainLayout/>

            </div>
        </ThemeProvider>

    )

}
