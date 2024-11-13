import React from "react";
import Footer from '../../../components/layout/Footer';
import '../../../styles/Policy.css'

const BookingPolicy = () => {
    return (
        <div className="container my-5 content-policy min-h-auto">
            <h2 className="text-center mb-4 content-header-policy">Booking and Refund Policy</h2>

            <div className="text-center mb-4" >
                <h2>Booking</h2>
                <p style={{ textAlign: 'left', marginLeft: '16px' }}>1. Please book at least 3 hours in advance for the desired time slot.</p>
                <p style={{ textAlign: 'left', marginLeft: '16px' }}>2. Customers who choose to pay online must complete the payment one day before the appointment is confirm. If payment is not made within one day, the appointment will be canceled.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Refund Policy: Only for payment online</h2>
                <p className="conditional-case" >1. If less than 3 hours before the appointment: No refund for online payments.</p>
                <p className="conditional-case">2. If more than 3 hours before the appointment: A 70% refund will be issued.</p>
                <p className="conditional-case">3. If staff have not confirmed the booking: A 100% refund will be issued.</p>
                <p className="conditional-case">4. If the center experiences a fault: A 100% refund will be issued.</p>
            </div>
            <Footer />
        </div>
    );
};

export default BookingPolicy;