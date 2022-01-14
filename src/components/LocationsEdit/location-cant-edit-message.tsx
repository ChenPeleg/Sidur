import * as React from 'react';
import {translations} from '../../services/translations';
import {Box, Card, CardContent, CardHeader} from '@mui/material';
import {LockTwoTone} from '@mui/icons-material';


export const LocationCantEditMessage = (props: any) => {

    return (
        <Box>
            <Card sx={{
                width: '300px',
                height: '150px',
                m: '3em'
            }}>
                <CardContent>
                    <CardHeader><LockTwoTone/> {translations.lockedForEdit} </CardHeader>
                    {translations.cantEditLocationMessag}
                </CardContent>
            </Card>

        </Box>
    );


}
