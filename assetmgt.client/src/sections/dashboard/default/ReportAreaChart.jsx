// material-ui
import { useTheme } from '@mui/material/styles';

import { chartsGridClasses, LineChart } from '@mui/x-charts';


const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ==============================|| REPORT AREA CHART ||============================== //

export default function ReportAreaChart({chartData}) {
    const theme = useTheme();
    const labels = chartData?.map(d => d.name) || [];
    const totalData = chartData?.map(d => d.total) || [];
    const approvedData = chartData?.map(d => d.approved) || [];
    const pendingData = chartData?.map(d => d.pending) || [];

  return (
        <LineChart
            hideLegend={false}
            grid={{ horizontal: true }}
            xAxis={[{ data: labels, scaleType: 'point', disableLine: true, tickSize: 7 }]}
            yAxis={[{ tickMaxStep: 10, position: 'none' }]}
            series={[
                { data: totalData, id: 'Total', label: 'Total', color: theme.vars.palette.warning.main },
                { data: approvedData, id: 'Approved', label: 'Approved', color: theme.vars.palette.success.main },
                { data: pendingData, id: 'Pending', label: 'Pending', color: theme.vars.palette.error.main }
            ]}
            height={340}
            margin={{ top: 30, bottom: 25, left: 20, right: 20 }}
            sx={{
                '& .MuiLineElement-root': { strokeWidth: 2 },
                [`& .${chartsGridClasses.line}`]: { strokeDasharray: '4 4' },
                '& .MuiChartsAxis-root.MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: 'transparent' }
            }}
        />
    );
}