import React from 'react';
import { Bar } from 'react-chartjs-2';

interface Vet {
    user_id: string;
    first_name: string;
    last_name: string;
    slotsThisWeek: number; // Ensure this field exists
}

interface VetSlotsChartProps {
    vetData: Vet[];
}

export const VetSlotsChart: React.FC<VetSlotsChartProps> = ({ vetData }) => {
    const chartData = {
        labels: vetData.map(vet => `${vet.first_name} ${vet.last_name}`),
        datasets: [
            {
                label: 'Slots Booked This Week',
                data: vetData.map(vet => vet.slotsThisWeek),
                backgroundColor: '#36A2EB',
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const, // Set to 'y' and cast to 'const'
        scales: {
            x: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};
