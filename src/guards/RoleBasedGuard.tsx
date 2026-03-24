// RoleBasedGuard.tsx
import { Navigate} from 'react-router-dom';
import { useAuth } from '../hooks/context/AuthContext';

interface RoleBasedGuardProps {
    allowedRoles: string[]; // Các quyền được phép truy cập vào route này
    children: JSX.Element;
}

const RoleBasedGuard = ({ allowedRoles, children }: RoleBasedGuardProps) => {
    const { user, loading } = useAuth();

    // Loading khi đang kiểm tra xác thực
    if (loading) {
        return <div>Loading...</div>;
    }

    // Kiểm tra nếu user không có quyền, chuyển hướng về trang không đủ quyền
    if (!user || !allowedRoles.includes(user.roleId)) {
        return <Navigate to="/no-access" replace />;
    }
    return children;
};

export default RoleBasedGuard;
