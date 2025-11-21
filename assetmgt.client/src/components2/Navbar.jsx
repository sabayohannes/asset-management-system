import { React, useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Avatar, Button, Box } from '@mui/material'

import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();
    const [role, setRole] = useState(null)
    const [token, setToken] = useState(null)
    const location = useLocation();
    
    useEffect(() => {
        const handleStoragechange = () => {
            setRole(localStorage.getItem("role"))
            setToken(localStorage.getItem("token"))

        };
        window.addEventListener('storage', handleStoragechange)
        handleStoragechange();
        return () => {
            window.removeEventListener('storage', handleStoragechange)
        }
    }, [location])
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        navigate("/")
        setRole(null)
    }
    return (
        <AppBar position="fixed"
            elevation={0}
            sx={{ backgroundColor: "rgba(255,255,255,0.8" ,
            color:"#0d47a1",
            borderBottom: "1px solid rgba(0,0,0,0.1)"}}
        >
            <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                    src="/logo.png" // or your logo URL
                    alt="Company Logo"
                    sx={{ width: 48, height: 48 }}
                />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}> Employee Asset Management System </Typography>
                </Box>
                <Box>
                    {role === "Admin" && (
                        <>
                            <Button color="inherit" onClick={() => navigate("/admindashboard")}>Admindashboard</Button>
                            <Button color="inherit" onClick={() => navigate("/AddAsset")}>Add Asset</Button>
                        </>
                    )} {role === "User" && (
                    <>
                                <Button color="inherit" onClick={() => navigate('/assetrequest')}>My requests</Button>
                                <Button color="inherit" onClick={() => navigate("/assetrequest") }>RequestAsset</Button>
                            </>)}
                    {token && (<Button color="inherit" onClick={handleLogout}>Logout</Button>)}
                </Box>
            </Toolbar>
        </AppBar>
  );
}

export default Navbar;