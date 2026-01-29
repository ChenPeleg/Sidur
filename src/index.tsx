import React from "react";
import "./index.css";
import App from "./hoc/App";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Root } from "./hoc/Root.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Root>
            <App />
        </Root>
    </StrictMode>
);

// const root = ReactDOM.createRoot(
//     document.getElementById("root") as HTMLElement
// );
// root.render(
//     <React.StrictMode>
//         <Root>
//             <App />
//         </Root>
//     </React.StrictMode>
// );
