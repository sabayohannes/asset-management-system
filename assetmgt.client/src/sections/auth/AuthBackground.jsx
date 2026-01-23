// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

import DeploymentUnitOutlined from '@ant-design/icons/DeploymentUnitOutlined';

export default function AuthBackground() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: 'absolute',
                zIndex: -1,
                bottom: -50,
                left: -50,
                opacity: 0.05, // Very faint so it doesn't distract
                transform: 'rotate(-15deg)',
                pointerEvents: 'none'
            }}
        >
            <DeploymentUnitOutlined
                style={{
                    fontSize: '600px',
                    color: theme.palette.primary.main
                }}
            />
        </Box>
    );
}