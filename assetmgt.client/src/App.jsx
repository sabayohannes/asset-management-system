import {BrowserRouter,Routes,Route } from 'react-router-dom'
import LoginPage from './components/Login'
import RegisterPage from './components/Register'
import './App.css'
import AddAsset from './components/Asset'
import UserAssetRequests from './pages/UserAssetRequests'
import AdminDashboard from './pages/AdminDashboard'
import { Box } from "@mui/material"
import Navbar from './components/Navbar'


function App() {


    return (
        <BrowserRouter>
            <Navbar />
                <Box
                sx={{
                    position: "fixed",       
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",         
                    background: "linear-gradient(135deg, #e0f7fa 0%, #e3f2fd 100%)",
                    overflowY: "auto",      
                }}
            >
                <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path='/AddAsset' element={<AddAsset />} />
                <Route path='/assetrequest' element={<UserAssetRequests />} />
                <Route path='/admindashboard' element={<AdminDashboard />} />
                </Routes>
            </Box>
      
    </BrowserRouter>
  )
}

export default App
