import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Box from '@mui/material/Box';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssetChart({ type }) {
    // Example data — replace with your asset data
    const data = {
        labels: ['Stocks', 'Real Estate', 'Crypto', 'Cash'],
        datasets: [
            {
                label: 'Assets',
                data: [5000, 12000, 3000, 2000], // Example numbers
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ],
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        cutout: '85%',
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `$${tooltipItem.raw}`;
                    }
                }
            }
        }
    };

    return(
        <Box
            sx={{
                width:500,        
                height:500,       
                mx: 'auto'
            }}
        >
            <Doughnut data={data} options={options} />
        </Box>
    )}
