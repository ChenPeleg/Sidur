import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {translations} from '../../services/translations';
import {SidurStore} from '../../store/store.types';
import {useDispatch, useSelector} from 'react-redux';
import {ActionsTypes} from '../../store/types.actions';
import {LocationsEdit} from './locations-edit';
import {LocationsRoutesEditWrapper} from '../LocationsEditRoutes/locations-routes-edit-wrapper';
import {LocationsTransportEditWrapper} from '../LocationsEditTransports/locations-transport-edit-wrapper';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const {
        children,
        value,
        index,
        ...other
    } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tab-panel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tab-panel-${index}`,
    };
}


export const LocationsEditTabs = () => {
    const locationTabSelectedAsString: string = useSelector((state: SidurStore) => state.sessionState.LocationGroupTabOpen || '1');
    const locationTabSelected = +locationTabSelectedAsString;
    const dispatch = useDispatch()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {

        dispatch({
            type: ActionsTypes.CHOOSE_LOCATION_GROUP_TAB,
            payload: {id: newValue.toString()}
        })
    };

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <Tabs value={locationTabSelected} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label={translations.Locations} {...a11yProps(0)} />
                    <Tab label={translations.roadTracks}   {...a11yProps(1)} />
                    <Tab label={translations.PublicTransport}  {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={locationTabSelected} index={0}>
                <LocationsEdit/>
            </TabPanel>
            <TabPanel value={locationTabSelected} index={1}>
                <LocationsRoutesEditWrapper/>
            </TabPanel>
            <TabPanel value={locationTabSelected} index={2}>
                <LocationsTransportEditWrapper/>
            </TabPanel>
        </Box>
    );
}
