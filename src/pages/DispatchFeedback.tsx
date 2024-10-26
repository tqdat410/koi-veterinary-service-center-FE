import { useAuth } from '../hooks/context/AuthContext';
import FeebackManagementPage from './Manager/FeedbackManagementPage';
import VeterinarianFeedbackPage from './Veterinarian/VeterinarianFeedbackPage';
import UnauthorizedPage from './UnauthorizedPage';

interface User {
    roleId: string;
    userId: number;
}

const DispatchFeedback = () => {
    const { user } = useAuth();

    if (user?.roleId === 'VET') {
        return <VeterinarianFeedbackPage />;

    } else if (user?.roleId === 'MAN') {
        return <FeebackManagementPage />;
        
    } else {
        return <UnauthorizedPage />;
    }
};

export default DispatchFeedback;