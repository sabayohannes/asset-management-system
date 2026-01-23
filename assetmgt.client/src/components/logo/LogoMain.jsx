import { useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// project import - using an icon that represents assets/management
import DeploymentUnitOutlined from '@ant-design/icons/DeploymentUnitOutlined';

// ==============================|| LOGO SVG REPLACEMENT ||============================== //

export default function LogoMain() {
    const theme = useTheme();

    return (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pl: 0.5 }}>
            {/* Asset Icon */}
            <DeploymentUnitOutlined
                style={{
                    fontSize: '28px',
                    color: theme.palette.primary.main
                }}
            />

            {/* Logo Text */}
            <Stack>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        lineHeight: 1,
                        color: theme.palette.common.black,
                        letterSpacing: '0.5px'
                    }}
                >
                    ASSET
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 500,
                        color: theme.palette.secondary.main,
                        textTransform: 'uppercase',
                        fontSize: '0.65rem',
                        lineHeight: 1.5
                    }}
                >
                    Management System
                </Typography>
            </Stack>
        </Stack>
    );
}