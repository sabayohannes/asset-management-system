import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssetForm from "../../../../sections/dashboard/default/AssetForm";


export default function AssetDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [asset, setAsset] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // toggle form

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (id === "new") return;
        const fetchAsset = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/assets/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAsset(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAsset();
    }, [id, token]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await axios.delete(`http://localhost:5001/api/assets/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate('/dashboard'); // redirect after deletion
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (!asset) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ p: 4 }}>
            {/* Top Row: Back + Edit/Delete */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </Box>
            </Box>

            {/* Asset Details */}
            {!isEditing ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'flex-start',
                        gap: 4
                    }}
                >
                    <Box
                        component="img"
                        src={asset.imageUrl}
                        alt={asset.name}
                        sx={{
                            width: { xs: '100%', md: 300 },
                            height: 'auto',
                            borderRadius: 2,
                            objectFit: 'cover'
                        }}
                    />

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" gutterBottom>
                            {asset.name}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Category: {asset.category}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Serial Number: {asset.serialNumber}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Purchase Date: {new Date(asset.purchaseDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Status: {asset.status}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <AssetForm
                    token={token}
                    asset={asset}
                    onSuccess={() => {
                        // Refresh asset details after editing
                        axios
                            .get(`http://localhost:5001/api/assets/${id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            })
                            .then((res) => setAsset(res.data));
                        setIsEditing(false);
                    }}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </Box>
    );
}
