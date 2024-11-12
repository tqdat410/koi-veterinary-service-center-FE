import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';
import {
    getUserFishStatistics,
    getAppointmentStatistics,
    getPaymentStatistics,
    getFeedbackStatistics,
    getVetSlotsInRange,
    getVeterinarians
} from '../../../api/statisticsApi';
import "../../../styles/DashBoard.css"
import Sidebar from "../../../components/layout/Sidebar";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addMonths, startOfMonth, endOfMonth, format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6666', '#FFD700', '#4B0082'];

const Dashboard: React.FC = () => {
    const [userFishStats, setUserFishStats] = useState<any>({});
    const [appointmentStats, setAppointmentStats] = useState<any>({});
    const [paymentStats, setPaymentStats] = useState<any>({});
    const [feedbackStats, setFeedbackStats] = useState<any>({});
    const [vetSlots, setVetSlots] = useState<any[]>([]);
    const [averageRatings, setAverageRatings] = useState<any[]>([]);
    const [vetNameMap, setVetNameMap] = useState<{ [key: string]: string }>({});
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]); // Re-fetch data when selectedDate changes

    const fetchData = async (date: Date) => {
        const startDate = startOfMonth(date);
        const endDate = endOfMonth(date);

        try {
            const [userFishRes, appointmentRes, paymentRes, feedbackRes, veterinariansRes] = await Promise.all([
                getUserFishStatistics(),
                getAppointmentStatistics(),
                getPaymentStatistics(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')),
                getFeedbackStatistics(),
                getVeterinarians(),
            ]);

            setUserFishStats(userFishRes.data);

            setAppointmentStats(appointmentRes.data);
            setPaymentStats(paymentRes.data);
            setFeedbackStats(feedbackRes.data);


            const vetSlotPromises = veterinariansRes.data.map(async (vet: any) => {
                try {
                    const slotsRes = await getVetSlotsInRange(vet.user_id, format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
                    return {
                        vetName: `${vet.last_name.charAt(0)}. ${vet.first_name}`,
                        slotsBooked: slotsRes.data || 0,
                        user_id: vet.user_id
                    };
                } catch (error) {
                    return {
                        vetName: `${vet.first_name} ${vet.last_name}`,
                        slotsBooked: 0,
                        user_id: vet.user_id
                    };
                }
            });
            const vetSlotData = await Promise.all(vetSlotPromises);

            const sortedVetSlotData = vetSlotData.sort((a, b) => a.user_id - b.user_id);
            setVetSlots(sortedVetSlotData);

            const nameMap = veterinariansRes.data.reduce((map: any, vet: any) => {
                map[vet.user_id] = `${vet.last_name.charAt(0)}. ${vet.first_name}`;
                return map;
            }, {});
            setVetNameMap(nameMap);

            const avgRatings = Object.entries(feedbackRes.data.averageRatingPerVet).map(([vetId, rating]) => ({
                vetId: nameMap[vetId] || vetId,
                rating,
            }));
            setAverageRatings(avgRatings);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(date);
        }
    };


    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px', marginTop:"15px" }}>
        <Sidebar/>
        <div className="container">

            <h1 className="my-4" style={{fontWeight: "bold", color: "#02033B", fontSize: "2.8rem"}}>Dashboard</h1>
            <div className="row">
                {/* User and Fish Statistics */}
                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card mb-4">
                        <div className="card-header fw-bold">User and Fish Statistics</div>
                        <div className="card-body">
                            <ResponsiveContainer width="90%" height={395}>
                                <BarChart width={350} height={300} data={[
                                    {name: 'CUS', value: parseInt(userFishStats.totalCustomers)},
                                    {name: 'STA', value: parseInt(userFishStats.totalStaff)},
                                    {name: 'VET', value: parseInt(userFishStats.totalVets)},
                                    {name: 'Fish', value: parseInt(userFishStats.totalFish)},
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>

                                    <Bar dataKey="value">
                                        {COLORS.map((color, index) => (
                                            <Cell key={`cell-${index}`} fill={color}/>
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                {/* Appointment Statistics */}
                <div className="col-lg-9 col-md-6 mb-4">
                    <div className="card mb-4">
                        <div className="card-header fw-bold">Appointment Statistics</div>
                        <div className="card-body">
                            <div className="row">
                                {/* Cash and VN Pay Payments Bar Chart */}


                                {/* Services Usage Pie Chart */}
                                <div className="col-6">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    {
                                                        name: 'Tái Khám',
                                                        value: parseInt(appointmentStats.taikhamAppointments)
                                                    },
                                                    {
                                                        name: 'Service 1',
                                                        value: parseInt(appointmentStats.service1Appointments)
                                                    },
                                                    {
                                                        name: 'Service 2',
                                                        value: parseInt(appointmentStats.service2Appointments)
                                                    },
                                                    {
                                                        name: 'Service 3',
                                                        value: parseInt(appointmentStats.service3Appointments)
                                                    },
                                                ]}
                                                cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                                                label={({name, value}) => `${name}: ${value}`} // Custom label
                                                dataKey="value"
                                                fill="#8884d8"
                                            >
                                                {COLORS.map((color, index) => (
                                                    <Cell key={`cell-${index}`} fill={color}/>
                                                ))}
                                            </Pie>
                                            <Tooltip/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="fw-bold">Total
                                        Appointments: {appointmentStats.totalAppointments || 0}</div>
                                </div>

                                {/* Total Appointments Today Pie Chart */}
                                <div className="col-6">

                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    {
                                                        name: 'Tái Khám',
                                                        value: parseInt(appointmentStats.taikhamAppointmentsToday)
                                                    },
                                                    {
                                                        name: 'Service 1',
                                                        value: parseInt(appointmentStats.service1AppointmentsToday)
                                                    },
                                                    {
                                                        name: 'Service 2',
                                                        value: parseInt(appointmentStats.service2AppointmentsToday)
                                                    },
                                                    {
                                                        name: 'Service 3',
                                                        value: parseInt(appointmentStats.service3AppointmentsToday)
                                                    },
                                                ]}
                                                cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                                                label={({name, value}) => `${name}: ${value}`} // Custom label
                                                dataKey="value"
                                                fill="#8884d8"
                                            >
                                                {COLORS.map((color, index) => (
                                                    <Cell key={`cell-${index}`} fill={color}/>
                                                ))}
                                            </Pie>
                                            <Tooltip/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="fw-bold">Total Appointments
                                        Today: {appointmentStats.totalAppointmentsToday || 0}</div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <h6>Total Appointments This
                                    Quarter: {appointmentStats.appointmentsThisQuarter || 0}</h6>
                                <h6>Total Appointments This Month: {appointmentStats.appointmentsThisMonth || 0}</h6>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        className="text-center"

                    />
                </div>

                {/* Payment Statistics */}
                <div className="col-lg-6 col-md-6 mb-4">

                    <div className="card mb-4">
                        <div className="card-header fw-bold">Payment Statistics</div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart width={300} height={300} data={[
                                            {name: 'Cash', value: parseInt(paymentStats.cashPayments)},
                                            {name: 'VNPay', value: parseInt(paymentStats.vnPayPayments)},
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Bar dataKey="value">
                                                {COLORS.map((color, index) => (
                                                    <Cell key={`cell-${index}`} fill={color}/>
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Total Paid and Not Paid Chart */}
                                <div className="col-6">

                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={[
                                            {name: 'Paid', value: parseInt(paymentStats.paidPayments)},
                                            {name: 'Not Paid', value: parseInt(paymentStats.notPaidPayments)},
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Bar dataKey="value">
                                                {COLORS.map((color, index) => (
                                                    <Cell key={`cell-${index}`} fill={color}/>
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="fw-bold">Total Paid and Not Paid</div>
                                </div>

                                {/* Paid and Not Paid Today Chart */}

                            </div>

                            {/* Display Total Amount and Total Payments Today */}
                            <div className="mt-3">

                                <h6>Total
                                    Amount: {Intl.NumberFormat('vi-VN').format(Number(paymentStats.totalAmount) || 0)} VND
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feedback Statistics */}
                <div className="col-lg-6 col-md-6 mb-4">
                    <div className="card mb-4">
                        <div className="card-header fw-bold">Veterinarian Slots Booked</div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart width={1100} height={400} data={vetSlots}

                                >
                                    <CartesianGrid strokeDasharray="4 5"/>
                                    <XAxis dataKey="vetName"/>
                                    <YAxis allowDecimals={false}/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="slotsBooked" stroke="#82ca9d" strokeWidth={2}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Veterinarian Slots Booked */}

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card mb-4">

                        <div className="card-header fw-bold">Feedback Statistics</div>
                        <div className="card-body">
                        <ResponsiveContainer width="100%" height={300}>
                                        <LineChart width={500} height={300} data={averageRatings}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="vetId"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Line type="monotone" dataKey="rating" stroke="#82ca9d" strokeWidth={2}/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>Total Feedbacks Today: {feedbackStats.totalFeedbackToday || 0}</div>
                                <div>Total Feedbacks This Quarter: {feedbackStats.totalFeedbackThisQuarter || 0}</div>
                                <div>Total Feedbacks This Month: {feedbackStats.totalFeedbackThisMonth || 0}</div>


                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Dashboard;
