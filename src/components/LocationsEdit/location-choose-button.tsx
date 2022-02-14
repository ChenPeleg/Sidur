import {Box, Card} from '@mui/material';
import {LocationModel} from '../../models/Location.model';
import * as React from 'react';
import {useState} from 'react';
import {ConfigService} from '../../services/config-service';
import {Home} from '@mui/icons-material';

interface LocationFormProps extends LocationModel {
    onClick: (locationUpdate: LocationModel) => void,
}

export const LocationChooseButton = (props: LocationFormProps) => {

    const justLocationObject = {
        ...props,
        onClick: null
    }
    const [inHover, setInHover] = useState(false);
    const onMouseOver = () => {
        setInHover(true)
    };
    const onMouseOut = () => {
        setInHover(false)
    };
    const isHome: boolean = props.id === ConfigService.Constants.HomeLocationId

    return (

        <Box sx={{display: 'flex'}}>
            <Card sx={{
                m: '0.2em',
                mb: '0.3em',
                minWidth: '200px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'start',
                backgroundColor: inHover ? '#e7f2f7' : '',
            }} onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut} elevation={inHover ? 6 : 2} onClick={(_event) => props.onClick(justLocationObject)}>
                {isHome ? <Box sx={{
                    p: '0px',
                    display: 'inline-flex'
                }}> <Box id={'divider'} sx={{
                    'width': '20px',
                    'height': '20px'
                }}/> <Home sx={{
                    m: '0px',
                    p: 0,
                    mr: '-10px',
                    ml: '-10px'
                }}/></Box> : null}
                <Box id={'text-field-container'}
                     sx={{
                         m: '0.5em',
                         mr: '1em',
                         ml: '1em',
                     }
                     }>


                    {props.name}

                </Box>


            </Card>
        </Box>
    )
}
