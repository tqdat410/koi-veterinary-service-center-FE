import React from 'react';

const TimeColumn: React.FC = () => {
    const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    return (
        <div className="position-absolute" style={{ width: '53px', height: '445px' }}>
            {times.map((time, index) => (
                <div
                    key={index}
                    className="text-center text-muted" // Sử dụng lớp Bootstrap cho màu sắc
                    style={{
                        width: '53px',
                        height: '19px',
                        position: 'absolute',
                        top: `${index * 48}px`,
                        fontSize: '1rem', // Tương đương với text-base
                        fontWeight: '400' // Tương đương với font-normal
                    }}
                >
                    {time}
                </div>
            ))}
        </div>
    );
};

export default TimeColumn;
