import React, { useState } from 'react'
import { Box, Button, Typography, TextField, Container, MenuItem, InputLabel, Select, FormControl } from '@mui/material'
import axios from 'axios'



const RegisterPage = () => {
    const [form, setForm] = useState({
        "email": "",
        "password": "",
        "role":""
    })
    const [token, setToken] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const handleClick = async () => {
        try {
            const res = await axios.post('http://localhost:5001/api/auth/register', form)
            setToken(res.data.token)
            setError('')
        } catch (err) {
        
            setToken('');
            if (err.response) {
                console.log('Backend Response:', err.response.data);
                setError(err.response.data?.message || 'Registration failed');
            } else {
                console.error('Unknown error:', err);
                setError('An unknown error occurred');
            }
        }
    }



    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}
        >
            <Container maxWidth='sm'>
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        boxShadow: 4,
                        borderRadius: 3,
                        p: 4,
                        backdropFilter: 'blur(5px)',
                    }}
                >
                    <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
                        Register
                    </Typography>

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            value={form.role}
                            name="role"
                            label="Role"
                            onChange={handleChange}
                            labelId="role-label"
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="User">User</MenuItem>
                        </Select>
                    </FormControl>

                    {error && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleClick}
                        sx={{ py: 1.5, fontWeight: 'bold' }}
                    >
                        Register
                    </Button>

                    {token && (
                        <Typography color="success.main" variant="body2" sx={{ mt: 2 }}>
                            Token: {token}
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    )
}

export default RegisterPage