import React from 'react';
import {Box, MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SidurRecord, SidurStore} from '../../store/store.types';
import {ActionsTypes} from '../../store/types.actions';
import {translations} from '../../services/translations';
import {LocationGroup} from '../../models/Location.model';


export const LocationGroupSelect = () => {
    const dispatch = useDispatch();
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const sidurId = useSelector((state: SidurStore) => state.sidurId)
    const sidurCollection = useSelector((state: SidurStore) => state.sidurCollection);
    const currenSidur = sidurCollection.find(s => s.id === sidurId) as SidurRecord
    const currentSidurLocationGroupId = currenSidur.locationGroupIdForSidur;
    const orders = useSelector((state: SidurStore) => state.orders);
    const sketches = currenSidur.sketches;
    const isNewSidur: boolean = orders.length === 0 && sketches.length === 0


    const handleLocationGroupChanged = (event: any, _child: React.ReactNode) => {

        const chosenLocationGroup = event.target.value as string;

        dispatch({
            type: ActionsTypes.CHANGE_SIDUR_LOCATION_GROUP,
            payload: {id: chosenLocationGroup}
        })


    }


    return (
        <Box>
            {isNewSidur ? <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'start',
                mb: '10px'
            }}>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                        display: {
                            xs: 'none',
                            sm: 'block',
                            fontWight: 'regular'
                        }
                    }}
                >  &nbsp;
                    {translations.LocationBaseSidurText} &nbsp; </Typography>
                <Select dir={'rtl'} disableUnderline={true} variant={'standard'} value={currentSidurLocationGroupId}
                        sx={{
                            //  color: 'black',
                            fontSize: '1.25rem',
                            fontWeight: 'normal'
                        }}
                        onChange={(event: SelectChangeEvent<any>, child: React.ReactNode) => {
                            handleLocationGroupChanged(event, child)
                        }}>

                    {locationGroups.map((oneLocationGroup: LocationGroup) => <MenuItem
                        key={oneLocationGroup.id}
                        value={oneLocationGroup.id}> {oneLocationGroup.name} &nbsp; </MenuItem>)}
                </Select>


            </Box> : null}

        </Box>


    )


}
