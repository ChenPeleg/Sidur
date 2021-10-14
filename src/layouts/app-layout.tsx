import React, {useLayoutEffect} from 'react'

import {themeMain} from '../hoc/themes';
import {HeaderLayout} from './header-layout';
import {MainLayout} from './main-layout';
import {ThemeProvider} from '@mui/material';


export const AppLayout = () => {
    useLayoutEffect(() => {
        document.body.setAttribute('dir', 'rtl');
    }, [])

    return (
        <ThemeProvider theme={themeMain}>
            <div className="app-background" dir={'rtl'}>
                <HeaderLayout/>
                <MainLayout/>

            </div>
        </ThemeProvider>

    )

}
