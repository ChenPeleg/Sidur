import {Box, Card, IconButton} from '@mui/material';
import {RouteModel} from '../../models/Location.model';
import * as React from 'react';
import {ActionsTypes} from '../../store/types.actions';
import {useDispatch} from 'react-redux';
import {RouteEditMenu} from './location-edite-route-menu';
import {Edit} from '@mui/icons-material';
import {RenameDialog} from '../Dialogs/rename-dialog';

export enum RouteEditAction {
    RenameRoute = 1,
    DeleteRoute = 2,
    CloneRoute = 3,
    EditRoute = 4
}

interface LocationRouteEditProps {
    route: RouteModel,

}

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

            </Card>
            <RouteEditMenu routeMoreAnchorEl={routeMoreAnchorEl} routeMenuId={props.route.id} isRouteMenuOpen={isRouteMenuOpen}
                           handleRouteMenuClick={handleRouteMenuClick} handleRouteMenuClose={handleRouteMenuClose}/>
            <RenameDialog open={RenameOpen} onClose={handleRenameClose} selectedValue={props.route.name}/>

        </Box>
    )
}
