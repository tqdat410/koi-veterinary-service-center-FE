// src/components/ServiceCardComponent.tsx
import React from 'react';

interface ServiceCardProps {
    id: number;
    title: string;
    description: string;
    price: number;
    onClick: () => void;
}

const ServiceCardComponent: React.FC<ServiceCardProps> = ({ id, title, description, price, onClick }) => {
    return (
        <div className="card service-card mb-4" style={{ width: '18rem' }} onClick={onClick}>
            <img
                src={`https://via.placeholder.com/320x180?text=Service+${id}`}
                className="card-img-top"
                alt={title}
            />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
                <p className="card-text font-weight-bold">${price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ServiceCardComponent;
