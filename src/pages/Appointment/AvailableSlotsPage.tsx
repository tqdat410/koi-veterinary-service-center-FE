import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/TableSchedule.css"
import {useDispatch, useSelector} from "react-redux";
import { setSlot } from '../../store/actions';

const slotOrderToTime = {
    1: '7:30 - 9:30',
    2: '10:00 - 12:00',
    3: '13:00 - 15:00',
    4: '15:30 - 17:30',
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getWeekDates = (startDate: Date): string[] => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setUTCDate(date.getUTCDate() + i);
        dates.push(date.toISOString().split('T')[0]); // Format: YYYY-MM-DD
    }
    return dates;
};

const getCurrentWeekStart = (): Date => {
    const today = new Date();
    const currentDay = today.getUTCDay();
    const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    return new Date(today.setUTCDate(today.getUTCDate() + daysToMonday));
};

const generateWeeksOfYear = (selectedYear: number) => {
    const currentDate = new Date(Date.UTC(selectedYear, 0, 1));
    const weeks = [];
    for (let i = 0; i < 52; i++) {
        const weekStart = new Date(currentDate);
        weekStart.setUTCDate(currentDate.getUTCDate() + i * 7);
        weeks.push({
            weekStart: weekStart.toISOString().split('T')[0],
            weekRange: `${weekStart.getUTCDate().toString().padStart(2, '0')}/${(weekStart.getUTCMonth() + 1).toString().padStart(2, '0')} to ${(weekStart.getUTCDate() + 6).toString().padStart(2, '0')}/${(weekStart.getUTCMonth() + 1).toString().padStart(2, '0')}`
        });
    }
    return weeks;
};

const AvailableSlot: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentYear = new Date().getUTCFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const currentWeekStart = getCurrentWeekStart();
    const [selectedWeekStart, setSelectedWeekStart] = useState(currentWeekStart.toISOString().split('T')[0]);
    const [weekDates, setWeekDates] = useState<string[]>(getWeekDates(currentWeekStart));
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<{ year: number; month: number; day: number; slot_order: number, slot_id:number } | null>(null);

    const weeks = generateWeeksOfYear(selectedYear);

    const service = useSelector((state: any) => state.service);

    useEffect(() => {
        // Nếu service là null, điều hướng về trang chọn service
        if (!service) {
            alert("You should choose service first!!!")
            navigate('/appointment/service-selection');

        }
    }, [service, navigate]);

    useEffect(() => {
        // Fetch available slots
        axios.get(`http://localhost:8080/api/v1/slots/available`)
            .then((response) => {
                console.log(response)

                setAvailableSlots(response.data);
            })
            .catch((error) => {
                console.error('Error fetching available slots:', error);
            });
    }, [selectedWeekStart]);

    const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newWeekStart = event.target.value;
        setSelectedWeekStart(newWeekStart);
        setWeekDates(getWeekDates(new Date(newWeekStart)));
    };

    const changeWeek = (direction: number) => {
        const currentStartDate = new Date(selectedWeekStart);
        currentStartDate.setUTCDate(currentStartDate.getUTCDate() + direction * 7);
        setSelectedWeekStart(currentStartDate.toISOString().split('T')[0]);
        setWeekDates(getWeekDates(currentStartDate));
    };

    const handleSlotSelection = (year: number, month: number, day: number, slot_order: number, slot_id: number) => {
        setSelectedSlot({ year, month, day, slot_order, slot_id });
    };

    const handleNextClick = () => {
        if (selectedSlot) {
            dispatch(setSlot(selectedSlot));
            navigate('/appointment/vet-selection'); // Navigate to the next page (replace with your actual path)
        }
    };
    const handleBackClick = () => {
        navigate('/appointment/service-selection'); // Navigate back to service selection page
    };
    return (
        <div className="d-flex flex-grow-1 align-items-center">
            <div className="container-fluid">
                <button
                    className="btn btn-secondary mb-3"
                    style={{position: 'absolute', top: '12%', left: '3%'}}
                    onClick={handleBackClick}>
                    Back
                </button>
                <div className="row justify-content-center">
                    <div className="col-md-7">
                        <h3 className="text-start" style={{fontWeight: "bold", color: "#02033B", fontSize: "2.7rem"}}>
                        Available Slots
                        </h3>
                        <div className="d-flex justify-content-start gap-3 align-items-center mb-2">
                            <div className="d-flex align-items-center">
                                <select id="week-select" className="form-select form-select-sm"
                                        value={selectedWeekStart} onChange={handleWeekChange}>
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
                                    <th key={index} className="text-center">
                                        {day} <br/> {new Date(weekDates[index]).toLocaleDateString('en-GB')}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {[1, 2, 3, 4].map((slotOrder) => (
                                <tr key={slotOrder}>
                                    <td>{`Slot ${slotOrder}`}</td>
                                    {weekDates.map((date, dateIndex) => {
                                        const isAvailable = availableSlots.some(slot =>
                                            slot.year === new Date(date).getUTCFullYear() &&
                                            slot.month === new Date(date).getUTCMonth() + 1 &&
                                            slot.day === new Date(date).getUTCDate() &&
                                            slot.slot_order === slotOrder
                                        );

                                        const isSelectedSlot = selectedSlot?.slot_order === slotOrder &&
                                            selectedSlot.year === new Date(date).getUTCFullYear() &&
                                            selectedSlot.month === new Date(date).getUTCMonth() + 1 &&
                                            selectedSlot.day === new Date(date).getUTCDate();

                                        const isPastDate = (cellDate: Date) => {
                                            const today = new Date();
                                            const vietnamOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
                                            const localToday = new Date(today.getTime() + vietnamOffset); // Today's date in local time
                                            localToday.setHours(0, 0, 0, 0); // Reset time part

                                            return cellDate < localToday; // Compare adjusted date
                                        };
                                        const cellDate = new Date(date);
                                        return (
                                            <td key={dateIndex} className={`text-center ${isAvailable ? 'available' : 'unavailable'} ${isSelectedSlot ? 'selected' : ''}`}
                                                onClick={() => isAvailable && !isPastDate(new Date(date)) && handleSlotSelection(new Date(date).getUTCFullYear(), new Date(date).getUTCMonth() + 1, new Date(date).getUTCDate(), slotOrder, availableSlots.find(slot =>
                                                    slot.year === new Date(date).getUTCFullYear() &&
                                                    slot.month === new Date(date).getUTCMonth() + 1 &&
                                                    slot.day === new Date(date).getUTCDate() &&
                                                    slot.slot_order === slotOrder)?.slot_id )}
                                                style={{backgroundColor: isPastDate(cellDate) ? '#ccd1d1' : ''}}
                                            >
                                                {isPastDate(cellDate) ? ( // Kiểm tra nếu đây là ngày trong quá khứ
                                                    <p className="fw-bold">-</p> // Hiển thị dấu "-" nếu là ngày trong quá khứ
                                                ) : isAvailable ? (
                                                    <>
                                                        <p className="text-success fw-bold">AVAILABLE</p>
                                                        <p>{slotOrderToTime[slotOrder as keyof typeof slotOrderToTime]}</p>
                                                    </>
                                                ) : (
                                                    <p className="fw-bold">-</p>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button className="btn btn-primary mt-3" onClick={handleNextClick} disabled={!selectedSlot}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvailableSlot;
