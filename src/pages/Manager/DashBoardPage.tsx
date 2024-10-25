

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import {
    getUserFishStatistics,
    getAppointmentStatistics,
    getPaymentStatistics,
    getFeedbackStatistics,
    getVetSlotsInCurrentWeek,
    getVeterinarians
} from '../../api/statisticsApi';

const Dashboard: React.FC = () => {
    const [userFishStats, setUserFishStats] = useState<any>({});
    const [appointmentStats, setAppointmentStats] = useState<any>({});
    const [paymentStats, setPaymentStats] = useState<any>({});
    const [feedbackStats, setFeedbackStats] = useState<any>({});
    const [vetSlots, setVetSlots] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userFishRes, appointmentRes, paymentRes, feedbackRes, veterinariansRes] = await Promise.all([
                getUserFishStatistics(),
                getAppointmentStatistics(),
                getPaymentStatistics(),
                getFeedbackStatistics(),
                getVeterinarians(),
            ]);

            setUserFishStats(userFishRes.data);
            setAppointmentStats(appointmentRes.data);
            setPaymentStats(paymentRes.data);
            setFeedbackStats(feedbackRes.data);

            const vetSlotPromises = veterinariansRes.data.map(async (vet: any) => {
                try {
                    const slotsRes = await getVetSlotsInCurrentWeek(vet.user_id);
                    return { vetName: `${vet.first_name} ${vet.last_name}`, slotsBooked: slotsRes.data || 0 };
                } catch (error) {
                    console.error(`Error fetching slots for vet ${vet.user_id}`, error);
                    return { vetName: `${vet.first_name} ${vet.last_name}`, slotsBooked: 0 };  // Default to 0 if there's an error
                }
            });

            const vetSlotData = await Promise.all(vetSlotPromises);
            setVetSlots(vetSlotData);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    // Prepare chart data
    const userFishData = [
        { name: 'Customers', value: userFishStats.totalCustomers },
        { name: 'Staff', value: userFishStats.totalStaff },
        { name: 'Vets', value: userFishStats.totalVets },
        { name: 'Fish', value: userFishStats.totalFish },
    ];

    const appointmentData = [
        { name: 'Service 1', value: appointmentStats.service1Appointments },
        { name: 'Service 2', value: appointmentStats.service2Appointments },
        { name: 'Service 3', value: appointmentStats.service3Appointments },
    ];

    const paymentData = [
        { name: 'Paid', value: paymentStats.paidPayments },
        { name: 'Cash Payments', value: paymentStats.cashPayments },
        { name: 'VnPay Payments', value: paymentStats.vnPayPayments },
        { name: 'Not Paid', value: paymentStats.notPaidPayments },
    ];

    const feedbackData = Object.keys(feedbackStats.averageRatingPerVet || {}).map(vetId => ({
        name: `Vet ${vetId}`,
        value: feedbackStats.averageRatingPerVet[vetId],
    }));

    const vetSlotData = vetSlots.map((vet) => ({
        name: vet.vetName,
        value: vet.slotsBooked,
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="container">
            <h1 className="my-4">Dashboard</h1>

            {/* User and Fish Stats Bar Chart */}
            <div className="card mb-4">
                <div className="card-header">User and Fish Statistics</div>
                <div className="card-body">
                    <BarChart width={500} height={300} data={userFishData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </div>
            </div>

            {/* Appointment Stats Bar Chart */}
            <div className="card mb-4">
                <div className="card-header">Appointment Statistics</div>
                <div className="card-body">
                    <BarChart width={500} height={300} data={appointmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>

            {/* Payment Stats Bar Chart */}
            <div className="card mb-4">
                <div className="card-header">Payment Statistics</div>
                <div className="card-body">
                    <BarChart width={500} height={300} data={paymentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#ffc658" />
                    </BarChart>
                </div>
            </div>

            {/* Feedback Stats Pie Chart */}
            <div className="card mb-4">
                <div className="card-header">Feedback Statistics</div>
                <div className="card-body">
                    <PieChart width={400} height={400}>
                        <Pie
                            data={feedbackData}
                            cx={200}
                            cy={200}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                        >
                            {feedbackData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
            </div>

            {/* Vet Slots Bar Chart */}
            <div className="card mb-4">
                <div className="card-header">Veterinarian Slots Booked This Week</div>
                <div className="card-body">
                    <BarChart width={500} height={300} data={vetSlotData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
