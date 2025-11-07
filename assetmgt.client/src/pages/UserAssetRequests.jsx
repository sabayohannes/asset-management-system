import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Box,
    Alert,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
} from "@mui/material";

const UserAssetRequests = () => {
    const [assets, setAssets] = useState([]);
    const [requests, setRequests] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState("");
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        console.log("UserAssetRequests rendered");
        fetchAvailableAssets();
        fetchMyRequests();
    }, []);

    const fetchAvailableAssets = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5001/api/assetrequests/available",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Available assets:", res.data);
            setAssets(res.data);
        } catch (err) {
            console.error("Error fetching assets:", err);
            setMessage("Failed to load assets");
        }
    };

    const fetchMyRequests = async () => {
        const userId = localStorage.getItem("userId")
      console.log(userId)
        try {
            const res = await axios.get(
                "http://localhost:5001/api/assetrequests/myrequests",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("My requests:", res.data);
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setMessage("Failed to load requests");
        }
    };

    const handleRequest = async () => {
        if (!selectedAsset) {
            setMessage("Please select an asset to request");
            return;
        }
        try {
            const res = await axios.post(
                "http://localhost:5001/api/assetrequests",
                { assetId: selectedAsset },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message || "Request sent successfully");
            fetchAvailableAssets();
            fetchMyRequests();
        } catch (err) {
            console.error("Error creating request:", err);
            setMessage(err.response?.data || "Error creating request");
        }
    };

    return (
        <Container sx={{ mt: 20 }}>
            <Typography variant="h4" gutterBottom>
                My Asset Requests
            </Typography>

            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

            {assets.length === 0 ? (
                <Typography>No assets available to request.</Typography>
            ) : (
                <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Asset</InputLabel>
                        <Select
                            value={selectedAsset}
                            label="Select Asset"
                            onChange={(e) => setSelectedAsset(e.target.value)}
                        >
                            {assets.map((a) => (
                                <MenuItem key={a.id} value={a.id}>
                                    {a.name} ({a.category})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleRequest}>
                        Request Asset
                    </Button>
                </Box>
            )}

            {requests.length === 0 ? (
                <Typography>No requests yet.</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Asset Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Request Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.asset?.name}</TableCell>
                                <TableCell>{r.status}</TableCell>
                                <TableCell>{new Date(r.requestDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Container>
    );
};

export default UserAssetRequests;
