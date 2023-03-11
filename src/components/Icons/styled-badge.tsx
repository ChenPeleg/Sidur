import {styled} from '@mui/system';
import {Badge, BadgeProps} from '@mui/material';

export const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 7,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));
