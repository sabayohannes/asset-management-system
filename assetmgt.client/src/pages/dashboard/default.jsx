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

import LinearProgress from '@mui/material/LinearProgress';
import CircleIcon from '@mui/icons-material/Circle';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import SaleReportCard from 'sections/dashboard/default/SaleReportCard';
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
    const handleCloseForm = () => setOpenFormModal(false);

    const assetRequestsPerMonth = () => {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const monthlyData = months.map((month, index) => {
            const monthNumber = index; // 0 = Jan
            const total = assets.filter(asset => new Date(asset.purchaseDate).getMonth() === monthNumber).length;
            const approved = assets.filter(
                asset => new Date(asset.purchaseDate).getMonth() === monthNumber && asset.status === 'Approved'
            ).length;
            const pending = assets.filter(
                asset => new Date(asset.purchaseDate).getMonth() === monthNumber && asset.status === 'Pending'
            ).length;

            return { name: month, total, approved, pending };
        });

        return monthlyData;
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

    return (
      <>
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
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
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
          {/* row 2 */}
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Grid>
                      <Typography variant="h5">Assets Requests</Typography>
                  </Grid>
                  <Grid>
                      <IconButton onClick={handleOrderMenuClick}>
                          <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
                      </IconButton>
                      <Menu
                          id="fade-menu"
                          slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
                          anchorEl={orderMenuAnchor}
                          onClose={handleOrderMenuClose}
                          open={Boolean(orderMenuAnchor)}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                          <MenuItem onClick={handleOrderMenuClose}>Export as CSV</MenuItem>
                          <MenuItem onClick={handleOrderMenuClose}>Export as Excel</MenuItem>
                          <MenuItem onClick={handleOrderMenuClose}>Print Table</MenuItem>
                      </Menu>
                  </Grid>
              </Grid>
              <MainCard sx={{ mt: 1 }} content={false}>
                  <OrdersTable />
              </MainCard>
          </Grid>
      
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                    <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Grid>
                            <Typography variant="h5">
                                {openFormModal ? (selectedAsset ? "Edit Asset" : "Add Asset") : "Assets Overview"}
                            </Typography>
                        </Grid>
                        <Grid>
                            {!openFormModal && (
                                <Button variant="contained" onClick={handleOpenForm}>
                                    Add Asset
                                </Button>
                            )}
                        </Grid>
                    </Grid>

                    {/* IF form is open, show form ONLY here */}
                    {openFormModal ? (
                        <Box sx={{ mt: 2 }}>
                            <AssetForm
                                token={localStorage.getItem("token")}
                                asset={selectedAsset}
                                onSuccess={() => {
                                    fetchAssets();
                                    setOpenFormModal(false);
                                }}
                                onClose={() => setOpenFormModal(false)}
                            />
                        </Box>
                    ) : (
                        /* Otherwise show Assets Overview */
                        <MainCard sx={{ mt: 2, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                All Assets
                            </Typography>
                                {assets.map((a) => (
                                    <Box
                                        key={a.id}
                                        sx={{
                                            p: 1,
                                            borderBottom: '1px solid #eee',
                                            display: "flex",
                                            gap: 2
                                        }}
                                    >
                                        {/* Asset Image */}
                                        console.log(a.imageUrl)
                                        <img
                                            src={a.imageUrl}
                                            alt={a.name}
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                borderRadius: "6px",
                                                objectFit: "cover",
                                                border: "1px solid #ddd"
                                            }}
                                        />

                                        {/* Asset Details (WRAPPED CORRECTLY) */}
                                        <Box sx={{ flex: 1 }}>
                                            <Typography><b>{a.name}</b></Typography>
                                            <Typography variant="body2">Category: {a.category}</Typography>
                                            <Typography variant="body2">Serial: {a.serialNumber}</Typography>
                                            <Typography variant="body2">Status: {a.status}</Typography>

                                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setSelectedAsset(a);
                                                        setOpenFormModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleDelete(a.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}

                        </MainCard>
                    )}
</Grid>

      {/* row 3 */}
        
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Asset Report</Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleAnalyticsMenuClick}>
              <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
            </IconButton>
            <Menu
              id="fade-menu"
              slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
              anchorEl={analyticsMenuAnchor}
              open={Boolean(analyticsMenuAnchor)}
              onClose={handleAnalyticsMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleAnalyticsMenuClose}>Weekly</MenuItem>
              <MenuItem onClick={handleAnalyticsMenuClose}>Monthly</MenuItem>
              <MenuItem onClick={handleAnalyticsMenuClose}>Yearly</MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
                      <ListItemButton divider>
                          <ListItemText primary="Total Assets" />
                          <Typography variant="h5">{totalAssets}</Typography>
                      </ListItemButton>
                      <ListItemButton divider>
                          <ListItemText primary="Available Assets" />
                          <Typography variant="h5">{availableAssets}</Typography>
                      </ListItemButton>
                      <ListItemButton divider>
                          <ListItemText primary="Approved Assets" />
                          <Typography variant="h5">{approvedAssets}</Typography>
                      </ListItemButton>
                      <ListItemButton>
                          <ListItemText primary="Assets Added This Year" />
                          <Typography variant="h5">{assetsAddedThisYear}</Typography>
                      </ListItemButton>

          </List>
                  <ReportAreaChart chartData={assetRequestsPerMonth()} />
        </MainCard>
      </Grid>
      {/* row 4 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <SaleReportCard />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Transaction History</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
                  <List

            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                px: 2,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    78%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
            </ListItem>
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
            </ListItem>
            <ListItem
              component={ListItemButton}
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
            </ListItem>
          </List>
        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack sx={{ gap: 3 }}>
            <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Grid>



                <Stack>
                  <Typography variant="h5" noWrap>
                    Help & Support Chat
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Typical replay within 5 min
                  </Typography>
                </Stack>
              </Grid>
              <Grid>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Need Help?
            </Button>
          </Stack>
        </MainCard>
      </Grid>
      </Grid>
            


    </>
  );
}
