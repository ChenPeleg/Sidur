import React from 'react';
import {Add, AddBox, BusAlert, ChangeCircle, MergeType, Remove, ReplayCircleFilled, Splitscreen, Timer} from '@mui/icons-material';
import {jsx} from '@emotion/react';


export const Icons: Record<string, React.ReactElement> = {
    'add': (<Add/>),
    'Remove': (<Remove/>),
    'Merge': (<MergeType/>),
    'Split': (<Splitscreen/>),
    'Change': (<ChangeCircle/>),
    'ChangeTime': (<Timer/>),
    'ReplaceExisting': (<ReplayCircleFilled/>),
    'publicTransport': (<BusAlert/>),
    'AddToPending': (<AddBox/>),
}


