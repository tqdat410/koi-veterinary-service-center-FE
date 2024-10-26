// AuthGuard.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/context/AuthContext';
import {useEffect, useState} from "react";
import LoginReminderModal from "./LoginReminderModal";
const AuthGuard = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setShowModal(true);
        }
    }, [isAuthenticated]);

    const handleModalClose = () => {
        setShowModal(false);
        setShouldRedirect(true); // Chỉ điều hướng sau khi modal được đóng
    };

    // Nếu vẫn đang load xác thực từ localStorage, có thể hiển thị loading indicator
    if (loading) {
        return <div>Loading...</div>;
    }

    // Hiển thị modal nếu chưa đăng nhập và sau đó điều hướng đến trang login
    if (!isAuthenticated) {
        return (
            <>
                <LoginReminderModal
                    show={showModal}
                    onClose={handleModalClose}
                />
                {shouldRedirect && <Navigate to="/login" />}
            </>
        );
    }

    return children;
};

export default AuthGuard;
