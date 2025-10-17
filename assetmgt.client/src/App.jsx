import {BrowserRouter,Routes,Route } from 'react-router-dom'
import LoginPage from './components/Login'
import RegisterPage from './components/Register'
import './App.css'
import AddAsset from './components/Asset'


function App() {


    return (
        <BrowserRouter>
        <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path='/AddAsset' element={<AddAsset/> }/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
