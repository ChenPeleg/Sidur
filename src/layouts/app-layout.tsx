import React, {useLayoutEffect} from 'react'
import {ThemeProvider} from '@material-ui/core/styles';
import {themeMain} from '../hoc/themes';
import {HeaderLayout} from './header-layout';
import {MainLayout} from './main-layout';


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
