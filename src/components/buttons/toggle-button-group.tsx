import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {translations} from '../../services/translations';
import {useDispatch} from 'react-redux';
import {ActionsTypes} from '../../store/types.actions';

export const ToggleButtons = () => {
    const [alignment, setAlignment] = React.useState('web');
    const dispatch = useDispatch()
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
       
        dispatch({
            type: ActionsTypes.CHANGE_VIEW,
            payload: {
                value: newAlignment
            }
        })

    };

    return (
        <ToggleButtonGroup
            value={alignment}
            exclusive
            sx={{color: 'white'}}

            onChange={handleChange}
        >
            <ToggleButton sx={{color: 'white'}} value={'orders'}> {translations.Orders} </ToggleButton>
            <ToggleButton sx={{color: 'white'}} value={'sketch'}>{translations.Sketch}</ToggleButton>
            <ToggleButton sx={{color: 'white'}} value={'both'}>{translations.All}</ToggleButton>
        </ToggleButtonGroup>
    );
}
