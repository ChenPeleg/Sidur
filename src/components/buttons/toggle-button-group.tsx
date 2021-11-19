import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {translations} from '../../services/translations';

export const ToggleButtons = () => {
    const [alignment, setAlignment] = React.useState('web');

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
    };

    return (
        <ToggleButtonGroup
            value={alignment}
            exclusive
            sx={{color: 'white'}}

            onChange={handleChange}
        >
            <ToggleButton sx={{color: 'white'}} value={'orders'}> {translations.Orders} </ToggleButton>
            <ToggleButton sx={{color: 'white'}} value={'sketches'}>{translations.Sketch}</ToggleButton>
            <ToggleButton sx={{color: 'white'}} value={'all'}>{translations.All}</ToggleButton>
        </ToggleButtonGroup>
    );
}
