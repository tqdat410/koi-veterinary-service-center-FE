// src/pages/UnauthorizedPage.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };

    return (
        <div
            className="container d-flex flex-column justify-content-center align-items-center vh-100"
            style={{marginTop: '0'}} // Remove default top margin for centering
        >
            <h1 className="display-3 text-danger">403 Forbidden</h1>
            <p className="lead">You do not have permission to access this page.</p>
            <div className="d-flex gap-2"> {/* Use gap for spacing between buttons */}
                <button className="btn btn-secondary" onClick={handleGoBack}>
                    Go Back
                </button>
                <Link to="/" className="btn btn-primary">
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
