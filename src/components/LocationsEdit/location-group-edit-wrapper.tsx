import React from 'react';
import {Box, Button, IconButton, MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {Edit, LockTwoTone} from '@mui/icons-material';
import {RenameDialog} from '../Dialogs/rename-dialog';
import {AppConstants, RecordBriefModel, SidurStore, TypeOfRecord} from '../../store/store.types';
import {ActionsTypes} from '../../store/types.actions';
import {translations} from '../../services/translations';
import {LocationGroup} from '../../models/Location.model';
import {LocationGroupMenu} from './location-group-menu';
import {LocationGroupActionType} from '../../models/LocationGroupMenuClickActionType.enum';
import {LocationsEditTabs} from './location-group-edit-tabs';
import {LocationCantEditMessage} from './location-cant-edit-message';


export const LocationGroupEditWrapper = () => {
    const dispatch = useDispatch();
    const locationGroupInEditId = useSelector((state: SidurStore) => state.sessionState.locationGroupInEdit || 'ESHBAL');
    const locationGroups: LocationGroup[] = useSelector((state: { LocationGroups: LocationGroup[] }) => state.LocationGroups || []);
    const recordBriefs: RecordBriefModel[] = useSelector((state: { recordBriefs: RecordBriefModel[] }) => state.recordBriefs || []);

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
    const buildTextForLocationInSidurim = (sidurim: RecordBriefModel []): string => {
        let retText = ''
        if (sidurim.length === 0) {
            return ''
        } else if (sidurim.length > 0) {
            retText = translations.thisCollectionIsInUse + ':';
            sidurim.forEach((s, i) => {
                let suffix = ''
                if (s.id.includes(AppConstants.ArchiveIdPrefix)) {
                    suffix = translations.InArchive
                } else if (s.id.includes(AppConstants.ArchiveIdPrefix)) {
                    suffix = translations.InTrash
                }
                if (suffix !== '') {
                    suffix = ' (' + suffix + ')'
                }
                if (i > 0) {
                    retText += ', '
                }
                retText += s.name + suffix
            })
        }
        if (sidurim.length >= 4) {
            retText += ', ' + translations.thisCollectionIsInUseandAnother + ' ' +
                (sidurim.length - 1).toString() + ' ' + translations.thisCollectionIsInUseandAnothersidurim;
        }
        retText += '. ' + translations.thisCollectionIsInUsedCannotbeDeleted
        return retText

    }

    const isLocationInSidur: RecordBriefModel [] | [] = recordBriefs.filter(lb => lb.typeOfRecord === TypeOfRecord.Sidur && lb.locationGroupOrSidurId === locationGroupInEditId);
   
    const handleLocationGroupMenuClick = (event: React.MouseEvent<HTMLElement>, clickAction: LocationGroupActionType) => {

        switch (clickAction) {

            case LocationGroupActionType.CreateCopy:
                dispatch({
                    type: ActionsTypes.CLONE_LOCATION_GROUP,
                    payload: {id: locationGroupInEditId}
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
    const handleCreateLocationGroup = () => {
        dispatch({
            type: ActionsTypes.NEW_LOCATION_GROUP,
            payload: {
                value: null,
            }
        })
    }


    const locationGroupInEdit: LocationGroup = locationGroups.find((lGroup: LocationGroup) => lGroup.id === locationGroupInEditId) || locationGroups[0] as LocationGroup;


    const sketchName = locationGroupInEdit ? locationGroupInEdit.name : '';


    return (
        <Box>
            {locationGroupInEdit ? <Box sx={{
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
                    {translations.LocationBase} &nbsp; </Typography>
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
                    {locationGroups.filter(l => l.id !== 'ESHBAL').map((oneLocationGroup: LocationGroup) => <MenuItem
                        key={oneLocationGroup.id}
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
                <Box
                    sx={{
                        fontSize: 'small',
                        maxWidth: '50vw',
                        pr: '20px',
                        pl: '20px'
                    }}> {locationGroupInEditId === 'ESHBAL' ? null : buildTextForLocationInSidurim(isLocationInSidur)}</Box>


            </Box> : <Button variant={'contained'} id={'sketches-create-sketch'}
                             onClick={handleCreateLocationGroup}>{translations.CreateSketch}</Button>}

            {locationGroupInEditId === 'ESHBAL' ? <LocationCantEditMessage/> : <LocationsEditTabs/>}
            <LocationGroupMenu locationGroupMoreAnchorEl={locationGroupMoreAnchorEl}
                               locationGroupMenuId={locationGroupInEditId || ''}
                               isLocationGroupMenuOpen={isLocationGroupMenuOpen}
                               handleLocationGroupMenuClick={handleLocationGroupMenuClick}
                               handleLocationGroupMenuClose={handleSketchMenuClose} preventDelete={isLocationInSidur.length > 0}/>
            <RenameDialog open={RenameOpen} onClose={handleRenameClose} selectedValue={sketchName}/>
        </Box>


    )


}
