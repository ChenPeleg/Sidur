import {Box, Card} from '@mui/material';
import {RouteModel, RouteOrTransport, TransportModel} from '../../models/Location.model';
import * as React from 'react';
import {useState} from 'react';


interface LocationRouteChooseRouteEditProps {
    route: RouteModel | TransportModel;
    routeClicked: (routeId: string) => void;
    routeOrTransport: RouteOrTransport;

}

export const LocationRouteTransportChoose = (props: LocationRouteChooseRouteEditProps) => {

    const [inHover, setInHover] = useState(false);

    const onMouseOver = () => {
        setInHover(true)
    };
    const onMouseOut = () => {
        setInHover(false)
    };
    const width = props.routeOrTransport === RouteOrTransport.Route ? '400px' : '200px';
    return (
        <Box sx={{m: '0.6em'}}>
            <Card sx={{
                width: width,
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
