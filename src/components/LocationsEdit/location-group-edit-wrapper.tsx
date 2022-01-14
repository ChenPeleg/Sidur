import React from 'react';
import {Box, Button, IconButton, MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {Edit, LockTwoTone} from '@mui/icons-material';
import {RenameDialog} from '../Dialogs/rename-dialog';
import {SidurStore} from '../../store/store.types';
import {ActionsTypes} from '../../store/types.actions';
import {translations} from '../../services/translations';
import {LocationGroup} from '../../models/Location.model';
import {LocationGroupMenu} from './location-group-menu';
import {LocationGroupActionType} from '../../models/LocationGroupMenuClickActionType.enum';
import {LocationsEditTabs} from './location-group-edit-tabs';


export const LocationGroupEditWrapper = () => {
    const dispatch = useDispatch();
    const locationGroupInEditId = useSelector((state: SidurStore) => state.locationGroupInEdit || 'ESHBAL');
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);

    const [locationGroupMoreAnchorEl, setLocationGroupMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const isLocationGroupMenuOpen = Boolean(locationGroupMoreAnchorEl);

    const locationGroupMenuId = 'primary-location-group-menu';
    const [RenameOpen, setRenameOpen] = React.useState(false);

    const handleLocationGroupMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setLocationGroupMoreAnchorEl(event.currentTarget);
    };
    const handleRenameClose = (value: string | null) => {
        setRenameOpen(false);
        const id = locationGroupInEditId;
        if (value) {
            dispatch({
                type: ActionsTypes.RENAME_LOCATION_GROUP,
                payload: {
                    value,
                    id
                }
            })
        }
    };
    const handleLocationGroupMenuClick = (event: React.MouseEvent<HTMLElement>, clickAction: LocationGroupActionType) => {

        switch (clickAction) {

            case LocationGroupActionType.CreateCopy:
                dispatch({
                    type: ActionsTypes.CLONE_LOCATION_GROUP,
                    payload: {id: locationGroupInEdit}
                })
                break;

            case LocationGroupActionType.Delete:
                dispatch({
                    type: ActionsTypes.DELETE_LOCATION_GROUP,
                    payload: {id: locationGroupInEdit?.id}
                })
                break;
            case LocationGroupActionType.Rename:
                setRenameOpen(true);
                break;


            default:
        }
        handleSketchMenuClose()
    };
    const handleSketchMenuClose = () => {
        setLocationGroupMoreAnchorEl(null);
    };
    const handleLocationGroupChanged = (event: any, child: React.ReactNode) => {

        const chosenSketch = event.target.value as string;
        if (chosenSketch === 'NEW') {
            dispatch({
                type: ActionsTypes.NEW_LOCATION_GROUP,
                payload: null
            });

        } else {
            dispatch({
                type: ActionsTypes.CHOOSE_LOCATION_GROUP,
                payload: {id: chosenSketch}
            })
        }


    }
    console.log(locationGroupInEditId)
    const handleCreateLocationGroup = () => {
        dispatch({
            type: ActionsTypes.NEW_LOCATION_GROUP,
            payload: {
                value: null,
            }
        })
    }


    const locationGroupInEdit: LocationGroup | null = locationGroups.find((lGroup: LocationGroup) => lGroup.id === locationGroupInEditId) || {
        Locations: [],
        name: 'אשבל',
        id: '1'
    };

    const sketchName = locationGroupInEdit ? locationGroupInEdit.name : '';


    return (
        <Box>
            {locationGroupInEdit ? <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
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
                > </Typography>   &nbsp;
                {translations.LocationBase} &nbsp;
                <Select dir={'rtl'} disableUnderline={true} variant={'standard'} value={locationGroupInEditId}
                        sx={{
                            //  color: 'black',
                            fontSize: '1.25rem',
                            fontWeight: 'normal'
                        }}
                        onChange={(event: SelectChangeEvent<any>, child: React.ReactNode) => {
                            handleLocationGroupChanged(event, child)
                        }}>
                    <MenuItem key={'ESHBAL'} sx={{verticalAlign: 'center'}}
                              value={'ESHBAL'}> &nbsp;  {translations.Eshbal} <LockTwoTone sx={{
                        height: '17px',
                        opacity: '0.7',
                        color: 'grey'
                    }}/></MenuItem>
                    <MenuItem key={'NEW'}
                              value={'NEW'}> &nbsp; <b>{translations.CreateLocationGroup}</b>  &nbsp;</MenuItem>
                    {locationGroups.map((oneLocationGroup: LocationGroup) => <MenuItem key={oneLocationGroup.id}
                                                                                       value={oneLocationGroup.id}> {oneLocationGroup.name} &nbsp; </MenuItem>)}
                </Select>


                <IconButton
                    size="small"
                    aria-label="show more"
                    aria-controls={locationGroupMenuId}
                    aria-haspopup="true"
                    onClick={handleLocationGroupMenuOpen}
                    color="inherit"
                >
                    <Edit/>
                </IconButton>


            </Box> : <Button variant={'contained'} id={'sketches-create-sketch'}
                             onClick={handleCreateLocationGroup}>{translations.CreateSketch}</Button>}

            <LocationsEditTabs/>
            <LocationGroupMenu locationGroupMoreAnchorEl={locationGroupMoreAnchorEl}
                               locationGroupMenuId={locationGroupInEditId || ''}
                               isLocationGroupMenuOpen={isLocationGroupMenuOpen}
                               handleLocationGroupMenuClick={handleLocationGroupMenuClick}
                               handleLocationGroupMenuClose={handleSketchMenuClose}/>
            <RenameDialog open={RenameOpen} onClose={handleRenameClose} selectedValue={sketchName}/>
        </Box>


    )


}
