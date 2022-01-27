import {HashRouter, Navigate, Route, Routes} from 'react-router-dom';
import React from 'react';


const ChildrenWrapper = (props: { childrenForRef: any }) => (<> {props.childrenForRef}</>)
export const RouterMain = ({
                               children

                           }: any) => {
    const c = children;

    // @ts-ignore
    return (
        <HashRouter key={'all-routes-container'}>
            <Routes>
                <Route key={'home-father-path'} path="/h" element={<ChildrenWrapper childrenForRef={c}></ChildrenWrapper>}>
                    {/*{children}*/}

                </Route>

            </Routes>
            <Navigate to={'/h'}/>

        </HashRouter>
    )

}

