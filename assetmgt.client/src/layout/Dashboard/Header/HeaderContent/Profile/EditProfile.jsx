import { useState,useEffect } from 'react';
import { Box, Button, TextField, Typography, Stack } from '@mui/material'; 
import axios from 'axios'
export default function EditProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5001/api/auth/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            setName(res.data.name);
            setEmail(res.data.email);
        });
    }, []);
    const handleSave = async () => {
        try {
            setLoading(true);
            setMessage('');

            await axios.put(
                'http://localhost:5001/api/auth/edit',
                { name, email },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setMessage('Profile updated successfully ✅');
        } catch (err) {
            setMessage(err.response?.data || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 400 }}>
            <Typography variant="h5" gutterBottom>
                Edit Profile
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                >
                    Save
                </Button>

                {message && (
                    <Typography variant="body2" color="primary">
                        {message}
                    </Typography>
                )}
            </Stack>
        </Box>
    );
}
