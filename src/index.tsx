import React from "react";
import "./index.css";
import App from "./hoc/App";
import reportWebVitals from "./reportWebVitals";
import { Root } from "./hoc/Root";
import ReactDOM from "react-dom/client";
import {ImportOrdersFromText} from './services/import-orders-from-text';
import {sidurFromDocsMock} from './__tests__/mocks/sidurFromDocsMock';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Root>
      <App />
    </Root>
  </React.StrictMode>
);
ImportOrdersFromText(sidurFromDocsMock,[]);
reportWebVitals();


