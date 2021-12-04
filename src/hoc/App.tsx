import React from 'react';
import './App.css';

import {AppLayout} from '../layouts/app-layout';
import {SidurBuilder} from '../sidurBuilder/sidurBuilder.main';

function App() {
    SidurBuilder(null as any)
    return (
        <AppLayout/>
    );
}

export default App;
