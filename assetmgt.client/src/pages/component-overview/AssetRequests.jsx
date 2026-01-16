import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Alert,
    Tabs,
    Tab, Grid, Paper,
} from "@mui/material";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
function AssetRequests() {
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [showAssetRequests, setShowAssetRequests] = useState(false);
    const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);
    useEffect(() => {
        fetchRequests();
       
    }, []);
    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedId(null);
    };
    const token = localStorage.getItem("token");
    const fetchRequests = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/assetrequests/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(res.data);
        } catch (err) {
            console.error("Error loading requests:", err);
            setMessage("Failed to load requests");
        }
    };

    const handleApprove = async (id) => {
        try {
            const res = await axios.post(
                `http://localhost:5001/api/assetrequests/requests/${id}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            fetchRequests();
        } catch (err) {
            console.error("Approve error:", err);
            setMessage("Failed to approve request");
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await axios.post(
                `http://localhost:5001/api/assetrequests/requests/${id}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            fetchRequests();
        } catch (err) {
            console.error("Reject error:", err);
            setMessage("Failed to reject request");
        }
    };
    const handleOrderMenuClick = (event) => {
        setOrderMenuAnchor(event.currentTarget);
    };
    const handleOrderMenuClose = () => {
        setOrderMenuAnchor(null);
    };

  return (
      <Container sx={{ mt: 4, mb: 4 }}>
          {/* Header aligned with table */}
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h5">Asset Request</Typography>
              <IconButton onClick={handleOrderMenuClick}>
                  <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
              </IconButton>
              <Menu
                  id="fade-menu"
                  anchorEl={orderMenuAnchor}
                  open={Boolean(orderMenuAnchor)}
                  onClose={handleOrderMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                  <MenuItem onClick={handleOrderMenuClose}>Export as CSV</MenuItem>
                  <MenuItem onClick={handleOrderMenuClose}>Export as Excel</MenuItem>
                  <MenuItem onClick={handleOrderMenuClose}>Print Table</MenuItem>
              </Menu>
          </Grid>

          {/* Table */}
          <Table>
              <TableHead>
                  <TableRow>
                      <TableCell>Request ID</TableCell>
                      <TableCell>Asset Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Request Date</TableCell>
                      <TableCell>Actions</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {requests.map((r) => (
                      <TableRow key={r.id}>
                          <TableCell>{r.id}</TableCell>
                          <TableCell>{r.asset?.name}</TableCell>
                          <TableCell>{r.asset?.category}</TableCell>
                          <TableCell>{r.status}</TableCell>
                          <TableCell>{new Date(r.requestDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                              {r.status === "Pending" ? (
                                  <IconButton onClick={(e) => handleMenuOpen(e, r.id)}>
                                      <MoreVertIcon />
                                  </IconButton>
                              ) : (
                                  <Typography>{r.status}</Typography>
                              )}
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
      </Container>

  );
}

export default AssetRequests;