import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUnreadMessageCount } from '../../hooks/useMessages';

/**
 * Notification bell component with unread message count badge
 * Integrates with backend to show real-time unread message count
 */
export default function NotificationBell() {
    const navigate = useNavigate();
    const { count, isLoading } = useUnreadMessageCount();

    const handleClick = () => {
        navigate('/messages');
    };

    return (
        <button
            onClick={handleClick}
            className="relative p-2 text-cms-text-secondary hover:text-cms-text-primary hover:bg-cms-bg-hover rounded-lg transition-all"
            aria-label={`Notifications${count > 0 ? `, ${count} unread messages` : ''}`}
        >
            <Bell size={20} />
            {!isLoading && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-xs font-semibold text-black bg-cms-accent rounded-full">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </button>
    );
}
