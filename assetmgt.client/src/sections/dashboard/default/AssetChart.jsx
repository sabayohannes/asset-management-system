import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssetChart({ chartData }) {
    const theme = useTheme();

    // 1. Process the data
    // If chartData exists, we extract labels and counts
    // For example: labels = ['Laptops', 'Printers'], data = [10, 5]
    const labels = chartData ? chartData.map(d => d.name) : ['No Data'];
    const counts = chartData ? chartData.map(d => d.total) : [1];

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Asset Count',
                data: counts,
                backgroundColor: [
                    theme.palette.primary.main,
                    theme.palette.success.main,
                    theme.palette.warning.main,
                    theme.palette.error.main,
                    theme.palette.secondary.main,
                ],
                hoverOffset: 4,
                borderWidth: 2,
                borderColor: theme.palette.background.paper,
            }
        ]
    };

    const options = {
        responsive: true,
        cutout: '75%', // Makes the doughnut ring thinner/thicker
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { family: theme.typography.fontFamily }
                }
            }
        }
    };

    return (
        <Box sx={{ width: '100%', height: 400, mt: 3, mx: 'auto' }}>
            <Doughnut data={data} options={options} />
        </Box>
    );
}