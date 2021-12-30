import React from 'react';
import {Box, Button, IconButton, MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {Edit} from '@mui/icons-material';
import {SketchActionType} from '../../models/SketchMenuClickActionType.enum';
import {RenameDialog} from '../Dialogs/rename-dialog';
import {SidurStore} from '../../store/store.types';
import {ActionsTypes} from '../../store/types.actions';
import {translations} from '../../services/translations';
import {LocationGroup} from '../../models/Location.model';
import {LocationGroupMenu} from './location-group-menu';


export const LocationsEdit = () => {
    const dispatch = useDispatch();
    const locationGroupInEditId = useSelector((state: SidurStore) => state.locationGroupInEdit);
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);

    const [locationGroupMoreAnchorEl, setLocationGroupMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const isLocationGroupMenuOpen = Boolean(locationGroupMoreAnchorEl);

    const locationGroupMenuId = 'primary-location-group-menu';
    const [RenameOpen, setRenameOpen] = React.useState(false);

    const handleSketchMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setLocationGroupMoreAnchorEl(event.currentTarget);
    };
    const handleRenameClose = (value: string | null) => {
        setRenameOpen(false);
        const id = locationGroupInEdit;
        if (value) {
            dispatch({
                type: ActionsTypes.RENAME_SKETCH,
                payload: {
                    value,
                    id
                }
            })
        }
    };
    const handleSketchMenuClick = (event: React.MouseEvent<HTMLElement>, clickAction: SketchActionType) => {


        switch (clickAction) {

            case SketchActionType.CreateCopy:
                dispatch({
                    type: ActionsTypes.CLONE_SKETCH,
                    payload: {id: locationGroupInEdit}
                })
                break;

            case SketchActionType.Delete:
                dispatch({
                    type: ActionsTypes.DELETE_SKETCH,
                    payload: {id: locationGroupInEdit}
                })
                break;
            case SketchActionType.Rename:
                setRenameOpen(true);
                break;


            default:
        }
        handleSketchMenuClose()
    };
    const handleSketchMenuClose = () => {
        setLocationGroupMoreAnchorEl(null);
    };
    const handleSketchChanged = (event: any, child: React.ReactNode) => {

        const chosenSketch = event.target.value as string;
        if (chosenSketch === 'NEW') {
            dispatch({
                type: ActionsTypes.NEW_SKETCH,
                payload: null
            });

        } else {
            dispatch({
                type: ActionsTypes.CHOOSE_SKETCH,
                payload: {id: chosenSketch}
            })
        }


    }
    const handleCreateSketch = () => {
        dispatch({
            type: ActionsTypes.NEW_SKETCH,
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
            fasdfasdfasdf
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
                >    &nbsp;
                    {translations.LocationBase} &nbsp;
                    <Select dir={'rtl'} disableUnderline={true} variant={'standard'} value={locationGroupInEdit}
                            sx={{
                                //  color: 'black',
                                fontSize: '1.25rem',
                                fontWeight: 'normal'
                            }}
                            onChange={(event: SelectChangeEvent<any>, child: React.ReactNode) => {
                                handleSketchChanged(event, child)
                            }}>
                        <MenuItem key={'NEW'}
                                  value={'NEW'}> &nbsp; <b>{translations.CreateSketch}</b>  &nbsp;</MenuItem>
                        {locationGroups.map((oneSketch: LocationGroup) => <MenuItem key={oneSketch.id}
                                                                                    value={oneSketch.id}> {oneSketch.name} &nbsp; </MenuItem>)}
                    </Select>
                </Typography>

                <IconButton
                    size="small"
                    aria-label="show more"
                    aria-controls={locationGroupMenuId}
                    aria-haspopup="true"
                    onClick={handleSketchMenuOpen}
                    color="inherit"
                >
                    <Edit/>
                </IconButton>


            </Box> : <Button variant={'contained'} id={'sketches-create-sketch'}
                             onClick={handleCreateSketch}>{translations.CreateSketch}</Button>}


            <LocationGroupMenu locationGroupMoreAnchorEl={locationGroupMoreAnchorEl}
                               locationGroupMenuId={locationGroupInEditId || ''}
                               isLocationGroupMenuOpen={isLocationGroupMenuOpen}
                               handleLocationGroupMenuClick={handleSketchMenuClose} handleLocationGroupMenuClose={handleSketchMenuClose}/>
            <RenameDialog open={RenameOpen} onClose={handleRenameClose} selectedValue={sketchName}/>
        </Box>


    )


}
