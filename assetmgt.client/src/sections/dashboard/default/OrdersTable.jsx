import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react'
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import {useState,useEffect } from 'react'


// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import Dot from 'components/@extended/Dot';


function createData(tracking_no, name, fat, carbs, protein) {
  return { tracking_no, name, fat, carbs, protein };
}



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'id', align: 'left', disablePadding: false, label: 'Asset ID' },
    { id: 'name', align: 'left', disablePadding: false, label: 'Asset Name' },
    { id: 'category', align: 'left', disablePadding: false, label: 'Category' },
    { id: 'status', align: 'left', disablePadding: false, label: 'Status' },
    { id: 'purchaseDate', align: 'left', disablePadding: false, label: 'Purchase Date' },
    { id: 'actions', align: 'left', disablePadding: false, label: 'Actions' }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
    
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
    let color = "primary";
    let title = status;
    if (status === "Available") {
        color = "warning";
    }
   else if (status === "Pending") {
        color = "warning";
    } else if (status === "Approved") {
        color = "success";
    } else if (status === "Rejected") {
        color = "error";
    }


  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}
function RowActions({ onApprove, onReject, onAssign }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);

    };
    return (
        <>
            <IconButton onClick={handleOpen}>
                <MoreVertIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => { handleClose(); onApprove(); }}>
                    Approve
                </MenuItem>

                <MenuItem onClick={() => { handleClose(); onReject(); }}>
                    Reject
                </MenuItem>

                <MenuItem onClick={() => { handleClose(); onAssign(); }}>
                    Assign
                </MenuItem>
            </Menu>
        </>
    );
}

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable( ) {
    const [rows, setRows] = useState([]);

    const fetchRows = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.get('http://localhost:5001/api/assetrequests/all', {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            })
            setRows(response.data)
            
        } catch (error) {
            console.error("Error fetching rows:", error);
        }
    }
    useEffect(() => {
        fetchRows()
    }, [])
  const order = 'asc';
    const orderBy = 'id';
    const approve = async (id) => {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:5001/api/assetrequests/requests/${id}/approve`,
            {},
            {
                headers: {
                Authorization: `Bearer ${token}`
                }
            })
        onActionComplete();
    };

    const reject = async(id) => {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:5001/api/assetrequests/requests/${id}/reject`, {},
            {
                headers: {Authorization:`Bearer ${token}`}
            })
        onActionComplete();

    };

    const assign = (id) => {
        console.log("Assign:", id);
    };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
                  <TableBody>
                      {rows && rows.length > 0 ? (
                      rows.map((row, index) =>
                      (<TableRow hover key={row.id || index}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.asset?.name}</TableCell>
                          <TableCell>{row.asset?.category}</TableCell>
                          <TableCell><OrderStatus status={row.status} /></TableCell>
                          <TableCell>
                              {row.asset?.purchaseDate ? new Date(row.asset.purchaseDate).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                              <RowActions
                                  onApprove={() => approve(row.id)}
                                  onReject={() => reject(row.id)}
                                  onAssign={() => assign(row.id)}
                              />
                          </TableCell>
                      </TableRow>))) : (
                          <TableRow>
                              <TableCell colSpan={6} align="center">
                                  No data available
                              </TableCell>
                          </TableRow>
                      )}
                  </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.string };
RowActions.propTypes = {
    onApprove: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    onAssign: PropTypes.func.isRequired
};