import { HashRouter, Navigate, Route, Routes } from "react-router";

export const RouterMain = ({ children }: any) => {
    return (
        // basename={'h/'}
        <HashRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/orders" />} />
            </Routes>

            {children}
        </HashRouter>
    );
};
