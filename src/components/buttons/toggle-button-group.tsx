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
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
        >
            <ToggleButton value={'orders'}>{translations.Orders}</ToggleButton>
            <ToggleButton value={'sketches'}>{translations.Sketch}</ToggleButton>
            <ToggleButton value={'all'}>{translations.All}</ToggleButton>
        </ToggleButtonGroup>
    );
}
