import React from 'react';
import { Radar } from 'react-chartjs-2';

interface FeedbackData {
    averageRatingPerVet: { [vetName: string]: number };
}

interface VetFeedbackChartProps {
    data: FeedbackData;
}

export const VetFeedbackChart: React.FC<VetFeedbackChartProps> = ({ data }) => {
    const chartData = {
        labels: Object.keys(data.averageRatingPerVet),
        datasets: [
            {
                label: 'Average Rating',
                data: Object.values(data.averageRatingPerVet),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    return <Radar data={chartData} />;
};