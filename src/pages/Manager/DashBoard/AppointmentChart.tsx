import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';

interface AppointmentData {
    appointmentsThisQuarter: number;
    appointmentsThisMonth: number;
    totalAppointments: number;
    service1Appointments: number;
    service2Appointments: number;
    service3Appointments: number;
    taikhamAppointments: number;
}

interface AppointmentChartProps {
    data: AppointmentData;
}

export const AppointmentChart: React.FC<AppointmentChartProps> = ({ data }) => {
    const serviceData = {
        labels: ['Service 1', 'Service 2', 'Service 3', 'Tái khám'],
        datasets: [
            {
                label: 'Appointments',
                data: [
                    data.service1Appointments,
                    data.service2Appointments,
                    data.service3Appointments,
                    data.taikhamAppointments,
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }
        ]
    };

    const generalData = {
        labels: ['Appointments This Quarter', 'Appointments This Month', 'Total Appointments'],
        datasets: [
            {
                label: 'General Statistics',
                data: [
                    data.appointmentsThisQuarter,
                    data.appointmentsThisMonth,
                    data.totalAppointments
                ],
                backgroundColor: ['#FF9F40', '#FF6384', '#4BC0C0']
            }
        ]
    };

    return (
        <>
            <Pie data={serviceData} />
            <Bar data={generalData} />
        </>
    );
};
