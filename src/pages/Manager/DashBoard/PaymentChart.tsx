import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';

interface PaymentData {
    paidPayments: number;
    notPaidPayments: number;
    vnPayPayments: number;
    cashPayments: number;
    totalPaymentsToday: number;
    paymentsThisMonth: number;
    paymentsThisQuarter: number;
}

interface PaymentChartProps {
    data: PaymentData;
}

export const PaymentChart: React.FC<PaymentChartProps> = ({ data }) => {
    const paymentStatusData = {
        labels: ['Paid Payments', 'Not Paid Payments'],
        datasets: [
            {
                label: 'Payment Status',
                data: [data.paidPayments, data.notPaidPayments],
                backgroundColor: ['#4CAF50', '#FF5722']
            }
        ]
    };

    const paymentMethodData = {
        labels: ['VNPay Payments', 'Cash Payments'],
        datasets: [
            {
                label: 'Payment Methods',
                data: [data.vnPayPayments, data.cashPayments],
                backgroundColor: ['#2196F3', '#FFC107']
            }
        ]
    };

    const paymentsData = {
        labels: ['Total Payments Today', 'Payments This Month', 'Payments This Quarter'],
        datasets: [
            {
                label: 'Payments Over Time',
                data: [data.totalPaymentsToday, data.paymentsThisMonth, data.paymentsThisQuarter],
                backgroundColor: ['#FF9F40']
            }
        ]
    };

    return (
        <>
            <Doughnut data={paymentStatusData} />
            <Doughnut data={paymentMethodData} />
            <Bar data={paymentsData} />
        </>
    );
};
