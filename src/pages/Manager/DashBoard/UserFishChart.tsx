import React from 'react';
import { Bar } from 'react-chartjs-2';

interface UserFishData {
    totalCustomers: number;
    totalStaff: number;
    totalVets: number;
    totalFish: number;
}

interface UserFishChartProps {
    data: UserFishData;
}

export const UserFishChart: React.FC<UserFishChartProps> = ({ data }) => {
    const chartData = {
        labels: ['Total Customers', 'Total Staff', 'Total Vets', 'Total Fish'],
        datasets: [
            {
                label: 'User and Fish Statistics',
                data: [data.totalCustomers, data.totalStaff, data.totalVets, data.totalFish],
                backgroundColor: ['#4CAF50', '#2196F3', '#FF5722', '#FFC107']
            }
        ]
    };

    return <Bar data={chartData} />;
};
