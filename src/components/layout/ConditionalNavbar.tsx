// src/components/ConditionalNavbar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/context/AuthContext';
import Navbar from '../layout/Navbar';

const ConditionalNavbar: React.FC = () => {
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

    // Kiểm tra xem Navbar có nên ẩn hay không
    const shouldHideNavbar = isAuthenticated && user && ['MAN', 'STA', 'VET'].includes(user.roleId) && location.pathname !== '/';

    return (
        <>
            {!shouldHideNavbar && <Navbar />}
        </>
    );
};

export default ConditionalNavbar;
