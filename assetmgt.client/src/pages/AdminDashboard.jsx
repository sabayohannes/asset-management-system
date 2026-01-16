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
    Grid,
    Paper,
    Tabs,
    Tab
} from "@mui/material";

function AdminDashboard() {
    const [tableIndex, setTabIndex] = useState(0);
    const [assets, setAssets] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchAsset();
    }, []);

    const fetchAsset = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/assets", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssets(res.data);
        } catch (err) {
            console.error("Error loading assets", err);
        }
    }

    const addAsset = () => {
        navigate('/AddAsset')
    }

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    }

    return (
        <Container sx={{ mt: 20 }}>
            <Button
                sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" }, mb: 2 }}
                onClick={addAsset}
            >
                Add new Asset
            </Button>

            <Tabs value={tableIndex} onChange={handleTabChange}>
                <Tab label="Assets" />
                <Tab label="Overview" />
            </Tabs>

            {tableIndex === 0 && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Asset Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assets.map((a) => (
                            <TableRow key={a.id}>
                                <TableCell>{a.name}</TableCell>
                                <TableCell>{a.category}</TableCell>
                                <TableCell>{a.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}


            {tableIndex === 1 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                            <Typography>Total Assets</Typography>
                            <Typography variant="h5">{assets.length}</Typography>
                        </Paper>
                    </Grid>
                    {/* Add more overview cards as needed */}
                </Grid>
            )}
        </Container>
    );
}

export default AdminDashboard;
