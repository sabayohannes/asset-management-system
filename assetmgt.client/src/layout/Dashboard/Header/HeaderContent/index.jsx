// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'

// project imports
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// project import
import { GithubOutlined } from '@ant-design/icons';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
    const role = localStorage.getItem("role");
  
  return (
    <>

      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
          <Box sx={{ color: '#1890FF', whiteSpace: 'nowrap' }}>
              Logged as {role === "Admin" ? "Admin" : localStorage.getItem("email")}

          </Box>

      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
