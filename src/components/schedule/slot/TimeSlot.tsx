import React from 'react';

interface TimeSlotProps {
    time: string;
    slot: string;
    color: string;
    textColor: string;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, slot, color, textColor }) => {
    return (
        <div className="position-relative" style={{ width: '188px', height: '85px' }}>
            <div
                className="position-absolute"
                style={{ width: '188px', height: '85px', backgroundColor: color }}
            />
            <div className="position-absolute bg-light rounded-top-end rounded-bottom-end" style={{ width: '181px', height: '85px', left: '7px', top: '0' }} />
            <div className="position-absolute" style={{ width: '80px', height: '12px', left: '20px', top: '67px' }}>
                <div className="text-muted" style={{ fontSize: '10px', color: textColor }}>
                    {time}
                </div>
            </div>
            <div className="position-absolute" style={{ color: textColor, left: '20px', top: '9px', fontSize: '12px', fontWeight: '500' }}>
                {slot}
            </div>
        </div>
    );
};

export default TimeSlot;
