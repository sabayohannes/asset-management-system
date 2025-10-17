import React, { useState } from 'react'
import { Box, Button, Typography, TextField, Container } from '@mui/material'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const [form, setForm] = useState({
        "email": "",
        "password":""
    })
    const [token, setToken] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const handleChange = (e) => {
        setForm({...form,[e.target.name]:e.target.value })
}
const handleClick = async() => {
    try{
        const res = await axios.post('http://localhost:5001/api/auth/login', form)
        setToken(res.data.token)
        setError('')
        navigate("/AddAsset")
    } catch (err) {
        setError('invalid password or username')
        setToken('');
       
        console.log({ err })
        if (err.response && err.response.status === (401)) {
            setError('User not registered or invalid credentials');
            setToken('');
            navigate('/register');
        }
    }
}



    return (
        <Container maxWidth='sm'>
            <Box sx={{ mt: 10, boxShadow: 3, p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>Login</Typography>
                <TextField fullWidth
                    
                            label="Enter your Email"
                            name="email"
                    value={form.email}
                            onChange={handleChange}
                           
                                  />
                <TextField fullWidth
                    sx={{ mt: 2 }}
                    label='Password'
                    name="password"
                    value={form.password}
                    onChange={handleChange} />
                {error && <Typography color="error" variant="body2">{error}</Typography>}
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleClick}>Login</Button>
                {token && (
                    <Typography color="success.main" variant="body2" sx={{ mt: 2 }}>
                        Token: {token}
                    </Typography>
                )}
                <Typography >Dont have an account <span style={{ cursor: 'pointer', color:'blue',textDecoration:'underline' }} onClick={() => navigate('/register')}>Register here </span></Typography>
            </Box>
            </Container >
        
    )

}
export default LoginPage;