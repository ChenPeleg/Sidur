import React from 'react'

import {themeMain} from '../hoc/themes';
import {ThemeProvider} from '@mui/material';
import {AppNavBar} from '../components/NavBar/app-nav-bar';
import {Loading} from '../components/Loading/loading';
import {RouterMain} from '../router/router-main';
import {MainLayout} from './main-layout';
import {HashRouter, Navigate, Route, Routes} from 'react-router-dom';


export const AppLayout = () => {


    return (
        <ThemeProvider theme={themeMain}>
            <div className="app-background"     data-testid={"test-app-back-ground"} dir={'rtl'}>

                <RouterMain>
                    <AppNavBar/>
                    <Loading/>

                    <MainLayout/>

                </RouterMain>


            </div>
        </ThemeProvider>

    )

}
