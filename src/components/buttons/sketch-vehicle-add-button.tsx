import React, {useState} from 'react'
import {Box} from '@mui/system';
import {Card} from '@mui/material';
import {Add} from '@mui/icons-material';


interface sketchVehicleAddButtonProps {

    sketchDriveClick: (event: React.MouseEvent<HTMLElement>) => void
}

export const SketchVehicleAddButton = (props: sketchVehicleAddButtonProps) => {


    const [inHover, setInHover] = useState(false);
    const onMouseOver = () => {
        setInHover(true)
    };
    const onMouseOut = () => {
        setInHover(false)
    };


    return (

        <Box>

            <Card onClick={(event: any) => props.sketchDriveClick(event)} onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut} elevation={inHover ? 8 : 2} sx={{
                m: '0.2em',
                mb: '0.3em',
                position: 'relative',

                zIndex: 40,
                minHeight: '7vh',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',

            }}>


                <Box sx={{
                    mt: '0.2em'
                }}
                > <Add fontSize={'large'}/> </Box>

            </Card>
        </Box>


    )

}
