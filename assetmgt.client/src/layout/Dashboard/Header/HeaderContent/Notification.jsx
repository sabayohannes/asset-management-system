import { useRef, useState, useEffect } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import axios from 'axios';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'Admin';
    const [read, setRead] = useState(0);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {

        return;
    }
    setOpen(false);
  };
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5001/api/assetrequests/notifications', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(res.data);
                const unreadCount = res.data.filter(r => !r.isRead).length;
                setRead(unreadCount);
            } catch (err) {
                console.error("Failed to fetch requests", err);
                setRequests([]);
                setRead(0);
            }
        };
        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localHost:5001/api/assetrequests/notifications/mark-all-read',{},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
            });
            setRead(0);
            setRequests(prev => prev.map(r => ({...r,isRead:true})))

        } catch (err) {
            console.error("Failed to mark notifications as read", err);
        }
    }

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: open ? 'grey.100' : 'transparent',
        })}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={read} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                          {read > 0 && (
                              <Tooltip title="Mark all as read">
                                  <IconButton color="success" size="small" onClick={markAllAsRead}>
                                      <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                                  </IconButton>
                              </Tooltip>
                          )}
                    </>
                  }
                >
                                  <List
                                      component="nav"
                                      sx={{
                                          p: 0,
                                          '& .MuiListItemButton-root': {
                                              py: 0.5,
                                              px: 2,
                                              '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                                              '& .MuiAvatar-root': avatarSX,
                                              '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                                          }
                                      }}
                                  >
                                      {requests.length === 0 ? (
                                          <ListItem>
                                              <ListItemText primary="No notifications" />
                                          </ListItem>
                                      ) : (
                                          requests.map((req, index) => (
                                              <ListItem
                                                  key={req._id}
                                                  component={ListItemButton}
                                                  divider
                                                  sx={(theme) => ({
                                                      alignItems: 'flex-start',
                                                      bgcolor: !req.isRead ? theme.palette.primary.lighter : 'transparent',
                                                      '&:hover': {
                                                          bgcolor: !req.isRead
                                                              ? theme.palette.primary.light
                                                              : theme.palette.grey[100]
                                                      }
                                                  })}
                                              >
                                                  <ListItemAvatar>
                                                      <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                                                          {req.assetName?.[0] || 'A'}
                                                      </Avatar>
                                                  </ListItemAvatar>
                                                  <ListItemText
                                                      primary={
                                                          <Typography variant="h6">
                                                              {isAdmin
                                                                  ? `Request from ${req.User?.UserName || 'User'}`
                                                                  : `Asset request: ${req.Asset?.Name || 'Asset'}`}
                                                          </Typography>
                                                      }
                                                      secondary={req.status}
                                                  />
                                                  <Typography variant="caption" noWrap>
                                                      {req.RequestDate
                                                          ? `${new Date(req.RequestDate).toLocaleDateString()} ${new Date(req.RequestDate).toLocaleTimeString()}`
                                                          : ''}
                                                  </Typography>
                                              </ListItem>
                                          ))
                                      )}
                                      <ListItemButton sx={{ textAlign: 'center', py: '12px !important' }}>
                                          <ListItemText
                                              primary={
                                                  <Typography variant="h6" color="primary">
                                                      View All
                                                  </Typography>
                                              }
                                          />
                                      </ListItemButton>
                                  </List>

                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
