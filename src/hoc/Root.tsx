import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import reducer from "../store/reducer";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer });

export const Root = ({ children, initialState = {} }: any) => (
    <Provider store={store}>{children}</Provider>
);
