import { useTheme } from '@mui/material/styles';
import DeploymentUnitOutlined from '@ant-design/icons/DeploymentUnitOutlined';

// ==============================|| MINI LOGO ICON ||============================== //

export default function LogoIcon() {
    const theme = useTheme();

    return (
        /** * This icon will now show when the sidebar is collapsed
         * or in the top bar on mobile.
         */
        <DeploymentUnitOutlined
            style={{
                fontSize: '28px',
                color: theme.palette.primary.main
            }}
        />
    );
}