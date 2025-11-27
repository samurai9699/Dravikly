'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

interface FrictionChartProps {
    data: Array<{ date: string; score: number }>;
}

export function FrictionChart({ data }: FrictionChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="text-slate-400">No data</div>
            </div>
        );
    }

    const chartData = {
        labels: data.map(d => d.date),
        datasets: [
            {
                label: 'Friction Score',
                data: data.map(d => d.score),
                fill: true,
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#94a3b8',
                bodyColor: '#fff',
                borderColor: '#06b6d4',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    color: '#94a3b8',
                    stepSize: 25,
                },
                grid: {
                    color: '#334155',
                    drawBorder: false,
                },
            },
            x: {
                ticks: {
                    color: '#94a3b8',
                },
                grid: {
                    color: '#334155',
                    drawBorder: false,
                },
            },
        },
    };

    return (
        <div className="h-64 w-full">
            <Line data={chartData} options={options} />
        </div>
    );
}
