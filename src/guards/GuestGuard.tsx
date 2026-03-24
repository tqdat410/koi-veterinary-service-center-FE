// components/GuestGuard.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/context/AuthContext';

const GuestGuard: React.FC = () => {
    const { isAuthenticated } = useAuth(); // Kiểm tra trạng thái đăng nhập

    // Nếu người dùng đã đăng nhập, chuyển hướng họ đến trang chủ
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Nếu người dùng chưa đăng nhập, hiển thị các route con
    return <Outlet />;
};

export default GuestGuard;
