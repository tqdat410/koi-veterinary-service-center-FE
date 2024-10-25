import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import '../../styles/Schedule.css';
import Sidebar from "../../components/layout/Sidebar";
import { fetchVetSlots } from "../../api/scheduleApi";
import { useDispatch } from 'react-redux';
import {useAuth} from "../../hooks/context/AuthContext";
// import { setAppointmentDetails } from '../../redux/actions/appointmentActions'; // Redux action to set appointment details

interface DoctorScheduleProps {
    appointments?: any[]; // Nhận appointments từ props
}

// Map slot_order to time ranges
const slotOrderToTime = {
    1: '7:30 - 9:30',
    2: '10:00 - 12:00',
    3: '13:00 - 15:00',
    4: '15:30 - 17:30',
};

// Get week dates and other functions remain unchanged
const getWeekDates = (startDate: Date): string[] => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate() + i));
        dates.push(date.toISOString().split('T')[0]); // Format: YYYY-MM-DD
    }
    return dates;
};

const getCurrentWeekStart = (): Date => {
    const today = new Date();
    const currentDay = today.getUTCDay();
    const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + daysToMonday));
};

const generateWeeksOfYear = (selectedYear: number) => {
    const currentDate = new Date(Date.UTC(selectedYear, 0, 1));
    const currentWeekStart = new Date(currentDate);
    const currentDay = currentDate.getUTCDay();
    const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    currentWeekStart.setUTCDate(currentDate.getUTCDate() + daysToMonday);

    const weeks = [];
    for (let i = 0; i < 52; i++) {
        const weekStart = new Date(currentWeekStart);
        weekStart.setUTCDate(currentWeekStart.getUTCDate() + i * 7);

        const weekEnd = new Date(weekStart);
        weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

        const weekRange = `${weekStart.getUTCDate().toString().padStart(2, '0')}/${(weekStart.getUTCMonth() + 1).toString().padStart(2, '0')} to ${weekEnd.getUTCDate().toString().padStart(2, '0')}/${(weekEnd.getUTCMonth() + 1).toString().padStart(2, '0')}`;
        weeks.push({ weekStart: weekStart.toISOString().split('T')[0], weekRange });
    }

    const currentWeek = getWeekDates(currentWeekStart);
    return { weeks, currentWeek };
};

const VetSchedule: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();
    const vetId = user?.userId;
    const navigate = useNavigate();
    

    const currentYear = new Date().getUTCFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const currentWeekStart = getCurrentWeekStart();
    const { weeks } = generateWeeksOfYear(selectedYear);
    const [selectedWeekStart, setSelectedWeekStart] = useState(currentWeekStart.toISOString().split('T')[0]);
    const [weekDates, setWeekDates] = useState<string[]>(getWeekDates(currentWeekStart));
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const [appointments, setAppointments] = useState<any[]>([]);

    const formatStatus = (status: string) => {
        switch (status) {
            case 'CHECKED_IN':
                return 'CHECKED IN';
            case 'ON_GOING':
                return 'ON GOING';
            default:
                return status;
        }
    };

    useEffect(() => {
        const loadVetSlots = async () => {
            console.log(vetId)
            if (vetId) {
                try {
                    const slots = await fetchVetSlots(vetId);
                    if (slots) {
                        setAppointments(slots);
                    } else {
                        // Handle the case where slots is null or empty
                        console.log('No slots available');
                        setAppointments([]);
                    }
                } catch (error) {
                    console.log('No slots available');
                    console.error('Error fetching slots:', error);
                    setAppointments([]);
            }
        } else {
            alert('User ID is not available');
        }
        };

        loadVetSlots();
    }, [vetId, selectedWeekStart]);

    const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newWeekStart = event.target.value;
        setSelectedWeekStart(newWeekStart);
        setWeekDates(getWeekDates(new Date(newWeekStart)));
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(event.target.value, 10);
        setSelectedYear(newYear);
        const { weeks, currentWeek } = generateWeeksOfYear(newYear);
        setSelectedWeekStart(currentWeek[0]);
        setWeekDates(getWeekDates(new Date(currentWeek[0])));
    };

    const changeWeek = (direction: number) => {
        const currentStartDate = new Date(selectedWeekStart);
        currentStartDate.setUTCDate(currentStartDate.getUTCDate() + direction * 7);
        const newWeekStart = currentStartDate.toISOString().split('T')[0];
        setSelectedWeekStart(newWeekStart);
        setWeekDates(getWeekDates(currentStartDate));
    };

    const handleCellClick = (appointmentId: number) => {
        console.log('Clicked appointment ID:', appointmentId);
        // Navigate to the details page with appointmentId
        navigate(`/veterinarian/appointment-details/${appointmentId}`);
    };

    return (
        <div className="d-flex flex-grow-1 gap-3" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: "6rem" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="text-start" style={{ fontWeight: "bold", color: "#02033B", fontSize: "2.5rem" }}>
                        Doctor Schedule
                    </h3>
                    <h3 className="text-end fst-italic">
                        {`(Your ID: ${vetId})`}
                    </h3>
                </div>
                <div className="d-flex justify-content-start align-items-center mb-3 gap-2">
                    <div className="d-flex align-items-center">
                        <select id="year-select" className="form-select form-select-sm me-2" value={selectedYear} onChange={handleYearChange}>
                            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        <select id="week-select" className="form-select form-select-sm" value={selectedWeekStart} onChange={handleWeekChange}>
                            {weeks.map((week, index) => (
                                <option key={index} value={week.weekStart}>
                                    {week.weekRange}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => changeWeek(-1)}>
                            &#8592;
                        </button>
                        <button className="btn btn-warning btn-sm" onClick={() => changeWeek(1)}>
                            &#8594;
                        </button>
                    </div>
                </div>

                <table className="table table-bordered table-schedule table-striped">
                    <thead>
                    <tr>
                        <th className="fs-5">Slot</th>
                        {weekDays.map((day, index) => (
                            <th key={index} className="text-center" style={{ minWidth:"10vh"}}>
                                {day}
                                <br /> {weekDates[index].split('-').reverse().join('/')}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {[1, 2, 3, 4].map((slotId) => (
                        <tr key={slotId}>
                            <td style={{height:"80px"}}>{`Slot ${slotId}`}</td>
                            {weekDates.map((date, dateIndex) => {
                                const appointment = appointments?.find(appointment => (
                                    appointment.year === new Date(date).getUTCFullYear() &&
                                    appointment.month === new Date(date).getUTCMonth() + 1 &&
                                    appointment.day === new Date(date).getUTCDate() &&
                                    appointment.slot_order === slotId
                                ));
                                return (
                                    <td  key={dateIndex} onClick={() => appointment && handleCellClick(appointment.appointment.appointment_id)} style={{minWidth:"9.3vw", cursor: appointment? 'pointer': 'default' }}>
                                        {appointment ? (
                                            <>
                                                <p className={`fw-bold ${
                                                    appointment.appointment.current_status === 'PENDING' ? 'text-warning' :
                                                        appointment.appointment.current_status === 'CONFIRMED' ? 'text-primary' :
                                                            appointment.appointment.current_status === 'CHECKED_IN' ? 'text-info' :
                                                                appointment.appointment.current_status === 'CANCEL' ? 'text-danger' :
                                                                    appointment.appointment.current_status === 'ON_GOING' ? 'text-secondary' :
                                                                        appointment.appointment.current_status === 'DONE' ? 'text-success' : ''
                                                }`}>
                                                    {formatStatus(appointment.appointment.current_status)}
                                                </p>
                                                <p>{slotOrderToTime[slotId as keyof typeof slotOrderToTime]}</p>
                                            </>
                                        ) : (
                                            <p className=" fw-bold">-</p>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VetSchedule;
