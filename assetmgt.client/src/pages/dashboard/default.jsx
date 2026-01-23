import { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
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
import ButtonBase from '@mui/material/ButtonBase'
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
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
import DeploymentUnitOutlined from '@ant-design/icons/DeploymentUnitOutlined';
import { CloseCircleOutlined } from '@ant-design/icons';
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
    const navigate=useNavigate();
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
    const exportToCSV = () => {
        // 1. Define the headers you want
        const headers = ['Asset Name', 'Category', 'Status', 'Purchase Date', 'Value'];

        // 2. Map your data to match the headers
        const rows = assets.map(asset => [
            `"${asset.name || asset.assetName}"`,
            `"${asset.category}"`,
            `"${asset.status}"`,
            `"${new Date(asset.purchaseDate).toLocaleDateString()}"`,
            `"${asset.value || 0}"`
        ]);

        // 3. Combine headers and rows
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

        // 4. Create a download link and click it automatically
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Asset_Inventory_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    <MainCard
                        content={false}
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            bgcolor: '#00c0ef', // Total Assets Blue
                            color: '#fff',
                            height: '126px',
                            border: 'none',
                            borderRadius: '16px', // Nice, modern rounded corners
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            '&:hover .watermark-icon': {
                                transform: 'translateY(6px) scale(1.15)',
                                opacity: 0.25
                            }
                        }}
                    >
                        {/* Watermark */}
                        <Box className="watermark-icon" sx={{
                            position: 'absolute', top: '8px', right: '12px', fontSize: '55px',
                            color: '#000', opacity: 0.12, transition: 'all 0.3s ease-in-out', zIndex: 0
                        }}>
                            <GiftOutlined />
                        </Box>

                        {/* Content */}
                        <Box sx={{ p: 2.25, position: 'relative', zIndex: 1 }}>
                            <Typography variant="h3" color="inherit" sx={{ fontWeight: 700 }}>{totalAssets}</Typography>
                            <Typography variant="subtitle1" color="inherit" sx={{ fontWeight: 500, opacity: 0.9 }}>Total Assets</Typography>
                        </Box>

                        {/* More Info Button - Curved to match the card */}
                        <ButtonBase onClick={() => navigate('/AssetReview')} sx={{
                            width: '100%', py: 0.8, position: 'absolute', bottom: 0,
                            bgcolor: 'rgba(0,0,0,0.12)', zIndex: 2,
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.22)' }
                        }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: 'center', width: '100%' }}>
                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>view all</Typography>
                                <ArrowRightOutlined style={{ fontSize: '10px', color: '#fff' }} />
                            </Stack>
                        </ButtonBase>
                    </MainCard>
                </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <MainCard
                        content={false}
                        sx={{
                            position: 'relative', overflow: 'hidden', bgcolor: '#00a65a', color: '#fff',
                            height: '126px', border: 'none', borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            '&:hover .watermark-icon': { transform: 'translateY(6px) scale(1.15)', opacity: 0.25 }
                        }}
                    >
                        <Box className="watermark-icon" sx={{ position: 'absolute', top: '8px', right: '12px', fontSize: '55px', color: '#000', opacity: 0.12, transition: '0.3s', zIndex: 0 }}>
                            <SettingOutlined />
                        </Box>
                        <Box sx={{ p: 2.25, position: 'relative', zIndex: 1 }}>
                            <Typography variant="h3" color="inherit" sx={{ fontWeight: 700 }}>{availableAssets}</Typography>
                            <Typography variant="subtitle1" color="inherit" sx={{ fontWeight: 500, opacity: 0.9 }}>Available Assets</Typography>
                        </Box>
                        <ButtonBase onClick={() => navigate('/AssetReview')} sx={{ width: '100%', py: 0.8, position: 'absolute', bottom: 0, bgcolor: 'rgba(0,0,0,0.12)', zIndex: 2, '&:hover': { bgcolor: 'rgba(0,0,0,0.22)' } }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: 'center', width: '100%' }}>
                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>view all</Typography>
                                <ArrowRightOutlined style={{ fontSize: '10px' }} />
                            </Stack>
                        </ButtonBase>
                    </MainCard>
                </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <MainCard
                        content={false}
                        sx={{
                            position: 'relative', overflow: 'hidden', bgcolor: '#f39c12', color: '#fff',
                            height: '126px', border: 'none', borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            '&:hover .watermark-icon': { transform: 'translateY(6px) scale(1.15)', opacity: 0.25 }
                        }}
                    >
                        <Box className="watermark-icon" sx={{ position: 'absolute', top: '8px', right: '12px', fontSize: '55px', color: '#000', opacity: 0.12, transition: '0.3s', zIndex: 0 }}>
                            <MessageOutlined />
                        </Box>
                        <Box sx={{ p: 2.25, position: 'relative', zIndex: 1 }}>
                            <Typography variant="h3" color="inherit" sx={{ fontWeight: 700 }}>{approvedAssets}</Typography>
                            <Typography variant="subtitle1" color="inherit" sx={{ fontWeight: 500, opacity: 0.9 }}>Approved Assets</Typography>
                        </Box>
                        <ButtonBase onClick={() => navigate('/AssetReview')} sx={{ width: '100%', py: 0.8, position: 'absolute', bottom: 0, bgcolor: 'rgba(0,0,0,0.12)', zIndex: 2, '&:hover': { bgcolor: 'rgba(0,0,0,0.22)' } }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: 'center', width: '100%' }}>
                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>view all</Typography>
                                <ArrowRightOutlined style={{ fontSize: '10px' }} />
                            </Stack>
                        </ButtonBase>
                    </MainCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                   
                        <MainCard
                            content={false}
                            sx={{
                                position: 'relative', overflow: 'hidden', bgcolor: '#dd4b39', color: '#fff',
                                height: '126px', border: 'none', borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                '&:hover .watermark-icon': { transform: 'translateY(6px) scale(1.15)', opacity: 0.25 }
                            }}
                        >
                            <Box className="watermark-icon" sx={{ position: 'absolute', top: '8px', right: '12px', fontSize: '55px', color: '#000', opacity: 0.12, transition: '0.3s', zIndex: 0 }}>
                                <CloseCircleOutlined />
                            </Box>
                            <Box sx={{ p: 2.25, position: 'relative', zIndex: 1 }}>
                                <Typography variant="h3" color="inherit" sx={{ fontWeight: 700 }}>{rejectedAssets}</Typography>
                                <Typography variant="subtitle1" color="inherit" sx={{ fontWeight: 500, opacity: 0.9 }}>Rejected Assets</Typography>
                            </Box>
                            <ButtonBase onClick={() => navigate('/AssetReview')} sx={{ width: '100%', py: 0.8, position: 'absolute', bottom: 0, bgcolor: 'rgba(0,0,0,0.12)', zIndex: 2, '&:hover': { bgcolor: 'rgba(0,0,0,0.22)' } }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: 'center', width: '100%' }}>
                                    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>view all</Typography>
                                    <ArrowRightOutlined style={{ fontSize: '10px' }} />
                                </Stack>
                            </ButtonBase>
                        </MainCard>
                  
                </Grid>
      
            
   </Grid>

      
            {/* row 2 */}
            <Grid item xs={12} sx={{ mt: 3 }}>
                <MainCard
                    content={false}
                    sx={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        width: '100%'
                    }}
                >
                    {/* Added alignItems="stretch" here to ensure both sides have equal height */}
                    <Grid container alignItems="stretch">

                        {/* LEFT SIDE: Branding */}
                        <Grid
                            item
                            xs={12}
                            md={6} // Explicitly 6 out of 12 columns
                            sx={{
                                background: 'linear-gradient(135deg, #00c0ef 0%, #0073b7 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent:'flex-start',
                                p: 7,
                                color: '#fff',
                                position: 'relative',
                                overflow: 'hidden',
                                minHeight: '500px' // Ensures a consistent base height
                            }}
                        >
                            {/* Decorative Elements */}
                            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />

                            <Box sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                p: 3,
                                borderRadius: '24px',
                                backdropFilter: 'blur(10px)',
                                mb: 3,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}>
                                <DeploymentUnitOutlined style={{ fontSize: '60px', color: '#fff' }} />
                            </Box>

                            <Typography variant="h2" sx={{ fontWeight: 800, textAlign: 'center', lineHeight: 1.1, letterSpacing: '-1px' }}>
                                ASSET <br /> MANAGEMENT
                            </Typography>

                            <Box sx={{ mt: 3, px: 3, py: 0.7, bgcolor: 'rgba(0,0,0,0.15)', borderRadius: '30px' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    System Analytics
                                </Typography>
                            </Box>
                        </Grid>

                        {/* RIGHT SIDE: Report Chart */}
                        <Grid
                            item
                            xs={12}
                            md={6} // Explicitly 6 out of 12 columns
                            sx={{
                                p: { xs: 3, md: 6 },
                                bgcolor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                // This ensures it fills the 50% height if the left side is taller
                                flexGrow: 1
                            }}
                        >
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>Request Performance</Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Monthly overview of asset distribution and approval rates.
                                </Typography>
                            </Box>

                            <Box sx={{ 
        flexGrow: 1, 
        width: '100%', 
        mt: -1, // Negative margin pulls the chart UP towards the title
        display: 'flex',
        flexDirection: 'column',
        '& .apexcharts-canvas': { margin: '0 auto' } // Centers the chart if needed
    }}>
                                <AssetReportCard data={monthlyData} total={totalAssets} />
                            </Box>
                        </Grid>
                    </Grid>
                </MainCard>
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
                            onClick={() => navigate('/assets/new')}
                            fullWidth
                        >
                            Add New Asset
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={exportToCSV}
                        >
                            Export Asset Inventory
                        </Button>
                    </Stack>
                </MainCard>
      </Grid>

            


    </>
  );
}
