import {Box, Fade} from '@mui/material';
import {SxProps} from '@mui/system';
import {LoadingShield} from './loading-shield';
import {useSelector} from 'react-redux';
import {SessionModel} from '../../store/store.types';

const loadingSx: SxProps = {
    position: 'absolute',
    top: '65px',
    left: '20px',
    height: '80px',
    width: '80px',
    zIndex: 10000
}


export const Loading = () => {

    const session: SessionModel = useSelector((state: { currentSessionState: SessionModel }) => state.currentSessionState);
    const isAnimationRunning = session?.isAnimationRunning || true
    return (
        <Fade in={isAnimationRunning} unmountOnExit>
            <Box sx={loadingSx}>
                <LoadingShield/>
            </Box>
        </Fade>

    )
}
