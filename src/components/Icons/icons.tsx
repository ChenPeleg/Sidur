import React from 'react';
import {
    Add,
    AddBox,
    ArrowCircleDown,
    ArrowCircleUp,
    BusAlert,
    ChangeCircle,
    Check,
    MergeType,
    Remove,
    ReplayCircleFilled,
    Splitscreen,
    Timer
} from '@mui/icons-material';


export const Icons: Record<string, React.ReactElement> = {
    'add': (<Add/>),
    'RemoveFromPending': (<Check/>),
    'Remove': (<Remove/>),
    'Merge': (<MergeType/>),
    'Split': (<Splitscreen/>),
    'Change': (<ChangeCircle/>),
    'ChangeTime': (<Timer/>),
    'ReplaceExisting': (<ReplayCircleFilled/>),
    'publicTransport': (<BusAlert/>),
    'AddToPending': (<AddBox/>),
    'MoveToTop': (<ArrowCircleUp/>),
    'MoveToBottom': (<ArrowCircleDown/>),
    'AddToVehicle': (<AddBox/>)
}


