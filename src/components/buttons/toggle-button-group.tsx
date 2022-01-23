import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import {translations} from '../../services/translations';
import {useDispatch} from 'react-redux';
import {ActionsTypes} from '../../store/types.actions';
import {StyledToggleButtonGroup} from './styled-toggle-button';
import {Link} from 'react-router-dom';


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
        <StyledToggleButtonGroup
            value={alignment}
            exclusive
            sx={{
                color: 'white',
                direction: 'ltr'
            }}
            color={'standard'}

            onChange={handleChange}
        >

            <ToggleButton component={Link} to="/locations" sx={{color: 'white'}}
                          value={'locationsView'}>{translations.Locations}</ToggleButton>

       
            <ToggleButton component={Link} to="/sketch" sx={{color: 'white'}} value={'sketch'}>{translations.Sketch}</ToggleButton>

            <ToggleButton component={Link} to="/orders" sx={{color: 'white'}} value={'orders'}> {translations.Orders} </ToggleButton>

        </StyledToggleButtonGroup>
    );
}
