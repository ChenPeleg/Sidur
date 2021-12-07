import React from 'react'
import {Box} from '@mui/system';
import {useDispatch, useSelector} from 'react-redux';
import {OrderModel} from '../../models/Order.model';
import {Button, Divider, Typography} from '@mui/material';
import {translations} from '../../services/translations';
import {DriveModel, SketchModel, VehicleScheduleModel} from '../../models/Sketch.model';
import {Utilities} from '../../services/utilities';
import {VehicleModel} from '../../models/Vehicle.model';
import {locations} from '../../services/locations';
import {SketchDrive} from './SketchDrive';
import {ActionsTypes} from '../../store/types.actions';
import {SidurStore} from '../../store/store.types';
import {SketchActionType} from '../../models/SketchMenuClickActionType.enum';
import {SketchMenu} from './sketch-menu';
import {Edit} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';


export const Sketches = () => {
    const dispatch = useDispatch()
    const orders = useSelector((state: { orders: OrderModel[] }) => state.orders);
    const vehicles = useSelector((state: { vehicles: VehicleModel[] }) => state.vehicles);
    const orderIdInEdit = useSelector((state: { orderIdInEdit: string | null }) => state.orderIdInEdit);
    const sketches: SketchModel[] = useSelector((state: { sketches: SketchModel[] }) => state.sketches);

    const [sketchMoreAnchorEl, setSketchMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const isSketchMenuOpen = Boolean(sketchMoreAnchorEl);

    const sketchMenuId = 'primary-sketch-menu';
    const handleSketchMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSketchMoreAnchorEl(event.currentTarget);
    };
    const SketchIdInEdit = useSelector((state: SidurStore) => state.SketchIdInEdit);
    const handleSketchMenuClick = (event: React.MouseEvent<HTMLElement>, clickAction: SketchActionType) => {

        switch (clickAction) {

            case SketchActionType.CreateCopy:
                dispatch({
                    type: ActionsTypes.CLONE_SIDUR,
                    payload: {id: SketchIdInEdit}
                })
                break;
            case SketchActionType.Archive:
                dispatch({
                    type: ActionsTypes.ARCHIVE_SIDUR,
                    payload: {id: SketchIdInEdit}
                })
                break;
            case SketchActionType.Delete:
                dispatch({
                    type: ActionsTypes.DELETE_SIDUR,
                    payload: {id: SketchIdInEdit}
                })
                break;
            case SketchActionType.Rename:
                // setRenameOpen(true);
                break;


            default:
        }
        handleSketchMenuClose()
    };
    const handleSketchMenuClose = () => {
        setSketchMoreAnchorEl(null);
    };
    const getVehicleNameFromId = (vehicleId: string): string | null => {
        return vehicles.find(v => v.id === vehicleId)?.vehicleName || vehicleId
    }
    const getLocationFromId = (locationId: string): string | null => {
        return locations.find(v => v.id === locationId)?.Name || locationId
    }
    const handleCreateSketch = () => {
        dispatch({
            type: ActionsTypes.NEW_SKETCH,
            payload: {
                value: null,
            }
        })
    }
    const defaultSketch: SketchModel = sketches[0] || Utilities.defaultSketchMMock();


    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                justifyContent: 'start',
                mb: '10px'
            }}>
                <Typography variant={'h5'}>{translations.Sketch} {defaultSketch.name}</Typography>

                <IconButton
                    size="small"
                    aria-label="show more"
                    aria-controls={sketchMenuId}
                    aria-haspopup="true"
                    onClick={handleSketchMenuOpen}
                    color="inherit"
                >
                    <Edit/>
                </IconButton>
                <Button variant={'contained'} id={'sketches-create-sketch'}
                        onClick={handleCreateSketch}>{translations.CreateSketch}</Button>


            </Box>
            <Box id={'sketch-wrapper-row'} sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                mb: '10px',
                justifyContent: 'center',
                minWidth: '30vw',
            }}>
                {defaultSketch.vehicleSchedules.map((vehicleTimeTable: VehicleScheduleModel) => {
                    return (<>
                        <Box key={vehicleTimeTable.id} id={'vehicle-column'} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            m: '15px',
                            mt: '0px',
                            justifyContent: 'start',
                            minWidth: '20vw',
                            minHeight: '60vh',
                        }}> <Typography variant={'h6'}>{getVehicleNameFromId(vehicleTimeTable.id)}  </Typography>
                            {vehicleTimeTable.drives.map((drive: DriveModel) => {
                                return (
                                    <>
                                        <SketchDrive key={drive.id} drive={drive}/>

                                    </>
                                )

                            })}

                        </Box>
                        <Divider orientation="vertical" variant={'fullWidth'} sx={{borderRight: '2px solid black '}} flexItem/>
                    </>)


                })}

            </Box>
            <Box>


            </Box>

            <SketchMenu sketchMoreAnchorEl={sketchMoreAnchorEl} sketchMenuId={SketchIdInEdit || ''} isSketchMenuOpen={isSketchMenuOpen}
                        handleSketchMenuClick={handleSketchMenuClick} handleSketchMenuClose={handleSketchMenuClose}/>
        </Box>


    )

}
