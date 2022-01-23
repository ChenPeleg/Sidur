import * as React from 'react';
import {translations} from '../../services/translations';
import {Box, Card, CardContent} from '@mui/material';
import {LockTwoTone} from '@mui/icons-material';
import {Styles} from '../../hoc/themes';


export const LocationCantEditMessage = () => {

    return (
        <Box>
            <Card sx={{
                width: '300px',
                height: '180px',
                p: '0.5em',
                m: '3em'
            }}>
                <Box sx={{
                    ...Styles.flexRow,
                    justifyContent: 'start',
                    alignItems: 'center',

                    m: '0.5em',
                    mb: '0.1em'
                }}>
                    <b> <LockTwoTone sx={{
                        mt: '0.4em',
                        mb: '0.2em'
                    }}/> </b>
                    <b>
                        &nbsp; {translations.lockedForEdit}
                    </b>
                </Box>
                <CardContent>

                    {translations.cantEditLocationMessag}
                </CardContent>
            </Card>

        </Box>
    );


}
