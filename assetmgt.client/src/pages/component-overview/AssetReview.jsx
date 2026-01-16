import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import useDialogs from "../../hooks/useDialogs/useDialogs";

import useNotifications from '../../hooks/useNotifications/useNotifications';

import PageContainer from './PageContainer';
import { useEffect } from 'react'
import axios from 'axios';

const INITIAL_PAGE_SIZE = 10;

const pageTitle = "Asset Review";
export default function AssetList() {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [assets, setAssets] = React.useState([])
    const [rowsState, setRowsState] = React.useState({ rows: [], rowCount: 0 });
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);


    const fetchAssets = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get('http://localhost:5001/api/assets', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const rows = response.data.map(a => ({
                id: a.id || a._id,
                name: a.name,
                category: a.category,           // adjust if nested: a.category?.name
                serialNumber: a.serialNumber,   // adjust key if API uses serial_no
                status: a.status,
                purchaseDate: a.purchaseDate,
                imageUrl: a.imageUrl, 
            }));
            console.log('Mapped rows:', rows);
            setRowsState({ rows, rowCount: rows.length });
            console.log('Raw API response:', response.data);
        } catch (err) {
            setError(err);
            console.error('Error fetching assets:', err);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchAssets();
    }, []);



    const dialogs = useDialogs();
    const notifications = useNotifications();

    const [paginationModel, setPaginationModel] = React.useState({
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
        pageSize: searchParams.get('pageSize')
            ? Number(searchParams.get('pageSize'))
            : INITIAL_PAGE_SIZE,
    });
    const [filterModel, setFilterModel] = React.useState(
        searchParams.get('filter')
            ? JSON.parse(searchParams.get('filter') ?? '')
            : { items: [] },
    );
    const [sortModel, setSortModel] = React.useState(
        searchParams.get('sort') ? JSON.parse(searchParams.get('sort') ?? '') : [],
    );





    const handlePaginationModelChange = React.useCallback(
        (model) => {
            setPaginationModel(model);

            searchParams.set('page', String(model.page));
            searchParams.set('pageSize', String(model.pageSize));

            const newSearchParamsString = searchParams.toString();

            navigate(
                `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
            );
        },
        [navigate, pathname, searchParams],
    );

    const handleFilterModelChange = React.useCallback(
        (model) => {
            setFilterModel(model);

            if (
                model.items.length > 0 ||
                (model.quickFilterValues && model.quickFilterValues.length > 0)
            ) {
                searchParams.set('filter', JSON.stringify(model));
            } else {
                searchParams.delete('filter');
            }

            const newSearchParamsString = searchParams.toString();

            navigate(
                `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
            );
        },
        [navigate, pathname, searchParams],
    );

    const handleSortModelChange = React.useCallback(
        (model) => {
            setSortModel(model);

            if (model.length > 0) {
                searchParams.set('sort', JSON.stringify(model));
            } else {
                searchParams.delete('sort');
            }

            const newSearchParamsString = searchParams.toString();

            navigate(
                `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
            );
        },
        [navigate, pathname, searchParams],
    );








    const handleRowClick = React.useCallback(
        (params) => {
            if (params.field === 'actions') return;
            navigate(`/assets/edit/${params.id}`);
        },
        [navigate],
    );
    const handleCreateClick = React.useCallback(() => {
        navigate('/assets/new');
    }, [navigate]);

    const handleRowEdit = React.useCallback(
        (employee) => () => {
            navigate(`/assets/edit/${row.id}`); 
        },
        [navigate],
    );

    const handleRowDelete = React.useCallback(

        [],
    );

    const initialState = React.useMemo(
        () => ({
            pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
        }),
        [],
    );

    const columns = [
        {
            field: 'imageUrl',
            headerName: 'Image',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                params.value ? (
                    <img
                        src={params.value}
                        alt="asset"
                        style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 6,
                            border: '1px solid #ddd'
                        }}
                    />
                ) : (
                    <span>No Image</span>
                )
            ),
        },

        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'category', headerName: 'Category', width: 130 },
        { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
        { field: 'status', headerName: 'Status', width: 120 },
        {
            field: 'purchaseDate',
            headerName: 'Purchase Date',
            width: 200,
            renderCell: (params) =>
                params.value
                    ? new Date(params.value).toLocaleDateString()
                    : '-',
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => navigate(`/assets/edit/${params.id}`)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDeleteAsset(params.id)}
                />
            ],
        },

        ];

    const pageTitle = "Asset Review";

    return (
        <PageContainer
            title={pageTitle}
            breadcrumbs={[{ title: pageTitle }]}
            actions={
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title="Reload data" placement="right" enterDelay={1000}>
                        <div>
                            <IconButton size="small" aria-label="refresh" >
                                <RefreshIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Button
                        variant="contained"
                        onClick={handleCreateClick}
                        startIcon={<AddIcon />}
                    >
                        Create Asset
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ flex: 1, width: '100%' }}>
                {error ? (
                    <Box sx={{ flexGrow: 1 }}>
                        <Alert severity="error">{error.message}</Alert>
                    </Box>
                ) : (
                    <DataGrid
                        rows={rowsState.rows}
                        rowCount={rowsState.rowCount}
                        columns={columns}
                        pagination
                        sortingMode="server"
                        filterMode="server"
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={handlePaginationModelChange}
                        sortModel={sortModel}
                        onSortModelChange={handleSortModelChange}
                        filterModel={filterModel}
                        onFilterModelChange={handleFilterModelChange}
                        disableRowSelectionOnClick
                        onRowClick={handleRowClick}
                        loading={isLoading}
                        initialState={initialState}
                        showToolbar
                        pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
                        sx={{
                            [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                                outline: 'transparent',
                            },
                            [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                            {
                                outline: 'none',
                            },
                            [`& .${gridClasses.row}:hover`]: {
                                cursor: 'pointer',
                            },
                        }}
                        slotProps={{
                            loadingOverlay: {
                                variant: 'circular-progress',
                                noRowsVariant: 'circular-progress',
                            },
                            baseIconButton: {
                                size: 'small',
                            },
                        }}
                    />
                )}
            </Box>
        </PageContainer>
    );
}
