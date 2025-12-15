// material-ui
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import React, { useState, useEffect,useRef } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import SearchOutlined from '@ant-design/icons/SearchOutlined';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //
import { useNavigate } from "react-router-dom";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [assets, setAssets] = useState([]);
    const [selectedAsset,setSelectedAsset]=useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const token = localStorage.getItem('token')
                console.log(localStorage.getItem('token'))
                const response = await axios.get('http://localhost:5001/api/assets', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAssets(response.data)
            } catch (err) {
                console.error('Error fetching assets:', err)
            }
        }
        fetchAssets();
    },[])
    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          size="small"
                  id="header-search"
                  sx={{ bgcolor: 'grey.100', borderRadius: 1 }}
          startAdornment={
              <InputAdornment position="start" sx={{ mr: -0.5, color: '#1890FF' }}>
              <SearchOutlined />
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          slotProps={{ input: { 'aria-label': 'weight' } }}
          placeholder="Search assets..."
          value={searchTerm} // controlled input
          onChange={(e) => setSearchTerm(e.target.value)} // update state on typing
        />
          </FormControl>
          {searchTerm && (
              <Box
                  sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                      bgcolor: 'background.paper',
                      boxShadow: 3,
                      zIndex: 10,
                      maxHeight: 200,
                      overflowY: 'auto',
                      mt: 0.5,
                      borderRadius: 1
                  }}
              >
                  <List sx={{ p: 0 }}>
                      {filteredAssets.length > 0 ? (
                          filteredAssets.map((asset) => (
                              <ListItem
                                  key={asset.id}
                                  sx={{ py: 0.5, cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                                  onClick={() => {
                                    
                                      navigate(`/assets/${asset.id}`)
                                      setSearchTerm('');
                                  }} 
                              >
                                  <Typography>{asset.name}</Typography>
                                    </ListItem>
                          ))
                      ) : (
                          <ListItem sx={{ py: 0.5 }}>
                              <Typography>No assets found</Typography>
                          </ListItem>
                      )}
                  </List>
                 

              </Box>
          )}
    </Box>
  );
}
