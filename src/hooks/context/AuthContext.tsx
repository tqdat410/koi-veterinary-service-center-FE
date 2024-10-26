// context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {logout as logoutAPI, refreshToken} from "../../api/authService"
interface User {
    roleId: string;
    userId: number;
}

interface AuthContextProps {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading để quản lý quá trình xác thực

    const handleTokenRefresh = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp && decodedToken.exp - currentTime < 60 * 5) {
                // Token expired, attempt to refresh
                const refreshedToken = await refreshToken(token);
                localStorage.setItem('token', refreshedToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${refreshedToken}`;
                login(refreshedToken); // Refresh and re-login with new token
            }
        } catch (error) {
            console.error("Token refresh failed:", error);
            logout(); // Logout if refresh fails
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {

            try {
                const decodedToken: any = jwtDecode(token);

                setIsAuthenticated(true);
                setUser({ userId: decodedToken.userId, roleId: decodedToken.scope });
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setInterval(handleTokenRefresh, 60 * 1000);
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decodedToken: any = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
            console.error("Token is already expired");
            return logout();
        }
        console.log(decodedToken)
        setIsAuthenticated(true);
        setUser({ roleId: decodedToken.scope, userId: decodedToken.userId });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    // Đăng xuất: xóa token khỏi localStorage và reset trạng thái người dùng
    const logout = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                await logoutAPI(token); // Gọi API logout mới
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }

        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        localStorage.clear();
    };
    return (

        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;