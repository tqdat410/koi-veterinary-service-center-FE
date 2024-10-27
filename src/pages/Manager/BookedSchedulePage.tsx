import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../styles/TableSchedule.css"
import {BASE_API} from "../../api/baseApi"
import Sidebar from "../../components/layout/Sidebar";


const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
interface Veterinarian {
    user_id: number;
    first_name: string;
    last_name: string;
    enable: boolean;
}

interface Slot {
    slot_id: number;
    year: number;
    month: number;
    day: number;
    slot_order: number;
    description: string;
    booked_veterinarian: Veterinarian[];
}
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
    const currentYear = new Date().getUTCFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const currentWeekStart = getCurrentWeekStart();
    const [selectedWeekStart, setSelectedWeekStart] = useState(currentWeekStart.toISOString().split('T')[0]);
    const [weekDates, setWeekDates] = useState<string[]>(getWeekDates(currentWeekStart));
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<{ year: number; month: number; day: number; slot_order: number, slot_id:number } | null>(null);
    const weeks = generateWeeksOfYear(selectedYear);



    useEffect(() => {
        // Fetch available slots
        axios.get(`${BASE_API}/slots/booked`)
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




    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar/>
            <div className="container" style={{ marginTop: "6rem" }}>

                <div className="justify-content-center">

                        <h3 className="text-start mb-3" style={{fontWeight: "bold", color: "#02033B", fontSize: "2.7rem"}}>
                            Available Slots
                        </h3>
                        <div className="d-flex justify-content-start gap-3 align-items-center mb-3">
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
                                    <th key={index} className="text-center" >
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
                                        const slotData = availableSlots.find(slot =>
                                            slot.year === new Date(date).getUTCFullYear() &&
                                            slot.month === new Date(date).getUTCMonth() + 1 &&
                                            slot.day === new Date(date).getUTCDate() &&
                                            slot.slot_order === slotOrder
                                        );

                                        return (
                                            <td key={dateIndex}
                                                className={`text-center `}
                                                    style={{fontSize:"1rem",padding:"0px"}}
                                            >
                                                {slotData ? (
                                                    <>
                                                        {slotData.booked_veterinarian.length > 0 ? (
                                                            slotData.booked_veterinarian.map(veterinarian => (
                                                                <p key={veterinarian.user_id}
                                                                   className="text-secondary fw-bold"
                                                                   style={{ width: '9vw',fontSize:"1.12rem",padding:"0px"}}
                                                                >

                                                                    {veterinarian.first_name} {veterinarian.last_name}
                                                                </p>
                                                            ))
                                                        ) : (
                                                            <p className="fw-bold">-</p>
                                                        )}

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
                </div>
            </div>
        </div>
    );
};

export default AvailableSlot;
