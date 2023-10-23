import React from "react";
import "./index.css";
import App from "./hoc/App";
import reportWebVitals from "./reportWebVitals";
import { Root } from "./hoc/Root";
import ReactDOM from "react-dom/client";

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

reportWebVitals();

export const getEnumKey = <T extends {}>(theEnum: T, keyValue:T[keyof T] ) =>
    (Object.keys(theEnum) as (keyof T)[])
        .find((k ) => theEnum[k] === keyValue) as keyof T || null ;

enum Friends {
    John = 0,
    James = 1,
    Lea = 3
}
const friendName = getEnumKey(Friends,Friends.James)
console.log(friendName)
