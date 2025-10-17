import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function AddAsset() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        serialNumber: '',
        purchaseDate: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                'http://localhost:5001/api/auth/assetregister', 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess('Asset added successfully!');
            setFormData({ name: '', category: '', serialNumber: '', purchaseDate: '' });
        } catch (err) {
            if (err.response && err.response.data) {
                setError(typeof err.response.data === 'string' ? err.response.data : 'Error occurred.');
            } else {
                setError('Failed to add asset.');
            }
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={5} backgroundColor="#f5f5f5">
            <Typography variant="h5" mb={3}>Add New Asset</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Serial Number"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Purchase Date"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                {error && <Typography color="error" mt={2}>{error}</Typography>}
                {success && <Typography color="primary" mt={2}>{success}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                    Add Asset
                </Button>
            </form>
        </Box>
    );
}
