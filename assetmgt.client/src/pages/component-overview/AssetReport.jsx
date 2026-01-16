// AssetReport.jsx
import { useState, useEffect } from "react";
import { Container, Typography, List, ListItemButton, ListItemText } from "@mui/material";
import ReportAreaChart from "sections/dashboard/default/ReportAreaChart";
import axios from "axios";
import MainCard from "components/MainCard";

export default function AssetReport() {
    const [analyticsMenuAnchor, setAnalyticsMenuAnchor] = useState(null);
    const [assets, setAssets] = useState([])
    const [assetRequests, setAssetRequests] = useState([]);
    const handleAnalyticsMenuClick = (e) => setAnalyticsMenuAnchor(e.currentTarget);
    const handleAnalyticsMenuClose = () => setAnalyticsMenuAnchor(null);
   
   
    const fetchAssets = async () => {
        try {
            const token = localStorage.getItem('token')
            console.log(localStorage.getItem('token'))
            const response = await axios.get('http://localhost:5001/api/assets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssets(response.data)
        } catch (err) {
            console.error('Error fetching assets:', err)
        }
    }
    useEffect(() => {
        fetchAssets();
    }, [])
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
    const assetRequestsPerMonth = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.map((month, i) => {
            const total = assetRequests.filter(r => new Date(r.requestDate).getMonth() === i).length;
            const approved = assetRequests.filter(r => new Date(r.requestDate).getMonth() === i && r.status === "Approved").length;
            const pending = assetRequests.filter(r => new Date(r.requestDate).getMonth() === i && r.status === "Pending").length;
            return { name: month, total, approved, pending };
        });
    };

    const totalAssets = assets.length;
    const availableAssets = assets.filter(a => a.status === "Available").length;
    const approvedAssets = assetRequests.filter(r => r.status === "Approved").length;
    const assetsAddedThisYear = assets.filter(a => new Date(a.purchaseDate).getFullYear() === new Date().getFullYear()).length;

    return (
        <Container sx={{ mt: 4 }}
        >
            <Typography variant="h5">Asset Report</Typography>
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
        </Container>
    );
}
