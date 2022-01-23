import React from 'react'

import {themeMain} from '../hoc/themes';
import {MainLayout} from './main-layout';
import {ThemeProvider} from '@mui/material';
import {AppNavBar} from '../components/NavBar/app-nav-bar';
import {Loading} from '../components/Loading/loading';
import {RouterMain} from '../router/router-main';


export const AppLayout = () => {
    // useLayoutEffect(() => {
    //     document.body.setAttribute('dir', 'rtl');
    // }, [])

    return (
        <ThemeProvider theme={themeMain}>
            <div className="app-background" dir={'rtl'}>
                <RouterMain>
                    <AppNavBar/>
                    <Loading/>

                    <MainLayout/>

                </RouterMain>

            </div>
        </ThemeProvider>

    )

}
