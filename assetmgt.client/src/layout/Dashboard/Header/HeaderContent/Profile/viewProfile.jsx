import { Box, Typography, Avatar, Stack, Chip, Divider } from '@mui/material';
import avatar1 from 'assets/images/users/avatar-1.png';
import axios from 'axios';
import { useEffect, useState } from 'react';
export default function ViewProfile() {
    const [user,setUser]=useState(null)
    //const user = JSON.parse(localStorage.getItem('user'));
    //if (!user) return <Typography sx={{ p: 3 }}>No user data found</Typography>;
    useEffect(() => {
        axios.get('http://localhost:5001/api/auth/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => setUser(res.data));
    }, []);
    if (!user) {
        return <Typography sx={{ p: 3 }}>Loading profile...</Typography>;
    }
    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={avatar1} sx={{ width: 64, height: 64 }} />
                <Stack spacing={0.5}>
                    <Typography variant="h5" fontWeight={600}>
                        {user.name || 'User'}
                    </Typography>
                    <Chip
                        label={user.role || 'Unknown'}
                        color={user.role === 'Admin' ? 'primary' : 'default'}
                        size="small"
                    />
                </Stack>
            </Stack>

            <Divider sx={{ width: '100%' }} />

            <Stack spacing={1}>
                <Typography variant="body1">
                    <strong>Email:</strong> {user.email || '-'}
                </Typography>
                <Typography variant="body1">
                    <strong>ID:</strong> {user.id}
                </Typography>
                {/* Add more fields if needed */}
            </Stack>
        </Box>
    );
}
