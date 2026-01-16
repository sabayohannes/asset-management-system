import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { getOne, deleteOne } from '../../data/assets';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
    Chip,
    Stack,
    Container,
    Divider
} from '@mui/material';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case 'available': return { color: 'success', label: 'Available' };
        case 'maintenance': return { color: 'warning', label: 'Maintenance' };
        default: return { color: 'default', label: status };
    }
};

export default function AssetDetail() {
    const { assetId } = useParams();
    const navigate = useNavigate();
    const [asset, setAsset] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDeleting, setIsDeleting] = React.useState(false);

    React.useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await getOne(Number(assetId));
                setAsset(data);
            } catch (err) {
                console.error(err);
            }
            setIsLoading(false);
        };
        loadData();
    }, [assetId]);

    const handleDeleteClick = async () => {
        if (!window.confirm(`Are you sure you want to permanently delete ${asset.name}?`)) return;

        setIsDeleting(true);
        try {
            await deleteOne(Number(assetId));
            // Navigates to assetreview after successful deletion
            navigate('/assetreview');
        } catch (err) {
            alert(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (!asset) return <Typography>Asset not found</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Top Navigation - Points to /assetreview */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/assetreview')}
                sx={{ mb: 3, textTransform: 'none', fontWeight: 600 }}
            >
                Back to List
            </Button>

            {/* 1. DATA CARDS GRID */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 2,
                    mb: 4
                }}
            >
                <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                        ASSET NAME
                    </Typography>
                    <Typography variant="h6">{asset.name}</Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                        PURCHASE DATE
                    </Typography>
                    <Typography variant="h6">{dayjs(asset.purchaseDate).format('MMM DD, YYYY')}</Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                        SERIAL NUMBER
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{asset.serialNumber}</Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                        CATEGORY
                    </Typography>
                    <Typography variant="body1">{asset.category}</Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>
                        STATUS
                    </Typography>
                    <Chip
                        label={getStatusStyle(asset.status).label}
                        color={getStatusStyle(asset.status).color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                </Paper>
            </Box>

            {/* 2. ACTIONS BAR (BOTTOM) */}
            <Divider sx={{ mb: 3 }} />

            <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                alignItems="center"
            >
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={isDeleting ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Asset'}
                </Button>

                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    // Points to /assets/edit/[id]
                    onClick={() => navigate(`/assets/edit/${assetId}`)}
                    sx={{ px: 4 }}
                >
                    Edit Asset
                </Button>
            </Stack>
        </Container>
    );
}