import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Alert,
    Tabs,
    Tab,Grid,Paper
} from "@mui/material";

function AdminDashboard() {
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState("");
    const [tableIndex, setTabIndex] = useState(0);
    const [assets, setAssets] = useState([])
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchRequests();
        fetchAsset();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/assetrequests/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(res.data);
        } catch (err) {
            console.error("Error loading requests:", err);
            setMessage("Failed to load requests");
        }
    };

    const handleApprove = async (id) => {
        try {
            const res = await axios.post(
                `http://localhost:5001/api/assetrequests/requests/${id}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            fetchRequests();
        } catch (err) {
            console.error("Approve error:", err);
            setMessage("Failed to approve request");
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await axios.post(
                `http://localhost:5001/api/assetrequests/requests/${id}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            fetchRequests();
        } catch (err) {
            console.error("Reject error:", err);
            setMessage("Failed to reject request");
        }
    };
    const addasset = () => {
        navigate('/AddAsset')
    }
    const handleTabChange = (event,newValue) => {
        setTabIndex(newValue)
    }
    const fetchAsset = async() => {
        try {

            const res = await axios.get("http://localhost:5001/api/assets", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
                setAssets(res.data)
            

        } catch (err) {
            console.error("Error loading assets", err);
            setMessage("failed to load asset");
        }
    }
    return (
        <Container sx={{ mt: 20 }}>
            
            <Typography variant="h4" gutterBottom sx={{fontStyle:'italic'} }>
                Requests for asset
            </Typography>

            {message && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}

            {requests.length === 0 ? (
                <Typography>No asset requests found</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Request ID</TableCell>
                            <TableCell>Asset Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Request Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {requests.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.id}</TableCell>
                                <TableCell>{r.asset?.name}</TableCell>
                                <TableCell>{r.asset?.category}</TableCell>
                                <TableCell>{r.status}</TableCell>
                                <TableCell>
                                    {new Date(r.requestDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {r.status === "Pending" ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleApprove(r.id)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{ ml: 1 }}
                                                onClick={() => handleReject(r.id)}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography>{r.status}</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
                <Button sx={{
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#115293" },
                }} onClick={() => addasset()}>Add new Asset</Button>
            <Tabs
                value={tableIndex}
                onChange={handleTabChange}
                sx={{
                    borderBottom: 1,
                  
                    mb: 3,
                    "& .Mui-selected": {
                        fontWeight: "bold",
                        textDecoration: "underline",
                        textUnderlineOffset: "6px"
                    },
                }
            }            >
                <Tab label="overView on asset" />
                <Tab label="open assets" /></Tabs>
            {tableIndex === 0 && (
                <div>
                    <Typography variant="h6" gutterBottom>
                        Asset Overview
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: 2, textAlign: "center" }}>
                                <Typography>Total Assets</Typography>
                                <Typography variant="h5">{assets.length}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: 2, textAlign: "center" }}>
                                <Typography>Pending Requests</Typography>
                                <Typography variant="h5">{requests.filter(r => r.status === 'Pending').length}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: 2, textAlign: "center" }}>
                                <Typography>Approved Requests</Typography>
                                <Typography variant="h5">{requests.filter(r => r.status === 'Approved').length}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: 2, textAlign: "center" }}>
                                <Typography>Rejected Requests</Typography>
                                <Typography variant="h5">{requests.filter(r => r.status === 'Rejected').length}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            )}


            {tableIndex === 1 && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Asset Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.asset?.name}</TableCell>
                                <TableCell>{r.asset?.category}</TableCell>
                                <TableCell>{r.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Container>
    );
}

export default AdminDashboard;
