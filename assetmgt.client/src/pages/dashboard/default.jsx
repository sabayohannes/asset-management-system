import { useState, useEffect } from 'react';
import  axios  from 'axios';
// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import LinearProgress from '@mui/material/LinearProgress';
import CircleIcon from '@mui/icons-material/Circle';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import AssetReportCard from 'sections/dashboard/default/AssetReportCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';

// assets
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import AssetForm from '../../sections/dashboard/default/AssetForm';
//import axios from '../../../../../../../node_modules/axios/index';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);
  const [analyticsMenuAnchor, setAnalyticsMenuAnchor] = useState(null);
    const [assets, setAssets] = useState([])
    const [openFormModal, setOpenFormModal] = useState(false);
    const [assetRequests, setAssetRequests] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [assetMenuAnchor, setAssetMenuAnchor] = useState(null);
    const [menuAssetId, setMenuAssetId] = useState(null);
    const handleDelete = async (assetId) => {
        const token = localStorage.getItem('token'); // get your token
        try {
            await axios.delete(`http://localhost:5001/api/assets/${assetId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAssets(); // refresh asset list after deletion
        } catch (err) {
            console.error('Error deleting asset:', err);
        }
    };


    const token = localStorage.getItem("token");
    const handleOpenForm = () => {
        setSelectedAsset(null); 
        setOpenFormModal(true);
    };
    const handleCloseForm = () => {
        setOpenFormModal(false)
        setAssetMenuAnchor(null);
        setMenuAssetId(null);
        setSelectedAsset(null);
    };

    const assetRequestsPerMonth = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return months.map((month, index) => {
            const monthNumber = index;

            // Match the logic: only process if purchaseDate exists
            const monthlyTotal = assets.filter(asset => {
                if (!asset.purchaseDate) return false;
                const date = new Date(asset.purchaseDate);
                return !isNaN(date) && date.getMonth() === monthNumber;
            }).length;

            // Apply similar logic for approved/pending
            const approved = assets.filter(asset =>
                asset.purchaseDate &&
                new Date(asset.purchaseDate).getMonth() === monthNumber &&
                asset.status === 'Approved'
            ).length;

            return { name: month, total: monthlyTotal, approved, pending: monthlyTotal - approved };
        });
    };


    const totalAssets = assets.length;
    const currentYear = new Date().getFullYear();
    const assetsAddedThisYear = assets.filter(asset => new Date(asset.purchaseDate).getFullYear() === currentYear).length;
    const availableAssets = assets.filter(asset => asset.status === 'Available').length;
    const pendingAssets = assets.filter(asset => asset.status === 'Pending').length;
    const approvedAssets = assetRequests.filter(asset => asset.status === 'Approved').length;
    const rejectedAssets = assetRequests.filter(asset => asset.status === 'Rejected').length;
    const fetchAssetRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/assetrequests/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssetRequests(response.data);
        } catch (err) {
            console.error('Error fetching asset requests:', err);
        }
    };

    useEffect(() => {
        fetchAssetRequests();
    }, []);
    console.log(assets);
        const fetchAssets = async () => {
            try {
                const token = localStorage.getItem('token')
console.log(localStorage.getItem('token'))
                const response = await axios.get('http://localhost:5001/api/assets',{
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAssets(response.data)
            } catch (err) {
                console.error('Error fetching assets:',err)
            }
    }
    useEffect(() => {
        fetchAssets();
    }, [])
        
  const handleOrderMenuClick = (event) => {
    setOrderMenuAnchor(event.currentTarget);
  };
  const handleOrderMenuClose = () => {
    setOrderMenuAnchor(null);
  };

  const handleAnalyticsMenuClick = (event) => {
    setAnalyticsMenuAnchor(event.currentTarget);
  };
  const handleAnalyticsMenuClose = () => {
    setAnalyticsMenuAnchor(null);
  };
    const monthlyData = assetRequestsPerMonth();
    return (
      <>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}
                >
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Well come Admin </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Box
                        sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0px 8px 20px rgba(0,0,0,0.15)',
                                cursor: 'pointer'
                            }
                        }}
                    >
              <AnalyticEcommerce
                  title="Total Assets"
                  count={totalAssets}
                        />
                   </Box>
      </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Box
                        sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0px 8px 20px rgba(0,0,0,0.15)',
                                cursor: 'pointer'
                            }
                        }}
                    >
              <AnalyticEcommerce
                  title="AvailableAssets"
                            count={availableAssets}
                            percentage={totalAssets
                                ? ((availableAssets / totalAssets) * 100).toFixed(1)
                                : 0}
                  
                        />
              </Box>
      </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Box
                        sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0px 8px 20px rgba(0,0,0,0.15)',
                                cursor: 'pointer'
                            }
                        }}
                    >
              <AnalyticEcommerce
                  title="Approved Assets"
                  count={approvedAssets}
                            percentage={totalAssets
                                ? ((approvedAssets / totalAssets) * 100).toFixed(1)
                                : 0}
                  extra={`${pendingAssets} pending`}
                        />
                    </Box>
      </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Box
                        sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0px 8px 20px rgba(0,0,0,0.15)',
                                cursor: 'pointer'
                            }
                        }}
                    >
                        <AnalyticEcommerce title="Rejected Assets"
                            count={rejectedAssets}
                            percentage={totalAssets
                                ? ((rejectedAssets / totalAssets) * 100).toFixed(1)
                                : 0}
                           />
        </Box>
                </Grid>
      
                        
                 
</Grid>

      
      {/* row 3 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                <AssetReportCard
                    data={monthlyData}
                    total={totalAssets}
                />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Asset Request History</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
                    <List component="nav" sx={{ /* your existing styles */ }}>
                        {assetRequests.slice(0, 5).map((request, index) => (
                            <ListItem
                                key={request._id || index}
                                component={ListItemButton}
                                divider={index !== assetRequests.slice(0, 5).length - 1}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{
                                        color: request.status === 'Approved' ? 'success.main' : 'warning.main',
                                        bgcolor: request.status === 'Approved' ? 'success.lighter' : 'warning.lighter'
                                    }}>
                                        {request.status === 'Approved' ? <GiftOutlined /> : <MessageOutlined />}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography variant="subtitle1">{request.assetName || 'New Request'}</Typography>}
                                    secondary={
                                        request.requestDate // Use your specific date field (createdAt or purchaseDate)
                                            ? new Date(request.requestDate).toLocaleDateString()
                                            : '-'
                                    }
                                />
                                <Stack sx={{ alignItems: 'flex-end' }}>
                                    <Typography variant="subtitle1" color={request.status === 'Rejected' ? 'error' : 'inherit'}>
                                        {request.status}
                                    </Typography>
                                </Stack>
                            </ListItem>
                        ))}
                        {assetRequests.length === 0 && (
                            <ListItem><ListItemText primary="No recent updates" /></ListItem>
                        )}
                    </List>
        </MainCard>
                <MainCard sx={{ mt: 2 }}>
                    <Stack sx={{ gap: 2 }}>
                        <Typography variant="h5">Quick Actions</Typography>
                        <Button
                            variant="contained"
                            startIcon={<PlusOutlined />}
                            onClick={handleOpenForm} // Use your existing form opener
                            fullWidth
                        >
                            Add New Asset
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={() => window.print()}
                        >
                            Export Asset Inventory
                        </Button>
                    </Stack>
                </MainCard>
      </Grid>

            


    </>
  );
}
