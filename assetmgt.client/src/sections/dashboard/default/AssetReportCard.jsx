import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box';

// project imports
import AssetChart from 'sections/dashboard/default/AssetChart';

// sales report status
const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| DEFAULT - SALES REPORT ||============================== //

export default function AssetReportCard({ data, total }) {
    const [value, setValue] = useState('year'); // Default to year to see the monthly trend

    return (
        <>
            <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid>
                    <Stack spacing={0.5}>
                        <Typography variant="h5">Asset Report</Typography>
                        <Typography variant="caption" color="secondary">
                            Total Assets Tracked: {total}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid>
                    <TextField
                        size="small"
                        select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    >
                        {status.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            {/* Pass the data to the chart */}
            <Box sx={{ pt: 1 }}>
                <AssetChart type={value} chartData={data} />
            </Box>
        </>
    );
}