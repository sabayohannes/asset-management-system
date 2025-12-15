import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';
import axios from 'axios';

export default function AssetForm({ token, asset, onSuccess, onClose }) {
    const [name, setName] = useState(asset?.name || '');
    const [category, setCategory] = useState(asset?.category || '');
    const [serialNumber, setSerialNumber] = useState(asset?.serialNumber || '');
    const [purchaseDate, setPurchaseDate] = useState(
        asset ? asset.purchaseDate.split('T')[0] : ''
    );
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (image) {
            // When selecting a new file
            const objectUrl = URL.createObjectURL(image);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }

        if (asset && asset.imageUrl) {
            console.log("Incoming asset image:", asset.imageUrl);

            // Always use full URL (because backend now returns absolute)
            setPreview(asset.imageUrl);
            return;
        }

        setPreview("");
    }, [image, asset]);




    useEffect(() => {
        console.log("Image URL:", asset?.imageUrl);
        console.log("Preview URL:", preview);
    }, [preview]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Category', category);
        formData.append('SerialNumber', serialNumber);
        formData.append('PurchaseDate', purchaseDate);
       
        if (image instanceof File)
            formData.append("Image", image);
        try {
            if (asset) {
               
                await axios.put(
                    `http://localhost:5001/api/assets/${asset.id}`,
                    
                        formData
                    , 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            
                        }
                    }
                );
            } else {
               
                await axios.post(
                    'http://localhost:5001/api/assets/assetregister',
                   
                        formData
                    ,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                            
                        }
                    }
                );
            }

            onSuccess(); // refresh parent component
            if (onClose) onClose(); // close modal if provided
        } catch (error) {
            console.error("Asset save error:", error);
        }
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Serial Number"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Purchase Date"
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />

                <Box mt={2}>
                    <Typography variant="body2">Asset Image</Typography>
                    {preview && (
                        <Box mb={1} mt={1}>
                            <img
                                src={preview}
                                alt="preview"
                                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                        </Box>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </Box>

                <Box mt={2} display="flex" gap={1}>
                    <Button type="submit" variant="contained" color="primary">
                        {asset ? 'Update Asset' : 'Add Asset'}
                    </Button>
                    {onClose && (
                        <Button variant="outlined" color="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                    )}
                </Box>
            </form>
        </Paper>
    );
}
