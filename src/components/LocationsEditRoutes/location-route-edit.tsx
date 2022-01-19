import {Box, Card, IconButton, Select, SelectChangeEvent} from '@mui/material';
import {LocationModel, RouteModel, RoutStopModel} from '../../models/Location.model';
import * as React from 'react';
import {ActionsTypes} from '../../store/types.actions';
import {useDispatch} from 'react-redux';
import {RouteEditMenu} from './location-edite-route-menu';
import {ArrowBack, Edit} from '@mui/icons-material';
import {RenameDialog} from '../Dialogs/rename-dialog';
import {ConfigService} from '../../services/config-service';
import MenuItem from '@mui/material/MenuItem';
import {translations} from '../../services/translations';

export enum RouteEditAction {
    RenameRoute = 1,
    DeleteRoute = 2,
    CloneRoute = 3,
    EditRoute = 4
}

interface Stops extends RoutStopModel {
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
    const sketchMenuId = 'primary-route-menu';

    const handleRouteMenuClose = () => {
        setRouteMoreAnchorEl(null);
    };
    const handleRouteMenuClick = (event: React.MouseEvent<HTMLElement>, clickAction: RouteEditAction) => {
        setRouteMoreAnchorEl(null);

        switch (clickAction) {

            case RouteEditAction.CloneRoute:
                break;
            case RouteEditAction.DeleteRoute:
                dispatch({
                    type: ActionsTypes.DELETE_ROUTE,
                    payload: {id: props.route.id}
                })
                break;

            case RouteEditAction.RenameRoute:
                setRenameOpen(true)
                break;
            default:
                break;
        }

    }

    const handleRenameClose = (value: string | null) => {
        setRenameOpen(false);
        const id = props.route.id;
        if (value) {
            const updatedRout = {...props.route}
            updatedRout.name = value;
            dispatch({
                type: ActionsTypes.UPDATE_ROUTE,
                payload: updatedRout
            })
        }
    };
    const allStops: Stops[] = props.route.routStops.map((r: RoutStopModel) => {
        const location = props.allLocations.find(l => l.id === r.locationId)

        if (location) {
            const stop: Stops = {
                ...r,
                locationName: location.name,
                minuetsFromLastCode: 30

            }
            return stop

        } else {
            return null
        }
    }).filter(s => s) as Stops[];
    const minutesFromLastOptions = ConfigService.Constants.RoutesMinutesOptions.map(value => ({
        value: value,
        text: value.toString() + ' ' + translations.min  //+ ' ' + translations.Nesia
    }));

    const handleDriveLengthChanged = (event: SelectChangeEvent<any>, child: React.ReactNode): void => {

    }

    return (
        <Box>
            <Card sx={{
                width: '400px',
                height: '300px'
            }}>
                <Box sx={{
                    m: '1em'
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
                    {allStops.map((stop: Stops) => (<Box sx={{
                        display: 'inline',
                        p: '0.1em',
                    }}>

                        {
                            stop.locationName
                        }
                        <Box sx={{
                            width: '15px',
                            height: '5px',
                            display: 'inline-flex'
                        }}/>
                        <ArrowBack sx={{mb: '-5px'}} fontSize={'small'}/>
                        <Select disableUnderline={true} variant={'standard'} value={stop.minuetsFromLastCode}
                                sx={{
                                    //  color: 'black',
                                    //  fontSize: '1.25rem',
                                    fontWeight: 'normal'
                                }}
                                onChange={(event: SelectChangeEvent<any>, child: React.ReactNode) => {
                                    handleDriveLengthChanged(event, child)
                                }}>
                            {minutesFromLastOptions.map((option) => <MenuItem key={option.value}
                                                                              value={option.value}>&nbsp; {option.text}  </MenuItem>)}
                        </Select>
                        <Box sx={{
                            width: '15px',
                            height: '5px',
                            display: 'inline-flex'
                        }}/>
                        <ArrowBack sx={{mb: '-5px'}} fontSize={'small'}/>
                        <Box sx={{
                            width: '15px',
                            height: '5px',
                            display: 'inline-flex'
                        }}/>

                    </Box>))}
                </Box>

            </Card>
            <RouteEditMenu routeMoreAnchorEl={routeMoreAnchorEl} routeMenuId={props.route.id} isRouteMenuOpen={isRouteMenuOpen}
                           handleRouteMenuClick={handleRouteMenuClick} handleRouteMenuClose={handleRouteMenuClose}/>
            <RenameDialog open={RenameOpen} onClose={handleRenameClose} selectedValue={props.route.name}/>

        </Box>
    )
}
