import React from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const datesOfWeek = [14, 15, 16, 17, 18, 19, 20];

const WeekHeader: React.FC = () => {
    return (
        <div className="position-absolute" style={{ width: '906px', height: '60px' }}>
            <div className="position-absolute" style={{ left: '0', top: '21px', width: '53px', height: '19px', color: '#b1b1b1', fontSize: '1rem' }}>
                Week
            </div>
            {daysOfWeek.map((day, index) => (
                <div
                    key={index}
                    className="position-absolute text-center text-muted"
                    style={{
                        left: `${122 + index * 121}px`,
                        top: '11px',
                        width: '53px',
                        height: '41px',
                        fontSize: '1rem', // Tương đương với text-base
                    }}
                >
                    {datesOfWeek[index]}<br />{day}
                </div>
            ))}
        </div>
    );
};

export default WeekHeader;
