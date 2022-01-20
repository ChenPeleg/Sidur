import {Box, Card} from '@mui/material';
import {RouteModel, TransportModel} from '../../models/Location.model';
import * as React from 'react';
import {useState} from 'react';


interface LocationRouteChooseRouteEditProps {
    route: RouteModel | TransportModel
    routeClicked: (routeId: string) => void
}

export const LocationRouteTransportChoose = (props: LocationRouteChooseRouteEditProps) => {

    const [inHover, setInHover] = useState(false);

    const onMouseOver = () => {
        setInHover(true)
    };
    const onMouseOut = () => {
        setInHover(false)
    };

    return (
        <Box sx={{m: '0.6em'}}>
            <Card sx={{
                width: '400px',
                p: '0.6em',
                cursor: 'pointer',
            }} onClick={() => props.routeClicked(props.route.id)}
                  onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut} elevation={inHover ? 6 : 2}>
                {props.route.name}
            </Card>

        </Box>
    )
}
