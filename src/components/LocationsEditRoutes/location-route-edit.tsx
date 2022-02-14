import {Box, Card, IconButton, Select, SelectChangeEvent} from '@mui/material';
import {LocationModel, RoadStopModel, RouteModel} from '../../models/Location.model';
import * as React from 'react';
import {ActionsTypes} from '../../store/types.actions';
import {useDispatch} from 'react-redux';
import {RouteTransportEditMenu} from '../LocationsEdit/location-edit-transport-route-menu';
import {ArrowBack, Delete, Edit} from '@mui/icons-material';
import {RenameDialog} from '../Dialogs/rename-dialog';
import {ConfigService} from '../../services/config-service';
import MenuItem from '@mui/material/MenuItem';
import {translations} from '../../services/translations';

export enum RouteOrTransEditAction {
    RenameRoute = 1,
    DeleteRoute = 2,
    CloneRoute = 3,

}

interface StopModel extends RoadStopModel {
    locationName: string,
    minuetsFromLastCode: number
}

interface LocationRouteEditProps {
    route: RouteModel,
    allLocations: LocationModel[]

}

//const routStops
export const LocationRouteEdit = (props: LocationRouteEditProps) => {
    const dispatch = useDispatch();

    const [RenameOpen, setRenameOpen] = React.useState(false);
    const [routeMoreAnchorEl, setRouteMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const isRouteMenuOpen = Boolean(routeMoreAnchorEl);

    const handleRouteMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setRouteMoreAnchorEl(event.currentTarget);
    };
    const sketchMenuId = 'primary-transportRoute-menu';

    const handleRouteMenuClose = () => {
        setRouteMoreAnchorEl(null);
    };
    const handleRouteMenuClick = (event: React.MouseEvent<HTMLElement>, clickAction: RouteOrTransEditAction) => {
        setRouteMoreAnchorEl(null);

        switch (clickAction) {

            case RouteOrTransEditAction.CloneRoute:
                dispatch({
                    type: ActionsTypes.CLONE_ROUTE,
                    payload: {id: props.route.id}
                })
                break;

            case RouteOrTransEditAction.DeleteRoute:
                dispatch({
                    type: ActionsTypes.DELETE_ROUTE,
                    payload: {id: props.route.id}
                })
                break;

            case RouteOrTransEditAction.RenameRoute:
                setRenameOpen(true)
                break;
            default:
                break;
        }

    }

    const handleRenameClose = (value: string | null) => {
        setRenameOpen(false);
        if (value) {
            const updatedRout = {...props.route}
            updatedRout.name = value;
            dispatch({
                type: ActionsTypes.UPDATE_ROUTE,
                payload: updatedRout
            })
        }
    };
    const allStops: StopModel[] = props.route.routStops.map((r: RoadStopModel) => {
        const location = props.allLocations.find(l => l.id === r.locationId)

        if (location) {
            const stop: StopModel = {
                ...r,
                locationName: location.name,
                minuetsFromLastCode: r.minuetsFromLast || 30

            }
            return stop

        } else {
            return null
        }
    }).filter(s => s) as StopModel[];
    const minutesFromLastOptions = ConfigService.Constants.RoutesMinutesOptions.map(value => ({
        value: value,
        text: value.toString() + ' ' + translations.min
    }));
    const handleRemoveLast = (_event: any) => {
        const updatedRout = {...props.route};
        updatedRout.routStops = [...updatedRout.routStops];
        updatedRout.routStops.pop();
        dispatch({
            type: ActionsTypes.UPDATE_ROUTE,
            payload: updatedRout
        })
    }
    const handleDriveLengthChanged = (event: SelectChangeEvent<any>, stop: StopModel): void => {
        const updatedRout = {...props.route}
        // const updatedValue = minutesFromLastOptions.find(o => o.value === event.target.value)

        updatedRout.routStops = updatedRout.routStops.map(s => {
            if (s.locationId === stop.locationId) {
                const newStop = {...s};
                newStop.minuetsFromLast = event.target.value;
                return newStop
            }
            return s
        })
        dispatch({
            type: ActionsTypes.UPDATE_ROUTE,
            payload: updatedRout
        })
    }
    const isLongRoute: boolean = allStops?.length > 5

    return (
        <Box>
            <Card sx={{
                width: '400px',
                minHeight: '300px'
            }}>
                <Box sx={{
                    m: '1em',
                    mb: '0px'
                }}> <b>{props.route.name}</b>
                    <IconButton
                        size="small"
                        aria-label="show more"
                        aria-controls={sketchMenuId}
                        aria-haspopup="true"
                        onClick={handleRouteMenuOpen}
                        color="inherit"
                    ><Edit fontSize={'small'}/></IconButton>
                </Box>
                <Box sx={{
                    pr: '1em',
                    pl: '1em',
                    flex: 'row',

                    flexWrap: 'wrap'
                }}>
                    {allStops.map((stop: StopModel, i: number) => (<Box key={stop.locationId + i.toString()} sx={{
                        display: isLongRoute ? 'inline' : 'block',
                        p: '0.1em',

                    }}>


                        {i > 0 ? <><Select disableUnderline={true} variant={'standard'} value={stop.minuetsFromLastCode}
                                           sx={{
                                               //  color: 'black',
                                               //  fontSize: '1.25rem',
                                               fontWeight: 'normal'
                                           }}
                                           onChange={(event: SelectChangeEvent<any>, _child: React.ReactNode) => {
                                               handleDriveLengthChanged(event, stop)
                                           }}>
                            {minutesFromLastOptions.map((option) => <MenuItem key={option.value}
                                                                              value={option.value}> {option.text}  &nbsp;&nbsp; </MenuItem>)}
                        </Select> <Box sx={{
                            width: isLongRoute ? '15px' : '5px',
                            height: '5px',
                            display: 'inline-flex'
                        }}/>
                            <ArrowBack sx={{mb: '-5px'}} fontSize={'small'}/>
                            <Box sx={{
                                width: '15px',
                                height: '5px',
                                display: 'inline-flex'
                            }}/></> : null}
                        <Card sx={{
                            maxWidth: '100px',
                            display: 'inline-flex',
                            p: '4px'
                        }}>{
                            stop.locationName
                        } </Card>


                        <Box sx={{
                            width: '15px',
                            height: '5px',
                            display: 'inline-flex',
                            mb: isLongRoute ? '1.3em' : '1.6em'
                        }}/>
                        {i + 1 === allStops.length ? <IconButton size="small"
                                                                 onClick={handleRemoveLast}
                                                                 color="inherit"
                        ><Delete fontSize={'small'}/> </IconButton> : <ArrowBack sx={{mb: '-5px'}} fontSize={'small'}/>}

                    </Box>))}
                </Box>

            </Card>
            <RouteTransportEditMenu routeMoreAnchorEl={routeMoreAnchorEl} routeMenuId={props.route.id} isRouteMenuOpen={isRouteMenuOpen}
                                    handleRouteMenuClick={handleRouteMenuClick} handleRouteMenuClose={handleRouteMenuClose}/>
            <RenameDialog open={RenameOpen} onClose={handleRenameClose} selectedValue={props.route.name}/>

        </Box>
    )
}
