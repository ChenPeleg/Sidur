import * as React from 'react';
import {translations} from '../../services/translations';
import {Box, Card, CardContent} from '@mui/material';


export const SketchNoSketchMessage = (props: any) => {

    return (
        <Box>
            <Card sx={{
                width: '300px',
                height: '150px',
                m: '3em'
            }}>
                <CardContent>
                    {translations.NoSketchMessage}
                </CardContent>
            </Card>

        </Box>
    );


}
